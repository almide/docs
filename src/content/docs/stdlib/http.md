---
title: http
description: HTTP client and server. Requires `import http`.
---

```almd
import http
```

## Functions

| Function | Signature | Description |
|---|---|---|
| `serve` | `(Int, (Unknown) -> Unknown) -> Unit` | Start an HTTP server on the given port with a request handler |
| `response` | `(Int, String) -> Response` | Create a plain text HTTP response with status code |
| `json` | `(Int, String) -> Response` | Create a JSON HTTP response with status code |
| `with_headers` | `(Int, String, Map[String, String]) -> Response` | Create a response with custom headers |
| `redirect` | `(String) -> Response` | Create a 302 temporary redirect response |
| `status` | `(Response, Int) -> Response` | Set the status code on a response |
| `body` | `(Response) -> String` | Get the body string from a response |
| `set_header` | `(Response, String, String) -> Response` | Set a header on a response |
| `get_header` | `(Response, String) -> Option[String]` | Get a header value from a response (first occurrence) |
| `status_code` | `(Response) -> Int` | Get the status code of a response |
| `headers` | `(Response) -> Map[String, String]` | All headers as a lowercased-name map (first occurrence wins) |
| `header_values` | `(Response, String) -> List[String]` | Every occurrence of a header (e.g. `set-cookie`) |
| `req_method` | `(Request) -> String` | Get the HTTP method of a request (GET, POST, etc.) |
| `req_path` | `(Request) -> String` | Get the URL path of a request |
| `req_body` | `(Request) -> String` | Get the body string of a request |
| `req_header` | `(Request, String) -> Option[String]` | Get a header value from a request |
| `query_params` | `(Request) -> Map[String, String]` | Get all query parameters from a request as a map |
| `get` | `(String) -> Result[String, String]` | Send an HTTP GET request and return the response body |
| `post` | `(String, String) -> Result[String, String]` | Send an HTTP POST request with a body string |
| `put` | `(String, String) -> Result[String, String]` | Send an HTTP PUT request |
| `patch` | `(String, String) -> Result[String, String]` | Send an HTTP PATCH request |
| `delete` | `(String) -> Result[String, String]` | Send an HTTP DELETE request |
| `request` | `(String, String, String, Map[String, String]) -> Result[String, String]` | Send a custom HTTP request with method, URL, body, and headers |
| `get_response` | `(String) -> Result[Response, String]` | Like `get`, but return the whole response (status, headers, body) |
| `post_response` | `(String, String) -> Result[Response, String]` | Like `post`, but return the whole response |
| `put_response` | `(String, String) -> Result[Response, String]` | Like `put`, but return the whole response |
| `patch_response` | `(String, String) -> Result[Response, String]` | Like `patch`, but return the whole response |
| `delete_response` | `(String) -> Result[Response, String]` | Like `delete`, but return the whole response |
| `request_response` | `(String, String, String, Map[String, String]) -> Result[Response, String]` | Like `request`, but return the whole response |

## Reference

### `http.serve(port: Int, f: (Unknown) -> Unknown) -> Unit`

Start an HTTP server on the given port with a request handler

```almd
http.serve(3000, (req) => http.response(200, "ok"))
```

### `http.response(status: Int, body: String) -> Response`

Create a plain text HTTP response with status code

```almd
http.response(200, "Hello!")
```

### `http.json(status: Int, body: String) -> Response`

Create a JSON HTTP response with status code

```almd
http.json(200, json.stringify(data))
```

### `http.with_headers(status: Int, body: String, headers: Map[String, String]) -> Response`

Create a response with custom headers

```almd
http.with_headers(200, body, {"Content-Type": "text/html"})
```

### `http.redirect(url: String) -> Response`

Create a 302 temporary redirect response

```almd
http.redirect("/new-path")
```

### `http.status(resp: Response, code: Int) -> Response`

Set the status code on a response

```almd
http.status(resp, 201)
```

### `http.body(resp: Response) -> String`

Get the body string from a response

```almd
let text = http.body(resp)
```

### `http.set_header(resp: Response, key: String, value: String) -> Response`

Set a header on a response

```almd
http.set_header(resp, "X-Custom", "value")
```

### `http.get_header(resp: Response, key: String) -> Option[String]`

Get a header value from a response

```almd
let ct = http.get_header(resp, "Content-Type")
```

### `http.req_method(req: Request) -> String`

Get the HTTP method of a request (GET, POST, etc.)

```almd
let method = http.req_method(req)
```

### `http.req_path(req: Request) -> String`

Get the URL path of a request

```almd
let path = http.req_path(req)
```

### `http.req_body(req: Request) -> String`

Get the body string of a request

```almd
let body = http.req_body(req)
```

### `http.req_header(req: Request, key: String) -> Option[String]`

Get a header value from a request

```almd
let auth = http.req_header(req, "Authorization")
```

