# Properties and settings reference generator

`generate.py` writes two pages in `flow/hosting/` from `boomerang-io/flow.service.workflow` at a release tag:

- `properties-reference.md` (**All properties**): every property in core's and the dispatcher's `application.properties`, one table per service.
- `settings-reference.md` (**All settings**): every setting in **Admin › Settings**, one section per group.

Each page's frontmatter has `title`, `order` (5 and 6, from `PROPERTIES_ORDER` and `SETTINGS_ORDER`, to sit after the Configuration reference at 4), `description` and `verified`, the `--tag` value quoted, which the website shows as "Verified against Flow …".

Run it at each release, as you regenerate the API reference and the task catalogue. It needs Python 3.9 or later and git, and uses only the standard library.

## Run it

From the docs repo root:

```bash
git -C ../flow.service.workflow fetch --tags
python3 tools/config-reference/generate.py --flow-repo ../flow.service.workflow --tag 5.0.0-beta.39
```

| Option | Default | What it does |
| --- | --- | --- |
| `--flow-repo` | required | A clone of `flow.service.workflow`. The working tree isn't read, so it can be on any branch. |
| `--tag` | required | The release tag the docs describe. |
| `--out` | `flow/hosting` | The folder to write to. |
| `--notes` | `tools/config-reference/notes.json` | The hand-kept notes. |
| `--hand-page` | `flow/hosting/configuration-reference.md` | The hand-kept page to compare with the source. |
| `--check` | off | Writes nothing. Exits 1 when a page differs from what the tag generates. |

It prints the property, settings and notes counts, and how many secret defaults it hid. Warnings go to stderr. It exits 1 without writing anything when a source file doesn't parse, `notes.json` isn't valid JSON, or a link on a generated page doesn't resolve.

## What it reads

All with `git show <tag>:<path>`:

| Path | For |
| --- | --- |
| `service-core/src/main/resources/application.properties` | Core's properties, defaults and comments. |
| `service-dispatcher/src/main/resources/application.properties` | The dispatcher's. |
| `service-core/src/main/resources/seed/settings.json` | The settings: groups, labels, keys, types, defaults and descriptions. |
| `client-web/src/Features/Settings/Settings.tsx` | Only to confirm that **Admin › Settings** still sorts the groups by name. It warns when the `sortBy(settings, … => ….name)` call is gone. |

## How the properties page is built

