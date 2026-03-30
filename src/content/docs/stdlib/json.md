---
title: json
description: JSON parsing, serialization, and querying. Requires `import json`.
---

```almd
import json
```

## Functions

| Function | Signature | Description |
|---|---|---|
| `parse` | `(String) -> Result[Value, String]` | Parse a JSON string into a Value. |
| `stringify` | `(Value) -> String` | Convert a Value to a JSON string. |
| `get` | `(Value, String) -> Option[Value]` | Get a nested value by key. Returns none if key doesn't exist. |
| `keys` | `(Value) -> List[String]` | Get all keys of a JSON object as a list of strings. |
| `from_string` | `(String) -> Value` | Create a Json string value. |
| `from_int` | `(Int) -> Value` | Create a Json integer value. |
| `from_bool` | `(Bool) -> Value` | Create a Json boolean value. |
| `null` | `() -> Value` | Create a Json null value. |
| `array` | `(List[Value]) -> Value` | Create a Json array from a list of Json values. |
| `from_float` | `(Float) -> Value` | Create a Json float value. |
| `stringify_pretty` | `(Value) -> String` | Convert a Json value to a pretty-printed JSON string with indentation. |
| `object` | `(List[(String, Value)]) -> Value` | Create a Json object from a list of (key, value) pairs. |
| `get_string` | `(Value, String) -> Option[String]` | Get a string value by key. Returns none if key doesn't exist or value is not a string. |
| `get_int` | `(Value, String) -> Option[Int]` | Get an integer value by key. Returns none if key doesn't exist or value is not an integer. |
| `get_float` | `(Value, String) -> Option[Float]` | Get a float value by key. Returns none if key doesn't exist or value is not a number. |
| `get_bool` | `(Value, String) -> Option[Bool]` | Get a boolean value by key. Returns none if key doesn't exist or value is not a boolean. |
| `get_array` | `(Value, String) -> Option[List[Value]]` | Get an array value by key. Returns none if key doesn't exist or value is not an array. |
| `as_string` | `(Value) -> Option[String]` | Extract string from a Json value (without key lookup). Returns none if not a string. |
| `as_int` | `(Value) -> Option[Int]` | Extract integer from a Json value (without key lookup). Returns none if not an integer. |
| `as_float` | `(Value) -> Option[Float]` | Extract float from a Json value (without key lookup). Returns none if not a number. |
| `as_bool` | `(Value) -> Option[Bool]` | Extract boolean from a Json value (without key lookup). Returns none if not a boolean. |
| `as_array` | `(Value) -> Option[List[Value]]` | Extract array from a Json value (without key lookup). Returns none if not an array. |
| `root` | `() -> JsonPath` | Create a root JSON path for traversal. |
| `field` | `(JsonPath, String) -> JsonPath` | Extend a JSON path with a field name. |
| `index` | `(JsonPath, Int) -> JsonPath` | Extend a JSON path with an array index. |
| `get_path` | `(Value, JsonPath) -> Option[Value]` | Get a value at a JSON path. Returns none if path doesn't exist. |
| `set_path` | `(Value, JsonPath, Value) -> Result[Value, String]` | Set a value at a JSON path. Returns error if path is invalid. |
| `remove_path` | `(Value, JsonPath) -> Value` | Remove a value at a JSON path. Returns the Json with the value removed. |

## Reference

### `json.parse(text: String) -> Result[Value, String]`

Parse a JSON string into a Value.

```almd
let v = json.parse("{\"name\": \"Alice\"}")
```

### `json.stringify(v: Value) -> String`

Convert a Value to a JSON string.

```almd
json.stringify(person.encode())
```

### `json.get(j: Value, key: String) -> Option[Value]`

Get a nested value by key. Returns none if key doesn't exist.

```almd
json.get(j, "name")
```

### `json.keys(j: Value) -> List[String]`

Get all keys of a JSON object as a list of strings.

```almd
json.keys(j)
```

