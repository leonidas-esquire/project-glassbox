# Safety and epistemic-boundary model

Project Glassbox helps humans inspect an AI system's observable process. It does not make an opaque model inherently truthful, safe, interpretable, or aligned. Its primary safety contribution is to make evidence, authority, transformations, uncertainty, and instrumentation gaps harder to hide.

## Non-claims

Project Glassbox does not claim to:

- Expose private chain-of-thought.
- Translate activations, attention, or neuron values into literal thoughts.
- Prove that a model understands a concept.
- Guarantee that a human-readable reasoning summary faithfully contains every internal factor.
- Verify a real-world claim merely because a calculation replayed.
- Turn a human approval click into informed consent or policy compliance.

Private chain-of-thought is labeled **Restricted**. Provider telemetry that is absent is labeled **Not Instrumented**. Missing sources are **Unavailable**. A generated explanation is a **Human-Readable Interpretation**, not an observed internal monologue.

## Trust boundaries

| Boundary | Threat | Required treatment |
|---|---|---|
| Model or agent → event adapter | Fabricated identity, source, or confidence | Authenticate producer; validate schema; retain producer identity; treat self-report as self-report |
| Tool broker → evidence record | Altered parameters or results | Record invocation, parameters, result digest, version, time, and error state |
| Memory or retrieval → context | Hidden omission, poisoning, or stale data | Record access policy, source, retrieval event, freshness, compaction, exclusion, and redaction |
| LLM → reasoning summary | Plausible but unsupported narrative | Link every claim to observable context; label as interpretation; permit challenge |
| LLM → deterministic executor | Prompt injection or unsafe action request | Use a typed handoff, capability allow-list, policy gate, and bounded inputs |
| Deterministic executor → verification label | Overbroad assurance claim | State exactly what code, environment, inputs, branch, and output were replayed |
| Synthesis → human | Automation bias or buried disagreement | Keep conflicts, alternatives, gaps, and confidence basis visible at approval time |
| Browser → audit export | Mutation or incomplete capture | Export boundaries and unresolved items; add signing and append-only integrity before production use |

## Safety invariants

1. **No invented observability.** Missing context, evidence, telemetry, or verification remains explicitly missing.
2. **No private-thought claim.** Explanations derive from observable records and are labeled as interpretations.
3. **Architecture-aware language.** Deterministic components execute functions and state transitions; they do not think.
4. **Scoped verification.** A verified hash or replay never lends unearned certainty to surrounding claims.
5. **Least privilege.** Each agent and runtime receives only the capabilities required for its bounded task.
6. **Human consequence gate.** A consequential proposal remains distinct from authorization and execution.
7. **Review provenance.** Approval, challenge, correction, and rejection are attributed and timestamped.
8. **Visible disagreement.** Synthesis does not erase contradictory evidence or unresolved questions.

## Privacy and restricted context

Production integrations should redact before display, apply role-based access control, and retain a visible redaction event containing purpose and policy identity without exposing protected content. Logs and exports must be classified independently: a record safe for an operator view may not be safe for a public audit.

Do not send secrets, private prompts, personal data, or raw sensitive documents into the public demonstration. The current app does not upload selected files, but a future connector could; that change requires explicit consent, retention controls, threat modeling, and security review.

## Human review

Human review should be an accountable decision, not a decorative control. Production review records should identify the reviewer, authority, evidence visible at the time, action, rationale, correction, timestamp, and downstream effect. High-impact actions should require separation of proposal, authorization, and execution.

## Known prototype risks

- Synthetic telemetry can be mistaken for a live signal despite labeling.
- In-memory data and browser downloads are not tamper-evident.
- Confidence values are illustrative rather than calibrated.
- A client-side adapter is not an authenticated event boundary.
- Static demo records do not demonstrate production scalability or regulatory compliance.

These limitations are product requirements, not footnotes; the interface and documentation should continue to surface them.
