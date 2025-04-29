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

To update the API docs, run the following commands along with the API spec (currently stored in `flow/apis/assets/spec.json`):

```sh
npx openapi-generator-cli generate -i ./flow/apis/assets/spec.json -g markdown -o ./tmp --skip-validate-spec -t ./flow/apis/assets/templates/ --api-name-suffix 'Route'
mv ./tmp/README.md ./tmp/overview.md
find ./tmp/Apis -type f -exec mv {} ./tmp/ \;
find ./tmp/*.md -type f -exec mv {} ./flow/apis/ \;
find ./tmp/Models/*.md -type f -exec mv {} ./flow/apis/models/ \;
rm -rf ./tmp
```

#### Pre-req

```sh
npm install @openapitools/openapi-generator-cli -g
```

### References

- The available mustahe variables can be found [here](https://github.com/OpenAPITools/openapi-generator/blob/master/modules/openapi-generator/src/main/java/org/openapitools/codegen/CodegenOperation.java)
- Available mustache lambdas can be found [here](https://openapi-generator.tech/docs/templating#mustache-lambdas)

### Tips

When writing the Java code, make sure to add the summary and description for each method, they are key to the generated API documentation.

### To Do

- [ ] Add a script to automatically generate the API docs and update the `flow/apis/docs` folder.
- [ ] Implement an MDX version so that the {{requestBodyExamples}} can be added within a code block element. Future [reference](https://github.com/synx-ai/oas3-mdx/blob/master/example/templates/mdx/path.hdb)

## License

This repository is licensed under the [Apache License, Version 2.0](LICENSE).
