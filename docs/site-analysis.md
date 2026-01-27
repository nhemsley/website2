# Site Analysis: source.nhemsley.github.io

**Status**: Legacy site, reference only

## Tech Stack

- Jekyll (Ruby 2.7.5)
- D3.js (word cloud)
- YAML data structure
- Rollup + Babel

## Structure

```
source.nhemsley.github.io/
├── _config.yml          # Jekyll config
├── _data/resume.yaml    # Resume data (skills, jobs, referees)
├── _layouts/            # HTML templates
├── _plugins/
│   ├── helpers.rb       # Skill aggregation
│   └── pdf-generator.rb # PDF export
├── javascript/lib/cloud.js  # D3 word cloud
├── media/               # CSS (screen + PDF)
├── projects/            # Project pages
├── index.md             # Home
├── interests.md         # Tech interests
└── resume.html          # Resume page
```

## Key Files

| File | Purpose |
|------|---------|
| `_data/resume.yaml` | Career history, skills, referees |
| `javascript/lib/cloud.js` | D3 word cloud visualization |
| `_plugins/helpers.rb` | Skill extraction from job tags |

## Resume Data Schema

```yaml
career:
  - company: "Example Corp"
    start: 2020-01-01
    end: 2021-12-31
    tags: [Rust, AWS, Kubernetes]
    description: "..."

referees:
  - name: {first: "John", last: "Doe"}
    position: "CTO"
    company: "..."
    email: "..."
```

## Word Cloud Logic

1. Extract `tags` from all career entries
2. Count frequency per skill
3. Apply `word_cloud_bump` for manual boosts
4. Render via d3-cloud

## Build Commands

```bash
yarn build          # JS bundle
bundle exec jekyll build  # Site
wkhtmltopdf resume-pdf.html resume.pdf  # PDF
```

## Pain Points

- Two build systems (Ruby + Node)
- Manual PDF generation
- No structured project listing
- Static only, no dynamic features

## Migration Notes

- Preserve `resume.yaml` structure
- Replace word cloud with new visualization
- Simplify build to single tool (Vite)
- Keep referee data secure

## DO NOT COMMIT

`source.nhemsley.github.io/` is reference only. Never add to git.