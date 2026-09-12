# Project Glassbox roadmap

This roadmap communicates direction, not a delivery guarantee. Work is accepted only when its evidence and safety boundaries are testable.

## Now — trustworthy prototype

- [x] Real-time synthetic trace with pause, replay, and step inspection.
- [x] System, agent, model, reasoning, evidence, and telemetry views.
- [x] LLM, deterministic/WASM, and hybrid agent representations.
- [x] Provenance inspector, comparison view, human-review ledger, and JSON audit export.
- [x] Browser-side deterministic replay with module and output hashes.
- [x] Explicit restricted, unavailable, redacted, conflicting, error, and loading states.
- [x] Versioned observable-agent event adapter.
- [ ] Validate the interface with non-technical users, developers, and AI-safety practitioners.

## Next — instrumented integrations

- [ ] Move the browser adapter into a provider-neutral TypeScript SDK.
- [ ] Add JSON Schema validation at ingestion and export.
- [ ] Add OpenTelemetry-compatible trace mapping.
- [ ] Implement signed event envelopes and tamper-evident audit chains.
- [ ] Add persistent, access-controlled review ledgers.
- [ ] Build reference adapters for common agent and tool runtimes.
- [ ] Add realistic integration fixtures without vendor-private data.
- [ ] Establish an accessibility test baseline and independent security review.

## Later — interoperable assurance

- [ ] Cross-run and cross-model comparison at scale.
- [ ] Reproducible policy-gate and sandbox conformance suites.
- [ ] Cryptographic source and transformation attestations.
- [ ] Privacy-preserving team and public audit views.
- [ ] Evaluation benchmarks for provenance completeness and explanation faithfulness.
- [ ] Portable audit bundles for regulators, auditors, researchers, and affected communities.

## Research questions

- Which observable signals most help humans detect unsupported conclusions?
- How should confidence be calibrated and attributed across mixed agent architectures?
- What minimum provenance is necessary to reproduce a consequential decision?
- How can interfaces communicate context loss without overwhelming users?
- Which human-review patterns improve outcomes without becoming ceremonial approval?

## Non-goals

Project Glassbox will not claim to expose private chain-of-thought, translate neural activations into literal thoughts, guarantee model truthfulness, or treat a polished explanation as proof that a conclusion is correct.
