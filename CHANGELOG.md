# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-04-26

### Added

- Guided assessment workspace that helps users construct the use case from structured choices.
- Generated use-case summary so users no longer need to start from a blank description field.
- Live risk preview with fired rules, conservative assumptions, and required controls.
- Conservative handling for "Not sure" answers.
- Rule R8a so unknown data provenance outside client or regulated exposure is at least Moderate risk.
- Tests for unknown data provenance and fail-closed parser behavior.

### Changed

- Replaced URL-based assessment results with in-page assessment preview to avoid leaking assessment details through query strings.
- Updated malformed result URL handling so invalid or missing inputs fail closed.
- Made regulated-domain selection mutually exclusive with "None of these" and "Not sure."
- Widened the app shell for the two-panel assessment workspace.

## [1.0.0] - 2026-04-19

### Added

- Initial deterministic AI governance classifier for insurance use cases.
- Rule, control, and review matrices.
- Static framework reference page.
- Unit tests for core rule outcomes.
