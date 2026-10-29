---
title: Concurrency
description: Structured concurrency with fan blocks, fan.map, fan.settle, fan.min, fan.bounded and fan.timeout.
---

Almide provides structured concurrency through the `fan` construct. All concurrent work is scoped and deterministic: the same inputs give the same result on every target. There is no unstructured `spawn`, and no `async`/`await`.

Every `fan` form requires an `effect fn` context.

## fan block

`fan { }` runs its arms concurrently and returns their values as a tuple, in arm order:

```almide
effect fn load_dashboard(user_id: Int) -> Result[Unit, String] = {
  let (user, posts, settings) = fan {
    fetch_user(user_id)!
    fetch_posts(user_id)!
    fetch_settings(user_id)!
  }
  println("${user.name} has ${int.to_string(list.len(posts))} posts")
  ok(())
}
```

Arms are separated by `,` or a newline. A fallible arm says `!`, as it would
anywhere else (ADR-0008): the arm's Err becomes the whole block's Err. Every arm
still runs, and the first Err in source order wins.

### Single expression

With one arm, the result is not a tuple:

```almide
effect fn one() -> Result[Int, String] = {
  let result = fan {
    add(10, 20)!
  }
  ok(result)   // Int, not a tuple
}
```

### Record form

Named arms give an anonymous record, read by name:

```almide
effect fn add(a: Int, b: Int) -> Result[Int, String] = ok(a + b)

effect fn mul(a: Int, b: Int) -> Result[Int, String] = ok(a * b)

effect fn main() -> Unit = {
  let r = fan {
    sum: add(3, 4)!
    product: mul(3, 4)!
    label: "3 and 4"
  }
  println(r.label + ": " + int.to_string(r.sum + r.product))
}
```

Removing `fan` gives the same output and value. A Result field without `!` is
E041.

### Staged fan (dependency chains)

Sequential dependencies between parallel stages:

```almide
effect fn pipeline() -> Result[Unit, String] = {
  // Stage 1: independent
  let (a, b) = fan {
    fetch_from_api()!
    load_from_cache()!
  }

  // Stage 2: depends on stage 1
  let (processed, stored) = fan {
    process(a, b)!
    store(a, b)!
  }

  ok(())
}
```

### Capturing outer bindings

`fan` can capture `let` bindings from outer scope:

```almide
effect fn with_capture() -> Result[Unit, String] = {
  let config = load_config()!
  let offset = 100

  let (a, b) = fan {
    fetch(config.url_a)!
    add_offset(42, offset)
  }
  ok(())
}
```

## Rules

`fan` has strict rules to prevent data races:

| Rule | Reason |
|------|--------|
| Only inside `effect fn` | Pure functions cannot fork concurrent work |
| Arms are expressions | `;` between arms is an error (it means sequencing); inside one block arm, `{ let x = f(); g(x) }` is fine |
| No `var` capture | Only `let` bindings from outer scope (prevents data races) |
| Explicit `!` | A fallible arm propagates only with `!`; the first Err in source order is the block's Err |

What is **not** allowed:

```almide no-check
effect fn add(a: Int, b: Int) -> Result[Int, String] = ok(a + b)

effect fn bad() -> Result[Unit, String] = {
  var counter = 0
  fan {
    add(counter, 1)!   // error[E008]: cannot capture mutable variable 'counter' inside fan block
  }
  ok(())
}
```

## fan.map

Map over a list with one callback returning `Result`. Every element runs and
results keep input order; the value is `Result[List[B], String]`, so propagate
it with `!`:

```almide
effect fn double(x: Int) -> Result[Int, String] = ok(x * 2)

effect fn fetch_all() -> Result[List[Int], String] = {
  let results = fan.map([1, 2, 3, 4, 5], (x) => double(x))!
  // results: [2, 4, 6, 8, 10]
  ok(results)
}
```

Works with outer captures, and the callback may be an effect fn passed by name:

```almide
effect fn with_offset() -> Result[List[Int], String] = {
  let offset = 100
  let results = fan.map([1, 2, 3], (x) => add_offset(x, offset))!
  // results: [101, 102, 103]
  ok(results)
}
```

Empty list returns `[]`:

```almide
effect fn empty_case() -> Result[Unit, String] = {
  let results = fan.map([], (x: Int) => double(x))!
  println(int.to_string(list.len(results)))   // 0
  ok(())
}
```

If any invocation returns `err(...)`, the lowest-index Err is the result.
`fan.map` never stops early — to stop at the first failure, write a `for` loop
with `!`.

## fan.settle

Run all arms to completion and **collect every result**, including failures.
The block form gives a tuple of per-arm Results (arms may have different types):

