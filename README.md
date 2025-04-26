# Boomerang documentation repository

This repository contains the documentation Markdown source files for [useboomerang/docs](https://useboomerang.io/docs).

The `main` branch will be automatically accessible along with any releases.

## Releases

Releases are tagged with the version number matching a release and prefixed with the product. For example flow@3.12.0 or bosun@1.0.0.

## Design

Markdown metadata is used to generate the documentation site: table of contents, breadcrumbs, and other navigation elements.

This is based on the [Remix Docs Template](https://github.com/boomerang-io/remix-docs-template?tab=readme-ov-file#frontmatter) and its content requirements.

## Contributing

Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information on how to contribute to this repository.

### Generating the API docs

To update the API docs, run the following LLM command along with the API spec

```
As a technical writer using the following Swagger API spec, generate markdown documents that can be inserted into the API section of the documentation
```

## License

This repository is licensed under the [Apache License, Version 2.0](LICENSE).
