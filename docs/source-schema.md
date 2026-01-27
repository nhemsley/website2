# Source Schema

**Purpose**: Markdown content tree, framework-agnostic

## Structure

```
source/
├── resume/
│   ├── index.md          # Resume page
│   ├── _data.yaml        # Resume data
│   └── jobs/*.md         # Individual job entries
├── projects/
│   └── [project-name]/
│       ├── index.md      # Project description
│       └── images/       # Assets
├── writing/
│   ├── interests.md      # Tech interests
│   └── blog/             # Future posts
├── pages/
│   ├── about.md
│   └── contact.md
└── metadata/
    ├── skills.yaml       # Skills taxonomy
    ├── referees.yaml     # References
    └── personal.yaml     # Contact info
```

## Job Entry Frontmatter

```yaml
---
company: "Example Corp"
start: 2020-01-01
end: 2021-12-31
tags: [Rust, AWS, Kubernetes]
force_page_break: false
---
Job description here...
```

## Project Frontmatter

```yaml
---
title: "Project Name"
status: active | archived
tags: [Rust, 3D, Simulation]
github: "https://github.com/..."
---
Project description...
```

## Skills Taxonomy

```yaml
# metadata/skills.yaml
categories:
  - id: frontend
    name: Frontend
    color: "#3498db"
    skills: [React, Vue, Svelte, TypeScript]
  - id: backend
    name: Backend
    color: "#e74c3c"
    skills: [Rust, Ruby, Node.js, Python]
```

## Design Principles

- Frontmatter for metadata
- Markdown for content
- Framework-agnostic
- Directory = hierarchy