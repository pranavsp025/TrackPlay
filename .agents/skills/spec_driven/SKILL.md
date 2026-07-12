---
name: spec_driven
description: Drives development by following a structured, plan-first, specification-driven development (SDD) cycle.
---

# Spec-Driven Development (SDD) Skill

This skill enforces a systematic approach to development where code is written only after planning and validation criteria are explicitly defined.

## Workflow

### 1. Research & Define (`SPEC.md`)
- Analyze the user request.
- Create a `SPEC.md` file in the workspace root if it does not exist, or update it.
- Define:
  - Feature requirements and scope.
  - API design, integration endpoints, and schemas.
  - Component architecture and state management.
  - UX/UI design choices (color palettes, typography, interactive elements).

### 2. Implementation Planning (`implementation_plan.md`)
- Create the standard `implementation_plan.md` artifact.
- Outline the sequence of files to modify or create.
- List open questions and obtain user approval.

### 3. Execution (`task.md`)
- Create `task.md` with checkbox tasks.
- Keep components focused and reusable.
- Apply high-fidelity styling (Vanilla CSS, clean typography, glassmorphism, dark mode).

### 4. Verification
- Verify that changes compile and run without errors.
- Run tests or check dev build.
- Create `walkthrough.md` with results and details.
