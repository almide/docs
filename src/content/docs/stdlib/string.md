---
title: string
description: String manipulation functions in the Almide standard library. Auto-imported.
---

The `string` module provides functions for string manipulation. It is **auto-imported** -- no `import` statement needed.

## Core Operations

### `string.len(s: String) -> Int`

Return the number of characters in a string.

```almd
string.len("hello") // => 5
string.len("")      // => 0
```

### `string.is_empty(s: String) -> Bool`

Check if a string is empty.

```almd
string.is_empty("") // => true
string.is_empty("a") // => false
```

### `string.contains(s: String, sub: String) -> Bool`

Check if a string contains a substring.

```almd
string.contains("hello world", "world") // => true
```

### `string.reverse(s: String) -> String`

Reverse the characters in a string.

```almd
string.reverse("hello") // => "olleh"
```

## Trimming

### `string.trim(s: String) -> String`

Remove leading and trailing whitespace.

```almd
string.trim("  hello  ") // => "hello"
```

### `string.trim_start(s: String) -> String`

Remove leading whitespace.

```almd
string.trim_start("  hello") // => "hello"
```

### `string.trim_end(s: String) -> String`

Remove trailing whitespace.

```almd
string.trim_end("hello  ") // => "hello"
```

## Splitting and Joining

### `string.split(s: String, sep: String) -> List[String]`

Split a string by separator into a list of substrings.

```almd
string.split("a,b,c", ",") // => ["a", "b", "c"]
```

### `string.join(list: List[String], sep: String) -> String`

Join a list of strings with a separator.

```almd
string.join(["a", "b", "c"], "-") // => "a-b-c"
```

### `string.lines(s: String) -> List[String]`

Split a string into lines.

```almd
string.lines("a\nb\nc") // => ["a", "b", "c"]
```

### `string.chars(s: String) -> List[String]`

Split a string into individual characters.

```almd
string.chars("abc") // => ["a", "b", "c"]
```

## Case Conversion

### `string.to_upper(s: String) -> String`

Convert all characters to uppercase.

```almd
string.to_upper("hello") // => "HELLO"
```

### `string.to_lower(s: String) -> String`

Convert all characters to lowercase.

```almd
string.to_lower("HELLO") // => "hello"
```

### `string.capitalize(s: String) -> String`

Capitalize the first character of a string.

```almd
string.capitalize("hello") // => "Hello"
```

## Search

### `string.starts_with(s: String, prefix: String) -> Bool`

Check if a string starts with a prefix.

```almd
string.starts_with("hello", "hel") // => true
```

### `string.ends_with(s: String, suffix: String) -> Bool`

Check if a string ends with a suffix.

```almd
string.ends_with("hello", "llo") // => true
```

### `string.index_of(s: String, needle: String) -> Option[Int]`

Find the first index of a substring, or none if not found.

```almd
string.index_of("hello", "ll") // => some(2)
```

### `string.last_index_of(s: String, needle: String) -> Option[Int]`

Find the last index of a substring, or none if not found.

```almd
string.last_index_of("abcabc", "bc") // => some(4)
```

### `string.count(s: String, sub: String) -> Int`

Count occurrences of a substring.

```almd
string.count("banana", "an") // => 2
```

## Replacement

### `string.replace(s: String, from: String, to: String) -> String`

Replace all occurrences of a substring.

```almd
string.replace("aabbcc", "bb", "XX") // => "aaXXcc"
```

### `string.replace_first(s: String, from: String, to: String) -> String`

Replace the first occurrence of a substring.

```almd
string.replace_first("aabaa", "a", "X") // => "Xabaa"
```

## Slicing and Substrings

### `string.slice(s: String, start: Int, end?: Int) -> String`

Extract a substring by start and optional end index.

```almd
string.slice("hello", 1, 4)  // => "ell"
string.slice("hello", 2)     // => "llo"
```

### `string.get(s: String, i: Int) -> Option[String]`

Get the character at a given index, or none if out of bounds.

```almd
string.get("hello", 1) // => some("e")
```

### `string.first(s: String) -> Option[String]`

Get the first character of a string.

```almd
string.first("hello") // => some("h")
```

### `string.last(s: String) -> Option[String]`

Get the last character of a string.

```almd
string.last("hello") // => some("o")
```

### `string.take(s: String, n: Int) -> String`

Take the first N characters.

```almd
string.take("hello", 3) // => "hel"
```

### `string.take_end(s: String, n: Int) -> String`

Take the last N characters.

```almd
string.take_end("hello", 3) // => "llo"
```

### `string.drop(s: String, n: Int) -> String`

Drop the first N characters.

```almd
string.drop("hello", 2) // => "llo"
```

### `string.drop_end(s: String, n: Int) -> String`

Drop the last N characters.

```almd
string.drop_end("hello", 2) // => "hel"
```

## Prefix and Suffix

### `string.strip_prefix(s: String, prefix: String) -> Option[String]`

Remove a prefix if present, returning none if not found.

```almd
string.strip_prefix("hello", "hel") // => some("lo")
```

### `string.strip_suffix(s: String, suffix: String) -> Option[String]`

Remove a suffix if present, returning none if not found.

```almd
string.strip_suffix("hello", "llo") // => some("he")
```

