---
title: datetime
description: Date and time operations in the Almide standard library. Requires import.
---

The `datetime` module provides date/time creation, formatting, and arithmetic. **Requires `import datetime`.** DateTime is represented as `Int` (Unix timestamp in seconds, UTC).

## Function Reference

### Construction

| Function | Signature | Description |
|---|---|---|
| `now` | `() -> Int` | Current time as Unix timestamp (effect) |
| `from_parts` | `(Int, Int, Int, Int, Int, Int) -> Int` | Create from year, month, day, hour, minute, second |
| `parse_iso` | `(String) -> Result[Int, String]` | Parse ISO 8601 string |
| `from_unix` | `(Int) -> Int` | Identity (documentation clarity) |

### Formatting

| Function | Signature | Description |
|---|---|---|
| `format` | `(Int, String) -> String` | Format with pattern string |
| `to_iso` | `(Int) -> String` | Format as ISO 8601 |
| `to_unix` | `(Int) -> Int` | Get Unix timestamp (identity) |

### Part Access

| Function | Signature | Description |
|---|---|---|
| `year` | `(Int) -> Int` | Extract year |
| `month` | `(Int) -> Int` | Extract month (1-12) |
| `day` | `(Int) -> Int` | Extract day (1-31) |
| `hour` | `(Int) -> Int` | Extract hour (0-23) |
| `minute` | `(Int) -> Int` | Extract minute (0-59) |
| `second` | `(Int) -> Int` | Extract second (0-59) |
| `weekday` | `(Int) -> String` | Day of week (Monday-Sunday) |

### Arithmetic

| Function | Signature | Description |
|---|---|---|
| `add_days` | `(Int, Int) -> Int` | Add n days |
| `add_hours` | `(Int, Int) -> Int` | Add n hours |
| `add_minutes` | `(Int, Int) -> Int` | Add n minutes |
| `add_seconds` | `(Int, Int) -> Int` | Add n seconds |
| `diff_seconds` | `(Int, Int) -> Int` | Difference in seconds |

### Comparison

| Function | Signature | Description |
|---|---|---|
| `is_before` | `(Int, Int) -> Bool` | Check if a is before b |
| `is_after` | `(Int, Int) -> Bool` | Check if a is after b |

## Examples

```almd
import datetime

let ts = datetime.from_parts(2024, 1, 15, 12, 0, 0)
datetime.format(ts, "%Y-%m-%d")          // => "2024-01-15"
datetime.to_iso(ts)                      // => "2024-01-15T12:00:00Z"
datetime.year(ts)                        // => 2024
datetime.weekday(ts)                     // => "Monday"
datetime.add_days(ts, 7)                 // one week later
datetime.diff_seconds(later, earlier)    // => 3600
```
