---
title: random
description: Random number generation. Requires `import random`.
---

```almd
import random
```

## Functions

| Function | Signature | Description |
|---|---|---|
| `int` | `(Int, Int) -> Int` | Generate a random integer between min and max (inclusive). |
| `float` | `() -> Float` | Generate a random float between 0.0 and 1.0. |
| `choice` | `(List[T]) -> Option[T]` | Pick a random element from a list, or none if empty. |
| `shuffle` | `(List[T]) -> List[T]` | Return a randomly shuffled copy of a list. |

## Reference

### `random.int(min: Int, max: Int) -> Int`

Generate a random integer between min and max (inclusive).

```almd
random.int(1, 100) // => 42
```

### `random.float() -> Float`

Generate a random float between 0.0 and 1.0.

```almd
random.float() // => 0.7321
```

### `random.choice(xs: List[T]) -> Option[T]`

Pick a random element from a list, or none if empty.

```almd
random.choice(["a", "b", "c"]) // => some("b")
```

### `random.shuffle(xs: List[T]) -> List[T]`

Return a randomly shuffled copy of a list.

```almd
random.shuffle([1, 2, 3]) // => [3, 1, 2]
```
