---
title: Installation
description: How to install and set up Almide.
---

## One-line installer (recommended)

**macOS / Linux:**

```bash
curl -fsSL https://raw.githubusercontent.com/almide/almide/main/tools/install.sh | sh
```

**Windows (PowerShell):**

```powershell
irm https://raw.githubusercontent.com/almide/almide/main/tools/install.ps1 | iex
```

Both scripts auto-detect your platform, download a prebuilt binary from GitHub Releases, and verify SHA-256 checksums.

## Self-update

Once installed, update Almide from itself:

```bash
almide self-update          # update to latest release
almide self-update v0.13.1  # pin to a specific version
```

## From source

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
