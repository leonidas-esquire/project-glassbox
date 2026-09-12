# Security policy

Project Glassbox is an early research prototype. It demonstrates observability and human-governance patterns; it is not yet a production authorization, identity, or compliance system.

## Supported versions

Security fixes are applied to the latest release and the current `main` branch. Older demonstration releases are not maintained unless explicitly listed here.

## Report a vulnerability

Do not open a public issue for a vulnerability, exposed secret, privacy incident, or plausible method of bypassing a human-authorization or provenance boundary.

Use GitHub's private **Report a vulnerability** workflow in the Security tab. If private reporting is unavailable, contact the project steward through [EGOVERNMENT AI LLC](https://egovernment.ai) and mark the message “Project Glassbox confidential security report.” Include:

- A concise description and affected version or commit.
- Reproduction steps or a minimal proof of concept.
- Likely impact and any known mitigations.
- Whether the issue has been disclosed elsewhere.

The maintainers will acknowledge a usable report within seven calendar days, coordinate validation and remediation, and credit reporters who want public acknowledgment. Please allow a reasonable remediation period before disclosure.

## High-priority security boundaries

We especially welcome reports involving:

- Cross-site scripting or unsafe rendering of event, context, source, or review data.
- Leakage of restricted instructions, secrets, personal data, or attachment contents.
- Tampering with provenance, verification labels, hashes, timestamps, or audit exports.
- Sandbox or WASM capability escape.
- Event-adapter schema bypass or identity spoofing.
- Human-authorization bypass or misleading approval state.
- Supply-chain compromise or malicious dependency behavior.

Security labels are evidence claims. A label such as **Deterministically Verified** must never imply that the surrounding policy, source data, or real-world outcome has also been verified.
