---
title: testing
description: Test assertion helpers. Requires `import testing`.
---

```almd
import testing
```

## Functions

| Function | Signature | Description |
|---|---|---|
| `assert_throws` | `(() -> Unit, String) -> Unit` | Assert that a function throws an error containing the expected message. |
| `assert_contains` | `(String, String) -> Unit` | Assert that a string contains a substring. |
| `assert_approx` | `(Float, Float, Float) -> Unit` | Assert two floats are approximately equal within tolerance. |
| `assert_gt` | `(Int, Int) -> Unit` | Assert that a is greater than b. |
| `assert_lt` | `(Int, Int) -> Unit` | Assert that a is less than b. |
| `assert_some` | `(Option[String]) -> Unit` | Assert that an Option is some (not none). |
| `assert_ok` | `(Result[String, String]) -> Unit` | Assert that a Result is ok (not err). |
| `assert_snapshot` | `(String, String) -> Unit` | Assert that a string equals the snapshot literal written at the call site. |

## Reference

### `testing.assert_throws(f: () -> Unit, expected: String) -> Unit`

Assert that a function throws an error containing the expected message.

```almd
testing.assert_throws(() => panic("oh no"), "oh no")
```

### `testing.assert_contains(haystack: String, needle: String) -> Unit`

Assert that a string contains a substring.

```almd
testing.assert_contains("hello world", "world")
```

### `testing.assert_approx(a: Float, b: Float, tolerance: Float) -> Unit`

Assert two floats are approximately equal within tolerance.

```almd
testing.assert_approx(3.14, 3.14159, 0.01)
```

### `testing.assert_gt(a: Int, b: Int) -> Unit`

Assert that a is greater than b.

```almd
testing.assert_gt(10, 5)
```

### `testing.assert_lt(a: Int, b: Int) -> Unit`

Assert that a is less than b.

```almd
testing.assert_lt(3, 7)
```

### `testing.assert_some(opt: Option[String]) -> Unit`

Assert that an Option is some (not none).

```almd
testing.assert_some(some("value"))
```

### `testing.assert_ok(result: Result[String, String]) -> Unit`

Assert that a Result is ok (not err).

```almd
testing.assert_ok(ok("success"))
```

### `testing.assert_snapshot(actual: String, expected: String) -> Unit`

Assert that `actual` equals the snapshot written at the call site. The
expectation is the literal itself — there is no sidecar file — and the accept
step rewrites it in place.

```almd
import testing

fn render(xs: List[Int]) -> String =
  xs |> list.map((x) => "item ${int.to_string(x)}") |> list.join("\n")

test "single line" {
  testing.assert_snapshot("hello", "hello")
}

test "multi line, written back as a heredoc" {
  testing.assert_snapshot(render([1, 2]), """
    item 1
    item 2
    """)
}
```

**Workflow**

1. **Write** — start with an empty expectation: `testing.assert_snapshot(render([1, 2]), "")`.
   A plain `almide test` run fails it as a *new snapshot* and prints the found value
   with the accept hint.
2. **Accept** — `almide test --update-snapshots <file>` (or `ALMIDE_UPDATE_SNAPSHOTS=1`)
   writes the found value back into the source as the second argument — a quoted
   string on one line, a heredoc when it spans lines. Review the diff and commit it
   like any other code.
3. **Drift** — when `actual` later changes, the plain run fails with a diff and the same
   hint; `--update-snapshots` rewrites the literal again.
4. **CI** — `almide test --ci` (or `CI=true`) never writes: a new or drifted snapshot
   fails there, so snapshots only ever change through a reviewed commit.
