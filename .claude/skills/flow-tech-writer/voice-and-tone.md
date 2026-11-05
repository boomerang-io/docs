# Flow voice and tone

Status: draft, 2026-10-29. Covers the Boomerang Flow documentation. The section on product UI copy records the patterns the docs mirror; it can move to `flow.service.workflow/specifications/` if the webapp adopts this guide too.

Where this comes from:
- The v5 webapp's newest copy (`client-web/src/Features/Home`, `Insights`, `Audit`), which already writes this way.
- `flow.service.workflow/CLAUDE.md`, "How to write": answer first, plain language, numbers over adjectives, no project codes.
- The 5.0.0 `CHANGELOG.md`, which sets the operator register.
- The docs rules proven on ARCHIE (`archie-tech-writer`): task-oriented headings, every procedure ending in a success state, banned filler words. ARCHIE's persona voice and Australian colour are **not** carried over. Flow has no persona.

## The voice in one line

An engineer who built Flow, explaining it to a capable colleague: plain, exact, calm and brief.

Flow has one voice everywhere. What changes between pages is **density**, set by the reader, not tone.

## Readers

| Reader | Arrives wanting to | Reads | Density |
| --- | --- | --- | --- |
| Workflow author, often not a developer | Build, run and fix a workflow | Introduction, fundamentals, guides, tutorials | One concept at a time. UI labels, not internals. |
| Task developer | Write a task, read params, return results | Tasks, parameters, developing tasks | Code, environment variables, a working example |
| Operator | Install, configure, upgrade and run Flow | Hosting, architecture | Properties, commands, failure modes and recovery |
| Integrator | Call the API, write a dispatcher, embed Flow | API reference, dispatcher pages | Protocol semantics, exact fields and codes |

Write each page for one reader. When a page needs another reader's detail, link to it. For example, keep protocol detail out of the operator page and configuration detail out of the developer page.

## Principles

1. **Answer first.** The first sentence of a page or section says what it is or what to do. No preamble ("In this section we will…").
2. **Plain words.** Use short, common words and one idea per sentence. Name things by what they are, never by an internal code (no epic, decision or track numbers). Coined labels are out.
3. **Exact.** Numbers beat adjectives: "requeued 90 seconds after the claim", not "requeued quickly". Quote UI labels, properties, errors and paths verbatim.
4. **Calm.** No hype, no exclamation marks, no emoji. Confidence comes from precision, not adjectives.
5. **Honest.** Describe only released behaviour. Where a reader would expect something that isn't built, say so plainly. Never invent a property, label, limit or step.
6. **Brief.** Every sentence earns its place. Split a sprawling page rather than pad a thin one.

## Tone by situation

| Situation | Tone | Do | Don't |
| --- | --- | --- | --- |
| Landing and introduction | Confident, benefit-led, still plain | "Boomerang Flow builds and runs workflows: graphs of tasks that run as containers on Kubernetes." | "✅ Automate with Ease – Just drag, drop, and connect." |
| Concepts | Definitional: one-sentence definition, then why and when | "A workflow is a graph of tasks that automates a process the same way every time." | "Workflows are a powerful feature that lets you…" |
| Guides | Imperative, one action per step | "Select **Add parameter**." | "Simply click on the Add Parameter button." |
| Operator and upgrade | Direct and consequence-first. A warning names the consequence and the recovery. | "The upgrade is forward-only. Back up the database first: a failed upgrade is recovered from the backup, not rolled back." | "Make sure you back up first!" |
| Troubleshooting | Neutral: symptom, cause, then fix. Quote the error. | "Startup stops with `email_unique` when two users share an email. Merge the accounts, then restart." | "Oops, something went wrong with the indexes." |
| Known limitations | Matter-of-fact, no apology | "Flow does not expire a dispatcher's registration." | "Unfortunately, Flow doesn't yet support…" |

## Who speaks

| Speaker | Write | Example |
| --- | --- | --- |
| The reader | "you" | "You need the Owner role." |
| The product | **Flow** by name, then "it" | "Flow requeues the task run." |
| The maintainers | "we", only on community pages (contributing, roadmap, support) | "We welcome pull requests." |

