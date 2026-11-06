# API examples

The examples in the generated API reference (`flow/apis/*Route.md`): a `curl` request under every operation, and, for some, an example request body and example responses. The contract carries no request or response examples; those live here, in the docs.

Python 3, standard library only (`prepare.py` reads the contract with `tools/apidiff/contract.py`).

| File | Does |
| --- | --- |
| `prepare.py` | Before generation. Writes a JSON copy of the contract, for the generator only, with vendor extensions the templates read: each operation's `curl` URL, content type and body option; each parameter's `x-default` and `x-example` and each model property's `x-default`, only where the contract gives a value; and each tag's description cleaned for the Route page's frontmatter. |
| `examples.json` | The docs-side examples, keyed by operation. |
| `inject.py` | After generation. Fills the marker pair `api.mustache` leaves under each operation's request with that operation's example request body and responses. |

## How the curl request is built

- `-X` and the method, and the URL from `$FLOW_URL` (service-core's origin, such as `http://localhost:7700`).
- Path parameters become shell variables: `$WORKSPACE`, `$WORKFLOW`, `$RUN_ID`, and for the rest the name in upper snake case (`$USER_ID`). A bare `{name}` or `{id}` takes the noun before it: `/task/{name}` is `$TASK`, `/token/{id}` is `$TOKEN_ID`.
- Required query parameters, with the schema's default, else its first enum value, else a value from `QUERY_VALUES` in `prepare.py`, else a shell variable.
- `-H "Authorization: Bearer $FLOW_TOKEN"` unless the operation declares `security: []`.
- A JSON body: `-d @body.json` when `examples.json` has a body for the operation, else a body built from the request schema's required fields with readable placeholder values. An optional body with no example is left out. A YAML-only body is sent with `--data-binary @task.yaml`.

## examples.json

```json
{
  "POST /api/v2/parameters": {
    "source": "live",
    "body": { "name": "slack-channel", "type": "text", "value": "#builds" },
    "response": { "status": 200, "json": { "name": "slack-channel" } }
  },
  "GET /api/v2/workspace/{workspace}/workflowrun/{workflowRunId}": {
    "response": [
      { "status": 200, "json": {} },
      { "status": 404, "title": "for a run ID that doesn't exist", "json": {} }
    ]
  }
}
```

- **Key:** the method and the path exactly as the contract writes them. Keys starting with `_` are notes.
- `body`: the request body. The request sends it as `body.json`, and the page shows it as the example request body.
- `response`: one response or a list of them. Each has `status`, optional `title` (a phrase saying when it happens) and optional `json`; with no `json` the page says the response has no body.
- `query`: query parameters to add to the URL, for a rule the contract can't state. For example, the task-run query needs `labels` or `workflowruns`, and the webhook needs `workspace` and `ref`.
- `contentType`: overrides `application/json` for the body, such as `application/cloudevents+json` for `POST /api/v2/event`.
- `source`: `live` for an exchange captured from a running stack, `code` for a body read from service-core and not run. The scripts ignore it.

`inject.py` stops, writing nothing, when a key matches no operation on any route page. It warns when an entry has a body but the page's request doesn't send `body.json`: rerun `prepare.py` and the generator.

## Where the examples came from

The `live` responses were captured on 6 November 2026 from a Flow stack built from `main` at `f23d276b1` (`5.0.0-beta.39-26`, newer than the contract's tag), signed in as the screenshot user (`tools/screenshots/.auth/user.json`), in `example-workspace`. The parameter and the token were created for the capture and then deleted.

Before an example went in:
- arrays were cut to one or two items (the run keeps only its Execute Shell task run);
- the token value was replaced with `bfk_<redacted>`;
- `trigger` was left out of runs, since the stack records `api` for a token's submit where the tag records `engine`;
- members the tag's schemas don't declare were removed (none were found).

The `code` bodies were read from service-core at `5.0.0-beta.39`: each carries the fields its service checks.

## Refresh at a release

1. Start a stack built from the release tag. Sign in through `tools/screenshots` so `.auth/user.json` holds a session.
2. Recapture each `live` response with `curl -b "flow_session=…"` against the same routes. Trim and redact as above. Use only resources you created, and delete them afterwards.
3. Check each `code` body against the release's service code.
4. Regenerate the API reference (see `CLAUDE.md` § API Reference), which runs `prepare.py` and `inject.py`.
