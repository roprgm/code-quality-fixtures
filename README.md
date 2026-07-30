# Code Quality Fixtures

Small, working applications for evaluating code-quality skills, coding agents,
and models. Each fixture is intentionally compact, independently installable,
and protected by behavior-focused checks so implementations can be reorganized
without requiring a golden patch.

These applications are benchmark inputs, not starter templates.

## Design constraints

Keep fixtures minimal. Every behavior, file, dependency, and line of code adds
setup or model-context cost and must contribute useful evaluation signal. Do
not add product polish, realistic breadth, generated boilerplate, or decorative
UI unless a benchmark specifically measures it.

Prefer the smallest project that exposes the quality concern. Add a larger
fixture only when the concern cannot be evaluated faithfully in a small one,
and document why its additional size is necessary.

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
