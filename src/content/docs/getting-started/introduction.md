---
title: Introduction
description: What is Almide and why does it exist?
---

Almide is a programming language designed for a single metric: **modification survival rate** — the probability that an LLM-generated code change compiles and passes tests on the first attempt.

## Core idea

Most programming languages optimize for human expressiveness. Almide optimizes for **predictability**. At every generation step, the set of valid next tokens is as small as possible. This means:

- **One way to write it** — no synonyms, no alternative syntax
- **Types everywhere** — every function signature is fully typed
- **Effects are visible** — `effect fn` marks side effects in the type
- **No magic** — no implicit conversions, no macros, no reflection

## Multi-target compilation

Almide compiles to three targets from the same source:

| Target | Use case |
|--------|----------|
| **Rust** | Production binaries, system programming |
| **TypeScript** | Web applications, Node.js |
| **WASM** | Browser, edge computing, sandboxed execution |

```bash
almide run app.almd              # Compile + execute (via Rust)
almide build app.almd --target wasm  # Build WASM binary
almide app.almd --target ts      # Emit TypeScript source
```

## Design principles

| Principle | Definition |
|-----------|------------|
| **Predictable** | The next valid syntax can be narrowed tightly at each step |
| **Local** | Understanding a function requires only nearby context |
| **Repairable** | Errors return near-unique fix candidates |
| **Compact** | High semantic density with low syntactic noise |

## What Almide looks like

```almide
// Pure function — no side effects
fn fibonacci(n: Int) -> Int =
  if n <= 1 then n
  else fibonacci(n - 1) + fibonacci(n - 2)

// Type with variants (algebraic data type)
type Shape =
  | Circle(Float)
  | Rectangle(Float, Float)

fn area(s: Shape) -> Float =
  match s {
    Circle(r) => 3.14159 * r ^ 2,
    Rectangle(w, h) => w * h,
  }

// Effect function — can fail, can do I/O
effect fn read_config(path: String) -> Result[String, String] = {
  let content = fs.read_text(path)
  ok(content)
}
```

## Next steps

- [Install Almide](/docs/getting-started/installation/) to start writing code
- [Hello World](/docs/getting-started/hello-world/) for your first program
- [Language Guide](/docs/guide/types/) for a comprehensive tour
