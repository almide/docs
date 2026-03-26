---
title: Installation
description: How to install and set up Almide.
---

## From source (recommended)

Almide is written in Rust. You need `cargo` installed.

```bash
git clone https://github.com/almide/almide.git
cd almide
cargo build --release
```

The binary is at `target/release/almide`. Add it to your `PATH`:

```bash
# Add to ~/.zshrc or ~/.bashrc
export PATH="$PATH:/path/to/almide/target/release"
```

## Verify installation

```bash
almide --version
```

## Editor support

Almide files use the `.almd` extension. Syntax highlighting is available for:

- **VS Code** — search for "Almide" in the extension marketplace
- **Tree-sitter** — grammar available at [almide/almide-grammar](https://github.com/almide/almide-grammar)

## Development setup

If you plan to contribute to Almide, install the git hooks:

```bash
brew install lefthook  # or see https://github.com/evilmartians/lefthook
lefthook install
```
