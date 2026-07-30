# Code Quality Fixtures

Small Harbor tasks for evaluating code-quality skills, coding agents, and
models. Each fixture is intentionally compact, independently installable, and
protected by behavior-focused checks so implementations can be reorganized
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
| `react-task-board` | React state, rendering, persistence, and ownership | test, typecheck, build, LLM judge |
| `typescript-order-api` | Domain boundaries, validation, HTTP concerns, and data ownership | test, typecheck, LLM judge |

Each fixture follows Harbor's native `instruction.md`, `task.toml`,
`environment/`, and `tests/` structure. Harbor keeps the verifier files outside
the agent workspace while it works.

## Use

Run the local dataset with any Harbor agent and model. For reproducible
benchmarks, pin both Harbor and this repository instead of tracking latest
versions.

Example:

```bash
harbor run -p fixtures -a pi -m vercel-ai-gateway/deepseek/deepseek-v4-flash
```

Keep verifier criteria under `tests/`, where Harbor does not expose them during
the agent run. Do not add reference solutions: the benchmark should protect
behavior and judge quality without prescribing one patch.
