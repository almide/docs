---
title: process
description: Process execution and control. Requires `import process`.
---

```almd
import process
```

## Functions

| Function | Signature | Description |
|---|---|---|
| `exec` | `(String, List[String]) -> Result[String, String]` | Execute a command and return its stdout as a string |
| `exit` | `(Int) -> Unit` | Exit the process with the given status code |
| `stdin_lines` | `() -> Result[List[String], String]` | Read all lines from standard input |
| `exec_in` | `(String, String, List[String]) -> Result[String, String]` | Execute a command in a specific working directory |
| `exec_with_stdin` | `(String, List[String], String) -> Result[String, String]` | Execute a command with input piped to its stdin |
| `exec_status` | `(String, List[String]) -> Result[{code: Int, stdout: String, stderr: String}, String]` | Execute a command and return exit code, stdout, and stderr |

## Reference

### `process.exec(cmd: String, args: List[String]) -> Result[String, String]`

Execute a command and return its stdout as a string

```almd
let output = process.exec("ls", ["-la"])
```

### `process.exit(code: Int) -> Unit`

Exit the process with the given status code

```almd
process.exit(1)
```

### `process.stdin_lines() -> Result[List[String], String]`

Read all lines from standard input

```almd
let lines = ok(string.lines(io.read_all()))
```

### `process.exec_in(dir: String, cmd: String, args: List[String]) -> Result[String, String]`

Execute a command in a specific working directory

```almd
let output = process.output(process.ProcessCommand { cmd: "pwd", args: [], dir: "/tmp" })
```

### `process.exec_with_stdin(cmd: String, args: List[String], input: String) -> Result[String, String]`

Execute a command with input piped to its stdin

```almd
let output = process.output(process.ProcessCommand { cmd: "cat", args: [], stdin: "hello" })
```

### `process.exec_status(cmd: String, args: List[String]) -> Result[{code: Int, stdout: String, stderr: String}, String]`

Execute a command and return exit code, stdout, and stderr

```almd
let r = process.output(process.ProcessCommand { cmd: "ls", args: [] }) // {code, stdout, stderr}
```

### `process.env(key: String) -> Option[String]`

Get the value of an environment variable, or None if not set.

```almd
let home = env.get("HOME") ?? "/tmp"
```

### `process.args() -> List[String]`

Get command-line arguments as a list of strings.

```almd
let args = process.args()
```

### `process.pid() -> Int`

Get the current process ID.

```almd
let my_pid = process.pid()
```

### `process.spawn(cmd: String, args: List[String]) -> Result[Int, String]`

Spawn a child process without waiting, return its PID.

```almd
let pid = process.spawn("node", ["server.js"])
```

### `process.kill(pid: Int, signal: Int) -> Result[Unit, String]`

Send a signal to a process by PID (e.g. 15 for SIGTERM, 9 for SIGKILL).

```almd
process.kill(pid, 15)
```

### `process.is_alive(pid: Int) -> Bool`

Check if a process with the given PID is still running.

```almd
let running = process.is_alive(pid)
```
