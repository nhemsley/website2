/**
 * Movement behavior definitions for bubble chart
 * Each movement type returns a force function for d3 simulation
 */

export const MOVEMENT_TYPES = {
  static: {
    label: "Static",
    desc: "No movement, settled positions",
  },
  breathing: {
    label: "Breathing",
    desc: "Gentle pulsing - repulsion force via sin wave",
  },
  brownian: {
    label: "Brownian Motion",
    desc: "Random walk, continuous jittery movement",
  },
  easedBrownian: {
    label: "Eased Brownian",
    desc: "Smoothed random walk, less jittery",
  },
  randomBump: {
    label: "Random Bump",
    desc: "Pick a bubble, apply periodic force bump",
  },
  orbiting: {
    label: "Orbiting",
    desc: "Bubbles orbit around center point",
  },
  clustering: {
    label: "Clustering",
    desc: "Attract by category, form groups",
  },
  pulse: {
    label: "Pulse Wave",
    desc: "Expand/contract from center rhythmically",
  },
};

/**
 * Create a movement force for the simulation
 * @param {string} type - Movement type key
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} time - Current animation time
 * @returns {Function} Force function for d3 simulation
 */
export function createMovementForce(type, width, height, time) {
  const centerX = width / 2;
  const centerY = height / 2;

  switch (type) {
    case "static":
      return () => {
        // No additional force
      };

    case "breathing":
      return (alpha) => {
        // Modulate charge force via sine wave for breathing effect
        // This will be applied to the simulation's charge force instead
      };

    case "brownian":
      return (alpha) => {
        // Pure random walk
        return (nodes) => {
          for (let node of nodes) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2;
            node.vx += Math.cos(angle) * speed;
            node.vy += Math.sin(angle) * speed;
          }
        };
      };

    case "easedBrownian":
      return (alpha) => {
        // Smoothed random walk with momentum
        return (nodes) => {
          for (let node of nodes) {
            if (!node.brownianAngle) {
              node.brownianAngle = Math.random() * Math.PI * 2;
              node.brownianSpeed = 0;
            }
            // Slowly change angle
            node.brownianAngle += (Math.random() - 0.5) * 0.3;
            node.brownianSpeed = Math.max(
              0.5,
              Math.min(1.5, node.brownianSpeed + (Math.random() - 0.5) * 0.2),
            );

            const speed = node.brownianSpeed * alpha;
            node.vx += Math.cos(node.brownianAngle) * speed * 0.5;
            node.vy += Math.sin(node.brownianAngle) * speed * 0.5;
          }
        };
      };

    case "randomBump":
      return (alpha) => {
        return (nodes) => {
          // Every ~30 ticks, bump a random node
          if (!window.__bumpCounter) {
            window.__bumpCounter = 0;
          }
          window.__bumpCounter++;

          if (window.__bumpCounter > 30) {
            const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
            const angle = Math.random() * Math.PI * 2;
            const bumpStrength = 3;
            randomNode.vx += Math.cos(angle) * bumpStrength;
            randomNode.vy += Math.sin(angle) * bumpStrength;
            window.__bumpCounter = 0;
          }
        };
      };

    case "orbiting":
      return (alpha) => {
        return (nodes) => {
          for (let node of nodes) {
            if (!node.orbitRadius) {
              node.orbitRadius = Math.hypot(node.x - centerX, node.y - centerY);
              node.orbitAngle = Math.atan2(node.y - centerY, node.x - centerX);
            }

            // Advance orbit angle
            node.orbitAngle += 0.01 * alpha;
            const targetX =
              centerX + Math.cos(node.orbitAngle) * node.orbitRadius;
            const targetY =
              centerY + Math.sin(node.orbitAngle) * node.orbitRadius;

            // Steer toward orbit position
            node.vx += (targetX - node.x) * 0.05;
            node.vy += (targetY - node.y) * 0.05;
          }
        };
      };

    case "clustering":
      return (alpha) => {
        return (nodes) => {
          // Cluster by category
          const categoryPositions = {};

          for (let node of nodes) {
            if (!categoryPositions[node.category]) {
              categoryPositions[node.category] = { x: 0, y: 0, count: 0 };
            }
            categoryPositions[node.category].x += node.x;
            categoryPositions[node.category].y += node.y;
            categoryPositions[node.category].count++;
          }

          // Average positions
          for (let cat in categoryPositions) {
            const pos = categoryPositions[cat];
            pos.x /= pos.count;
            pos.y /= pos.count;
          }

          // Attract nodes to their category center
          for (let node of nodes) {
            const catCenter = categoryPositions[node.category];
            const dx = catCenter.x - node.x;
            const dy = catCenter.y - node.y;
            const distance = Math.hypot(dx, dy);
            if (distance > 1) {
              node.vx += (dx / distance) * 0.1 * alpha;
              node.vy += (dy / distance) * 0.1 * alpha;
            }
          }
        };
      };

    case "pulse":
      return (alpha) => {
        return (nodes) => {
          const pulsePhase = Math.sin(time * 2) * 0.5 + 0.5; // 0 to 1
          for (let node of nodes) {
            const distance = Math.hypot(node.x - centerX, node.y - centerY);
            const angle = Math.atan2(node.y - centerY, node.x - centerX);

            // Contract and expand
            const targetDistance = distance * (0.7 + pulsePhase * 0.3);
            const targetX = centerX + Math.cos(angle) * targetDistance;
            const targetY = centerY + Math.sin(angle) * targetDistance;

            node.vx += (targetX - node.x) * 0.03 * alpha;
            node.vy += (targetY - node.y) * 0.03 * alpha;
          }
        };
      };

    default:
      return () => {};
  }
}

/**
 * Get charge strength for breathing movement
 * @param {number} time - Current animation time
 * @returns {number} Charge force multiplier
 */
export function getBreathingChargeStrength(time) {
  // Oscillate between -60 and -20 (repulsion increases/decreases)
  return -40 + Math.sin(time * 1.5) * -20;
}

/**
 * Get collide padding for breathing effect
 * @param {number} time - Current animation time
 * @returns {number} Padding amount
 */
export function getBreathingCollideStrength(time) {
  // Oscillate between 0.7 and 1.0
  return 0.8 + Math.sin(time * 1.5) * 0.1;
}
