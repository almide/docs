---
title: option
description: Option type operations — nullable values. Auto-imported.
---

Option type operations. auto-imported.

### `option.map(o: Option[A], f: Fn[A] -> B) -> Option[B]`

Transform the inner value using a function. If none, returns none.

```almide
fn show(o: Option[Int]) -> String = match o {
  some(n) => "some(${n})",
  none => "none",
}

fn main() -> Unit = {
  println(show(option.map(some(2), (x) => x * 10)))
}
```
```text
some(20)
```

### `option.flat_map(o: Option[A], f: Fn[A] -> Option[B]) -> Option[B]`

Chain an Option-returning function on the inner value. Flattens nested Options.

```almide
fn show(o: Option[Int]) -> String = match o {
  some(n) => "some(${n})",
  none => "none",
}

fn main() -> Unit = {
  println(show(option.flat_map(some(5), (x) => if x > 0 then some(x) else none)))
  println(show(option.flat_map(some(-5), (x) => if x > 0 then some(x) else none)))
}
```
```text
some(5)
none
```

### `option.flatten(o: Option[Option[A]]) -> Option[A]`

Flatten a nested Option. some(some(x)) becomes some(x), some(none) becomes none.

```almide
fn show(o: Option[Int]) -> String = match o {
  some(n) => "some(${n})",
  none => "none",
}

fn main() -> Unit = {
  println(show(option.flatten(some(some(42)))))
  println(show(option.flatten(some(none))))
}
```
```text
some(42)
none
```

### `option.unwrap_or(o: Option[A], default: A) -> A`

Get the inner value, or return a default if none.

**Deprecated (E052, ADR-0005 D4)** — the eager fallback is the third spelling with no definition relation to `??` (`≡ unwrap_or_else`, the default is evaluated only on the fallback path). Write `value ?? default`; `almide fix` rewrites both the call and the pipe-stage form. Removed one dialect window later.


```almide
fn main() -> Unit = {
  let n: Int? = none
  println("${n ?? 0}")
  println("${some(7) ?? 0}")
}
```
```text
0
7
```

### `option.unwrap_or_else(o: Option[A], f: Fn[Unit] -> A) -> A`

Get the inner value, or compute a default using a function.

```almide
fn main() -> Unit = {
  println("${option.unwrap_or_else(none, () => 42)}")
}
```
```text
42
```

### `option.is_some(o: Option[A]) -> Bool`

Check if the Option contains a value.

```almide
fn main() -> Unit = {
  println("${option.is_some(some(42))}")
}
```
```text
true
```

### `option.is_none(o: Option[A]) -> Bool`

Check if the Option is none.

```almide
fn main() -> Unit = {
  println("${option.is_none(none: Option[Int])}")
}
```
```text
true
```

### `option.to_result(o: Option[A], err: String) -> Result[A, String]`

Convert some to ok, none to err with the given error message.

```almide
fn show(r: Result[Int, String]) -> String = match r {
  ok(n) => "ok(${n})",
  err(e) => "err(\"${e}\")",
}

fn main() -> Unit = {
  println(show(option.to_result(some(42), "missing")))
  println(show(option.to_result(none, "missing")))
}
```
```text
ok(42)
err("missing")
```

### `option.filter(o: Option[A], f: Fn[A] -> Bool) -> Option[A]`

Keep the value if it satisfies the predicate, otherwise return none.

```almide
fn show(o: Option[Int]) -> String = match o {
  some(n) => "some(${n})",
  none => "none",
}

fn main() -> Unit = {
  println(show(option.filter(some(5), (x) => x > 3)))
  println(show(option.filter(some(2), (x) => x > 3)))
}
```
```text
some(5)
none
```

### `option.zip(a: Option[A], b: Option[B]) -> Option[(A, B)]`

Combine two Options into an Option of a tuple. None if either is none.

```almide
fn show(o: Option[(Int, Int)]) -> String = match o {
  some((a, b)) => "some((${a}, ${b}))",
  none => "none",
}

fn main() -> Unit = {
  println(show(option.zip(some(1), some(2))))
  println(show(option.zip(some(1), none)))
}
```
```text
some((1, 2))
none
```

### `option.or_else(o: Option[A], f: Fn[Unit] -> Option[A]) -> Option[A]`

Return the Option if some, otherwise call the function to produce an alternative.

```almide
fn show(o: Option[Int]) -> String = match o {
  some(n) => "some(${n})",
  none => "none",
}

fn main() -> Unit = {
  println(show(option.or_else(none, () => some(42))))
  println(show(option.or_else(some(1), () => some(42))))
}
```
```text
some(42)
some(1)
```

### `option.to_list(o: Option[A]) -> List[A]`

Convert some(x) to [x], none to [].

```almide
fn main() -> Unit = {
  println("${option.to_list(some(42))}")
  println("${option.to_list(none: Option[Int])}")
}
```
```text
[42]
[]
```


## Signature index (14 functions)

```
// some(f(v)) for some(v); none stays none.
// @since 0.7.0 or earlier
option.map(o: Option[A], f: (A) -> B) -> Option[B]

// f(v) for some(v); none stays none.
// @since 0.7.0 or earlier
option.flat_map(o: Option[A], f: (A) -> Option[B]) -> Option[B]

// Inner option of some(inner); none for none.
// @since 0.7.0 or earlier
option.flatten(o: Option[Option[A]]) -> Option[A]

// v for some(v), else default (always evaluated).
// @since 0.7.0 or earlier
option.unwrap_or(o: Option[A], default: A) -> A   (deprecated — use ??)

// v for some(v), else f(); f runs only for none.
// @since 0.7.0 or earlier
option.unwrap_or_else(o: Option[A], f: () -> A) -> A

// true for some(_), false for none.
// @since 0.7.0 or earlier
option.is_some(o: Option[A]) -> Bool

// true for none, false for some(_).
// @since 0.7.0 or earlier
option.is_none(o: Option[A]) -> Bool

// ok(v) for some(v), err(e) for none.
// @since 0.7.0 or earlier
option.to_result(o: Option[A], e: E) -> Result[A, E]

// o when some(v) and f(v) holds, else none.
// @since 0.7.0 or earlier
option.filter(o: Option[A], f: (A) -> Bool) -> Option[A]

// some((x, y)) when both are some, else none.
// @since 0.7.0 or earlier
option.zip(a: Option[A], b: Option[B]) -> Option[(A, B)]

// o when some, else f(); f runs only for none.
// @since 0.7.0 or earlier
option.or_else(o: Option[A], f: () -> Option[A]) -> Option[A]

// [v] for some(v), [] for none.
// @since 0.7.0 or earlier
option.to_list(o: Option[A]) -> List[A]

// some(values) if no element is none, else none.
// @since 0.15.0 or earlier
option.collect(xs: List[Option[A]]) -> Option[List[A]]

// some of all f(x), or none; f runs on every x.
// @since 0.15.0 or earlier
option.collect_map(xs: List[A], f: (A) -> Option[B]) -> Option[List[B]]
```

