---
title: map
description: Map (dictionary) operations in the Almide standard library. Auto-imported.
---

The `map` module provides functions for working with `Map[K, V]` key-value collections. It is **auto-imported** -- no `import` statement needed.

Map literals use brackets: `["a": 1, "b": 2]`. Empty map: `[:]` (requires type annotation).

## Function Reference

| Function | Signature | Description |
|---|---|---|
| `new` | `() -> Map[K, V]` | Create an empty map |
| `get` | `(Map[K, V], K) -> Option[V]` | Get value by key |
| `get_or` | `(Map[K, V], K, V) -> V` | Get value or default |
| `set` | `(Map[K, V], K, V) -> Map[K, V]` | Return new map with key set (immutable) |
| `contains` | `(Map[K, V], K) -> Bool` | Check if key exists |
| `remove` | `(Map[K, V], K) -> Map[K, V]` | Return new map with key removed (immutable) |
| `keys` | `(Map[K, V]) -> List[K]` | Get all keys (sorted) |
| `values` | `(Map[K, V]) -> List[V]` | Get all values |
| `entries` | `(Map[K, V]) -> List[(K, V)]` | Get all key-value pairs (sorted by key) |
| `len` | `(Map[K, V]) -> Int` | Number of entries |
| `is_empty` | `(Map[K, V]) -> Bool` | Empty check |
| `merge` | `(Map[K, V], Map[K, V]) -> Map[K, V]` | Merge two maps (second overrides) |
| `from_list` | `(List[(K, V)]) -> Map[K, V]` | Create map from list of pairs |
| `map` | `(Map[K, V], Fn[V] -> B) -> Map[K, B]` | Transform all values |
| `filter` | `(Map[K, V], Fn[K, V] -> Bool) -> Map[K, V]` | Keep matching entries |
| `fold` | `(Map[K, V], A, Fn[A, K, V] -> A) -> A` | Accumulate over entries |
| `any` | `(Map[K, V], Fn[K, V] -> Bool) -> Bool` | Any entry matches |
| `all` | `(Map[K, V], Fn[K, V] -> Bool) -> Bool` | All entries match |
| `count` | `(Map[K, V], Fn[K, V] -> Bool) -> Int` | Count matching entries |
| `each` | `(Map[K, V], Fn[K, V] -> Unit) -> Unit` | Side effect per entry |
| `find` | `(Map[K, V], Fn[K, V] -> Bool) -> Option[(K, V)]` | Find first matching entry |
| `update` | `(Map[K, V], K, Fn[V] -> V) -> Map[K, V]` | Update value at key with function |

### Mutable Operations (require `var`)

| Function | Signature | Description |
|---|---|---|
| `insert` | `(Map[K, V], K, V) -> Unit` | Insert in place |
| `delete` | `(Map[K, V], K) -> Unit` | Remove key in place |
| `clear` | `(Map[K, V]) -> Unit` | Remove all entries in place |

## Examples

```almd
let scores: Map[String, Int] = ["alice": 90, "bob": 85]

// Lookup
let alice_score = map.get(scores, "alice")  // => some(90)

// Immutable update
let updated = map.set(scores, "carol", 95)

// Iteration
for (name, score) in scores {
  println(name + ": " + int.to_string(score))
}

// Higher-order
let high_scores = map.filter(scores, (k, v) => v >= 90)
let total = map.fold(scores, 0, (acc, k, v) => acc + v)
```
