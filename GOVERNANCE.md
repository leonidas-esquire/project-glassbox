# Governance

Project Glassbox is an open-source project stewarded by **eGovernment AI LLC**. Its governance is designed to welcome broad participation while protecting the project's epistemic boundaries, security, and public-interest mission.

## Roles

- **Project steward:** Holds legal stewardship, appoints maintainers, manages releases and project marks, and resolves governance appeals.
- **Founder and lead maintainer:** Sets the product direction, convenes decisions, and protects the founding safety constraints.
- **Maintainers:** Review contributions, manage issues, operate releases, and document consequential decisions.
- **Reviewers:** Provide domain review in engineering, accessibility, security, AI safety, policy, or design.
- **Contributors:** Propose and submit changes under the Apache-2.0 license and DCO.

The founding lead is Leonidas Esquire Williamson. Initial maintainers may be added after sustained, constructive contributions and demonstrated care for the project's trust model.

## Decisions

Routine changes are decided through pull-request review. Changes to schemas, disclosure boundaries, authority semantics, governance, licensing, or stable public APIs require:

1. A public design or research proposal.
2. A stated threat model and migration impact.
3. Review by at least one maintainer who did not author the change.
4. A recorded decision and, when appropriate, an architecture decision record.

Maintainers seek consensus. When consensus is not possible, the project steward makes the decision and records the rationale. Security incidents may be handled privately until disclosure is safe.

## Safety invariants

No governance decision may silently redefine private chain-of-thought as observable data, present unavailable telemetry as fact, remove provenance from consequential claims, describe deterministic execution as thought, or bypass required human authorization. A proposal to revise one of these invariants requires explicit public notice and project-steward approval.

## Releases

Releases use semantic versioning where practical. A release must pass CI, preserve required notices, document known limitations, and identify schema or audit-format changes. Only authorized maintainers may create official releases or represent a fork as Project Glassbox.

## Appeals and conflicts

Conflicts of interest must be disclosed. A maintainer with a material conflict should recuse from the decision. Governance or moderation appeals go to the project steward, who may appoint an independent reviewer.
