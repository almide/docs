---
title: fs
description: File system operations in the Almide standard library. Requires import.
---

The `fs` module provides file system operations. **Requires `import fs`.** All functions are `effect fn`.

## Function Reference

### Reading

| Function | Signature | Description |
|---|---|---|
| `read_text` | `(String) -> Result[String, String]` | Read file as UTF-8 string |
| `read_bytes` | `(String) -> Result[List[Int], String]` | Read file as byte list |
| `read_lines` | `(String) -> Result[List[String], String]` | Read file as list of lines |

### Writing

| Function | Signature | Description |
|---|---|---|
| `write` | `(String, String) -> Result[Unit, String]` | Write string to file (create/overwrite) |
| `write_bytes` | `(String, List[Int]) -> Result[Unit, String]` | Write bytes to file |
| `append` | `(String, String) -> Result[Unit, String]` | Append string to file |

### Directory Operations

| Function | Signature | Description |
|---|---|---|
| `mkdir_p` | `(String) -> Result[Unit, String]` | Create directory and parents |
| `list_dir` | `(String) -> Result[List[String], String]` | List directory entries |
| `walk` | `(String) -> Result[List[String], String]` | Recursively list all files |
| `glob` | `(String) -> Result[List[String], String]` | Find files matching glob pattern |

### File Queries

| Function | Signature | Description |
|---|---|---|
| `exists` | `(String) -> Bool` | Check if path exists |
| `is_file` | `(String) -> Bool` | Check if path is a regular file |
| `is_dir` | `(String) -> Bool` | Check if path is a directory |
| `is_symlink` | `(String) -> Bool` | Check if path is a symlink |
| `file_size` | `(String) -> Result[Int, String]` | Get file size in bytes |
| `modified_at` | `(String) -> Result[Int, String]` | Get modification time (Unix timestamp) |
| `stat` | `(String) -> Result[{size, is_dir, is_file, modified}, String]` | Get file metadata |

### File Operations

| Function | Signature | Description |
|---|---|---|
| `copy` | `(String, String) -> Result[Unit, String]` | Copy file |
| `rename` | `(String, String) -> Result[Unit, String]` | Rename or move file |
| `remove` | `(String) -> Result[Unit, String]` | Delete a file |
| `remove_all` | `(String) -> Result[Unit, String]` | Recursively delete directory |

### Temporary Files

| Function | Signature | Description |
|---|---|---|
| `temp_dir` | `() -> String` | Get system temp directory |
| `create_temp_file` | `(String) -> Result[String, String]` | Create temp file with prefix |
| `create_temp_dir` | `(String) -> Result[String, String]` | Create temp directory with prefix |

## Examples

```almd
import fs

effect fn process_files() -> Result[Unit, String] = {
  let text = fs.read_text("input.txt")
  let lines = string.lines(text)
  let upper = list.map(lines, (l) => string.to_upper(l))
  fs.write("output.txt", string.join(upper, "\n"))
}

effect fn list_almd_files() -> Result[Unit, String] = {
  let files = fs.glob("src/**/*.almd")
  for f in files {
    println(f)
  }
  ok(())
}
```
