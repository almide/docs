---
title: path
description: Filesystem path manipulation — join, dirname, basename, extension, normalize, and the SafePath type.
---

`import path`

Pure string manipulation over `/`-separated paths. Nothing here touches the
filesystem; use [fs](/docs/stdlib/fs/) for that. The separator is `/` on every
platform — Windows-style `\` paths are not interpreted.

## Splitting a path apart

| Function | Signature |
|---|---|
| `path.dirname(p)` | `String -> String` |
| `path.basename(p)` | `String -> String` |
| `path.extension(p)` | `String -> Option[String]` |
| `path.stem(p)` | `String -> String` |

```almide
import path

fn main() -> Unit = {
  println(path.dirname("/var/log/app.log"))    // /var/log
  println(path.basename("/var/log/app.log"))   // app.log
  println(path.stem("/var/log/app.log"))       // app
  println(path.extension("app.log") ?? "-")    // log
}
```

`extension` returns the last extension with no leading dot, and `none` when
there is none. Two edge cases are worth knowing:

- `dirname("app.log")` is `""`, not `"."`.
- A dotfile is asymmetric: `extension(".hidden")` is `some("hidden")` while
  `stem(".hidden")` is `".hidden"`. Do not assume `stem + "." + extension`
  reconstructs the input.

## Building and cleaning

| Function | Signature |
|---|---|
| `path.join(base, child)` | `(String, String) -> String` |
| `path.normalize(p)` | `String -> String` |
| `path.is_absolute(p)` | `String -> Bool` |

```almide
path.join("var", "log")        // var/log
path.join("var/", "log")       // var/log      — one trailing slash is absorbed
path.join("/usr/lib", "/etc")  // /etc         — an absolute child replaces base
path.normalize("/a/./b/../c")  // /a/c
path.normalize("a/../../c")    // ../c         — relative paths keep leading ..
path.normalize("/../a")        // /a           — absolute paths cannot escape root
```

`join` with an empty child keeps the trailing slash (`join("a", "")` is `"a/"`).

## SafePath

`SafePath` is an opaque type for paths that have been checked for traversal.
Construct it through `from_string`, which rejects anything containing a `..`
segment:

| Function | Signature |
|---|---|
| `path.from_string(s)` | `String -> Result[SafePath, String]` |
| `path.trusted(s)` | `String -> SafePath` |
| `path.to_string(p)` | `SafePath -> String` |

```almide
match path.from_string(user_input) {
  ok(p)  => read_it(path.to_string(p)),
  err(e) => println(e),          // path traversal rejected: ../../etc/passwd
}
```

`trusted` is the deliberate escape hatch for paths you constructed yourself. It
performs no checking — the name is the documentation.
