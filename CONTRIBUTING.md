# Contributing to Project Glassbox

Project Glassbox needs engineers, AI-safety researchers, designers, auditors, policy practitioners, technical writers, and people who can test whether the interface is understandable outside the AI field.

## Before you begin

- Use [GitHub Discussions](https://github.com/leonidas-esquire/project-glassbox/discussions) for open-ended ideas.
- Use an issue template for a scoped bug, feature, safety concern, or research proposal.
- Report exploitable vulnerabilities privately as described in [SECURITY.md](SECURITY.md).
- Read the [safety model](docs/safety-model.md) before changing labels, provenance behavior, review gates, or disclosure boundaries.

## Local setup

Project Glassbox is a static browser application with no runtime dependencies.

```bash
git clone https://github.com/leonidas-esquire/project-glassbox.git
cd project-glassbox
npm install
npm run dev
```

Open `http://127.0.0.1:4173`. Run all checks before submitting a pull request:

```bash
npm run check
npm run audit:dependencies
```

## Contribution workflow

1. Create a focused branch from `main`.
2. Make one coherent change and add or update tests.
3. Preserve the distinction between observed records, interpretations, inferences, and unavailable information.
4. Update documentation and the changelog when behavior or public contracts change.
5. Commit with a DCO sign-off: `git commit -s`.
6. Open a pull request using the repository template.

Maintainers may ask for a design issue before accepting a large architectural change. Small fixes do not need an advance proposal.

## Non-negotiable trace rules

Every new record type must identify its producer, source, transformation, relationships, verification state, and unavailable information. Never:

- Present private chain-of-thought as observable data.
- Turn aggregate neural telemetry into literal thoughts or claims of understanding.
- Label deterministic execution as “thinking.”
- Invent missing sources, confidence, context, or verification.
- Expose protected instructions, secrets, or personal data.
- Allow an agent-generated proposal to bypass an explicit human-authorization boundary.

Use the canonical statuses defined in [`schemas/observable-agent-event.schema.json`](schemas/observable-agent-event.schema.json).

## Design and accessibility

Visual elements must carry semantic meaning. Do not rely on color alone. Preserve keyboard access, visible focus, reduced-motion support, useful accessible names, responsive layouts, and readable contrast. Include before-and-after screenshots for interface changes.

## AI-assisted contributions

AI-assisted contributions are welcome when the contributor understands, tests, and takes responsibility for the submitted work. Disclose material AI assistance in the pull request, review generated code for licensing and security concerns, and never submit model output you are not authorized to license.

## License

Contributions are accepted under the [Apache License 2.0](LICENSE) and the [Developer Certificate of Origin](DCO.md). Project marks remain subject to [TRADEMARKS.md](TRADEMARKS.md).
