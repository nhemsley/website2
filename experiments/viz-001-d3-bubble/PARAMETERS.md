# Visualization Parameters

This document describes all configurable parameters for each movement pattern in the bubble chart visualization.

## Static
No configurable parameters - bubbles remain in settled positions with no movement.

---

## Breathing
Gentle pulsing effect using sinusoidal modulation of repulsive forces.

| Parameter | Default | Min | Max | Description |
|-----------|---------|-----|-----|-------------|
| **speed** | 2.0 | 0.5 | 5.0 | Frequency of the breathing cycle |
| **amplitude** | 0.15 | 0.05 | 0.3 | Size variation (±%) |
| **chargeBase** | -150 | -300 | -50 | Base repulsive force between bubbles |

**How it works:** The breathing effect modulates both bubble radius and repulsive charge force using a sine wave. The charge force scales with the square of the radius multiplier to maintain physics accuracy.

---

## Eased Brownian
Smooth, flowing random walk with momentum and inertia.

| Parameter | Default | Min | Max | Description |
|-----------|---------|-----|-----|-------------|
| **angleVariation** | 0.8 | 0.1 | 2.0 | How drastically direction changes per tick |
| **minSpeed** | 1.5 | 0.5 | 3.0 | Minimum movement speed |
| **maxSpeed** | 4.0 | 2.0 | 8.0 | Maximum movement speed |
| **speedVariance** | 0.5 | 0.1 | 1.0 | Random speed change amount per tick |
| **intensityMultiplier** | 1.2 | 0.5 | 3.0 | Overall movement intensity scaling |

**How it works:** Each bubble maintains an angle and speed that randomly varies each tick, creating organic flowing motion. Speed is clamped between min/max for consistency.

---

## Random Pulse
Random bubbles periodically expand and push neighbors away.

| Parameter | Default | Min | Max | Description |
|-----------|---------|-----|-----|-------------|
| **pulseInterval** | 60 | 20 | 180 | Ticks between random pulses |
| **minPulseSize** | 1.3 | 1.1 | 1.5 | Minimum bubble expansion multiplier |
| **maxPulseSize** | 1.7 | 1.5 | 2.5 | Maximum bubble expansion multiplier |
| **pulseSpeed** | 0.016 | 0.005 | 0.05 | Speed of pulse animation (phase increment) |
| **forceRadius** | 3.0 | 1.5 | 6.0 | Distance multiplier for pulse force effect |

**How it works:** Every N ticks, a random bubble is chosen to pulse. It expands using eased animation and applies outward repulsive force to nearby bubbles within the force radius.

---

## Orbiting
Bubbles circle around the center point of the canvas.

| Parameter | Default | Min | Max | Description |
|-----------|---------|-----|-----|-------------|
| **orbitSpeed** | 0.01 | 0.001 | 0.05 | Angular velocity of orbit (radians per tick) |
| **steeringStrength** | 0.05 | 0.01 | 0.2 | How quickly bubbles adjust course toward orbit path |

**How it works:** Each bubble maintains its initial distance from center and orbits at that radius. The steering strength controls how tightly bubbles follow their orbital path.

---

## Clustering
Bubbles attract toward the center of their category group.

| Parameter | Default | Min | Max | Description |
|-----------|---------|-----|-----|-------------|
| **attractionStrength** | 0.1 | 0.01 | 0.5 | Force pulling bubbles toward their cluster center |

**How it works:** For each category, the center position is calculated as the average position of all bubbles in that category. Each bubble is then attracted toward its category center.

---

## Pulse Wave
All bubbles expand and contract rhythmically from the center.

| Parameter | Default | Min | Max | Description |
|-----------|---------|-----|-----|-------------|
| **pulseFrequency** | 2.0 | 0.5 | 5.0 | Speed of pulse wave cycle |
| **contractionMin** | 0.7 | 0.5 | 0.9 | Minimum distance multiplier during contraction |
| **movementStrength** | 0.03 | 0.01 | 0.1 | Force strength for pulse movement |

**How it works:** A sinusoidal pulse phase modulates the target distance of each bubble from center, creating a synchronized expansion/contraction effect across all bubbles.

---

## Implementation Notes

- All parameters have sensible defaults that work well out of the box
- Parameters can be adjusted via the UI controls when "⚙️ Parameters" is toggled
- Parameter changes take effect immediately and can be experimented with in real-time
- "Reset to Defaults" button restores original values
- Parameters are passed from App.svelte → SkillBubbleChart.svelte → movements.js

## Adding New Parameters

To add a new parameter:

1. Add it to `MOVEMENT_PARAMS` in `src/lib/movementParams.js`
2. Use it in the movement force function in `src/lib/movements.js`
3. The UI controls will automatically generate from the parameter definition