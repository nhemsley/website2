# Bubble Chart Visualization Experiment

D3.js + Svelte interactive skill bubble chart with dynamic movement behaviors.

## Overview

This experiment creates an interactive force-directed bubble chart for visualizing skills with:
- **Color coding** by skill category (Frontend, Backend, DevOps, etc.)
- **Size scaling** by proficiency level (1-10)
- **Interactive tooltips** showing details on hover
- **Category filtering** with active selection
- **8 different movement styles** for dynamic animation

## Movement Styles

### 1. Static
No movement, settled positions. Bubbles reach equilibrium and hold steady.

### 2. Breathing
Gentle pulsing effect where repulsion force oscillates via sine wave. Creates a rhythm of expansion and contraction. Bubble radii also scale slightly for visual effect.

```javascript
charge strength oscillates: -40 ± 20
collide strength oscillates: 0.8 ± 0.1
```

### 3. Brownian Motion
Pure random walk. Each frame, every bubble gets a random velocity bump. Creates continuous jittery, chaotic movement.

### 4. Eased Brownian
Smoothed random walk with momentum and angle inertia. Less jittery than pure Brownian, more natural flowing movement with gradual direction changes.

### 5. Random Bump
Pick a random bubble every 30 ticks and apply a sudden force bump in a random direction. Creates punctuated, sporadic activity while maintaining general stability.

### 6. Orbiting
Bubbles orbit around the center point. Each bubble maintains its orbit radius and gradually advances around the center, creating circular motion patterns.

### 7. Clustering
Bubbles attract toward their category centers, forming spatial groups by skill category. Creates natural visual organization while maintaining interactive drag behavior.

### 8. Pulse Wave
Rhythmic expand/contract from center. All bubbles pulse outward and inward in sync, creating a wave-like breathing pattern across the entire visualization.

## Features

### Interactive Elements
- **Drag bubbles** to reposition (forces restart with reduced intensity)
- **Category filters** to show only skills in one category
- **Hover tooltips** displaying skill name, category, proficiency, and project count
- **Movement selector** to switch between animation styles in real-time

### Responsive Design
- Scales to container dimensions
- Auto-recalculates on window resize
- SVG viewBox for proper scaling across devices

### Performance
- D3 force simulation with tuned parameters
- requestAnimationFrame for smooth animation
- Efficient tick updates via D3 selections

## Tech Stack

- **D3.js** - Force simulation, selections, transitions
- **Svelte** - Component framework, reactivity
- **Vite** - Build tool and dev server

## Data Structure

```javascript
{
  name: "React",           // Skill name
  category: "Frontend",    // Category for color coding
  proficiency: 8,          // 1-10 scale
  projects: 12             // Project count
}
```

### Color Palette by Category
| Category | Color |
|----------|-------|
| Frontend | #3498db (Blue) |
| Backend | #e74c3c (Red) |
| DevOps | #f39c12 (Orange) |
| Data | #9b59b6 (Purple) |
| 3D | #e91e63 (Pink) |
| Tools | #795548 (Brown) |
| Cloud | #1abc9c (Teal) |
| Database | #16a085 (Green) |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## Files

- `src/App.svelte` - Main component with movement selector
- `src/lib/SkillBubbleChart.svelte` - Bubble chart visualization component
- `src/lib/movements.js` - Movement type definitions and force factories
- `src/main.js` - Entry point
- `index.html` - HTML container

## Key Implementation Details

### Force Simulation
```javascript
simulation
  .force("x", d3.forceX(centerX).strength(0.05))      // Gentle centering
  .force("y", d3.forceY(centerY).strength(0.05))      // Gentle centering
  .force("collide", d3.forceCollide(radius + 8))      // Padding between bubbles
  .force("charge", d3.forceManyBody().strength(-60))  // Repulsion
  .force("movement", movementForce)                   // Dynamic behavior
```

### Animation Loop
```javascript
// Request animation frame drives the movement updates
animationTime += 0.01
bubbles update positions and radii based on movement type
simulation ticks and updates forces
```

### Movement Force Pattern
Each movement type returns a force function:
```javascript
function movementForce(alpha) {
  return (nodes) => {
    // Apply forces to nodes based on movement logic
    for (let node of nodes) {
      node.vx += velocityX;
      node.vy += velocityY;
    }
  };
}
```

## Next Steps

- [ ] Stub implementations for other visualization types (bar chart, radar, network, etc.)
- [ ] Load real skill data from `source/metadata/skills.yaml`
- [ ] Add animation speed control slider
- [ ] Implement movement combination/blending
- [ ] Add export/screenshot capability
- [ ] Optimize for mobile (touch support, responsive movement)
- [ ] Add sound/audio visualization integration

## Observations & Learnings

**What worked:**
- Force simulation is stable and responsive to movement changes
- Sine wave modulation creates smooth, natural breathing effect
- Random walk feels organic when eased
- Category clustering provides good visual feedback

**What could improve:**
- Brownian motion can feel too chaotic, needs damping
- Orbiting can sometimes escape bounds
- Bump frequency timing could be more rhythmic
- Consider adding Voronoi visualization for clustering mode