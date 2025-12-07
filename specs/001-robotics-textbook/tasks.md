---
description: "Task list for Physical AI & Humanoid Robotics Textbook implementation"
---

# Tasks: Physical AI & Humanoid Robotics Textbook

**Input**: Design documents from `/specs/001-robotics-textbook/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are explicitly requested in the plan's roles for AI and human intervention and validation steps.

**Organization**: Tasks are grouped by implementation phase and user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Documentation**: `docs/`, `.claude/history/`, `specs/` at repository root

## Phase 0: Research & Outline (AI-Assisted)

**Purpose**: Define initial content outlines and gather foundational research for each module and chapter.

### Milestones
- **M0.1**: Comprehensive outline for all modules and chapters generated.
- **M0.2**: Initial research summaries for key technical concepts (ROS 2, Gazebo, Unity, Isaac, VLA) compiled.

### Tasks
- [ ] T001 Generate high-level module outlines based on `specs/001-robotics-textbook/spec.md`
- [ ] T002 [AI] For each module, prompt Claude Code with detailed module-level specifications to generate chapter outlines and learning objectives, saving outputs to `docs/` module directories.
- [ ] T003 [AI] For complex technical concepts (ROS 2, Gazebo, Unity, Isaac, VLA), use Claude Code (Task tool with `subagent_type=Explore`) to research and summarize foundational knowledge, key libraries, and best practices, saving to `docs/research/`.
- [ ] T004 Human review of module and chapter outlines (from T002) for pedagogical flow and completeness.
- [ ] T005 Create PHRs for each AI generation and human review iteration (from T002, T003, T004) in `.claude/history/prompts/`.

---

## Phase 1: Chapter Drafting (AI-Driven with Human Oversight)

**Purpose**: Produce initial drafts of all textbook chapters.

### Milestones
- **M1.1**: Drafts for all chapters in Module 1 (ROS 2) completed.
- **M1.2**: Drafts for all chapters in Module 2 (Digital Twin) completed.
- **M1.3**: Drafts for all chapters in Module 3 (AI-Robot Brain) completed.
- **M1.4**: Drafts for all chapters in Module 4 (VLA) completed.
- **M1.5**: Drafts for Humanoid Mechatronics Overview and Capstone Project guidelines completed.

### Tasks for User Story 1: AI Generates Chapter Draft (Priority: P1)

**Goal**: The AI successfully generates initial chapter drafts based on specifications.

**Independent Test**: Provide a chapter specification to the AI and verify a draft chapter is produced with relevant content and structure in `docs/`.

- [ ] T101 [US1] [AI] For each chapter in Module 1 (ROS 2), prompt Claude Code with detailed chapter specifications (derived from T002) to generate initial Markdown content, including explanations, code examples, diagrams (textual/conceptual), and exercises, saving to `docs/01-ros2-robot-nervous-system/<chapter-name>/index.md`.
- [ ] T102 [US1] Automated validation of AI-generated content (from T101) for formatting consistency (Docusaurus compatibility) and code syntax.
- [ ] T103 [US1] Human review of each chapter draft for Module 1 (from T101) for technical accuracy, clarity, completeness, and adherence to writing guidelines.
- [ ] T104 [US1] [AI] Claude Code iterates on Module 1 chapter drafts based on human feedback (from T103).
- [ ] T105 [US1] Final human approval for each chapter in Module 1 before marking as "draft complete."
- [ ] T106 [US1] Create PHRs for each generation, validation, review, and approval iteration for Module 1 in `.claude/history/prompts/001-robotics-textbook/`.

### Tasks for User Story 2: Human Review and Refinement (Priority: P1)

**Goal**: Human authors effectively refine AI-generated chapter drafts.

**Independent Test**: Have a human review an AI-generated chapter and provide feedback, then observe the AI's ability to incorporate that feedback into a revised chapter.

- [ ] T107 [US2] [AI] For each chapter in Module 2 (Digital Twin), prompt Claude Code with detailed chapter specifications (derived from T002) to generate initial Markdown content, saving to `docs/02-digital-twin-gazebo-unity/<chapter-name>/index.md`.
- [ ] T108 [US2] Automated validation of AI-generated content (from T107) for formatting consistency (Docusaurus compatibility) and code syntax.
- [ ] T109 [US2] Human review of each chapter draft for Module 2 (from T107) for technical accuracy, clarity, completeness, and adherence to writing guidelines.
- [ ] T110 [US2] [AI] Claude Code iterates on Module 2 chapter drafts based on human feedback (from T109).
- [ ] T111 [US2] Final human approval for each chapter in Module 2 before marking as "draft complete."
- [ ] T112 [US2] Create PHRs for each generation, validation, review, and approval iteration for Module 2 in `.claude/history/prompts/001-robotics-textbook/`.

### Tasks for User Story 3: Content Updates and Versioning (Priority: P2)

**Goal**: The AI assists in updating existing textbook chapters, ensuring versioning and traceability.

**Independent Test**: Provide an update specification for an existing chapter and verify that the updated chapter is generated, versioned correctly, and integrated seamlessly into the book structure.

- [ ] T113 [US3] [AI] For each chapter in Module 3 (AI-Robot Brain), prompt Claude Code with detailed chapter specifications (derived from T002) to generate initial Markdown content, saving to `docs/03-ai-robot-brain-nvidia-isaac/<chapter-name>/index.md`.
- [ ] T114 [US3] Automated validation of AI-generated content (from T113) for formatting consistency (Docusaurus compatibility) and code syntax.
- [ ] T115 [US3] Human review of each chapter draft for Module 3 (from T113) for technical accuracy, clarity, completeness, and adherence to writing guidelines.
- [ ] T116 [US3] [AI] Claude Code iterates on Module 3 chapter drafts based on human feedback (from T115).
- [ ] T117 [US3] Final human approval for each chapter in Module 3 before marking as "draft complete."
- [ ] T118 [US3] Create PHRs for each generation, validation, review, and approval iteration for Module 3 in `.claude/history/prompts/001-robotics-textbook/`.

- [ ] T119 [AI] For each chapter in Module 4 (Vision-Language-Action (VLA)), prompt Claude Code with detailed chapter specifications to generate initial Markdown content, saving to `docs/04-vision-language-action/<chapter-name>/index.md`.
- [ ] T120 Automated validation of AI-generated content (from T119) for formatting consistency (Docusaurus compatibility) and code syntax.
- [ ] T121 Human review of each chapter draft for Module 4 (from T119) for technical accuracy, clarity, completeness, and adherence to writing guidelines.
- [ ] T122 [AI] Claude Code iterates on Module 4 chapter drafts based on human feedback (from T121).
- [ ] T123 Final human approval for each chapter in Module 4 before marking as "draft complete."
- [ ] T124 Create PHRs for each generation, validation, review, and approval iteration for Module 4 in `.claude/history/prompts/001-robotics-textbook/`.

- [ ] T125 [AI] Generate initial Markdown content for Humanoid Mechatronics Overview, saving to `docs/05-humanoid-mechatronics-overview/index.md`.
- [ ] T126 Automated validation of AI-generated content (from T125) for formatting consistency (Docusaurus compatibility) and code syntax.
- [ ] T127 Human review of Humanoid Mechatronics Overview (from T125) for technical accuracy, clarity, completeness, and adherence to writing guidelines.
- [ ] T128 [AI] Claude Code iterates on Humanoid Mechatronics Overview based on human feedback (from T127).
- [ ] T129 Final human approval for Humanoid Mechatronics Overview before marking as "draft complete."
- [ ] T130 Create PHRs for each generation, validation, review, and approval iteration for Humanoid Mechatronics Overview in `.claude/history/prompts/001-robotics-textbook/`.

- [ ] T131 [AI] Generate initial Markdown content for Capstone Project guidelines and resources, saving to `docs/06-capstone-project/index.md`.
- [ ] T132 Automated validation of AI-generated content (from T131) for formatting consistency (Docusaurus compatibility) and code syntax.
- [ ] T133 Human review of Capstone Project guidelines (from T131) for technical accuracy, clarity, completeness, and adherence to writing guidelines.
- [ ] T134 [AI] Claude Code iterates on Capstone Project guidelines based on human feedback (from T133).
- [ ] T135 Final human approval for Capstone Project guidelines before marking as "draft complete."
- [ ] T136 Create PHRs for each generation, validation, review, and approval iteration for Capstone Project guidelines in `.claude/history/prompts/001-robotics-textbook/`.

---

## Phase 2: Integration & Refinement (Human-Led with AI Support)

**Purpose**: Integrate all chapters, refine the entire textbook, and prepare for publication.

### Milestones
- **M2.1**: All chapters integrated into Docusaurus structure with navigation.
- **M2.2**: Cross-chapter consistency review (terminology, style, references) completed.
- **M2.3**: Comprehensive review of Capstone Project guidelines and resources.
- **M2.4**: Final technical and pedagogical review of the entire textbook.
- **M2.5**: Final content versioning and publication readiness.

### Tasks
- [ ] T201 Integrate all `docs/` chapters into the Docusaurus project structure, configuring navigation and sidebar in `docusaurus.config.js` and `sidebars.js`.
- [ ] T202 Human review of the complete textbook for overall flow, consistency, and learning experience (entire `docs/` directory).
- [ ] T203 [AI] Claude Code assists in global content refinements (e.g., consistent terminology, cross-referencing, rephrasing for clarity) based on human feedback (from T202), modifying relevant `docs/**/*.md` files.
- [ ] T204 Final review and validation of all code examples by running them in target environments (Cloud Workstation, Edge AI Kit), verifying against `docs/**/*.md`.
- [ ] T205 [AI] Generate an index, glossary, and bibliography (AI-assisted) and human review, saving to `docs/index.md`, `docs/glossary.md`, `docs/bibliography.md`.
- [ ] T206 Final human approval of the entire textbook for publication (all `docs/` content).
- [ ] T207 Update versioning metadata for the complete textbook and archive all relevant PHRs and ADRs in `.claude/history/`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0 (Research & Outline)**: No dependencies - can start immediately.
- **Phase 1 (Chapter Drafting)**: Depends on Phase 0 completion.
- **Phase 2 (Integration & Refinement)**: Depends on Phase 1 completion.

### User Story Dependencies

- **User Story 1 (P1 - AI Generates Chapter Draft)**: Depends on T004 (Human review of outlines).
- **User Story 2 (P1 - Human Review and Refinement)**: Depends on T004 (Human review of outlines).
- **User Story 3 (P2 - Content Updates and Versioning)**: Depends on T004 (Human review of outlines).

### Within Each User Story

- AI generation tasks before automated validation.
- Automated validation before human review.
- Human review before AI iteration.
- AI iteration before final human approval.
- PHR creation after each logical step.

### Parallel Opportunities

- Multiple AI content generation tasks (T101, T107, T113, T119, T125, T131) can be initiated in parallel once their respective module specifications are ready.
- Automated validation tasks (T102, T108, etc.) can run in parallel for different chapters.
- Human review tasks can be distributed and conducted in parallel.

---

## Parallel Example: Chapter Drafting

```bash
# Generate Module 1 (ROS 2) Chapters in parallel (if specifications ready):
Task: "[US1] [AI] Generate initial Markdown content for ROS 2 Chapter 1 in docs/01-ros2-robot-nervous-system/chapter1/index.md"
Task: "[US1] [AI] Generate initial Markdown content for ROS 2 Chapter 2 in docs/01-ros2-robot-nervous-system/chapter2/index.md"

