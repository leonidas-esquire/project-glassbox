# GitHub launch and protection checklist

Repository files configure CI, CodeQL, Dependabot, issue forms, pull-request guidance, CODEOWNERS, and contribution labels. The following account-level settings must also be verified by a repository administrator.

## Repository identity

- Owner and repository: `leonidas-esquire/project-glassbox`
- Visibility: Public
- Description: `Open infrastructure for observable, verifiable, human-governed AI.`
- Homepage: `https://glassbox-ai.leonidasesquire.chatgpt.site`
- Topics: `ai-safety`, `ai-observability`, `ai-governance`, `agentic-ai`, `provenance`, `wasm`, `human-in-the-loop`, `responsible-ai`, `open-source`
- Features: Issues and Discussions enabled; wiki optional and disabled by default

## Security

- Enable the dependency graph, Dependabot alerts, and Dependabot security updates.
- Enable private vulnerability reporting.
- Confirm CodeQL's weekly and change-triggered workflow succeeds.
- Keep secret scanning and push protection enabled when available.
- Require two-factor authentication for maintainers when the account supports it.

## Main-branch ruleset

Create a ruleset targeting `main` that:

- Requires a pull request before merging.
- Requires one approving review and CODEOWNER review.
- Dismisses stale approvals when new commits are pushed.
- Requires conversation resolution.
- Requires the `Verify repository and application` and `Analyze JavaScript` checks.
- Requires branches to be up to date before merge.
- Blocks force pushes and branch deletion.
- Applies to administrators, with an emergency bypass limited to the repository owner.

## Initial release

Create `v0.1.0` only after the first GitHub Actions run is green. Use the `0.1.0` section of [`CHANGELOG.md`](../../CHANGELOG.md) as the release basis and mark the release as a research prototype—not a production assurance or compliance system.

## Final verification

- Open every README image at full resolution.
- Follow the quick-start instructions in a fresh clone.
- Open each issue form and the pull-request template.
- Confirm Discussions, private vulnerability reporting, labels, CodeQL, and required checks.
- Verify the public URL while signed out.
- Record any unavailable account-level protection instead of implying it is active.
