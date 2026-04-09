---
title: Quick Reference
description: Dense cheatsheet for Almide syntax, types, stdlib, and idioms. Designed for AI code generation.
---

## File Structure

```almd
import <module>
// declarations...
```

File extension: `.almd`

## Types

```almd
type Name = { field: Type, ... }                     // record
type Name = | Case1(Type) | Case2 | Case3{f: Type}  // variant (leading |)
type Name[A, B] = { first: A, second: B }            // generic (use [] not <>)
type Name = Type                                     // type alias
type Handler = (String) -> String                    // function type alias
type ConfigError =
  | Io(IoError) | Parse(ParseError)
```

**Built-in types:** `Int`, `Float`, `String`, `Bool`, `Unit`, `Path`, `List[T]`, `Map[K, V]`, `Set[T]`, `Result[T, E]`, `Option[T]`

## Functions

```almd
fn name(x: Type, y: Type) -> RetType = expr
effect fn name(x: Type) -> Result[T, E] = expr       // side effects
```

**Visibility:** `fn f()` (public) | `mod fn f()` (project) | `local fn f()` (file)
**Order:** `[local|mod]? effect? fn`
**Predicate:** `fn empty?(xs: List[T]) -> Bool` (`?` suffix = Bool return only)
**Hole:** `fn parse(text: String) -> Ast = _`
**Todo:** `fn optimize(ast: Ast) -> Ast = todo("later")`

## Expressions

| Construct | Syntax |
|---|---|
| If | `if cond then expr else expr` |
| Match | `match x { Pat => expr, _ => expr }` |
| Lambda | `(x) => expr` |
| Block | `{ let x = 1; x + 1 }` |
| For | `for x in xs { ... }` |
| While | `while cond { ... }` |
| Range | `0..5` (excl) / `1..=5` (incl) |
| Pipe | `x \|> f \|> g` |
| Spread | `{ ...base, name: "bob" }` |

## Literals

```almd
42                             // Int
3.14                           // Float
"hello ${name}"                // interpolated string
'raw string'                   // no interpolation
true / false                   // Bool
[1, 2, 3]                     // List
[]                             // empty List
["a": 1, "b": 2]              // Map
[:]                            // empty Map (needs type annotation)
{ name: "alice", age: 30 }    // Record
ok(value) / err(msg)          // Result
some(value) / none             // Option
```

## Statements

```almd
let x = 1                      // immutable binding
let x: Int = 1                 // with type annotation
var y = 2                      // mutable binding
y = y + 1                      // reassign (var only)
let { name, age } = user       // destructure
guard x > 0 else err("neg")    // early exit
```

## Patterns

```almd
_                               // wildcard
name                            // bind
ok(inner) / err(inner)          // Result
some(inner) / none              // Option
TypeName(args...)               // constructor
TypeName{ field1, field2 }      // record
literal                         // int, float, string, bool
```

## Protocols

```almd
protocol Action {
  fn name(a: Self) -> String
  fn execute(a: Self, ctx: Context) -> Result[String, String]
}

type GreetAction: Action = { greeting: String }
fn GreetAction.name(a: GreetAction) -> String = "greet"
fn GreetAction.execute(a: GreetAction, ctx: Context) -> Result[String, String] =
  ok(a.greeting)
```

## Tests

```almd
test "description" {
  assert_eq(add(1, 2), 3)
  assert(x > 0)
  assert_ne(a, b)
}
```

## Built-in Functions

`println(s)`, `eprintln(s)`, `assert_eq(a, b)`, `assert_ne(a, b)`, `assert(cond)`

No `print` function. Use `println` for all output.

## Unwrap Operators

```almd
expr!                          // propagate error (effect fn only)
expr ?? fallback               // unwrap with default
expr?                          // Result -> Option (discard error)
```

```almd
effect fn load(path: String) -> Result[String, String] = {
  let text = fs.read_text(path)!        // propagate on err
  ok(text)
}
let port = int.parse(s) ?? 8080         // fallback
let name = map.get(env, "USER") ?? "anonymous"
let parsed = int.parse(input)?          // Option[Int]
```

Error type conversion (replaces `From`):

```almd
fs.read_text(path) |> result.map_err(_, (e) => Io(e))!
```

## Operators (precedence high to low)

`. () [] ! ?? ?` > `not -` > `^` > `* / %` > `+ -` > `.. ..=` > `== != < > <= >=` > `and` > `or` > `|> >>`

## Stdlib Modules

**Auto-imported:** string, list, map, set, int, float, option, result, math, value

**Import required:** json, bytes, matrix, fs, io, env, process, random, regex, datetime, http, testing, error

## Key Rules

- Newline = statement separator (no semicolons needed)
- `[]` for generics, NOT `<>`
- `effect fn` for side effects, NOT `fn name!()`
- `fn name?()` suffix is for Bool predicates only
- Postfix `!` / `??` / `?` are unwrap operators (see above)
- No exceptions -- use `Result[T, E]`
- No null -- use `Option[T]`
- No inheritance, no macros, no operator overloading, no implicit conversions
- `_` is ONLY for match wildcard / let discard / lambda params
- UFCS: `f(x, y)` is equivalent to `x.f(y)`
- `+` is concatenation for strings and lists

## Common Mistakes

| Wrong | Correct | Why |
|---|---|---|
| `list[1, 2, 3]` | `[1, 2, 3]` | `list` is a module |
| `each(xs, f)` | `for x in xs { f(x) }` | Use `for` loop for side effects |
| `List.new()` | `[]` | No `new()` for List |
| `{"a": 1}` | `["a": 1]` | Braces are for records, brackets for maps |
| `string.length(s)` | `string.len(s)` | No synonyms |
| `println(42)` | `println(int.to_string(42))` | No implicit conversion |
| `fn foo<T>(x: T)` | `fn foo[T](x: T)` | `[]` for generics |
| `1 :: 2 :: []` | `[1, 2]` | No cons operator |

## Entry Point

```almd
effect fn main(args: List[String]) -> Result[Unit, AppError] = {
  let cmd = list.get(args, 1)
  match cmd {
    some("run") => do_something()!,
    some(other) => err(UnknownCommand(other)),
    none => err(NoCommand),
  }
}
```
