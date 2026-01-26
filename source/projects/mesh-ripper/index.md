---
title: "mesh-ripper: 3D Mesh Visualization Tool"
type: project
slug: mesh-ripper
status: completed
startDate: 2020-03-01
endDate: 2021-12-01
technologies: [Rust, Bevy, WebGL, 3D Graphics]
featured: false
description: "High-performance mesh visualization tool for animating sequences of 3D model files"
externalLinks:
  - title: "mesh-ripper GitHub"
    url: "https://github.com/rezural/mesh-ripper"
  - title: "Bevy Engine"
    url: "https://bevyengine.org/"
---

# mesh-ripper: 3D Mesh Visualization Tool

A high-performance visualization tool written in Rust using the Bevy game engine for animating sequences of numbered STL (stereolithography) mesh files.

## Purpose

mesh-ripper was developed to visualize the output of the Salvatore fluid simulation project. Given a directory containing numbered .stl mesh files, the tool animates through them in sequence, providing real-time 3D visualization of simulation results.

## Technical Stack

- **Language**: Rust
- **Engine**: Bevy game engine (known for excellent performance)
- **Graphics**: WebGL rendering
- **Input**: Directory of numbered .stl mesh files

## Key Features

- Real-time animation of mesh sequences
- Efficient handling of large mesh files (30MB+ per frame)
- High-performance rendering using Bevy
- Intuitive mesh file traversal and playback

## Development Notes

This was my first foray into the Bevy game engine. The architecture shows the learning curve, but the tool performs quite well despite being a first attempt. The performance characteristics of Bevy made it an excellent choice for this data-intensive visualization task.

## Related Projects

- [Salvatore Fluid Simulation](../salvatore) - The simulation project that generates the mesh files visualized by mesh-ripper