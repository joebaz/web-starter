# Glossary

## Overview

This is a provisional set of terms. [Issue #38](https://github.com/joebaz/web-starter/issues/38) will finalize these terms and additional procedures for updating the glossary.

## Language

### Roles

**Maintainer**:
A person responsible for the repository, who approves its work and is the only one who commits, pushes, or merges it.
_Avoid_: owner

**Coordinator**:
The agent role that takes a GitHub issue from approval to a reviewed change, handing each part to the right role.
_Avoid_: orchestrator

**Planner**:
The agent role that gets GitHub issues ready for a Coder through triage, maintainer interviews, and issue writing.

**Researcher**:
The read-only agent role that answers approved research questions with checked facts and sources.

**Architect**:
The read-only agent role that assesses every issue for code health: the plan before coding, and the change after its last review.

**Coder**:
The agent role that implements an issue that is ready for an agent, with its test plan, for independent review.

**Reviewer**:
The agent role that reviews a change independently and recommends "accept" or "changes needed".

### Debt

**Technical debt**:
A shortcut, omission, or structural flaw in the code, such as duplication, a missing test, a workaround, or a misplaced boundary, that makes later changes slower or riskier until it is paid down.
_Avoid_: tech debt, cruft, architecture debt

**Design debt**:
A shortfall in what visitors experience on the site, in its performance, usability, or accessibility, that stays until it is fixed.
_Avoid_: UX debt

## Flagged ambiguities

- "Design" can also mean the code's structure. Problems in how the code is divided and named are **Technical debt**; **Design debt** is about the visitor's experience.