### `http.query_params(req: Request) -> Map[String, String]`

Get all query parameters from a request as a map

```almd
let params = http.query_params(req) // {"page": "1", "q": "test"}
```

### `http.get(url: String) -> Result[String, String]`

Send an HTTP GET request and return the response body

```almd
let html = http.get("https://example.com")!
```

### `http.post(url: String, body: String) -> Result[String, String]`

Send an HTTP POST request with a body string

```almd
let resp = http.post("https://api.example.com", body)!
```

### `http.put(url: String, body: String) -> Result[String, String]`

Send an HTTP PUT request

```almd
let resp = http.put(url, body)!
```

### `http.patch(url: String, body: String) -> Result[String, String]`

Send an HTTP PATCH request

```almd
let resp = http.patch(url, body)!
```

### `http.delete(url: String) -> Result[String, String]`

Send an HTTP DELETE request

```almd
let resp = http.delete(url)!
```

### `http.request(method: String, url: String, body: String, headers: Map[String, String]) -> Result[String, String]`

Send a custom HTTP request with method, URL, body, and headers

```almd
let resp = http.request("PUT", url, body, headers)!
```

## The `*_response` family — status, headers and body together

Every verb-shaped String client has a `*_response` twin with the **same
parameters** that returns the whole `Response` record instead of just the body:

| body only | full response |
|---|---|
| `http.get(url)` | `http.get_response(url)` |
| `http.post(url, body)` | `http.post_response(url, body)` |
| `http.put(url, body)` | `http.put_response(url, body)` |
| `http.patch(url, body)` | `http.patch_response(url, body)` |
| `http.delete(url)` | `http.delete_response(url)` |
| `http.request(method, url, body, headers)` | `http.request_response(method, url, body, headers)` |

The body-only function is the `body` projection of its twin, so the two never
disagree. `get_bytes` / `request_bytes` / `get_status` / `request_status` are
result-*shape* variants, not verbs, and have no twin.

What the record holds:

- `http.status_code(resp)` — **any** complete response is `ok`, a 404 and a 3xx
  included. `err` is a transport failure only (connection / TLS / timeout).
- **Redirects are never followed.** A 3xx arrives as-is with its `Location`
  header, so the response is always to the URL you passed.
- Headers keep their wire spelling and a repeated field keeps **every**
  occurrence: `http.get_header(resp, k)` answers the first,
  `http.header_values(resp, k)` all of them, `http.headers(resp)` the
  lowercased-name map (first wins).
- `http.body(resp)` — the transfer-decoded body text.

The twins are **native-only** today: the embedded wasm lane serves the body /
status / bytes shapes and grows the response shape when the wasi:http port
lands.

```almd
import http

effect fn main() -> Unit = {
  let resp = http.get_response("https://example.com/")!
  println("status ${int.to_string(http.status_code(resp))}")
  println(http.get_header(resp, "content-type") ?? "no Content-Type")
  for cookie in http.header_values(resp, "set-cookie") {
    println("cookie: ${cookie}")
  }
  println(http.body(resp))
}
```

### `http.status_code(resp: Response) -> Int`

Get the status code of a response. A 3xx or 4xx is still an `ok` response.

```almd
let code = http.status_code(resp)
```

### `http.headers(resp: Response) -> Map[String, String]`

All headers as a map keyed by lowercased name; for a repeated field the first
occurrence wins.

```almd
let ct = map.get(http.headers(resp), "content-type")
```

### `http.header_values(resp: Response, key: String) -> List[String]`

Every occurrence of a header, in wire order — what you want for `set-cookie`.

```almd
let cookies = http.header_values(resp, "set-cookie")
```

### `http.get_response(url: String) -> Result[Response, String]`

```almd
let resp = http.get_response("https://example.com")!
```

### `http.post_response(url: String, body: String) -> Result[Response, String]`

```almd
let resp = http.post_response("https://api.example.com/login", body)!
```

### `http.put_response(url: String, body: String) -> Result[Response, String]`

```almd
let resp = http.put_response(url, body)!
```

### `http.patch_response(url: String, body: String) -> Result[Response, String]`

```almd
let resp = http.patch_response(url, body)!
```

### `http.delete_response(url: String) -> Result[Response, String]`

```almd
let resp = http.delete_response(url)!
```

### `http.request_response(method: String, url: String, body: String, headers: Map[String, String]) -> Result[Response, String]`

The general form. A redirect check reads the 3xx and its `Location` straight
off the record:

```almd
import http

effect fn main() -> Unit = {
  let resp = http.request_response("GET", "http://example.com/old", "", ["User-Agent": "checker"])!
  let code = http.status_code(resp)
  if code >= 300 and code < 400 then
    println("redirects to ${http.get_header(resp, "location") ?? "?"}")
  else
    println("answers ${int.to_string(code)} directly")
}
```
