# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation repository for Boomerang Flow and Boomerang Bosun, containing Markdown source files that are processed to generate the documentation website at useboomerang.io/docs.

This site is then consumed within https://github.com/boomerang-io/website to render the Markdown as a static website using the Remix Docs Template.

## Architecture

The documentation is organized into two main products:

### Boomerang Flow

- **flow/**: Main documentation for the workflow automation platform
  - `apis/`: Generated API documentation and OpenAPI specifications
  - `architecture/`: Technical architecture documentation
  - `fundamentals/`: Core concepts and features
  - `guides/`: How-to guides and tutorials
  - `hosting/`: Installation and deployment guides
  - `introduction/`: Getting started content
  - `tutorials/`: Step-by-step tutorials

### Boomerang Bosun

- **bosun/**: Documentation for the policy-as-code CI/CD gates platform
  - `architecture/`: Technical architecture documentation
  - `introduction/`: Getting started content

## Documentation Structure

- Uses Markdown with frontmatter metadata for site generation
- Based on the Remix Docs Template
- Frontmatter includes: title, order, description, toc, and sometimes hidden flags
- Each section has an `index.md` file as the main entry point
- Assets (images, PDFs) are stored in `assets/` subdirectories

## API Documentation Generation

The API documentation is auto-generated from OpenAPI specifications using openapi-generator-cli:

```bash
# Install prerequisite
npm install @openapitools/openapi-generator-cli -g

# Generate API docs from spec
npx openapi-generator-cli generate -i ./flow/apis/assets/spec.json -g markdown -o ./tmp --skip-validate-spec -t ./flow/apis/assets/templates/ --api-name-suffix 'Route'
mv ./tmp/README.md ./tmp/overview.md
find ./tmp/Apis -type f -exec mv {} ./tmp/ \;
find ./tmp/*.md -type f -exec mv {} ./flow/apis/ \;
find ./tmp/Models/*.md -type f -exec mv {} ./flow/apis/models/ \;
rm -rf ./tmp
```

## Key Files

- `flow/apis/assets/spec.json`: OpenAPI specification for Flow API
- `flow/apis/assets/templates/`: Mustache templates for API doc generation
- `openapitools.json`: Configuration for OpenAPI generator CLI
- Each product has its own index.md serving as the main landing page

## Release Management

- Releases are tagged with version numbers prefixed by product (e.g., flow@3.12.0, bosun@1.0.0)
- The main branch is automatically published
- Documentation supports multiple versions through releases

## Content Guidelines

- Documentation is written for both technical and non-technical audiences
- Includes visual guides with screenshots and GIFs in assets folders
- Uses docs-cards components for navigation
- Integrates with external resources (Slack community, GitHub)
