# Provenance model

Project Glassbox treats explanations as inspectable data products. A sentence or visual node is useful only when a reviewer can determine where it came from, how it changed, what supports it, and what remains unknown.

## Core record

The canonical observable event schema is [`schemas/observable-agent-event.schema.json`](../schemas/observable-agent-event.schema.json). Each meaningful item should carry:

| Field | Meaning |
|---|---|
| `id` | Stable identifier within the trace |
| `agentId` | Registered producer or responsible agent |
| `step`, `offset`, `timestamp` | Position in observable execution time |
| `type` | Semantic class such as evidence, assumption, message, transition, or decision |
| `status` | Epistemic or operational status from the controlled vocabulary |
| `title`, `summary`, `detail` | Human-readable representation of the record |
| `context` | Authorized records available to the producer for this event |
| `source` | Direct origin, or an explicit unavailable/restricted label |
| `verification` | Check performed and its scope |
| `transform` | How source material became this representation |
| `relationship` | Dependencies, recipients, and downstream influence |
| `unavailable` | Information required but absent, concealed, or uninstrumented |
| `confidence`, `basis` | Producer-supplied confidence and its stated basis |
| `history` | Bounded transformation or lifecycle history |

## Status vocabulary

| Status | Use |
|---|---|
| **Observed** | Directly recorded by an instrumented component |
| **Deterministically Verified** | Reproduced from fixed code, inputs, environment contract, and expected output |
| **Human-Readable Interpretation** | A concise generated explanation linked to observable support |
| **Inferred** | Derived from evidence but not directly observed |
| **Restricted** | Known to exist but intentionally concealed by policy or access control |
| **Not Instrumented** | The runtime does not expose the signal |
| **Unavailable** | Required information was not supplied or could not be obtained |
| **Blocked** | An attempted operation was denied by policy, capability, or authority |
| **Awaiting Human Authorization** | A proposal is valid for review but has not been authorized or executed |

These labels describe different dimensions in some real systems. The prototype uses one primary status per displayed record for legibility. A future protocol should model epistemic state, operational state, verification state, and review state as separate fields.

## Graph semantics

Edges are directional claims about dependency or influence. They should state whether a child record:

- Received another record as context.
- Was derived through a named transformation.
- Verified only a bounded calculation or artifact.
- Contradicted or qualified another record.
- Authorized, blocked, or awaited an action.
- Contributed to a synthesis or final proposal.

An edge is not proof that its destination is correct. It is evidence that the declared relationship occurred or was generated.

## Confidence

Confidence values are never silently treated as calibrated probabilities. A record must explain whether the value represents source completeness, model self-report, deterministic integrity, classifier calibration, human judgment, or another basis. Missing calibration should be visible.

For deterministic records, 100% confidence may describe reproduction of the same output under the declared replay contract. It does not establish that inputs were truthful, code was safe, or the output was a sound policy choice.

## Transformation history

A derived item should retain the identities or digests of source records, the transformation name and version, information intentionally dropped, and the actor responsible for the transformation. Summarization and context compaction are first-class transformations; they must not look like verbatim source material.

## Audit export

The browser exports the contract in [`schemas/audit-record.schema.json`](../schemas/audit-record.schema.json). The current JSON bundle is inspectable but unsigned. Planned integrity work includes canonical serialization, per-event content digests, signed envelopes, append-only review records, and a Merkle-linked trace manifest.
