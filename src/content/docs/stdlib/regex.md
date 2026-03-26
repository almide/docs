---
title: regex
description: Regular expression functions in the Almide standard library. Requires import.
---

The `regex` module provides regular expression matching, searching, and replacement. **Requires `import regex`.**

## Function Reference

| Function | Signature | Description |
|---|---|---|
| `is_match` | `(String, String) -> Bool` | Check if pattern matches anywhere in string |
| `full_match` | `(String, String) -> Bool` | Check if pattern matches entire string |
| `find` | `(String, String) -> Option[String]` | Find first match |
| `find_all` | `(String, String) -> List[String]` | Find all non-overlapping matches |
| `replace` | `(String, String, String) -> String` | Replace all matches |
| `replace_first` | `(String, String, String) -> String` | Replace first match |
| `split` | `(String, String) -> List[String]` | Split by regex pattern |
| `captures` | `(String, String) -> Option[List[String]]` | Extract capture groups from first match |

Note: The first argument is always the regex pattern, the second is the string to search.

## Examples

```almd
import regex

regex.is_match("[0-9]+", "abc123")              // => true
regex.full_match("[0-9]+", "123")               // => true
regex.find("[0-9]+", "abc123def")               // => some("123")
regex.find_all("[0-9]+", "a1b2c3")              // => ["1", "2", "3"]
regex.replace("[0-9]+", "a1b2", "X")            // => "aXbX"
regex.replace_first("[0-9]+", "a1b2", "X")      // => "aXb2"
regex.split("[,;]", "a,b;c")                    // => ["a", "b", "c"]
regex.captures("(\\w+)@(\\w+)", "user@host")    // => some(["user@host", "user", "host"])
```
