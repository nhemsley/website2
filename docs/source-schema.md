# source/ Directory Schema

**Purpose**: Single source-of-truth markdown tree for all portfolio content. Can be consumed by any static site generator (Hugo, Astro, Next.js, etc.).

**Design Principles**:
- Content is agnostic to the rendering framework
- All metadata expressed as frontmatter (YAML)
- Directory structure reflects content hierarchy
- Self-documenting with clear naming conventions

---

## Directory Structure

```
source/
├── README.md                          # Schema documentation
├── resume/
│   ├── index.md                       # Resume main page
│   ├── _data.yaml                     # Resume data export (for reference)
│   └── jobs/
│       ├── fluid-notion-systems.md
│       ├── itomic-2019.md
│       ├── freo-guitar-tuition.md
│       ├── crypto-exchange.md
│       ├── media-on-mars.md
│       ├── abc-wall-removers.md
│       ├── integrated-natural-systems.md
│       ├── phone-control-australia.md
│       ├── house-of-snowball.md
│       └── itomic-2003.md
│
├── projects/
│   ├── salvatore/
│   │   ├── index.md                   # Project description
│   │   ├── images/
│   │   │   └── [screenshots, diagrams]
│   │   └── videos.md                  # Video embeds and descriptions
│   │
│   └── mesh-ripper/
│       ├── index.md
│       └── images/
│
├── writing/
│   ├── interests.md                   # Technology interests/philosophy
│   ├── blog/                          # Future: blog posts
│   │   └── STRUCTURE.md
│   └── articles/                      # Future: longer-form articles
│       └── STRUCTURE.md
│
├── pages/
│   ├── about.md                       # About page
│   └── contact.md                     # Contact information
│
└── metadata/
    ├── skills.yaml                    # Master skills taxonomy
    ├── referees.yaml                  # Professional referees
    └── personal-data.yaml             # Contact, location, etc.
```

---

## Frontmatter Schema

### Resume Page (`resume/index.md`)

```yaml
---
title: Resume / CV
description: Professional resume and career history
slug: resume
type: resume
---
```

### Job Entry (`resume/jobs/*.md`)

```yaml
---
title: "[Company Name]"
type: job
company: "Company Name"
role: "Job Title (optional)"
startDate: 2020-03-01
endDate: 2021-12-01
current: false
tags: [Rust, Bevy, AWS, Terraform, 3d Programming, Big Data]
order: 1  # Display order (higher = earlier in career)
pageBreak: false  # PDF: force page break before this job
---
```

**Content**: Job description in markdown, can include lists, code blocks, etc.

### Project (`projects/*/index.md`)

```yaml
---
title: "Salvatore: Fluid Simulation of Breaking Waves"
type: project
slug: salvatore
description: "Numerical fluid simulation with visualization"
startDate: 2020-03-01
endDate: 2021-12-01
status: completed  # completed | in-progress | archived
technologies: [Rust, Salva, Bevy, AWS, Splashsurf, Meshlab]
featured: true
externalLinks:
  - title: "rezural/mesh-ripper"
    url: "https://github.com/rezural/mesh-ripper"
  - title: "Salva crate"
    url: "https://github.com/dimforge/salva"
images:
  - filename: "wave-simulation.png"
    alt: "Wave breaking over reef"
  - filename: "mesh-ripper-ui.png"
    alt: "Mesh visualization interface"
---
```

**Content**: Project description, technical details, embedded video descriptions, etc.

### Writing (`writing/*.md`)

```yaml
---
title: "Technology Interests"
type: writing
slug: interests
description: "Current interests and learning goals"
date: 2024-01-26
categories: [technology, career, philosophy]
---
```

**Content**: Prose in markdown format.

### Metadata Files

**`metadata/skills.yaml`** - Master skills taxonomy:

```yaml
skills:
  languages:
    - name: Rust
      level: intermediate
      yearsExperience: 3
      projects: [salvatore, mesh-ripper]
    - name: Ruby
      level: advanced
      yearsExperience: 15
      projects: [itomic, freo-guitar]
    # ... etc
  
  categories:
    - name: "3D Graphics"
      skills: [Bevy, Three.js, Meshlab]
    - name: "DevOps"
      skills: [Docker, Kubernetes, AWS, Terraform]
    # ... etc
```

**`metadata/referees.yaml`** - Professional referees:

```yaml
referees:
  - firstName: Ben
    lastName: Bowden
    email: ben@freoguitar.com
    phone: "+61 (08) 6270 6380"
    role: "Managing Director"
    business: "Freo Guitar Tuition"
    website: "https://www.freoguitar.com"
    relationship: "Direct supervisor"
    
  - firstName: Kammi
    lastName: Rapsey
    email: kam@mediaonmars.com.au
    phone: "+61 (08) 9433 3394"
    role: "Principal"
    business: "Media On Mars"
    website: "https://www.mediaonmars.com.au"
    relationship: "Founder of employing company"
    # ... etc
```

