# TypeScript Stabilization Plan

Current state: `yarn workspace station-desktop-app run tsc --noEmit` reports many legacy errors across unrelated domains, which removes compiler signal for regressions.

## Goals

1. Recover useful compiler signal without blocking day-to-day delivery.
2. Prevent new TypeScript debt while reducing old debt incrementally.
3. Reach a state where `tsc --noEmit` can run in CI for targeted scopes, then globally.

## Phase 1: Freeze New Debt

1. Add rule: no new `any` in touched files unless justified in PR notes.
2. Require tests for changed code in high-risk runtime paths.
3. Keep `pre-release:check` mandatory for release workflows.

## Phase 2: Domain-by-Domain Recovery

Tackle one domain at a time, starting with highest runtime risk:

1. `src/session.ts`, `src/tab-webcontents/**`, `src/urlrouter/**`
2. `src/services/**` (transport and serialization)
3. `src/applications/**` and manifest-provider boundaries
4. `src/persistence/**` migrations and model typing

For each domain:

1. Define a local `tsconfig` include scope.
2. Make the domain compile with `--noEmit`.
3. Add scoped CI check for that domain.

## Phase 3: CI Rollout

1. Add separate CI jobs for each stabilized domain.
2. Block merges only for stabilized domains first.
3. When all domains are green, enable global `tsc --noEmit` gate.

## Tracking

Use a simple table in this file or in project board:

1. Domain name
2. Owner
3. Error count baseline
4. Current error count
5. CI gate enabled (yes/no)

## Definition of Done

1. Global `tsc --noEmit` passes in CI.
2. Release pipeline includes TypeScript gate by default.
3. New TypeScript regressions fail CI immediately.
