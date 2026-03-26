---
title: Design Philosophy
description: The design principles and trade-offs behind the Almide programming language.
---

## Core Thesis

**Almide is the language LLMs can write most accurately.**

The essence of language design for LLMs is not maximizing expressiveness, but **minimizing the set of valid candidates at each generation step**. Almide optimizes for **minimal thinking tokens**: the less an LLM has to branch over syntax, semantics, repair strategies, or missing abstractions, the faster, cheaper, and more reliable code generation becomes.

**Goal: High conciseness + Low freedom**

## Four Pillars

| Principle | Definition |
|---|---|
| **Predictable** | The "next valid syntax, API, and semantics" can be narrowed down tightly at each generation step |
| **Local** | The information needed to understand or modify a given location is as close as possible |
| **Repairable** | When errors occur, the compiler returns near-unique fix candidates in few steps |
| **Compact** | High semantic density with low syntactic noise. Strict yet concise |

## Seven Design Principles

1. **Canonicity** -- There should be, in principle, only one primary way to express the same meaning
2. **Surface Semantics** -- Side effects, fallibility, optionality, and mutability must appear in the syntax or type
3. **Local Reasoning** -- The meaning of a function or expression should be largely understandable from nearby syntax alone
4. **Incremental Completion** -- Incomplete code is legal; one can make progress by filling typed holes
5. **Repair-First** -- The compiler should be a repair tool, not a rejection tool; diagnostics are structured
6. **Vocabulary Economy** -- The standard library has a consistent vocabulary with no synonyms
7. **No Magic** -- Mechanisms that change meaning at runtime, context-dependent DSLs, and implicit type conversions are prohibited

## Surface Ambiguity Removed

| Ambiguity source | Other languages | Almide |
|---|---|---|
| Null handling | `null`, `nil`, `None`, `undefined` | `Option[T]` only |
| Error handling | `throw`, `try/catch`, `panic`, error codes | `Result[T, E]` only |
| Generics | `<T>` (ambiguous with `<` `>`) | `[T]` |
| Loops | `while`, `for`, `loop`, `forEach`, recursion | `for x in xs { }` + `while cond { }` |
| Early exit | `return`, `break`, `continue`, `throw` | Last expression + `guard ... else` |
| Lambdas | `=>`, `->`, `lambda`, `fn`, `\x ->`, blocks | `(x) => expr` only |
| Statement termination | `;`, optional `;`, ASI rules | Newline-separated |
| Conditionals | `if` with optional `else`, ternary `?:` | `if/then/else` |
| Side effects | Implicit anywhere | `effect fn` annotation required |
| Operator meaning | Overloading, implicit coercion | Fixed built-in meanings only |
| Type conversions | Implicit widening, coercion | Explicit only |

## Semantic Ambiguity Removed

| Source | What Almide does |
|---|---|
| Name resolution | Core modules auto-imported; non-core requires explicit `import` |
| Type inference | Local only -- annotations required on function signatures |
| Overloading | None -- names do not participate in ad-hoc overload resolution |
| Implicit conversions | None -- `int.to_string(n)`, never auto-coerce |
| Trait lookup | Traits exist but all `impl` is explicit |
| Method resolution | Module-qualified function form is canonical; UFCS is sugar |
| Declaration order | Functions can reference each other freely |
| Import style | `import module` or `import module as alias` -- no `from`, no `*` |

## The `effect` System

`effect fn` is not primarily a safety feature -- it is a **search space reducer for code generation**.

- A pure function can only call other pure functions -- the set of valid completions shrinks dramatically
- An `effect fn` explicitly marks I/O boundaries -- the LLM knows exactly where side effects are legal
- Effect mismatch is caught at compile time -- wrong calls are rejected before execution
- Function signatures alone tell the LLM what is callable at each point, without reading function bodies

## Concurrency: `fan`

Almide keeps concurrency boring on purpose: explicit fork, explicit join, automatic cancellation, and fail-fast semantics. There is no `async`/`await`.

```almd
// Run concurrently, wait for all
fan { fetch_users(); fetch_orders() }

// Parallel map
fan.map(urls, (url) => http.get(url))

// First to complete wins
fan.race([() => fast_api(), () => slow_api()])
```

Rules:
- `fan { }` is only valid inside `effect fn`
- If any expression returns `err`, the entire `fan` fails and siblings are cancelled
- No `var` capture inside `fan` (prevents data races)
- No unstructured `spawn` -- all concurrency is scoped

## UFCS

`f(x, y)` and `x.f(y)` are equivalent. The compiler rewrites `x.f(y)` to `f(x, y)` at parse time. Canonical form is module-qualified: `string.len(s)`.

## Compiler Diagnostics

Each error points to exactly one repair:

```almide
'!' is not valid in Almide at line 5:12
  Hint: Use 'not x' for boolean negation, not '!x'.

'return' is not valid in Almide at line 12:5
  Hint: Use the last expression as the return value,
        or 'guard ... else' for early exit.
```

## Stdlib Naming Conventions

| Convention | Rule | Example |
|---|---|---|
| Module prefix | Canonical form is `module.function()` | `string.len(s)`, `list.get(xs, i)` |
| Predicate prefix | `is_` for boolean functions | `string.is_empty(s)` |
| Return consistency | `Option` for lookups, `Result` for I/O | `list.get() -> Option[T]` |
| No synonyms | One name per operation | `len` not `length`/`size` |
| Symmetric pairs | Matching names for inverses | `split`/`join`, `to_string`/`to_int` |

## What Almide Sacrifices

These are intentional trade-offs:

| Sacrificed | Why |
|---|---|
| Raw expressiveness | Each concept has one idiomatic way to write it |
| Operator overloading | Operators have fixed built-in meanings only |
| Metaprogramming | No macros, no reflection, no code generation |
| Ad-hoc polymorphism | Protocols are explicit, no implicit resolution |
| Multiple return styles | No `return` keyword; last expression is always the value |
| Syntax sugar variety | One way to write each construct |
| DSL capabilities | No operator definition, no custom syntax |

These are not missing features -- they are **intentional constraints that keep the generation space focused**.