Never use a company "we" for product behaviour: "We expose a series of RESTful APIs" becomes "Flow exposes a REST API under `/api/v2`." Write "the user" only for some other person, such as an approver, never for the reader.

## Mechanics

**Spelling.** Use Australian/British spelling, matching the v5 webapp: colour, behaviour, cancelled, catalogue, organisation, analyse, licence (noun). Some things keep their own spelling:
- identifiers, property names, API fields and enum values (`cancelled` is the enum, `color` stays if a field is spelt that way);
- third-party product terms;
- UI labels quoted exactly as rendered.

**Capitalisation.**
- Titles and headings are sentence case.
- Flow's concepts are lowercase in running text: workflow, workspace, task, task run, workflow run, dispatcher, parameter, schedule, trigger, action, quota, artifact, integration.
- Capitalise proper nouns (Boomerang Flow, Kubernetes, Tekton, Slack, GitHub) and UI labels quoted as they appear.

**Product name.** Write "Boomerang Flow" on first mention on landing and introduction pages, then "Flow". Never "Boomerang" alone for Flow, and never "the platform" or "the system" when "Flow" works.

**UI labels.** Bold them, exactly as rendered, verified against the webapp: **Manage workspace**, **Add parameter**. Write navigation as a path: **Admin › Settings › Quotas**. The verb for interacting is "select", which works for mouse, keyboard and touch.

**Code formatting.** Use code formatting for:
- properties and environment variables: `flow.security.enabled`, `FLOW_ENCRYPT_SECRET`;
- file paths, commands and image names;
- enum and status values: `succeeded`, `timedout`;
- parameter references: `$(params.name)`;
- error codes: `WORKFLOW_STORAGE_REMOVED`;
- HTTP routes: `PATCH /api/v2/settings`.

**Numbers.** Use digits with units and a space: 90 seconds, 30 minutes, 16 MB, 1,000 runs. Write dates as 29 October 2026.

**Abbreviations.** Spell one out on its first use on a page, unless it's universally known: API, URL, HTTP, JSON, YAML, CPU, UI.

**Lists and tables.** Use a table to compare options (`Option | Use when | Trade-off`) and a numbered list for an ordered procedure. Use prose when an explanation needs its reasons kept together.

**Callouts.** Use a blockquote: `> **Note:**` for a useful aside and `> **Warning:**` for data loss, an irreversible step or a security exposure. Use them sparingly; a page full of notes has none.

**Links.** Name the destination: "How parameters resolve", never "Learn more" or "click here".

**Banned.** Never write these in the docs' own prose. Product copy quoted verbatim is exempt: see Matching the product UI.
- emoji;
- exclamation marks;
- *simply, just* (as a minimiser), *easily, obviously, of course, seamless, effortless, powerful, robust, leverage, utilise, best-in-class, Oops*;
- "Note that…" as a sentence opener;
- the future tense for current behaviour ("Flow will requeue…" when it requeues now).

## Terminology (v5)

| Write | Means | Don't write |
| --- | --- | --- |
| **workspace** | Holds workflows, members, parameters and quotas | team (the v3/v4 name, allowed only in upgrade notes) |
| **workflow** | A graph of tasks that automates a process the same way every time | pipeline, or "Workflow" capitalised mid-sentence |
| **task** | One unit of work, run as a container, from the catalogue or your own | job (except a Kubernetes Job) |
| **node** | A task placed on a workflow's canvas | — |
| **workflow run** / **task run** | The record of one execution of a workflow or a task | activity item, execution record |
| **status** | Outcome: `notstarted`, `ready`, `running`, `waiting`, `succeeded`, `failed`, `invalid`, `skipped`, `cancelled`, `timedout`. In guides, use the label the webapp shows. | phase |
| **phase** | Lifecycle: `queued`, `pending`, `running`, `completed` | status |
| **trigger** | How a run starts: manual, schedule, webhook, event, GitHub | — |
| **action** | A point where a person decides: an approval or a manual step | task (for an action) |
| **parameter** | A named value. Layers: global, workspace, workflow, task, and the run's context. A **secured** parameter is hidden in the webapp and in logs. | property (for a parameter), "secret parameter" |
| **run workspace** | The volume a run's tasks share. Always write both words: the product uses "workspace" for the tenant too, so a bare "workspace" means the tenant. | "workspace" alone for the volume; Workflow storage (removed in v5; upgrade notes only) |
| **artifact** | A file a task uploads, either run-scoped or workflow-scoped (kept between runs) | — |
| **dispatcher** | The process that claims task runs and runs them. Flow ships a Kubernetes dispatcher. | agent or worker, for this tier. "AI agent" is only the `ai-agent` task. |
| **executor** | How Flow's Kubernetes dispatcher runs a task: `tekton` (default) or `kube-jobs` | runner |
| **catalogue** | The seeded set of tasks | catalog (except in identifiers) |
| **Admin** / **Manage workspace** | Platform administration (one tabbed page) / one workspace's own settings | admin console, settings page |

