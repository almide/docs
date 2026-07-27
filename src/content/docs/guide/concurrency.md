---
title: Concurrency
description: Structured concurrency with fan blocks, fan.map, fan.race, fan.any, and fan.settle.
---

Almide provides structured concurrency through the `fan` construct. All concurrent work is scoped, cancellable, and fail-fast. There is no unstructured `spawn`.

## fan block

`fan { }` runs multiple expressions concurrently and returns their results as a tuple:

```almide
effect fn load_dashboard(user_id: Int) -> Result[Unit, String] = {
  let (user, posts, settings) = fan {
    fetch_user(user_id)
    fetch_posts(user_id)
    fetch_settings(user_id)
  }
  println("${user.name} has ${int.to_string(list.len(posts))} posts")
  ok(())
}
```

Each expression runs in parallel. Results are collected as a tuple in declaration order.

### Single expression

With one expression, the result is not a tuple:

```almide
let result = fan {
  add(10, 20)
}
// result: Int (not a tuple)
assert_eq(result, 30)
```

### Staged fan (dependency chains)

Sequential dependencies between parallel stages:

```almide
effect fn pipeline() -> Result[Unit, String] = {
  // Stage 1: independent
  let (a, b) = fan {
    fetch_from_api()
    load_from_cache()
  }

  // Stage 2: depends on stage 1
  let (processed, stored) = fan {
    process(a, b)
    store(a, b)
  }

  ok(())
}
```

### Capturing outer bindings

`fan` can capture `let` bindings from outer scope:

```almide
effect fn with_capture() -> Result[Unit, String] = {
  let config = load_config()
  let offset = 100

  let (a, b) = fan {
    fetch(config.url_a)
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
| Expressions only | No `let`, `var`, `for`, or `while` inside `fan` blocks |
| No `var` capture | Only `let` bindings from outer scope (prevents data races) |
| Fail-fast | If any expression returns `err(...)`, the entire `fan` fails and siblings are cancelled |

What is **not** allowed:

```almide no-check
// Compile error: var capture forbidden in fan
effect fn bad() -> Result[Unit, String] = {
  var counter = 0
  fan {
    counter = counter + 1  // error: no var capture in fan
  }
  ok(())
}
```

```almide
// Compile error: statements not allowed in fan
fan {
  let x = fetch()  // error: only expressions, no let
  x + 1
}
```

## fan.map

Parallel map over a collection. Each element is processed concurrently, results maintain original order:

```almide
effect fn double(x: Int) -> Result[Int, String] = ok(x * 2)

effect fn fetch_all() -> Result[List[Int], String] = {
  let results = fan.map([1, 2, 3, 4, 5], (x) => double(x))
  // results: [2, 4, 6, 8, 10]
  ok(results)
}
```

Works with outer captures:

```almide
effect fn with_offset() -> Result[List[Int], String] = {
  let offset = 100
  let results = fan.map([1, 2, 3], (x) => add_offset(x, offset))
  // results: [101, 102, 103]
  ok(results)
}
```

Empty list returns `[]`:

```almide
let results = fan.map([], (x: Int) => double(x))
assert_eq(results, [])
```

If any invocation returns `err(...)`, the entire `fan.map` fails.

## fan.race

Run multiple tasks and take the result of the **first one to settle**:

```almide
effect fn fastest_mirror(mirrors: List[String]) -> Result[String, String] = {
  let content = fan.race(list.map(mirrors, (url) => () => http.get(url)))
  ok(content)
}
```

`fan.race` takes a **list of thunks** (zero-argument functions).

The winner is decided by **list order, not by wall-clock speed** — the same
input always produces the same result, on both targets:

```almide
effect fn fast() -> Result[String, String] = ok("fast")
effect fn slow() -> Result[String, String] = ok("slow")

effect fn pick() -> Result[String, String] = {
  let winner = fan.race([
    () => slow(),
    () => fast(),
  ])
  ok(winner)   // "slow" — it is first in the list
}
```

This is deliberate. A race whose outcome depends on timing would make a program
non-reproducible and would break the native/wasm equivalence guarantee, so
`race` means "I accept any one of these", not "give me whichever machine
happens to finish first".

## fan.any

Like `fan.race` but **skips failures**. Returns the first **successful** result:

```almide
effect fn primary() -> Result[Int, String] = err("down")
effect fn fallback() -> Result[Int, String] = ok(42)

let result = fan.any([
  () => primary(),
  () => fallback(),
])
assert_eq(result, 42)  // primary failed, fallback wins
```

Use this for redundancy patterns (try multiple sources, use first that works).

## fan.settle

Run all tasks to completion and **collect all results**, including failures:

```almide
effect fn succeed(x: Int) -> Result[Int, String] = ok(x)
effect fn fail(msg: String) -> Result[Int, String] = err(msg)

let results = fan.settle([
  () => succeed(1),
  () => fail("bad"),
  () => succeed(3),
])
// results: [ok(1), err("bad"), ok(3)]
assert_eq(list.len(results), 3)
```

Unlike `fan` blocks which are fail-fast, `fan.settle` never short-circuits. Useful for batch operations where partial failure is acceptable.

## There is no fan.timeout

`fan.timeout` existed once and was removed. Using it is a diagnosed error:

```
error[E027]: fan.timeout was removed: a wall-clock timeout has no portable
             cross-target meaning
```

A deadline measured in milliseconds cannot mean the same thing natively and in
a wasm sandbox, so it would have made programs behave differently per target —
the one thing the language refuses to do. Enforce deadlines at the boundary
that invokes the program instead:

```bash
timeout 5 ./app
```

## Summary

| Function | Behavior | Failure mode |
|----------|----------|-------------|
| `fan { a; b }` | Run expressions concurrently, return tuple | Fail-fast: first `err` cancels all |
| `fan.map(xs, f)` | Parallel map, ordered results | Fail-fast |
| `fan.race(thunks)` | First in list order settles the race | First result (success or failure) |
| `fan.any(thunks)` | First **success** in list order wins | All must fail for error |
| `fan.settle(thunks)` | Run all, collect all results | Never fails |

Every combinator is deterministic: the same inputs give the same result, on
both targets, every run.

## How it runs

| Target | Implementation |
|--------|---------------|
| Native | `std::thread::scope` for `race` and `settle`; `map` runs sequentially |
| WASM | Sequential — the target is single-threaded |

The asymmetry is not a gap in the wasm backend, it is the point. Because a fan
thunk cannot capture a `var` (that is a compile error), the thunks are pure, so
running them in parallel and running them in order produce the same values.
Parallelism is an implementation detail the language is free to drop; the
result is not. That is what lets the native and wasm legs stay byte-identical
while only one of them actually uses threads.

## Design philosophy

- **Structured** -- all concurrent work has a clear scope and lifetime
- **No shared mutable state** -- `var` capture is forbidden in `fan`
- **No unstructured spawn** -- you cannot fire-and-forget
- **Fail-fast by default** -- errors propagate immediately (use `fan.settle` when you need partial results)
- **Composable** -- stage fan blocks sequentially when tasks depend on each other

## Next steps

- [Error Handling](/docs/guide/error-handling/) -- Result propagation in effect fn
- [Functions](/docs/guide/functions/) -- effect fn requirements
- [Standard Library](/docs/stdlib/overview/) -- modules that return Result