## Padding and Repetition

### `string.pad_start(s: String, n: Int, ch: String) -> String`

Pad a string on the left to reach a target length.

```almd
string.pad_start("42", 5, "0") // => "00042"
```

### `string.pad_end(s: String, n: Int, ch: String) -> String`

Pad a string on the right to reach a target length.

```almd
string.pad_end("hi", 5, ".") // => "hi..."
```

### `string.repeat(s: String, n: Int) -> String`

Repeat a string n times.

```almd
string.repeat("ab", 3) // => "ababab"
```

## Character Classification

### `string.is_digit(s: String) -> Bool`

Check if all characters are ASCII digits.

```almd
string.is_digit("123") // => true
```

### `string.is_alpha(s: String) -> Bool`

Check if all characters are alphabetic.

```almd
string.is_alpha("abc") // => true
```

### `string.is_alphanumeric(s: String) -> Bool`

Check if all characters are alphanumeric.

```almd
string.is_alphanumeric("abc123") // => true
```

### `string.is_whitespace(s: String) -> Bool`

Check if all characters are whitespace.

```almd
string.is_whitespace("  ") // => true
```

### `string.is_upper(s: String) -> Bool`

Check if all characters are uppercase.

```almd
string.is_upper("ABC") // => true
```

### `string.is_lower(s: String) -> Bool`

Check if all characters are lowercase.

```almd
string.is_lower("abc") // => true
```

## Byte Conversion

### `string.to_bytes(s: String) -> List[Int]`

Convert a string to a list of UTF-8 byte values.

```almd
string.to_bytes("Hi") // => [72, 105]
```

### `string.from_bytes(bytes: List[Int]) -> String`

Create a string from a list of UTF-8 byte values.

```almd
string.from_bytes([72, 105]) // => "Hi"
```

## Unicode

### `string.codepoint(s: String) -> Option[Int]`

Return the Unicode codepoint of the first character, or none for empty string.

```almd
string.codepoint("A") // => some(65)
```

### `string.from_codepoint(n: Int) -> String`

Create a single-character string from a Unicode codepoint.

```almd
string.from_codepoint(65) // => "A"
```

## Complete Function Reference

| Function | Signature | Description |
|---|---|---|
| `len` | `(String) -> Int` | Character count |
| `is_empty` | `(String) -> Bool` | Empty check |
| `trim` | `(String) -> String` | Strip whitespace |
| `trim_start` | `(String) -> String` | Strip leading whitespace |
| `trim_end` | `(String) -> String` | Strip trailing whitespace |
| `split` | `(String, String) -> List[String]` | Split by separator |
| `join` | `(List[String], String) -> String` | Join with separator |
| `lines` | `(String) -> List[String]` | Split into lines |
| `chars` | `(String) -> List[String]` | Split into characters |
| `contains` | `(String, String) -> Bool` | Substring check |
| `starts_with` | `(String, String) -> Bool` | Prefix check |
| `ends_with` | `(String, String) -> Bool` | Suffix check |
| `index_of` | `(String, String) -> Option[Int]` | First occurrence |
| `last_index_of` | `(String, String) -> Option[Int]` | Last occurrence |
| `count` | `(String, String) -> Int` | Count occurrences |
| `replace` | `(String, String, String) -> String` | Replace all |
| `replace_first` | `(String, String, String) -> String` | Replace first |
| `slice` | `(String, Int, Int?) -> String` | Substring extraction |
| `get` | `(String, Int) -> Option[String]` | Character at index |
| `first` | `(String) -> Option[String]` | First character |
| `last` | `(String) -> Option[String]` | Last character |
| `take` | `(String, Int) -> String` | First N characters |
| `take_end` | `(String, Int) -> String` | Last N characters |
| `drop` | `(String, Int) -> String` | Drop first N |
| `drop_end` | `(String, Int) -> String` | Drop last N |
| `strip_prefix` | `(String, String) -> Option[String]` | Remove prefix |
| `strip_suffix` | `(String, String) -> Option[String]` | Remove suffix |
| `to_upper` | `(String) -> String` | Uppercase |
| `to_lower` | `(String) -> String` | Lowercase |
| `capitalize` | `(String) -> String` | Capitalize first |
| `pad_start` | `(String, Int, String) -> String` | Left pad |
| `pad_end` | `(String, Int, String) -> String` | Right pad |
| `repeat` | `(String, Int) -> String` | Repeat N times |
| `reverse` | `(String) -> String` | Reverse characters |
| `to_bytes` | `(String) -> List[Int]` | UTF-8 bytes |
| `from_bytes` | `(List[Int]) -> String` | From UTF-8 bytes |
| `codepoint` | `(String) -> Option[Int]` | Unicode codepoint |
| `from_codepoint` | `(Int) -> String` | From codepoint |
| `is_digit` | `(String) -> Bool` | ASCII digit check |
| `is_alpha` | `(String) -> Bool` | Alphabetic check |
| `is_alphanumeric` | `(String) -> Bool` | Alphanumeric check |
| `is_whitespace` | `(String) -> Bool` | Whitespace check |
| `is_upper` | `(String) -> Bool` | Uppercase check |
| `is_lower` | `(String) -> Bool` | Lowercase check |
