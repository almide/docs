---
title: Formal Grammar
description: Complete EBNF grammar specification for the Almide programming language.
---

This page presents the formal grammar of Almide in Extended Backus-Naur Form (EBNF).

## Program Structure

```ebnf
program     = import* decl*
import      = "import" path ("as" IDENT)?                (* import json, import self as app *)
decl        = type_decl | fn_decl | protocol_decl | top_let | strict_decl | test_decl
```

## Declarations

```ebnf
protocol_decl   = "protocol" IDENT "{" protocol_method* "}"
protocol_method = "effect"? "fn" IDENT "(" params ")" "->" type

type_decl   = "type" IDENT type_params? "=" type_body ("deriving" "From")?
type_body   = record_body | variant_body | type
record_body = "{" field ("," field)* "}"
variant_body= "|"? variant ("|" variant)*
variant     = IDENT
            | IDENT "(" type ("," type)* ")"
            | IDENT "{" field ("," field)* "}"

fn_decl     = visibility? "effect"? "fn" IDENT type_params? "(" params ")" "->" type "=" expr
visibility  = "local" | "mod"                             (* default is public *)

top_let     = "let" IDENT (":" type)? "=" expr            (* module-scope constant *)
strict_decl = "strict" IDENT                              (* strict mode directive *)
test_decl   = "test" STRING block
```

## Types

```ebnf
type        = "Int" | "Float" | "String" | "Bool" | "Unit" | "Path"
            | IDENT
            | IDENT "[" type ("," type)* "]"              (* generics use [] not <> *)
            | "(" type ("," type)+ ")"                    (* tuple type *)
            | "Fn" "(" type* ")" "->" type                (* function type *)
```

## Expressions

```ebnf
expr        = block | if_expr | match_expr | for_in | while_expr
            | fan_expr | guard | let | var | assign | binary | pipe | call
            | lambda | literal | range

block       = "{" stmt* expr? "}"

if_expr     = "if" expr "then" expr ("else" expr)?
              (* else is optional; omitting returns Unit *)

match_expr  = "match" expr "{" arm ("," arm)* "}"
arm         = pattern ("if" expr)? "=>" expr              (* optional guard *)

for_in      = "for" (IDENT | "(" IDENT "," IDENT ")") "in" expr block
while_expr  = "while" expr block                          (* condition-based loop *)
fan_expr    = "fan" "{" expr+ "}"                         (* concurrent execution *)

guard       = "guard" expr "else" expr                    (* early exit / loop break *)

let         = "let" IDENT (":" type)? "=" expr
var         = "var" IDENT (":" type)? "=" expr
assign      = IDENT "=" expr

binary      = expr OP expr
              (* OP: + - * / % ^ == != < > <= >= and or not >> *)
              (* + for string/list concat, ^ for power (right-assoc) *)
              (* not for boolean neg, >> for function composition *)
              (* comparison operators are non-associative: a < b < c is an error *)
              (* ** is accepted as an alias for ^ *)

pipe        = expr "|>" expr                              (* pipe operator *)
range       = expr ".." expr | expr "..=" expr            (* exclusive / inclusive range *)

call        = expr "(" args ")"
            | expr "." IDENT "(" args ")"
            | expr "[" expr "]"                           (* index access *)

args        = (expr | IDENT ":" expr) ("," (expr | IDENT ":" expr))*
              (* named args supported *)

lambda      = "(" params ")" "=>" expr                    (* shorthand *)
            | "fn" "(" params ")" "=>" expr               (* explicit *)
```

## Patterns

```ebnf
pattern     = "_" | IDENT | LITERAL | "-" LITERAL         (* negative numeric literals *)
            | "true" | "false"
            | "some" "(" pattern ")" | "none"
            | "ok" "(" pattern ")" | "err" "(" pattern ")"
            | TYPENAME "(" pattern ("," pattern)* ")"     (* constructor *)
            | TYPENAME "{" field_pat ("," field_pat)* ("..")? "}"  (* record *)
            | "(" pattern "," pattern ("," pattern)* ")"  (* tuple *)
```

## Literals

```ebnf
list_lit    = "[" (expr ("," expr)*)? "]"                 (* [1, 2, 3] or [] *)

map_lit     = "[" expr ":" expr ("," expr ":" expr)* "]"  (* ["a": 1, "b": 2] *)
            | "[" ":" "]"                                 (* empty map: [:] *)

literal     = INT | FLOAT | STRING | SINGLE_STRING | "true" | "false"
            | "ok" "(" expr ")" | "err" "(" expr ")"
            | list_lit | map_lit | record_lit
```

### String Literals

- **Double-quote strings**: `"hello ${name}"` -- interpolation via `${expr}` + escape sequences
- **Single-quote strings**: `'hello'` -- escape sequences only, no interpolation
- **Heredoc**: `"""..."""` -- multiline, indent-stripped, interpolation supported
- **Raw heredoc**: `r"""..."""` -- no escapes, no interpolation
- **Raw string**: `r"..."` -- no escapes, no interpolation
- **Numeric literals** support `_` as a visual separator: `1_000_000`, `0xFF`

## Lexical Elements

### Identifiers

```ebnf
Identifier ::= [a-z_][a-zA-Z0-9_]*
Name       ::= Identifier | Identifier "?"               (* ? suffix = Bool predicate *)
TypeName   ::= [A-Z][a-zA-Z0-9]*
```

### Keywords (42)

```almide
module  import  type    trait   impl    for     in      fn
let     var     if      then    else    match   ok      err
some    none    todo    unsafe  true    false
not     and     or      strict  pub     effect  deriving test
guard   break   continue while  local   mod
fan
```

### Operators and Delimiters

```almide
Operators:   +  -  *  /  %  ^  ==  !=  <  <=  >  >=  |>  ..  ..=
Unary:       -  not
Logical:     and  or
Assignment:  =
Arrows:      ->  =>
Delimiters:  (  )  {  }  [  ]  ,  .  :  ;  |  _  @  ...
```

### Comments

```almide
// line comment (to end of line)
/* block comment (nestable) */
```

## Statement Separators

Newlines separate statements. Semicolons are used only to place multiple statements on a single line.

A newline is **ignored** (the statement continues) when:

**The line ends with:**
- Binary operators: `+`, `-`, `*`, `/`, `%`, `==`, `!=`, `<=`, `>=`, `<`, `>`, `and`, `or`, `|>`
- Delimiters: `,`, `.`, `:`
- Opening brackets: `(`, `{`, `[`
- Arrows: `->`, `=>`
- Assignment: `=`
- Keywords: `if`, `then`, `else`, `match`, `not`, `|`

**The next line starts with:**
- `.` (method chaining)
- `|>` (pipe)

## Notes

- `string`, `list`, `map`, `int`, `float`, `option`, `result`, `set`, `value`, `math` are auto-imported
- No `return`, `class`, `null`, `!` -- use Almide alternatives (`not` for negation)
- Case-insensitive aliases: `Ok`/`ok`, `Err`/`err`, `Some`/`some`, `None`/`none`
- All errors via `Result[T, E]`, all optionals via `Option[T]`
