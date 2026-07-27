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
effect fn one() -> Result[Int, String] = {
  let result = fan {
    add(10, 20)
  }
  ok(result)   // Int, not a tuple
}
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
| Fail-fast | If any expression returns `err(...)`, the `fan` fails with that error. Sibling *side effects* may still complete on native — only the returned value is guaranteed |

What is **not** allowed:

```almide no-check
effect fn add(a: Int, b: Int) -> Result[Int, String] = ok(a + b)

effect fn bad() -> Result[Unit, String] = {
  var counter = 0
  fan {
    add(counter, 1)   // error[E008]: cannot capture mutable variable 'counter' inside fan block
  }
  ok(())
}
```

```almide no-check
// error: `let` is not allowed inside fan block
fan {
  let x = fetch()
  x + 1
}
```

## fan.map

Map over a collection with fail-fast error propagation; results keep input order. It runs sequentially today on both targets — see *How it runs*.

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
effect fn empty_case() -> Result[Unit, String] = {
  let results = fan.map([], (x: Int) => double(x))
  println(int.to_string(list.len(results)))   // 0
  ok(())
}
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

effect fn pick_available() -> Result[Int, String] = {
  let result = fan.any([
    () => primary(),
    () => fallback(),
  ])
  ok(result)   // 42 — primary failed, fallback wins
}
```

Use this for redundancy patterns (try multiple sources, use first that works).

## fan.settle

Run all tasks to completion and **collect all results**, including failures:

```almide
effect fn succeed(x: Int) -> Result[Int, String] = ok(x)
effect fn fail_with(msg: String) -> Result[Int, String] = err(msg)

effect fn run_all() -> Result[Unit, String] = {
  let results = fan.settle([
    () => succeed(1),
    () => fail_with("bad"),
    () => succeed(3),
  ])
  // results: [ok(1), err("bad"), ok(3)]
  println(int.to_string(list.len(results)))   // 3
  ok(())
}
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

`race`, `settle` and `map` are deterministic — same inputs, same result, both
targets. **`fan.any` is not**: on wasm it returns `0` unless the winning thunk
is last in the list ([#900](https://github.com/almide/almide/issues/900)).
Avoid it on the wasm target until that is fixed.

## How it runs

| Target | Implementation |
|--------|---------------|
| Native | `std::thread::scope` for `settle` and `fan { }` blocks; `race` evaluates only the head thunk; `map` and `any` run sequentially |
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
