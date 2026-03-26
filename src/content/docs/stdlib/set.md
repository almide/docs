---
title: set
description: Set operations in the Almide standard library. Auto-imported.
---

The `set` module provides functions for working with `Set[A]` collections of unique values. It is **auto-imported** -- no `import` statement needed.

## Function Reference

### Construction

| Function | Signature | Description |
|---|---|---|
| `new` | `() -> Set[A]` | Create an empty set |
| `from_list` | `(List[A]) -> Set[A]` | Create set from list |

### Access

| Function | Signature | Description |
|---|---|---|
| `contains` | `(Set[A], A) -> Bool` | Check membership |
| `len` | `(Set[A]) -> Int` | Number of elements |
| `is_empty` | `(Set[A]) -> Bool` | Empty check |
| `to_list` | `(Set[A]) -> List[A]` | Convert to list |

### Modification (immutable)

| Function | Signature | Description |
|---|---|---|
| `insert` | `(Set[A], A) -> Set[A]` | Add value (returns new set) |
| `remove` | `(Set[A], A) -> Set[A]` | Remove value (returns new set) |

### Set Operations

| Function | Signature | Description |
|---|---|---|
| `union` | `(Set[A], Set[A]) -> Set[A]` | Union of two sets |
| `intersection` | `(Set[A], Set[A]) -> Set[A]` | Intersection |
| `difference` | `(Set[A], Set[A]) -> Set[A]` | Elements in a not in b |
| `symmetric_difference` | `(Set[A], Set[A]) -> Set[A]` | Elements in either but not both |
| `is_subset` | `(Set[A], Set[A]) -> Bool` | Check if a is subset of b |
| `is_disjoint` | `(Set[A], Set[A]) -> Bool` | Check if no common elements |

### Higher-Order

| Function | Signature | Description |
|---|---|---|
| `filter` | `(Set[A], Fn[A] -> Bool) -> Set[A]` | Keep matching elements |
| `map` | `(Set[A], Fn[A] -> B) -> Set[B]` | Transform elements |
| `fold` | `(Set[A], B, Fn[B, A] -> B) -> B` | Accumulate over elements |
| `each` | `(Set[A], Fn[A] -> Unit) -> Unit` | Side effect per element |
| `any` | `(Set[A], Fn[A] -> Bool) -> Bool` | Any element matches |
| `all` | `(Set[A], Fn[A] -> Bool) -> Bool` | All elements match |

## Examples

```almd
let a = set.from_list([1, 2, 3])
let b = set.from_list([2, 3, 4])

set.union(a, b)           // {1, 2, 3, 4}
set.intersection(a, b)    // {2, 3}
set.difference(a, b)      // {1}
set.contains(a, 2)        // => true
set.is_subset(a, b)       // => false
```
