---
title: CLI Reference
description: Complete reference for the Almide command-line interface including all subcommands and flags.
---

## Installation

```bash
cargo install almide
```

Or build from source:

```bash
git clone https://github.com/almide/almide
cd almide
cargo build --release
```

## Commands

### `almide run`

Compile and execute an Almide program.

```bash
almide run app.almd
almide run app.almd -- arg1 arg2    # pass arguments to the program
```

The compiler generates Rust source, compiles it with `rustc`, and executes the resulting binary. Arguments after `--` are passed to the program's `main(args)` function.

### `almide build`

Compile an Almide program to a binary or other target format.

```bash
almide build app.almd                  # build native binary
almide build app.almd -o myapp         # specify output name
almide build app.almd --target wasm    # build WebAssembly
almide build app.almd --target npm     # build npm package
```

**Flags:**

| Flag | Description |
|---|---|
| `-o <name>` | Output file name |
| `--target wasm` | Build WebAssembly binary |
| `--target npm` | Build npm-publishable package |
| `--release` | Enable optimizations |

### `almide test`

Find and run all test blocks in `.almd` files.

```bash
almide test                            # all tests (recursive from cwd)
almide test spec/lang/                 # tests in a directory
almide test spec/lang/expr_test.almd   # single test file
almide test --run "pattern"            # filter tests by name
```

The test runner recursively finds all `.almd` files containing `test` blocks and executes them. Tests are defined inline:

```almd
test "addition works" {
  assert_eq(1 + 1, 2)
  assert(true)
  assert_ne(1, 2)
}
```

### `almide check`

Type-check source files without generating code or running.

```bash
almide check app.almd
almide check src/
```

Reports type errors, undefined references, and other static analysis issues. Faster than `almide run` since it skips code generation and compilation.

### `almide fmt`

Format Almide source code.

```bash
almide fmt app.almd                    # format a single file
almide fmt src/                        # format all .almd files in directory
```

Applies canonical formatting: consistent indentation, spacing, and line breaks.

### `almide clean`

Clear the dependency cache and build artifacts.

```bash
almide clean
```

Removes cached git dependencies and generated files.

## Code Emission

### `--target`

Emit generated source code for a specific target language.

```bash
almide app.almd --target rust          # emit Rust source
almide app.almd --target ts            # emit TypeScript source
```

Outputs the generated source code to stdout. Useful for inspecting what the compiler produces.

### `--emit-ast`

Emit the parsed AST as JSON.

```bash
almide app.almd --emit-ast
```

Outputs the full abstract syntax tree in JSON format. Useful for tooling integration and debugging.

## Diagnostics

Error output includes file location, source context, and actionable hints:

```text
error[E005]: argument 'xs' expects List[Int] but got String
  at line 5
  in call to list.sort()
  hint: Fix the argument type
  |
5 | let sorted = list.sort("hello")
  |                        ^^^^^^^
```

### `--json`

Output diagnostics in JSON format for tool integration:

```bash
almide check app.almd --json
```

## Project Configuration

Projects are configured via `almide.toml` in the project root:

```toml
[package]
name = "myapp"
version = "0.1.0"

[dependencies]
mylib = { git = "https://github.com/user/mylib" }
```

## Exit Codes

| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | Compilation error |
| 101 | Runtime error (program panicked) |
