---
title: Testing
description: Writing test blocks, the built-in and testing-module assertions, stubbing dependencies with where, and running almide test.
---

Tests live next to the code they cover. A `test` block is a top-level form in
any `.almd` file — there is no separate test framework to install and no
attribute to remember.

```almide
fn add(a: Int, b: Int) -> Int = a + b

fn slugify(s: String) -> String =
  s |> string.to_lower |> string.replace(" ", "-")

test "add sums two integers" {
  assert_eq(add(1, 2), 3)
  assert_eq(add(-1, 1), 0)
}

test "slugify lowercases and dashes" {
  assert_eq(slugify("Hello World"), "hello-world")
}
```

```bash
almide test calc_test.almd
```

The name must be a string literal, and the block must be at the top level —
a `test` inside a function is a parse error (usually it means the previous
declaration is missing its closing brace).

A test body is an implicit effect context, so it may call effectful functions
directly without being declared `effect fn`.

## Assertions

Three assertions are built in and need no import:

| Call | Meaning |
|---|---|
| `assert(cond)` | fails unless `cond` is true |
| `assert_eq(a, b)` | fails unless `a == b`; both sides must have the same type |
| `assert_ne(a, b)` | fails unless `a != b` |

`assert_eq` carries the whole language's test suite and is what you want most
of the time.

`import testing` adds seven more:

```almide
import testing

test "richer assertions" {
  testing.assert_gt(10, 3)
  testing.assert_lt(3, 10)
  testing.assert_approx(0.1 + 0.2, 0.3, 0.0001)
  testing.assert_contains("hello world", "lo wo")
  testing.assert_some(list.first(["a"]))
  testing.assert_ok(int.parse("42"))
}
```

| Call | Signature |
|---|---|
| `testing.assert_gt(a, b)` | `(Int, Int) -> Unit` |
| `testing.assert_lt(a, b)` | `(Int, Int) -> Unit` |
| `testing.assert_approx(a, b, tolerance)` | `(Float, Float, Float) -> Unit` |
| `testing.assert_contains(haystack, needle)` | `(String, String) -> Unit` |
| `testing.assert_some(opt)` | `Option[A] -> Unit` |
| `testing.assert_ok(result)` | `Result[A, B] -> Unit` |
| `testing.assert_throws(f, expected)` | `(() -> Unit, String) -> Unit` |

Two caveats when your tests also have to pass on the wasm target:

- `assert_throws` has no wasm implementation — wasm cannot catch a panic, it
  traps. Mark such a file with `// wasm:skip` in its first three lines.
- `assert_some` and `assert_ok` are implemented on wasm for `Option[String]`
  and `Result[String, String]` only. Other instantiations refuse with a wall
  rather than silently testing the wrong thing.

## Stubbing with `where`

A test can replace a binding for the duration of that test:

```almide
test "uses the pinned clock" where now = () => 500 {
  assert_eq(now(), 500)
}
```

The substitution is **lexical over the test body only** — it does not reach
into functions the body calls. A helper that calls `now()` internally still
gets the real one, so `where` is a local stub, not dependency injection.

Three forms are available:

| Form | Effect |
|---|---|
| `where name = expr` | bind a value or replace a reference |
| `where module.name = expr` | replace a specific module member |
| `where target(args) => expr` | answer a matching call with a value |

Table-driven tests use the case form, and each case becomes its own test:

```almide
test "add table" where [
  "positive" [ a = 1, b = 2, want = 3 ],
  "negative" [ a = -1, b = -2, want = -3 ],
] {
  assert_eq(add(a, b), want)
}
```

Stubs can also be declared once for a file or a module instead of per test:

```almide
local test where { clock.now = fixed_now }   // this file
mod   test where { db.connect = fake_db }    // this module
```

More specific wins: a case's `where` beats the test's, which beats the file's,
which beats the module's.

## Running tests

```bash
almide test                    # discover and run everything
almide test spec/lang/         # a directory
almide test calc_test.almd     # one file
```

With no argument, discovery looks in `spec/` and `exercises/`, and falls back
to the whole tree. A file counts as a test file if it contains a `test` block —
the `_test.almd` suffix is a convention that discovery does not actually
require.

| Flag | Meaning |
|---|---|
| `--target wasm` | run only on wasm, through wasmtime |
| `--target native` | run only through the native (rustc) harness |
| `--run <pattern>` | filter tests by name |
| `--json` | machine-readable result per file |
| `--no-check` | skip type checking |

By default `almide test` runs each file on wasm first — no rustc needed, so it
is fast — and falls back to the native harness only for files that fail or get
skipped there. That is why the default output is a per-file summary rather than
a list of test names:

```
1 via WASM, 0 via native fallback, 0 failed (of 1 files)
All 1 test file(s) passed
```

**`--run` only applies to the native harness.** On the default path it is
silently ignored, so pair it with an explicit target:

```bash
almide test spec/lang/function_test.almd --target native --run recursion
```

Names are matched as substrings against the generated function names, so
`--run recursion` also catches `mutual recursion`.

## Reading a failure

Failures come through the native harness, which reports them in Rust's
`assert_eq!` format — `left` is your first argument, `right` is the second:

```
---- tests::__test_almd_slugify_lowercases_and_dashes stdout ----
assertion `left == right` failed
  left: "Hello-World"
 right: "hello-world"
```

The file and line in a panic message point at the *generated* harness, not at
your `.almd` — use the test name to locate the source. `almide test` exits
non-zero when any test fails, so it drops straight into CI.

## Next steps

- [testing](/docs/stdlib/testing/) — the assertion module reference
- [WebAssembly](/docs/guide/wasm/) — why tests run on wasm first
