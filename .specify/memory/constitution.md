<!--
Version change: 0.0.0 -> 1.0.0
Modified principles: None (initial creation)
Added sections:
  - AI-Driven Content Generation
  - Technical Accuracy and Validation
  - Modular Chapter Structure
  - Consistent Formatting and Examples
  - Versioning, Updates, and Traceability
  - Project File Organization
  - Operational Policies
  - Compliance & Review
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md: ⚠ pending (review for alignment with new principles)
  - .specify/templates/spec-template.md: ⚠ pending (review for alignment with new principles)
  - .specify/templates/tasks-template.md: ⚠ pending (review for alignment with new principles)
  - .specify/templates/commands/*.md: ⚠ pending (review for outdated references)
  - README.md, docs/quickstart.md: ⚠ pending (review for references to principles)
Follow-up TODOs: None
-->
# Physical AI & Humanoid Robotics Constitution

## Core Principles

### I. AI-Driven Content Generation
All content generation for the textbook MUST leverage Spec-Kit Plus and Claude Code.
The AI is an integral part of the content creation process, from outline generation
to drafting chapters and exercises. All AI-generated content MUST be reviewed and
approved by a human author.

### II. Technical Accuracy and Validation
All technical content related to robotics, ROS 2, Gazebo, Unity, NVIDIA Isaac, and VLA
MUST meet rigorous accuracy standards. Facts, code examples, and procedural steps MUST
be verified against official documentation and real-world implementations.
Discrepancies require immediate human review and correction.

### III. Modular Chapter Structure
Chapters MUST be designed as modular, self-contained units following a clear
pedagogical structure (e.g., introduction, concepts, implementation, exercises, summary).
Writing guidelines include clear, concise language, progressive complexity, and a
consistent tone appropriate for an academic textbook. Each chapter should be
independently reviewable and updatable.

### IV. Consistent Formatting and Examples
All content, including text, code examples, diagrams, and exercises, MUST adhere
to a consistent formatting style. Code examples MUST be runnable and validated.
Diagrams MUST be clear, labeled, and convey information effectively.
Exercises MUST reinforce learning objectives and include solutions where appropriate.
Markdown format compatible with Docusaurus MUST be used for all book chapters.

### V. Versioning, Updates, and Traceability
The textbook content, including chapters, code, and diagrams, MUST be versioned
to track changes and facilitate updates. A clear process for content updates,
errata, and new editions MUST be established. All content modifications MUST be
traceable to their source (e.g., Git commit, Spec-Kit Plus prompt ID, human review log).

### VI. Project File Organization
Book chapters MUST be stored in the `docs/` directory. Spec prompts and AI history
MUST be stored in the `.claude/history/` directory. The entire project MUST
maintain a file structure compatible with Docusaurus.

## Operational Policies

### AI Interpretation of Specifications
The AI agent MUST interpret specifications literally and precisely. Ambiguous
instructions in specifications MUST trigger a clarification request to the human author.
The AI is responsible for breaking down high-level specifications into actionable,
detailed tasks.

### Quality Validation Rules
Content generated or modified by the AI MUST pass automated quality checks
(e.g., spell check, grammar check, code linting). Technical accuracy MUST be
validated by running code examples and cross-referencing against trusted sources.
Any validation failures MUST halt the process and require human intervention.

### Chapter Review Rules
Each chapter MUST undergo a structured human review process covering technical accuracy,
pedagogical clarity, completeness, and adherence to formatting standards. Review
feedback MUST be incorporated systematically, with AI assistance for revisions and
human final approval.

### Human-in-the-Loop Final Approval
All generated or updated content MUST receive final human approval before being
committed to the main branch or published. The AI serves as an assistant, but ultimate
responsibility for content quality and accuracy rests with the human authors.

## Compliance & Review
All AI-generated content and human modifications MUST adhere to the principles
outlined in this constitution. Regular audits of content quality, technical accuracy,
and adherence to file organization standards WILL be conducted. Any deviations
REQUIRE immediate corrective action.

## Governance
This Constitution serves as the foundational governance document for the
`Physical AI & Humanoid Robotics` textbook project. All contributors, human and AI,
MUST adhere to these principles. Amendments to this Constitution REQUIRE a formal
proposal, review by all lead authors, and a unanimous approval vote.
Changes MUST be documented with version increments and a Sync Impact Report.
Any PRs or content reviews MUST explicitly verify compliance with these rules.

**Version**: 1.0.0 | **Ratified**: 2025-12-04 | **Last Amended**: 2025-12-04
