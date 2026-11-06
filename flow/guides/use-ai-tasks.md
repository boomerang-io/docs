---
title: Use AI tasks
order: 6
description: Call an OpenAI-compatible model from a workflow with AI Prompt or AI Agent, use the reply, and see token usage in Insights.
verified: "5.0.0-beta.39"
---

<!-- Written against flow.service.workflow 5.0.0-beta.39. UI labels checked against the live webapp (build 490ba3894, 2026-11-06): 48 of 61 bolded terms seen live; the rest are states the walk didn't reach or aren't labels, and were verified in client-web source. -->

# Use AI tasks

Flow's two AI tasks call an OpenAI-compatible model from a workflow. **AI Prompt** sends one prompt and returns the reply. **AI Agent** lets the model call tools until it has an answer. This guide is for workflow authors.

## Before you start

- **An AI endpoint.** Your operator can give every AI task a default endpoint and token on the dispatcher: see [Run AI tasks](../hosting/dispatcher#run-ai-tasks). Otherwise, set **Endpoint** and **API token** on each task. With neither, the task fails with `MISSING_PARAM`.
- **A model identifier** your endpoint serves, such as `openai/gpt-4o-mini`.
- **For your own token,** a secured workspace parameter to hold it: see [Use secrets](./use-secrets).
- **To give the model files,** a run workspace: turn on **Configure › Workspace › Shared workspace for each run**. See [Configure a workflow](./configure-workflow).

## Choose AI Prompt or AI Agent

Both are in the palette's **AI** category, and both run Boomerang's `task-ai` image.

| Task | What it does | Use it to | Extra results |
| --- | --- | --- | --- |
| **AI Prompt** | One call to the model: a prompt in, the reply out | Summarise, classify, draft or extract | none |
| **AI Agent** | A loop: the model calls tools on MCP servers until it answers | Look things up or act before answering | `turns`, `toolCalls` |

## Summarise text with AI Prompt

This example turns a list of changes into three release-note bullets.

1. In the editor, open the **Parameters** tab and select **Add parameter**.
2. Enter the **Name** `changes`, choose the **Type** **Text Area**, and enter a few lines as the **Default value (optional)**, such as:

   ```text
   Fix retry of a timed-out run
   Add a for-each badge to the run canvas
   Show model usage on Insights
   ```

3. Select **Add**.
4. Open the **Canvas** tab. From the **AI** category, drag **AI Prompt** onto the canvas.
5. Select the node's edit icon.

   **Edit AI Prompt** opens on its **Parameters** tab.

6. In **Task name**, enter `summarise`.
7. In **Model**, enter your model identifier, such as `openai/gpt-4o-mini`.
8. Select **System prompt**, enter `You write release notes for busy readers. Plain language, no marketing.`, and select **Update**.
9. Select **Prompt**, enter the text below, and select **Update**:

   ```text
   Summarise these changes as three short bullet points:

   $(params.changes)
   ```

10. In **Max tokens**, enter `300`.
11. Leave **Endpoint** and **API token** blank to use your operator's defaults, and select **Apply**.
12. Link **Start** to `summarise`, and `summarise` to **End**.
13. [Save a version](./workflow-editor#save-a-version).
14. On the **Workflows** page, select **Run it**, then **Run and View**.

When the run's status is **Succeeded**, select **View Details** on `summarise`. Under **Results**, `output` holds the three bullets, `model` names the model the endpoint served, and `totalTokens` counts the tokens it used.

<!-- SCREENSHOT: The View Details modal for the summarise task, Results listing output, model and the token counts. (not capturable yet: Needs an OpenAI-compatible endpoint for a succeeded summarise run) -->

## Set the prompt and the model call

Every field comes from the task's catalogue entry; hover a label for its description. The ones you'll use most:

| Field | What it does |
| --- | --- |
| **Model** | Required. The model identifier the endpoint expects. |
| **Prompt** | The user message. It can hold `$(params.x)` and `$(tasks.x.results.y)` references. |
| **Prompt file** | A path on the run workspace whose contents are the prompt, for a prompt too large for a field. Give **Prompt** or **Prompt file**, not both. |
| **System prompt** | Sent ahead of the prompt. |
| **Messages** / **Messages file** | An exact JSON array of `{role, content}` messages, replacing **System prompt** and **Prompt**. |
| **Endpoint** / **API token** | An OpenAI-compatible base URL and its bearer token. Each one you set wins over the dispatcher's default. |
| **Temperature**, **Max tokens**, **Seed** | Sent only when set, so the provider's defaults apply otherwise. |
| **Request parameters** | A JSON object merged into the request, such as `{"top_p": 0.9}`. Its keys win over **Temperature**, **Max tokens** and **Seed**. |
| **Response format** / **JSON Schema** | `text` (the default) or `json`. With `json` and a schema, the reply is held to the schema and checked before it's returned. |
| **Files** | Comma-separated paths on the run workspace, added to the prompt up to **Max context bytes** (65536 by default). |
| **Images** | Comma-separated run workspace paths or `https` URLs, for a vision-capable model. Workspace images over **Max image bytes** (5242880 by default) fail the task. |
| **Output file** | A path on the run workspace to write the full reply to. |

Store your own token as a secured workspace parameter and enter its reference in **API token**, such as `$(workspace.params.ai-token)`. The field shows a single reference as written. The value reaches the task container as the plain environment variable `PARAM_TOKEN`; see [Use secrets](./use-secrets).

## Use the reply in a later task

A later task reads the reply as `$(tasks.summarise.results.output)`. Flow inserts the reply as written, quotes and newlines included, and never expands references inside it.

For example, an **Execute Shell** task can save the reply to the run workspace for an **Upload Artifact** task:

```sh
cat <<'EOF' > /workspace/release-notes.md
$(tasks.summarise.results.output)
EOF
```

With **Response format** `json`, `output` is the JSON as text. Parse it in the task that reads it.

> [!NOTE]
> All of a task's results share 4096 bytes on Flow's Kubernetes dispatcher. A longer reply fails the task with `ResultsTooLarge` rather than being cut short. Set **Max tokens**, or set **Output file** and pass the file on through the run workspace.

## Let the model call tools with AI Agent

**AI Agent** takes every **AI Prompt** field, plus the tools the model may call. On Flow's Kubernetes dispatcher the tools come from MCP servers, which the dispatcher must be able to reach.

1. Store the MCP servers' tokens as one secured workspace parameter, such as `docs-mcp-tokens` with the value `{"docs": "<token>"}`.
2. Drag **AI Agent** onto the canvas and open its form.
3. In **MCP servers**, enter the servers by name and URL, with no credentials:

   ```json
   [{"name": "docs", "url": "https://mcp.example.com/mcp"}]
   ```

4. In **MCP tokens**, enter `$(workspace.params.docs-mcp-tokens)`.
5. Optional: in **Allowed tools**, list the tool names the model may call, such as `["search"]`. Blank allows every tool the servers offer.
6. Set **Model** and **Prompt** as for **AI Prompt**, then select **Apply**.

The loop stops when the model answers without calling a tool. **Max turns** (10 by default) caps the model calls and **Max tool calls** caps the tool calls; passing either fails the task with `MAX_TURNS_EXCEEDED`. A tool name no server offers fails it with `UNKNOWN_TOOL`. The task log has one JSON line per turn and per tool call, and the `turns` and `toolCalls` results count them. **Images** are sent again on every turn, so each turn pays for them.

## Read the results

| Result | Holds |
| --- | --- |
| `output` | The reply: text, or JSON as text with **Response format** `json` |
| `finishReason` | Why the model stopped, as the endpoint reported it |
| `model` | The model the endpoint served, which can be more specific than the one you asked for |
| `promptTokens`, `completionTokens`, `totalTokens` | Token counts, summed over every turn of **AI Agent** |
| `reasoningTokens`, `cachedPromptTokens` | Token counts when the endpoint reports them; empty otherwise |
| `cost` | The call's cost when the endpoint reports one; empty otherwise |
| `turns`, `toolCalls` | **AI Agent** only: model calls and tool calls made |

## See model usage in Insights

**Insights** adds a **Model usage** panel once the period it shows has AI task runs:

- **Total tokens**, split into prompt and completion;
- **Cost**, as the endpoints reported it, in their currency, when any reported one;
- **AI task runs**, where each for-each item counts once;
- a row per model, with **Task runs**, **Prompt**, **Completion**, **Total** and **Cost**.

On the same page, the **Task runs** panel can group by **Model**. Flow labels each AI task run with its **Model**, unless that parameter is a secret. See [Insights](../webapp/insights).

<!-- SCREENSHOT: The Insights page's Model usage panel with total tokens, AI task runs and a row per model. (not capturable yet: Model usage lists AI task runs; there are none without an AI endpoint) -->

## Fix a failed AI task

The task log names the cause of a failure.

| Symptom | Cause | Fix |
| --- | --- | --- |
| `MISSING_PARAM` | No prompt or messages, or no endpoint or token from the task or the dispatcher | Give **Prompt**, or set **Endpoint** and **API token**, or ask your operator for defaults |
| `INVALID_PARAM` | Both **Prompt** and **Prompt file**, a JSON field that doesn't parse, or a credential inside **MCP servers** | Correct the field it names |
| `INVALID_RESPONSE` | With **Response format** `json`, the reply wasn't JSON or didn't match the schema | Tighten the prompt or the schema |
| `FILE_TOO_LARGE` | A workspace image is larger than **Max image bytes** | Shrink the image or raise the limit |
| Reason `ResultsTooLarge` | The results passed the 4096-byte limit | Lower **Max tokens** or use **Output file** |
| Reason `ImageNotAllowed` | The dispatcher doesn't allow the task's image | Ask your operator; the dispatcher allows images starting `boomerangio/task-ai` by default |

When the endpoint answers with a rate limit or a server error, or can't be reached, the task tries again, 3 attempts in all. Any other rejection, such as a bad token or an unknown model, fails at once.

## Not seeing what you expected?

- [Why does the task fail with `MISSING_PARAM` when no endpoint is set?](#fix-a-failed-ai-task)
- [Why did the task fail with `ParamUnresolved` on **API token**?](../introduction/troubleshooting#a-task-failed-with-paramunresolved)
- [Why does the **Summarise a web page with AI** starter summarise nothing?](../introduction/known-issues#two-starters-depend-on-the-http-call-tasks)

## Next steps

- [Use secrets](./use-secrets): keep endpoint and MCP tokens out of your workflows.
- [Repeat a task for each item](./repeat-a-task-for-each-item): run a prompt once per item.
- [Keep files between runs](./keep-files-between-runs): save a long reply as an artifact.
- [Insights](../webapp/insights): the rest of the Insights page.
