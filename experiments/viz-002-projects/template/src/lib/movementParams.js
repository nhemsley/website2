/**
 * Configurable parameters for each movement type
 * These can be exposed as controls or tuned for different effects
 */

export const MOVEMENT_PARAMS = {
  static: {
    // No parameters - static has no movement
  },

  breathing: {
    speed: {
      label: "Breathing Speed",
      default: 2.0,
      min: 0.5,
      max: 5.0,
      step: 0.1,
      desc: "Frequency of the breathing cycle",
    },
    amplitude: {
      label: "Breathing Amplitude",
      default: 0.15,
      min: 0.05,
      max: 0.3,
      step: 0.01,
      desc: "Size variation (±%)",
    },
    chargeBase: {
      label: "Charge Strength",
      default: -150,
      min: -300,
      max: -50,
      step: 10,
      desc: "Base repulsive force",
    },
  },

  breathingOrbit: {
    speed: {
      label: "Breathing Speed",
      default: 2.0,
      min: 0.5,
      max: 5.0,
      step: 0.1,
      desc: "Frequency of the breathing cycle",
    },
    amplitude: {
      label: "Breathing Amplitude",
      default: 0.15,
      min: 0.05,
      max: 0.3,
      step: 0.01,
      desc: "Size variation (±%)",
    },
    chargeBase: {
      label: "Charge Strength",
      default: -150,
      min: -300,
      max: -50,
      step: 10,
      desc: "Base repulsive force",
    },
    orbitSpeed: {
      label: "Orbit Speed",
      default: 0.01,
      min: 0.001,
      max: 0.05,
      step: 0.001,
      desc: "Angular velocity of orbit",
    },
    steeringStrength: {
      label: "Steering Strength",
      default: 0.05,
      min: 0.01,
      max: 0.2,
      step: 0.01,
      desc: "How quickly bubbles adjust course",
    },
  },

  easedBrownian: {
    angleVariation: {
      label: "Direction Change",
      default: 0.8,
      min: 0.1,
      max: 2.0,
      step: 0.1,
      desc: "How drastically direction changes",
    },
    minSpeed: {
      label: "Min Speed",
      default: 1.5,
      min: 0.5,
      max: 3.0,
      step: 0.1,
      desc: "Minimum movement speed",
    },
    maxSpeed: {
      label: "Max Speed",
      default: 4.0,
      min: 2.0,
      max: 8.0,
      step: 0.1,
      desc: "Maximum movement speed",
    },
    speedVariance: {
      label: "Speed Variance",
      default: 0.5,
      min: 0.1,
      max: 1.0,
      step: 0.05,
      desc: "Random speed change amount",
    },
    intensityMultiplier: {
      label: "Intensity",
      default: 1.2,
      min: 0.5,
      max: 3.0,
      step: 0.1,
      desc: "Overall movement intensity",
    },
  },

  randomPulse: {
    pulseInterval: {
      label: "Pulse Interval",
      default: 60,
      min: 20,
      max: 180,
      step: 10,
      desc: "Ticks between random pulses",
    },
    minPulseSize: {
      label: "Min Pulse Size",
      default: 1.3,
      min: 1.1,
      max: 1.5,
      step: 0.05,
      desc: "Minimum bubble expansion",
    },
    maxPulseSize: {
      label: "Max Pulse Size",
      default: 1.7,
      min: 1.5,
      max: 2.5,
      step: 0.1,
      desc: "Maximum bubble expansion",
    },
    pulseSpeed: {
      label: "Pulse Speed",
      default: 0.016,
      min: 0.005,
      max: 0.05,
      step: 0.001,
      desc: "Speed of pulse animation",
    },
    forceRadius: {
      label: "Force Radius",
      default: 3.0,
      min: 1.5,
      max: 6.0,
      step: 0.5,
      desc: "Distance pulse affects neighbors",
    },
  },

  orbiting: {
    orbitSpeed: {
      label: "Orbit Speed",
      default: 0.01,
      min: 0.001,
      max: 0.05,
      step: 0.001,
      desc: "Angular velocity of orbit",
    },
    steeringStrength: {
      label: "Steering Strength",
      default: 0.05,
      min: 0.01,
      max: 0.2,
      step: 0.01,
      desc: "How quickly bubbles adjust course",
    },
  },

  clustering: {
    attractionStrength: {
      label: "Attraction Strength",
      default: 0.3,
      min: 0.01,
      max: 1.0,
      step: 0.05,
      desc: "Force pulling toward cluster center",
    },
  },

  pulse: {
    pulseFrequency: {
      label: "Pulse Frequency",
      default: 1.5,
      min: 0.5,
      max: 5.0,
      step: 0.1,
      desc: "Speed of pulse wave cycle",
    },
    contractionMin: {
      label: "Minimum Contraction",
      default: 0.6,
      min: 0.3,
      max: 0.9,
      step: 0.05,
      desc: "Minimum distance multiplier",
    },
    movementStrength: {
      label: "Movement Strength",
      default: 0.08,
      min: 0.01,
      max: 0.3,
      step: 0.01,
      desc: "Force strength for pulse movement",
    },
  },
};

/**
 * Get default parameter values for a movement type
 * @param {string} movementType - The movement type key
 * @returns {Object} Object with parameter names as keys and default values
 */
export function getDefaultParams(movementType) {
  const params = MOVEMENT_PARAMS[movementType] || {};
  const defaults = {};

  for (const [key, config] of Object.entries(params)) {
    defaults[key] = config.default;
  }

  return defaults;
}

/**
 * Get all parameter definitions for a movement type
 * @param {string} movementType - The movement type key
 * @returns {Object} Parameter definitions with metadata
 */
export function getParamDefinitions(movementType) {
  return MOVEMENT_PARAMS[movementType] || {};
}
