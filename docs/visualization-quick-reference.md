# Visualization Quick Reference

## 10 Patterns

| # | Pattern | Library | Mobile | Complexity |
|---|---------|---------|--------|------------|
| 1 | **Bubble Chart** | D3.js | ✅ | Medium |
| 2 | Network Graph | D3.js | ⚠️ | High |
| 3 | Timeline | D3.js | ✅ | Medium |
| 4 | Treemap | D3/Vega | ✅ | Medium |
| 5 | Radar/Spider | ECharts | ✅ | Low |
| 6 | Heatmap | D3.js | ⚠️ | Medium |
| 7 | Constellation | D3/Three | ⚠️ | High |
| 8 | **Progress Bars** | CSS | ✅ | Low |
| 9 | 3D Force Graph | Three.js | ❌ | Very High |
| 10 | Tag Timeline | D3.js | ✅ | Medium |

## Library Selection

| Need | Use |
|------|-----|
| Full control | D3.js |
| Quick & easy | ECharts |
| 3D | Three.js |
| Less code | Vega-Lite |
| Simple bars | CSS only |

## Framework Comparison

| Lib | Mindshare | Bundle | Svelte |
|-----|-----------|--------|--------|
| D3.js | ⭐⭐⭐⭐⭐ | 40KB | ✅ |
| ECharts | ⭐⭐⭐⭐ | 40KB | ✅ |
| Three.js | ⭐⭐⭐⭐ | 145KB | ✅ |
| Vega-Lite | ⭐⭐⭐ | 20KB | ✅ |
| Layer Cake | ⭐⭐ | 5KB | ✅ |

## Color Palette

| Category | Hex |
|----------|-----|
| Frontend | #3498db |
| Backend | #e74c3c |
| DevOps | #f39c12 |
| Data | #9b59b6 |
| 3D | #e91e63 |
| Tools | #795548 |
| Cloud | #1abc9c |
| Database | #16a085 |

## Data Schema

```yaml
skills:
  - name: "React"
    category: "Frontend"
    proficiency: 8
    years: 5
```

## Svelte + D3 Pattern

```svelte
<script>
  import { onMount } from 'svelte';
  import { select } from 'd3';
  let el;
  onMount(() => {
    select(el).append('svg');
  });
</script>
<div bind:this={el}></div>
```

## Links

- D3: https://d3js.org/
- D3 Gallery: https://d3-graph-gallery.com/
- ECharts: https://echarts.apache.org/
- Three.js: https://threejs.org/