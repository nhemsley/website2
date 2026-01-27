# Documentation

## Recent Updates

- **2026-01-28**: Enhanced `source/metadata/skills.yaml` with category taxonomy and color palette for visualizations

## Key Docs

| Doc | Purpose |
|-----|---------|
| `ARCHITECTURE.md` | Site structure, exploration philosophy |
| `visualization-strategy.md` | 10 viz patterns, tech stack |
| `visualization-quick-reference.md` | Quick lookup tables |
| `site-analysis.md` | Legacy Jekyll site analysis |
| `source-schema.md` | Data structure for content |

## Quick Decisions

- **Framework**: Svelte
- **Primary Viz**: D3.js
- **Fallback**: ECharts (when D3 too hard)
- **3D**: Three.js
- **Approach**: Exploration-first, consolidate later

## Visualization Priority

1. **Bubble Chart** (#1) - Primary, high impact
2. **Progress Bars** (#8) - Mobile fallback
3. Others - As curiosity drives

## Philosophy

> Get it working → Iterate → Collapse tech stack later

- Bundle size: not a concern yet
- Tech mixing: allowed during exploration
- Pre-packaged solutions: encouraged when faster

## Structure

```
docs/
├── ARCHITECTURE.md      # Site structure
├── DECISIONS.md         # Tech choices
├── visualization-*.md   # Viz patterns
└── site-analysis.md     # Legacy site
```

## See Also

- `AGENTS.md` (root) - Agent instructions, terse docs guideline