### `json.from_string(s: String) -> Value`

Create a Json string value.

```almd
json.from_string("hello")
```

### `json.from_int(n: Int) -> Value`

Create a Json integer value.

```almd
json.from_int(42)
```

### `json.from_bool(b: Bool) -> Value`

Create a Json boolean value.

```almd
json.from_bool(true)
```

### `json.null() -> Value`

Create a Json null value.

```almd
json.null()
```

### `json.array(items: List[Value]) -> Value`

Create a Json array from a list of Json values.

```almd
json.array([json.i(1), json.i(2)])
```

### `json.from_float(n: Float) -> Value`

Create a Json float value.

```almd
json.from_float(3.14)
```

### `json.stringify_pretty(j: Value) -> String`

Convert a Json value to a pretty-printed JSON string with indentation.

```almd
json.stringify_pretty(j)
```

### `json.object(entries: List[(String, Value)]) -> Value`

Create a Json object from a list of (key, value) pairs.

```almd
json.object([("name", json.s("Alice")), ("age", json.i(30))])
```

### `json.get_string(j: Value, key: String) -> Option[String]`

Get a string value by key. Returns none if key doesn't exist or value is not a string.

```almd
json.get_string(j, "name")
```

### `json.get_int(j: Value, key: String) -> Option[Int]`

Get an integer value by key. Returns none if key doesn't exist or value is not an integer.

```almd
json.get_int(j, "age")
```

### `json.get_float(j: Value, key: String) -> Option[Float]`

Get a float value by key. Returns none if key doesn't exist or value is not a number.

```almd
json.get_float(j, "price")
```

### `json.get_bool(j: Value, key: String) -> Option[Bool]`

Get a boolean value by key. Returns none if key doesn't exist or value is not a boolean.

```almd
json.get_bool(j, "active")
```

### `json.get_array(j: Value, key: String) -> Option[List[Value]]`

Get an array value by key. Returns none if key doesn't exist or value is not an array.

```almd
json.get_array(j, "items")
```

### `json.as_string(j: Value) -> Option[String]`

Extract string from a Json value (without key lookup). Returns none if not a string.

```almd
json.as_string(j)
```

### `json.as_int(j: Value) -> Option[Int]`

Extract integer from a Json value (without key lookup). Returns none if not an integer.

```almd
json.as_int(j)
```

### `json.as_float(j: Value) -> Option[Float]`

Extract float from a Json value (without key lookup). Returns none if not a number.

```almd
json.as_float(j)
```

### `json.as_bool(j: Value) -> Option[Bool]`

Extract boolean from a Json value (without key lookup). Returns none if not a boolean.

```almd
json.as_bool(j)
```

### `json.as_array(j: Value) -> Option[List[Value]]`

Extract array from a Json value (without key lookup). Returns none if not an array.

```almd
json.as_array(j)
```

### `json.root() -> JsonPath`

Create a root JSON path for traversal.

```almd
json.root()
```

### `json.field(path: JsonPath, name: String) -> JsonPath`

Extend a JSON path with a field name.

```almd
json.field(json.root(), "user")
```

### `json.index(path: JsonPath, i: Int) -> JsonPath`

Extend a JSON path with an array index.

```almd
json.index(json.field(json.root(), "items"), 0)
```

### `json.get_path(j: Value, path: JsonPath) -> Option[Value]`

Get a value at a JSON path. Returns none if path doesn't exist.

```almd
json.get_path(j, json.field(json.root(), "name"))
```

### `json.set_path(j: Value, path: JsonPath, value: Value) -> Result[Value, String]`

Set a value at a JSON path. Returns error if path is invalid.

```almd
json.set_path(j, json.field(json.root(), "name"), json.s("Bob"))
```

### `json.remove_path(j: Value, path: JsonPath) -> Value`

Remove a value at a JSON path. Returns the Json with the value removed.

```almd
json.remove_path(j, json.field(json.root(), "temp"))
```
