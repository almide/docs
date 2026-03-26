---
title: http
description: HTTP client and server functions in the Almide standard library. Requires import.
---

The `http` module provides an HTTP client for making requests and a server for handling them. **Requires `import http`.** Client functions are `effect fn`.

## Function Reference

### Server

| Function | Signature | Description |
|---|---|---|
| `serve` | `(Int, Fn[Request] -> Response) -> Unit` | Start HTTP server on port (effect) |

### Response Builders

| Function | Signature | Description |
|---|---|---|
| `response` | `(Int, String) -> Response` | Plain text response with status |
| `json` | `(Int, String) -> Response` | JSON response with status |
| `with_headers` | `(Int, String, Map[String, String]) -> Response` | Response with custom headers |
| `redirect` | `(String) -> Response` | 302 redirect |

### Response Accessors

| Function | Signature | Description |
|---|---|---|
| `status` | `(Response, Int) -> Response` | Set status code |
| `body` | `(Response) -> String` | Get body string |
| `set_header` | `(Response, String, String) -> Response` | Set header |
| `get_header` | `(Response, String) -> Option[String]` | Get header value |

### Request Accessors

| Function | Signature | Description |
|---|---|---|
| `req_method` | `(Request) -> String` | HTTP method (GET, POST, etc.) |
| `req_path` | `(Request) -> String` | URL path |
| `req_body` | `(Request) -> String` | Request body |
| `req_header` | `(Request, String) -> Option[String]` | Get request header |
| `query_params` | `(Request) -> Map[String, String]` | Query parameters as map |

### HTTP Client (effect)

| Function | Signature | Description |
|---|---|---|
| `get` | `(String) -> Result[String, String]` | Send GET request |
| `post` | `(String, String) -> Result[String, String]` | Send POST with body |
| `put` | `(String, String) -> Result[String, String]` | Send PUT with body |
| `patch` | `(String, String) -> Result[String, String]` | Send PATCH with body |
| `delete` | `(String) -> Result[String, String]` | Send DELETE request |
| `request` | `(String, String, String, Map[String, String]) -> Result[String, String]` | Custom request (method, url, body, headers) |

## Examples

```almd
import http
import json

// HTTP server
effect fn main(args: List[String]) -> Result[Unit, String] = {
  http.serve(3000, (req) => {
    let method = http.req_method(req)
    let path = http.req_path(req)
    match path {
      "/" => http.response(200, "Hello!"),
      "/api/data" => http.json(200, json.stringify(data)),
      _ => http.response(404, "Not found"),
    }
  })
}

// HTTP client
effect fn fetch_data() -> Result[String, String] = {
  let body = http.get("https://api.example.com/data")
  ok(body)
}
```