When the product renames something, change it here first, then sweep the docs. Rename every instance or none.

## Matching the product UI

The docs quote the webapp, so they follow its copy. When a label or line changes in the webapp, the docs change with it.

**The product has its own voice: Boomerang, with its full Australian character, slang included** (the owner's ruling, 2026-11-06). Examples:
- the activation title **G’day! Let’s activate Boomerang Flow**;
- the 404 page's "Crikey…";
- the 403 page's "Sorry mate…";
- the error page's "Don't lose your daks";
- "you gotta fill out all these fields".

The plain-language rules on this page govern **the docs' own prose only**, never the product UI.

- **Quote product copy verbatim:** exclamation marks, curly apostrophes and slang included. Never flatten, paraphrase or "correct" it in the docs.
- **Don't suggest plainer UI copy.** When the docs work turns up product copy that is flat, a voice suggestion may add Boomerang character. It never replaces existing slang with plainer words. The candidates and the owner's rules are in `.claude/v5-sources/boomerang-voice-candidates.md`, section 1.
- **Report wrong copy, not slangy copy.** If a line says something untrue about the product, report it as a defect. A slangy line that is accurate is the product's voice, not a defect.

## Do and don't

| Do | Don't | Rule |
| --- | --- | --- |
| "Boomerang Flow builds and runs workflows as containers on Kubernetes. Drag tasks onto a canvas, or bring your own container." | "Boomerang Flow is the easiest way to build, automate, and optimize workflows - without writing a single line of code... unless you really want to!" | Calm, exact |
| "**Build visually.** Drag tasks onto the canvas and link them." | "✅ Automate with Ease – Build workflows visually without coding. Just drag, drop, and connect." | No emoji, no *just* |
| "Flow exposes a REST API under `/api/v2`." | "We expose a series of RESTFul APIs that allows management and extensibility of every aspect of the system." | Who speaks |
| "Create a workspace." | "Create a Team." | v5 terminology |
| "Flow's Kubernetes dispatcher runs each task as a pod." | "The agent runs each task." | v5 terminology |
| "Select **Save**." | "Simply click on Save." | Banned words, "select" |
| "See How parameters resolve." | "Learn more." | Named links |
| "Customise how your workflow behaves." | "Customize how your Workflow behaves." (still in the v5 webapp) | Spelling, lowercase concepts |
| "> **Warning:** The reset is one-way. If the encryption pair turns up later, restore from the backup instead." | "**IMPORTANT!!** Don't lose your keys!" | Consequence and recovery |

## Conformance backlog (current docs)

Counted across `flow/` on 2026-10-29, excluding the generated API pages. Fix these as each page is revised for v5, not in a separate sweep.

| Drift | Count | Files |
| --- | --- | --- |
| "Team" / "Teams" (now workspace) | 205 | 23 |
| "Workflow" capitalised mid-sentence | 445 | 35 |
| US *-ize/-ization* spelling | 93 | 21 |
| "we" / "our" / "us" | 79 | 23 |
| "agent" for the worker tier (now dispatcher) | 42 | 4 |
| *simply / just / easily / obviously / of course* | 11 | 9 |
| "Learn more" links | 10 | 8 |
| Emoji (landing pages) | 12 | 3 |
| Exclamation marks in prose | 6 | 4 |