**`metadata/personal-data.yaml`** - Contact and personal info:

```yaml
personal:
  fullName: Nicholas Hemsley
  titles:
    - Computer Scientist
    - Data Scientist
  contact:
    email: nick.hems@gmail.com
    phone: "+61 497 686 384"
  location:
    city: Perth
    country: Australia
  social:
    github: nhemsley
    linkedin: https://linkedin.com/in/nhemsley
    # ... etc
```

---

## Content Guidelines

### Markdown Formatting

- Use standard Markdown for all content
- Code blocks with language specification
- Relative links between content (e.g., `[See Salvatore](../projects/salvatore)`)
- YouTube embeds: Store video IDs in metadata, rendering left to site generator

### Job Descriptions

- Lead with 1-2 sentence overview
- Bullet points for key achievements/responsibilities
- Tag all relevant technologies
- If multiple sections, use H3 headers

### Project Descriptions

- Overview paragraph
- Technical details section
- Challenges and solutions
- Links to code, live demos, papers, videos
- Image descriptions for visualization

### Dates

- Use ISO 8601 format: `YYYY-MM-DD`
- Omit `endDate` if current/ongoing
- Leave `endDate` empty string `""` if no end date

### Tags and Categories

- Keep tags lowercase with hyphens
- Use consistent naming across all entries
- Example: `rust`, `web-development`, `3d-graphics`

### File Naming

- Use kebab-case: `salvatore`, `mesh-ripper`, `freo-guitar-tuition`
- No spaces or special characters
- Date-based files (blog posts): `YYYY-MM-DD-title-slug.md`

---

## Examples

### Job Entry Example

**File**: `resume/jobs/fluid-notion-systems.md`

```yaml
---
title: "Fluid Notion Systems"
type: job
company: "Fluid Notion Systems"
startDate: 2020-03-01
endDate: 2021-12-01
tags: [Rust, Bevy, AWS, Terraform, 3d Programming, Big Data]
order: 1
---

## Overview

Worked on a fluid simulation of breaking waves and visualization software for the results.

## Responsibilities

- Designed and implemented numerical fluid simulation using Salva physics engine
- Built visualization pipeline: simulation → PLY → STL → decimated mesh
- Created mesh-ripper visualization tool in Bevy game engine
- Managed AWS infrastructure for simulation compute

## Technical Details

- Core simulation: Rust + Salva crate (particle-based fluid dynamics)
- Bathymetry from grayscale heightmap images
- Output: 600MB+ PLY files per timestep
- Conversion: splashsurf (PLY→STL), meshlab (decimation ~30MB final)
- Visualization: Bevy engine with WebGL rendering

## Results

See the [Salvatore project page](../projects/salvatore) for details and videos.
```

### Project Example

**File**: `projects/salvatore/index.md`

```yaml
---
title: "Salvatore: Fluid Simulation of Breaking Waves"
type: project
slug: salvatore
status: completed
startDate: 2020-03-01
endDate: 2021-12-01
technologies: [Rust, Salva, Bevy, AWS, Splashsurf, Meshlab]
featured: true
description: "Numerical fluid simulation over contoured bathymetry with visualization"
externalLinks:
  - title: "mesh-ripper GitHub"
    url: "https://github.com/rezural/mesh-ripper"
images:
  - filename: "scar-reef.jpg"
    alt: "Scar Reef wave simulation"
  - filename: "hollow-left.jpg"
    alt: "Hollow breaking wave"
---

## Overview

Numerical fluid simulation of breaking waves over contoured sea floor, exploring fluid dynamics in realistic bathymetry. My first significant Rust project.

## Core Simulation

...content here...
```

---

## Site Generator Integration

### For Hugo

1. Convert `source/resume/jobs/*.md` → `content/resume/jobs/`
2. Convert `source/projects/*/index.md` → `content/projects/*/index.md`
3. Reference metadata files in site config
4. Custom partials for skills display, job rendering, etc.

### For Astro

1. Ingest `source/` as Content Collection
2. Define Zod schema from frontmatter
3. Type-safe queries in components
4. Use `metadata/*.yaml` in layout components

### For Next.js

1. Create API routes to parse `source/` at build time
2. Generate static props from markdown + YAML
3. Build frontend components to consume structured data

---

## Evolution

This schema is designed to grow:

- **Blog posts**: Add `writing/blog/YYYY-MM-DD-*.md`
- **Articles**: Add `writing/articles/YYYY-MM-DD-*.md`
- **Speaking**: Add `speaking/*.md` with talk details
- **Open Source**: Add `open-source/*.md` for OSS contributions
- **Media**: Expand projects with more rich media

The frontmatter structure accommodates new fields without breaking existing parsers.
