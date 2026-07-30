# Code Quality Fixtures

Small, working applications for evaluating code-quality skills, coding agents,
and models. Each fixture is intentionally compact, independently installable,
and protected by behavior-focused checks so implementations can be reorganized
without requiring a golden patch.

These applications are benchmark inputs, not starter templates.

## Design constraints

Keep fixture product scope minimal. Every behavior, file, and dependency must
contribute useful evaluation signal. Raw line count is not the target:
realistic duplication, indirection, and unnecessary code are useful when the
benchmark expects an agent to recognize and remove them. Do not add product
polish, unrelated breadth, or decorative UI unless a benchmark measures it.

Prefer the smallest product that exposes the quality concern, then retain the
amount of imperfect code needed to make the task representative. Add a larger
fixture only when the concern cannot be evaluated faithfully in a small one,
and document why its additional scope is necessary.

## Fixtures

| Fixture | Focus | Checks |
| --- | --- | --- |
| `react-task-board` | React state, rendering, persistence, and ownership | test, typecheck, build |
| `typescript-order-api` | Domain boundaries, validation, HTTP concerns, and data ownership | test, typecheck |

Machine-readable setup and check commands are available in
[`fixtures.json`](fixtures.json) and in each fixture's `fixture.json`.

## Use

Copy one fixture into a clean workspace, give an agent a behavior-preserving
task, and run every declared check after it finishes. For reproducible
benchmarks, pin this repository to a commit instead of tracking `main`.

Run a fixture directly:

```bash
cd fixtures/react-task-board
npm ci
npm test
npm run typecheck
npm run build
```

Do not add reference solutions or evaluation rubrics to fixture directories.
Those belong to the benchmark consuming the fixture, where they cannot leak
into the agent's workspace.
