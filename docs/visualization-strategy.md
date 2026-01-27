# Visualization Strategy

**Date**: 2026-01-28 | **Status**: Active

---

## Stack Decision

**Selected**: Svelte + D3.js  
**Rationale**: Your preference (Svelte) + industry standard (D3) + max flexibility

| Option | Mindshare | Flexibility | Bundle |
|--------|-----------|-------------|--------|
| **D3.js** ✓ | ⭐⭐⭐⭐⭐ | Max | 40KB |
| ECharts | ⭐⭐⭐⭐ | High | 40KB |
| Three.js (3D) | ⭐⭐⭐⭐ | Max | 145KB |
| Vega-Lite | ⭐⭐⭐ | Medium | 20KB |
| Layer Cake | ⭐⭐ | Medium | 5KB |

---

## 10 Visualization Patterns

| # | Pattern | Best For | Library | Complexity |
|---|---------|----------|---------|------------|
| 1 | **Bubble Chart** | Frequency + categories | D3.js | Medium |
| 2 | Network Graph | Relationships | D3.js | High |
| 3 | Timeline | Progression | D3.js | Medium |
| 4 | Treemap | Hierarchy | D3.js/Vega | Medium |
| 5 | Radar/Spider | Profile overview | ECharts | Low |
| 6 | Heatmap | Multi-dimensional | D3.js | Medium |
| 7 | Constellation | Artistic showcase | D3/Three | High |
| 8 | **Progress Bars** | Simple listing | CSS | Low |
| 9 | 3D Force Graph | Immersive | Three.js | Very High |
| 10 | Tag Timeline | Career narrative | D3.js | Medium |

**Primary**: Pattern 1 (Bubble Chart) - high impact, interactive  
**Secondary**: Pattern 8 (Progress Bars) - mobile fallback  
**Showcase**: Pattern 7 (Constellation) - differentiator

---

## Data Schema

```yaml
skills:
  - name: "React"
    category: "Frontend"    # For color coding
    proficiency: 8          # 1-10 scale
    years: 5               # Experience
    projects: 12           # Usage count
```

**Categories**: Frontend, Backend, DevOps, Data, 3D, Tools, Cloud, Database

---

## Color Palette

| Category | Color | Hex |
|----------|-------|-----|
| Frontend | Blue | #3498db |
| Backend | Red | #e74c3c |
| DevOps | Orange | #f39c12 |
| Data | Purple | #9b59b6 |
| 3D/Graphics | Pink | #e91e63 |
| Tools | Brown | #795548 |
| Cloud | Teal | #1abc9c |
| Database | Green | #16a085 |

---

## Implementation Phases

```
Week 1: Foundation → Svelte + D3 project, data pipeline
Week 2: Primary → Bubble Chart (Pattern 1)
Week 3-4: Polish → Progress Bars, accessibility, mobile
Week 5+: Advanced → Network graph, 3D (optional)
```

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Initial Load | < 2s |
| Bundle Size | < 150KB |
| Lighthouse | 90+ |
| WCAG | AA compliance |

---

## Key Files

```
src/components/
├── SkillBubbleChart.svelte    # Primary
├── SkillBars.svelte           # Mobile fallback
├── SkillTimeline.svelte       # Optional
└── VisualizationSelector.svelte
```

---

## References

- D3.js: https://d3js.org/
- D3 Gallery: https://d3-graph-gallery.com/
- Svelte: https://svelte.dev/
- Three.js: https://threejs.org/