```almide
effect fn succeed(x: Int) -> Result[Int, String] = ok(x)
effect fn fail_with(msg: String) -> Result[Int, String] = err(msg)

effect fn run_all() -> Result[Unit, String] = {
  let (a, b, c) = fan.settle {
    succeed(1)
    fail_with("bad")
    succeed(3)
  }
  // a: ok(1), b: err("bad"), c: ok(3)
  println("${a} ${b} ${c}")
  ok(())
}
```

The mapper form `fan.settle(xs, f)` gives a `List[Result[B, String]]`, one per
element. Unlike `fan` blocks, `fan.settle` never propagates an Err. Useful for
batch operations where partial failure is acceptable.

## The first success: `??` and `list.find_map`

Taking the first success is sequential, so it is not a `fan` form. In source
order, chain with `??` — the right side runs only when the left side failed:

```almide
effect fn primary() -> Result[Int, String] = err("down")
effect fn fallback() -> Result[Int, String] = ok(42)

effect fn pick_available() -> Int =
  primary() ?? fallback() ?? -1   // 42 — primary failed, fallback wins
```

Over a list, use `list.find_map`; `?` turns an element's Err into `none`, so
the element is skipped:

```almide
let winner = list.find_map(mirrors, (m) => fetch(m)?) ?? fallback_text
```

## fan.min

`fan.min(clock) { … }` picks **one** arm by the clock you pass. The clock is
required — it says what "least" is measured on:

```almide
let w = fan.min(compute.ms(100)) {
  cheap_fail(1)
  ok_after(500)
  heavy(1000)
} ?? -1
```

With a `compute.*` clock the winner is the Ok arm that spent the least
deterministic compute; a tie goes to source order, an arm over the budget or
returning Err is excluded, and the arms must be pure. Because compute is
counted, not timed, the winner is the same on every run and every target. The
mapper form `fan.min(clock, xs, f)` races one pure lambda over a list.

## fan.bounded and fan.timeout

`fan.bounded(budget) { body }` limits one body by deterministic compute time:

```almide
let r = fan.bounded(compute.ms(100)) { work(input) } ?? -1   // Err if work exceeds the budget
```

`fan.timeout(deadline) { body }` is a wall-clock deadline, checked
cooperatively at charge sites:

```almide
let t = fan.timeout(duration.ms(5000)) { work(input) } ?? -1
```

Which check fires first depends on the host, so `fan.timeout` is the one form
whose outcome is only pinned at its two ends: a generous deadline always
completes, and a diverging body under a tiny deadline is always cut. Its body
is pure today.

## Summary

| Form | Behavior | Failure mode |
|----------|----------|-------------|
| `fan { a, b }` | Run arms concurrently, return a tuple (or a record for named arms) | First Err in source order (with `!`) |
| `fan.map(xs, f)` | Map in list order, every element runs | Lowest-index Err |
| `fan.settle { … }` / `fan.settle(xs, f)` | Run all, collect all Results | Never fails |
| `fan.min(clock) { … }` | One arm, least spend on the clock | Err when no arm succeeds |
| `fan.bounded(budget) { … }` | One body under a compute budget | Err over budget |
| `fan.timeout(deadline) { … }` | One body under a wall-clock deadline | Err when the deadline fires |
| `a() ?? b() ?? fb` | First success in source order (sequential) | `fb` |

## How it runs

| Target | Implementation |
|--------|---------------|
| Native | `fan { }` arms run in parallel; a heavy pure `fan.map` callback is parallelised (a thread per core, results in list order); `fan.settle` / `fan.min` run in source order |
| WASM | Sequential — the target is single-threaded |

The asymmetry is not a gap in the wasm backend, it is the point. Because a fan
arm cannot capture a `var` (that is a compile error), running the arms in
parallel and running them in order produce the same values. Parallelism is an
implementation detail the language is free to drop; the result is not. That is
what lets the native and wasm legs stay byte-identical while only one of them
actually uses threads.

## Design philosophy

- **Structured** -- all concurrent work has a clear scope and lifetime
- **No shared mutable state** -- `var` capture is forbidden in `fan`
- **No unstructured spawn** -- you cannot fire-and-forget
- **Explicit propagation** -- an arm's Err propagates only with `!` (use `fan.settle` when you need partial results)
- **Composable** -- stage fan blocks sequentially when tasks depend on each other

## Next steps

- [Error Handling](/docs/guide/error-handling/) -- Result propagation in effect fn
- [Functions](/docs/guide/functions/) -- effect fn requirements
- [Standard Library](/docs/stdlib/overview/) -- modules that return Result
