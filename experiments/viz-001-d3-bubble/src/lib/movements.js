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
  easedBrownian: {
    label: "Eased Brownian",
    desc: "Smooth flowing random walk with momentum",
  },
  randomPulse: {
    label: "Random Pulse",
    desc: "Random bubbles pulse outward, pushing neighbors",
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
      return (alpha) => {
        // No additional force
      };

    case "breathing":
      return (alpha) => {
        // Modulate charge force via sine wave for breathing effect
        // This will be applied to the simulation's charge force instead
      };

    case "easedBrownian": {
      let nodes;
      function force(alpha) {
        // Smoothed random walk with momentum
        for (let node of nodes) {
          if (!node.brownianAngle) {
            node.brownianAngle = Math.random() * Math.PI * 2;
            node.brownianSpeed = 2;
          }
          // Change angle more dramatically for more movement
          node.brownianAngle += (Math.random() - 0.5) * 0.8;
          node.brownianSpeed = Math.max(
            1.5,
            Math.min(4.0, node.brownianSpeed + (Math.random() - 0.5) * 0.5),
          );

          const speed = node.brownianSpeed * alpha;
          node.vx += Math.cos(node.brownianAngle) * speed * 1.2;
          node.vy += Math.sin(node.brownianAngle) * speed * 1.2;
        }
      }
      force.initialize = function (_nodes) {
        nodes = _nodes;
      };
      return force;
    }

    case "randomPulse": {
      let nodes;
      function force(alpha) {
        // Every ~60 ticks, pulse a random node
        if (!window.__pulseCounter) {
          window.__pulseCounter = 0;
        }
        window.__pulseCounter++;

        if (window.__pulseCounter > 60) {
          const randomNode = nodes[Math.floor(Math.random() * nodes.length)];

          // Set pulse properties
          if (!randomNode.isPulsing) {
            randomNode.isPulsing = true;
            randomNode.pulsePhase = 0;
            randomNode.pulseTarget = 1.3 + Math.random() * 0.4; // 1.3x to 1.7x size
          }

          window.__pulseCounter = 0;
        }

        // Animate all pulsing nodes
        for (let node of nodes) {
          if (node.isPulsing) {
            node.pulsePhase += 0.016; // Speed of pulse (slowed 5x)

            if (node.pulsePhase >= 1) {
              // Pulse complete
              node.isPulsing = false;
              node.pulseScale = 1;
            } else {
              // Ease out: grows fast, returns slow
              const t = node.pulsePhase;
              const easeOut =
                t < 0.5
                  ? 1 + (node.pulseTarget - 1) * (1 - Math.cos(t * Math.PI))
                  : node.pulseTarget -
                    (node.pulseTarget - 1) * Math.sin((t - 0.5) * Math.PI);

              node.pulseScale = easeOut;

              // Add outward repulsive force while pulsing
              const pulseForce = (node.pulseScale - 1) * 2;
              for (let other of nodes) {
                if (other !== node) {
                  const dx = other.x - node.x;
                  const dy = other.y - node.y;
                  const dist = Math.hypot(dx, dy);
                  if (dist < (node.radius + other.radius) * 3) {
                    // Push nearby nodes away
                    other.vx += (dx / dist) * pulseForce;
                    other.vy += (dy / dist) * pulseForce;
                  }
                }
              }
            }
          } else {
            node.pulseScale = 1;
          }
        }
      }
      force.initialize = function (_nodes) {
        nodes = _nodes;
      };
      return force;
    }

    case "orbiting": {
      let nodes;
      function force(alpha) {
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
      }
      force.initialize = function (_nodes) {
        nodes = _nodes;
      };
      return force;
    }

    case "clustering": {
      let nodes;
      function force(alpha) {
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
      }
      force.initialize = function (_nodes) {
        nodes = _nodes;
      };
      return force;
    }

    case "pulse": {
      let nodes;
      function force(alpha) {
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
      }
      force.initialize = function (_nodes) {
        nodes = _nodes;
      };
      return force;
    }

    default:
      return (alpha) => {};
  }
}

/**
 * Get charge strength for breathing movement
 * @param {number} time - Current animation time
 * @returns {number} Charge force multiplier
 */
export function getBreathingChargeStrength(time) {
  // Scale with breathing phase: radius varies ±15%, so force should scale accordingly
  // Breathing phase oscillates between 0.85 and 1.15
  const breathingPhase = 1 + Math.sin(time * 2) * 0.15;
  // Base charge of -150, scaled by breathing phase squared (force ~ radius²)
  return -150 * breathingPhase * breathingPhase;
}

/**
 * Get breathing radius multiplier
 * @param {number} time - Current animation time
 * @returns {number} Radius multiplier (0.85 to 1.15)
 */
export function getBreathingRadiusMultiplier(time) {
  // Oscillate between 0.85 and 1.15 (±15%)
  return 1 + Math.sin(time * 2) * 0.15;
}

/**
 * Get collide padding for breathing effect
 * @param {number} time - Current animation time
 * @returns {number} Padding amount
 */
export function getBreathingCollideStrength(time) {
  // Keep collision enforcement strong and constant
  return 1.0;
}