- **One table per service**, rows sorted by property, so properties that share a prefix sit together.
- **Commented-out examples.** A commented-out `key=value` line becomes a row when no live line sets that key, with the default "not set" and the example quoted, such as `flow.events.sink.types`. When a live line sets the key, the commented line is an alternative value and is skipped, such as `#dispatcher.logging.type=loki`.
- **Environment variable** is derived with Spring's relaxed binding: upper case, with dots, dashes and list indexes as underscores (`flow.events.sink.destinations[0].url` becomes `FLOW_EVENTS_SINK_DESTINATIONS_0_URL`). The page says it's derived.
- **Default** is the value in the file, code-formatted, or "blank". A `${VAR:fallback}` default that names the property's own variable shows the fallback; one that names another variable shows "Same as `VAR`", as for `mongo.encrypt.secret`. A secret's default is never printed: it shows "(set your own)", and the lede links to [Set the required configuration](../../flow/hosting/configuring.md#set-the-required-configuration). A property is a secret when:
  - its key starts with `flow.encrypt.`, `mongo.encrypt.` or `flow.security.tokens.`;
  - its last segment ends in `token`, `secret`, `salt`, `password`, `key`, `hash`, `otc`, `code` or `value` (after a dash or alone), unless its value is `true` or `false`;
  - its default carries credentials in a URI, as `spring.mongodb.uri` does;
  - or `notes.json` marks it `"secret": true`.
- **Restart** isn't a column: every property needs a restart, and the lede says so once.
- **Description** is the comment block right above the property, joined into one line:
  - Internal project codes are removed: `(E8.2a)`, `(merged from service-engine, E8.2a)`, a leading `T6-1:`, and the "Merged from service-engine" lines.
  - A heading line, short and in title form with no closing punctuation (`Proxy Settings`, `Error Management`), isn't a description. Only the lines after a block's last heading describe the property, so the history above `# Workflow Service Integration` is dropped.
  - Property names, environment variables, paths, routes and URLs are put in code; Markdown characters are escaped. The words are verbatim.
  - **Shared comments.** One comment often covers several lines below it. A property with no comment of its own, in the same run of lines (no blank or comment line between), shows "See `<key>`" for the nearest earlier property in the run that has the same parent key, or the same shape differing in one segment (`kube.resource.limit.memory`, `kube.resource.request.memory`). Where that rule misses, `notes.json` sets it with `sameAs`.
  - Notes from `notes.json` follow, as **Note:** or **Warning:**.

## How the settings page is built

- **Groups** are in the order **Admin › Settings** lists them: by name, compared by UTF-16 code unit as lodash `sortBy` does. Each section has the group's description, verbatim, and its group key.
- **Label, Key, Description** are verbatim from the seed, Markdown-escaped. Labels are bold, as UI labels are in the docs.
- **Type** is the field Admin › Settings renders: Toggle, Number, Text, Secured or Select, with ", read-only" when the entry is `readOnly`. An unknown type is printed as is, with a warning.
- **Default** is the seed's value: On or Off for a toggle, the option's label and key for a select, "blank" for an empty value, and "Not shown" for a secured setting, whatever the seed holds.
- **Select options** are listed in the description.
- **When a setting applies.** The lede says settings need no restart, then lists the exceptions from the `applies` field in `notes.json`, merging settings in a group that share the same text. The row repeats it as a note, unless the seed's description already says when it applies.

## notes.json

```json
{
  "properties": {
    "core | dispatcher": {
      "<key, or a prefix ending in *>": {
        "level": "note | warning",
        "text": "Shown under the description, in Markdown.",
        "sameAs": "<key whose comment covers this property>",
        "secret": true,
        "source": "Where the fact comes from, in flow.service.workflow. Not rendered."
      }
    }
  },
  "settings": {
    "<group key>": {
      "<key>": {
        "level": "note | warning",
        "text": "Shown under the description, in Markdown.",
        "applies": "when the setting applies, if not at once: completes \"<label> applies …\".",
        "source": "Not rendered."
      }
    }
  }
}
```

- Every field but `source` is optional.
- The generator warns when a note names a property, prefix, settings group or setting that doesn't exist at the tag, or a `sameAs` that doesn't. The note is skipped.
- Take each fact from `specifications/*.md` or `CHANGELOG.md` at the tag, and say where in `source`. Where a fact comes from the code, as for the properties nothing reads, name the file.
- Don't repeat what the comment or seed description already says. Add what an operator needs: a deprecation, a limit, a property that does nothing, a link to the page that explains it.
- Write notes to the docs voice in `.claude/skills/flow-tech-writer/voice-and-tone.md`. Links are relative to `flow/hosting/`.

## Checks

On every run, the generator:

- **checks every link** on the two pages: the page must exist, and an anchor must match a heading on it, slugged as the website does. A broken link is an error, and nothing is written.
- **warns about notes** that name something the tag doesn't have.
- **compares the hand page**, `configuration-reference.md`. It reads every property name the page puts in code, expands shorthand such as `.values` against the full name before it on the same line, and matches `<name>` and `*` as wildcards. A name in neither `application.properties` is a warning: it's an error in the hand page, to fix there by hand. A name the source has only as a commented-out example is a note, and so is a name on a line labelled "Spring Boot property", such as `management.opentelemetry.tracing.export.otlp.endpoint`, which Spring Boot reads and Flow's files don't set.

## At each release

1. Regenerate with the new tag and read every warning.
2. Fix the hand page for each property it names that the source doesn't have.
3. Look for blank descriptions on new properties and for "See" rows that point at the wrong comment, and add `text` or `sameAs` notes.
4. Review every note against the release: remove one the release made untrue, such as a "Not read by Flow" note once the property is read again, and check each `applies` against the CHANGELOG.
5. Review the diff of both pages.
