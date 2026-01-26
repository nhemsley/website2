# source/ - Universal Content Repository

This directory contains the **single source-of-truth** for all portfolio content. It's a framework-agnostic markdown tree that can be consumed by any static site generator (Hugo, Astro, Next.js, etc.).

## Purpose

Instead of duplicating content across different site implementations, we maintain one authoritative `source/` directory. When experimenting with a new site generator, you simply:

1. Copy `source/` into the new site's content folder
2. Adapt the frontmatter and structure to the generator's conventions
3. Iterate on the site design without touching the content

This allows rapid experimentation with different frameworks while keeping content synchronized.

## Directory Structure

```
source/
├── README.md                    # This file
├── resume/                      # Resume/CV content
│   ├── index.md                 # Resume main page
│   └── jobs/                    # Individual job entries
│       ├── fluid-notion-systems.md
│       ├── itomic-2019.md
│       ├── freo-guitar-tuition.md
│       └── ... (more jobs)
│
├── projects/                    # Project showcases
│   ├── salvatore/               # Individual project
│   │   ├── index.md
│   │   ├── images/
│   │   └── videos.md
│   └── mesh-ripper/
│       └── index.md
│
├── writing/                     # Articles, interests, essays
│   ├── interests.md             # Technology interests
│   ├── blog/                    # Future: dated blog posts
│   └── articles/                # Future: long-form articles
│
├── pages/                       # Standalone pages
│   ├── about.md
│   └── contact.md
│
└── metadata/                    # Structured data
    ├── skills.yaml
    ├── referees.yaml
    └── personal-data.yaml
```

## Quick Start

See `docs/source-schema.md` for the complete schema specification, including:
- Frontmatter fields for each content type
- File naming conventions
- Markdown formatting guidelines
- Examples and best practices

## Content Types

### Resume (`resume/`)
Career history organized as individual job entries with:
- Company, dates, description
- Tags for technologies used
- Support for PDF-optimized formatting

### Projects (`projects/`)
Project showcases with:
- Technical description and challenges
- External links (GitHub, demos, papers)
- Image galleries
- Embedded videos

### Writing (`writing/`)
Articles, essays, and reflections on technology, philosophy, and career.

### Metadata (`metadata/`)
Structured YAML files for:
- Master skills taxonomy
- Professional referees
- Personal contact information

## Working with source/

### Adding a Job

1. Create `resume/jobs/company-name.md`
2. Use frontmatter from schema for company, dates, tags
3. Write job description in markdown

### Adding a Project

1. Create `projects/project-name/index.md`
2. Create `projects/project-name/images/` for assets
3. Include project metadata in frontmatter
4. Link to external resources, code, videos

### Adding Writing

1. Create `writing/interests.md` or `writing/blog/YYYY-MM-DD-title.md`
2. Use appropriate frontmatter
3. Write in markdown

## Site Generator Integration

When creating a new site implementation:

1. **Read** `docs/source-schema.md` for the complete specification
2. **Copy** `source/` into your site's content folder
3. **Adapt** frontmatter and structure as needed for your framework
4. **Build** your site using the generator's conventions
5. **Sync** back to `source/` when content changes

Examples for different frameworks are documented in `docs/source-schema.md`.

## Guidelines

- **All dates**: ISO 8601 format (YYYY-MM-DD)
- **All tags**: lowercase, kebab-case (e.g., `3d-graphics`, `web-development`)
- **All links**: relative within source/ (e.g., `../projects/salvatore`)
- **All file names**: kebab-case with no special characters
- **All content**: UTF-8 encoded, standard markdown

## Schema Documentation

Full schema documentation is in `docs/source-schema.md`, including:
- Frontmatter fields for each content type
- Complete examples
- Evolution and extensibility

## Future Expansion

This structure is designed to grow:
- Blog posts (dated entries in `writing/blog/`)
- Speaking engagements (`speaking/`)
- Open source contributions (`open-source/`)
- Media library (`media/`)
- Conference talks, workshops, etc.

New content types can be added by creating new directories and updating the schema.