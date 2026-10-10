<!--
Sync Impact Report
===================
Version change: [TEMPLATE] → 1.0.0 (initial ratification)

Modified principles: N/A (first adoption; all principles newly defined)

Added sections:
  - Core Principles: I. Code Quality & Readability (NON-NEGOTIABLE)
  - Core Principles: II. Test-First Development (NON-NEGOTIABLE)
  - Core Principles: III. Comprehensive Test Coverage
  - Core Principles: IV. Maintainability & Simplicity
  - Core Principles: V. Documentation & Review Accountability
  - Quality Gates (Section 2)
  - Development Workflow (Section 3)
  - Governance

Removed sections: N/A (no prior ratified content existed; source file contained
  only unresolved template placeholders)

Templates requiring follow-up: None found referencing stale principle names at
  time of writing — dependent templates/commands are not modified by this
  command per its scope guard, but should be checked for alignment on next use.

Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Confirmed as the date of this initial ratification
    (2026-10-09) since no prior adoption date exists. Update if an earlier
    informal adoption date is identified.
-->

# Spec Kit Week2 Constitution

## Core Principles

### I. Code Quality & Readability (NON-NEGOTIABLE)
All code MUST be written for the next reader, not just the compiler. Code MUST
pass linting and static analysis with zero warnings before merge; any
suppressed rule MUST carry an inline justification. Functions and modules
MUST have a single, clear responsibility — if a change description needs
"and" to summarize what a function does, it MUST be split. Naming MUST be
descriptive and consistent with existing conventions in the codebase; no
single-letter or abbreviated identifiers outside of well-known idioms (e.g.
loop indices). Dead code, commented-out blocks, and unused imports/exports
MUST be removed before merge, not left "in case it's needed later."

**Rationale**: Code quality defects compound silently — unlike test failures,
poor readability and unmanaged complexity rarely block a build, so they
accumulate unchecked unless explicitly gated. Enforcing this at review time is
far cheaper than untangling it during an incident.

### II. Test-First Development (NON-NEGOTIABLE)
Tests MUST be written before implementation code for any new behavior or bug
fix. The workflow is: write a failing test that encodes the expected
behavior → confirm it fails for the expected reason → implement the minimum
code to pass it → refactor with the test green. A pull request that adds
behavior without a preceding test commit (or equivalent documented evidence
of the red-green cycle) MUST NOT be merged. Bug fixes MUST include a
regression test that fails on the pre-fix code.

**Rationale**: Tests written after the fact tend to validate what the code
does, not what it should do, which lets the original bug's assumptions leak
into the test suite. Writing the test first forces the specification to be
explicit before implementation choices anchor it.

### III. Comprehensive Test Coverage
Every public function, API endpoint, and user-facing behavior MUST have
automated test coverage at the appropriate level: unit tests for pure logic
and edge cases, integration tests for component boundaries and contracts,
and end-to-end tests for critical user journeys. Coverage MUST include
documented edge cases (empty input, boundary values, error paths) in
addition to the happy path. A pull request MUST NOT decrease overall test
coverage without explicit justification recorded in the PR description.
Flaky tests MUST be fixed or quarantined with a tracked follow-up within one
release cycle — they MUST NOT be silently skipped or deleted.

**Rationale**: Coverage that only exercises the happy path gives false
confidence; most production incidents originate in untested edge cases and
error-handling paths. A coverage floor combined with mandatory edge-case
tests catches regressions before they reach users.

### IV. Maintainability & Simplicity
Solutions MUST use the simplest design that satisfies current, stated
requirements (YAGNI). New abstractions, frameworks, or dependencies MUST be
justified against the complexity they remove — if a problem can be solved
with existing project tools, a new one MUST NOT be introduced. Duplication
MUST NOT be eliminated prematurely; three or more concrete repetitions, not
anticipated future ones, justify an abstraction. Breaking changes to shared
interfaces (library APIs, schemas, CLI contracts) MUST be versioned and
accompanied by a migration note.

**Rationale**: Unnecessary abstraction and speculative generality are harder
to undo than duplication — removing a bad abstraction requires understanding
every caller, while removing duplication is a local edit. Keeping the system
simple now is what keeps future changes cheap.

### V. Documentation & Review Accountability
Every pull request MUST include a description of what changed and why,
sufficient for a reviewer with no prior context to evaluate correctness.
Non-obvious design decisions (a workaround, a hidden constraint, a
performance trade-off) MUST be captured as a code comment or ADR-style note
at the point of decision, not left to be reconstructed from commit history.
No code MUST be merged without at least one independent review confirming
Principles I–IV were followed; the reviewer's approval is itself a
compliance checkpoint, not a formality.

**Rationale**: Knowledge that exists only in the author's head or in a chat
log is lost the moment the author moves on. Requiring the "why" to be
recorded at commit time, and requiring independent review, is cheaper than
re-deriving intent later and catches drift from the other principles while
it is still easy to fix.

## Quality Gates

Automated gates MUST block merge, not just warn, for: lint/static-analysis
failures, failing or skipped-without-justification tests, and any decrease
in test coverage below the project's recorded floor. CI MUST run the full
test suite (unit, integration, and any designated end-to-end suite) on every
pull request before it is eligible for merge. Performance-sensitive code
paths identified by the team MUST have a benchmark or load test guarding
against regression; a change that regresses a tracked benchmark by more than
an agreed threshold MUST be justified in the PR description or reverted.

## Development Workflow

Feature work follows the Spec Kit flow (specify → plan → tasks → implement)
so that tests and acceptance criteria are defined before implementation
begins, in support of Principle II. Every pull request MUST be reviewed by
at least one person other than the author before merge. Reviewers MUST
explicitly check for: adherence to Principles I–V, adequate test coverage for
the change, and absence of unjustified new complexity. Reverts of a merged
change MUST include a brief note on why, so the same mistake is not
reintroduced.

## Governance

This constitution supersedes all other informal practices and ad-hoc
conventions for this project. Any conflict between this document and a
style guide, template default, or past precedent MUST be resolved in favor
of this constitution unless an amendment is made.

**Amendment procedure**: Amendments MUST be proposed via a pull request that
modifies this file directly, with the specific change and rationale stated in
the PR description. An amendment MUST update the Sync Impact Report at the
top of this file and bump the version per the policy below before merge.

**Versioning policy**: This constitution follows semantic versioning:
- MAJOR: Backward-incompatible governance changes, or removal/redefinition of
  an existing principle.
- MINOR: A new principle or section is added, or existing guidance is
  materially expanded.
- PATCH: Clarifications, wording fixes, or non-semantic refinements.

**Compliance review**: Every pull request MUST be checked against this
constitution during review (see Development Workflow). Any exception MUST be
documented in the PR description with a reason and, where applicable, a
follow-up task to bring the code back into compliance.

**Version**: 1.0.0 | **Ratified**: 2026-10-09 | **Last Amended**: 2026-10-09