# After generation, run automated validation in parallel:
Task: "[US1] Automated validation of AI-generated content for ROS 2 Chapter 1"
Task: "[US1] Automated validation of AI-generated content for ROS 2 Chapter 2"

# And so on for human review, AI iteration, and final approval.
```

---

## Implementation Strategy

### Iterative Chapter Development

1. **Phase 0 Completion**: Secure complete and approved outlines and research summaries.
2. **Module-by-Module Drafting**: Proceed with Phase 1, drafting chapters module by module, completing all steps (AI generation, validation, human review, AI iteration, final approval) for one module's chapters before moving to the next.
3. **Continuous PHR Creation**: Maintain meticulous PHR records throughout, ensuring full traceability.
4. **Final Integration**: Once all chapters are drafted and approved, move to Phase 2 for full textbook integration and final polish.

### AI-Human Collaboration Model

- **AI Role**: Content generation (drafting, code examples, conceptual diagrams), initial research, iterative revisions based on feedback, global consistency checks.
- **Human Role**: Strategic outlining, detailed specification writing, technical accuracy validation, pedagogical review, final content approval, overall project management.

---

## Notes

- [P] tasks = different files, no dependencies (allows parallel execution)
- [Story] label maps task to specific user story for traceability
- Each user story phase should be independently completable and testable
- Human approval gates are critical for quality assurance and policy compliance.
- Cloud-based AI execution is assumed for all content generation and automated validation tasks to ensure efficiency and scalability.
