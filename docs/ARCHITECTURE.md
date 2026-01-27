# Architecture

**Philosophy**: Exploration-first. Get stuff working, collapse tech stack later.

---

## Site Structure

```
nhemsley.github.io/
├── docs/                    # Documentation (terse)
├── experiments/             # Exploration space
│   ├── viz-001-bubble/     # Each experiment isolated
│   ├── viz-002-network/
│   └── viz-xxx-name/
├── src/                     # Production code (once stable)
└── source.nhemsley.github.io/  # Legacy (DO NOT commit)
```

---

## Experiment Workflow

```
1. Create experiment folder: experiments/viz-xxx-name/
2. Try tech A (e.g., D3.js)
3. Hit wall? Try tech B (e.g., ECharts)
4. Got it working? Keep whatever works
5. Later: consolidate successful experiments into src/
```

**Bundle size**: Not a concern during exploration  
**Tech purity**: Not a concern during exploration  
**Goal**: Working visualizations first, optimize later

---

## Tech Stack (Flexible)

| Layer | Primary | Fallbacks |
|-------|---------|-----------|
| Framework | Svelte | Vanilla JS |
| 2D Viz | D3.js | ECharts, Vega-Lite, Chart.js |
| 3D Viz | Three.js | Babylon.js |
| Styling | CSS | Tailwind |
| Build | Vite | Rollup |

**Rule**: If D3 is too hard for a viz, use pre-packaged solution. No shame.

---

## Experiment Template

```
experiments/viz-xxx-name/
├── index.html          # Standalone demo
├── main.js             # Entry point
├── README.md           # What worked, what didn't
└── package.json        # Dependencies for this experiment
```

Each experiment is self-contained. Can use different tech than others.

---

## Production Path

```
Experiment → Works → Document learnings → Migrate to src/
                  ↓
            Doesn't work → Try different tech → Repeat
```

**When to migrate to src/**:
- Visualization works reliably
- Code is reasonably clean
- Ready to integrate into main site

---

## Data Flow

```
resume.yaml → Transform → Visualization Component → Render
     ↑
Source of truth (skills, experience, categories)
```

---

## Key Constraints

- ✅ Working code > perfect code
- ✅ Pre-packaged solutions > reinventing wheel
- ✅ Exploration > premature optimization
- ❌ Don't optimize bundle size yet
- ❌ Don't enforce single tech stack yet
- ❌ Don't commit source.nhemsley.github.io/

---

## Visualization Targets

See `visualization-strategy.md` for full list.

**Priority**:
1. Bubble Chart (Pattern 1) - Primary display
2. Progress Bars (Pattern 8) - Mobile fallback
3. Everything else - As curiosity drives

---

## File Naming

```
experiments/viz-NNN-descriptive-name/
```

Examples:
- `viz-001-d3-bubble-basic/`
- `viz-002-echarts-radar/`
- `viz-003-three-constellation/`

---

## Related Docs

- `visualization-strategy.md` - Viz patterns & stack decisions
- `visualization-quick-reference.md` - Quick lookup
- `DECISIONS.md` - Key choices made
- `site-analysis.md` - Current Jekyll site