---
title: json
description: JSON parsing and manipulation in the Almide standard library. Requires import.
---

The `json` module provides JSON parsing, construction, and traversal. **Requires `import json`.**

## Function Reference

### Parsing and Serialization

| Function | Signature | Description |
|---|---|---|
| `parse` | `(String) -> Result[Value, String]` | Parse JSON string |
| `stringify` | `(Value) -> String` | Convert to compact JSON string |
| `stringify_pretty` | `(Value) -> String` | Convert to pretty-printed JSON |

### Value Construction

| Function | Signature | Description |
|---|---|---|
| `from_string` | `(String) -> Value` | Create string value |
| `from_int` | `(Int) -> Value` | Create integer value |
| `from_float` | `(Float) -> Value` | Create float value |
| `from_bool` | `(Bool) -> Value` | Create boolean value |
| `null` | `() -> Value` | Create null value |
| `array` | `(List[Value]) -> Value` | Create array value |
| `object` | `(List[(String, Value)]) -> Value` | Create object from key-value pairs |

### Key-Based Access

| Function | Signature | Description |
|---|---|---|
| `get` | `(Value, String) -> Option[Value]` | Get nested value by key |
| `get_string` | `(Value, String) -> Option[String]` | Get string by key |
| `get_int` | `(Value, String) -> Option[Int]` | Get integer by key |
| `get_float` | `(Value, String) -> Option[Float]` | Get float by key |
| `get_bool` | `(Value, String) -> Option[Bool]` | Get boolean by key |
| `get_array` | `(Value, String) -> Option[List[Value]]` | Get array by key |
| `keys` | `(Value) -> List[String]` | Get all object keys |

### Value Extraction (keyless)

| Function | Signature | Description |
|---|---|---|
| `as_string` | `(Value) -> Option[String]` | Extract string from value |
| `as_int` | `(Value) -> Option[Int]` | Extract integer from value |
| `as_float` | `(Value) -> Option[Float]` | Extract float from value |
| `as_bool` | `(Value) -> Option[Bool]` | Extract boolean from value |
| `as_array` | `(Value) -> Option[List[Value]]` | Extract array from value |

### Path API

| Function | Signature | Description |
|---|---|---|
| `root` | `() -> JsonPath` | Create root path |
| `field` | `(JsonPath, String) -> JsonPath` | Extend path with field |
| `index` | `(JsonPath, Int) -> JsonPath` | Extend path with array index |
| `get_path` | `(Value, JsonPath) -> Option[Value]` | Get value at path |
| `set_path` | `(Value, JsonPath, Value) -> Result[Value, String]` | Set value at path |
| `remove_path` | `(Value, JsonPath) -> Value` | Remove value at path |

## Examples

```almd
import json

// Parse JSON
let data = json.parse("{\"name\": \"Alice\", \"age\": 30}")

// Access fields
match data {
  ok(j) => {
    let name = json.get_string(j, "name")  // => some("Alice")
    let age = json.get_int(j, "age")       // => some(30)
  },
  err(e) => println("parse error: " + e),
}

// Build JSON
let obj = json.object([
  ("name", json.from_string("Bob")),
  ("age", json.from_int(25)),
  ("scores", json.array([json.from_int(90), json.from_int(85)])),
])
let text = json.stringify_pretty(obj)

// Path-based access
let path = json.field(json.root(), "scores") |> json.index(_, 0)
let first_score = json.get_path(obj, path)  // => some(Value)
```
