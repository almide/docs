---
title: Hello World
description: Write and run your first Almide program.
---

## Your first program

Create a file called `hello.almd`:

```almide
effect fn main() -> Result[Unit, String] = {
  println("Hello, world!")
  ok(())
}
```

Run it:

```bash
almide run hello.almd
```

Output:

```text
Hello, world!
```

## Breaking it down

- `effect fn` — this function has side effects (printing to stdout)
- `main()` — the entry point of the program
- `-> Result[Unit, String]` — returns `Unit` on success, or a `String` error
- `println(...)` — print a line to stdout
- `ok(())` — return success with the Unit value `()`

## Adding logic

```almide
fn greet(name: String) -> String =
  "Hello, ${name}!"

effect fn main() -> Result[Unit, String] = {
  let names = ["Alice", "Bob", "Charlie"]
  for name in names {
    println(greet(name))
  }
  ok(())
}
```

```text
Hello, Alice!
Hello, Bob!
Hello, Charlie!
```

## Writing tests

Add a `test` block anywhere in your `.almd` file:

```almide
fn add(a: Int, b: Int) -> Int = a + b

test "addition" {
  assert_eq(add(1, 2), 3)
  assert_eq(add(0, 0), 0)
  assert_eq(add(-1, 1), 0)
}
```

Run tests:

```bash
almide test hello.almd
```

## Building a binary

```bash
almide build hello.almd -o hello
./hello
```

## Next steps

- [Types & Values](/docs/guide/types/) — learn about Almide's type system
- [Functions](/docs/guide/functions/) — pure functions and effect functions
