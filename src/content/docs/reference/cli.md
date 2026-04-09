---
title: CLI Reference
description: Complete reference for the Almide command-line interface including all subcommands and flags.
---

## Installation

```bash
git clone https://github.com/almide/almide
cd almide
cargo build --release
```

See [Installation](/docs/getting-started/installation/) for details.

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

### `almide compile`

Compile source to a module interface — the language-agnostic intermediate representation of a module's public API (types, functions, constants).

```bash
almide compile                         # project module interface
almide compile parser                  # specific module by name
almide compile src/parser.almd         # specific module by file path
almide compile --json                  # machine-readable JSON output
almide compile parser --json           # combine module + JSON
```

The module interface is the bridge between Almide source and external targets. It captures the public contract (exported types, function signatures, constants) without any target-specific details.

**Default output** is human-readable:

```text
module parser

  type Token
    | Ident(String)
    | Number(Int)
    | Symbol(String)

  fn parse(input: String) -> List[Token]
  fn tokenize(input: String) -> List[Token]
```

**JSON output** (`--json`) is designed for tooling: binding generators, documentation tools, and IDE integration.

| Flag | Description |
|------|-------------|
| `--json` | Output as machine-readable JSON |

### `almide check`

Type-check source files without generating code or running.

```bash
almide check app.almd
almide check app.almd --deny-warnings
almide check app.almd --json
almide check --explain E001
almide check app.almd --effects
```

Reports type errors, undefined references, and other static analysis issues. Faster than `almide run` since it skips code generation and compilation.

| Flag | Description |
|------|-------------|
| `--deny-warnings` | Treat warnings as errors |
| `--json` | Output diagnostics as JSON |
| `--explain E001` | Explain an error code |
| `--effects` | Show effect/capability analysis |

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

### `almide init`

Create a new Almide project with `almide.toml` and `src/main.almd`.

```bash
almide init
```

### `almide add`

Add a dependency to `almide.toml`.

```bash
almide add my-lib --git https://github.com/user/my-lib --tag v1.0.0
```

### `almide deps`

List project dependencies.

```bash
almide deps
```

### `almide self-update`

Update the Almide compiler to the latest release, or pin to a specific version.

```bash
almide self-update          # update to latest
almide self-update v0.13.1  # pin to a specific version
```

Downloads a prebuilt binary for your platform from GitHub Releases and verifies the SHA-256 checksum before replacing the current binary.

## Common Flags

| Flag | Commands | Description |
|------|----------|-------------|
| `--no-check` | run, build, test | Skip type checking |
| `--fast` | build | Maximum performance: native CPU, opt-level=3, LTO |
| `--release` | build | Optimize for performance (opt-level=2) |
| `--json` | compile, test, check | Output results as JSON |

## Code Emission

### `--target`

Emit generated source code for a specific target language.

```bash
almide app.almd --target rust          # emit Rust source
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
