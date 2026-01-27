<script>
    import { onMount, onDestroy } from "svelte";
    import * as d3 from "d3";
    import {
        MOVEMENT_TYPES,
        createMovementForce,
        getBreathingChargeStrength,
        getBreathingCollideStrength,
        getBreathingRadiusMultiplier,
        getGravityVelocityDecay,
        getNodeSpeed,
    } from "./movements.js";
    import { logger } from "./logger.js";

    // Map skill names to Simple Icons slugs
    const iconSlugs = {
        Rust: "rust",
        JavaScript: "javascript",
        TypeScript: "typescript",
        React: "react",
        Svelte: "svelte",
        Vue: "vuedotjs",
        Ruby: "ruby",
        Python: "python",
        PostgreSQL: "postgresql",
        Docker: "docker",
        Kubernetes: "kubernetes",
        Terraform: "terraform",
        "D3.js": "d3",
        "Three.js": "threedotjs",
        Bevy: "rust",
        "Node.js": "nodedotjs",
        Rails: "rubyonrails",
        Git: "git",
        Linux: "linux",
    };

    // Sample skill data - will be props later
    export let skills = [
        { name: "Rust", category: "Backend", proficiency: 8, projects: 4 },
        {
            name: "JavaScript",
            category: "Frontend",
            proficiency: 9,
            projects: 25,
        },
        {
            name: "TypeScript",
            category: "Frontend",
            proficiency: 8,
            projects: 15,
        },
        { name: "React", category: "Frontend", proficiency: 8, projects: 12 },
        { name: "Svelte", category: "Frontend", proficiency: 7, projects: 3 },
        { name: "Vue", category: "Frontend", proficiency: 7, projects: 8 },
        { name: "Ruby", category: "Backend", proficiency: 8, projects: 18 },
        { name: "Python", category: "Backend", proficiency: 6, projects: 5 },
        {
            name: "PostgreSQL",
            category: "Database",
            proficiency: 8,
            projects: 15,
        },
        { name: "AWS", category: "Cloud", proficiency: 7, projects: 10 },
        { name: "Amazon EC2", category: "Cloud", proficiency: 7, projects: 8 },
        { name: "Amazon S3", category: "Cloud", proficiency: 7, projects: 8 },
        { name: "Docker", category: "DevOps", proficiency: 8, projects: 12 },
        { name: "Kubernetes", category: "DevOps", proficiency: 6, projects: 4 },
        { name: "Terraform", category: "DevOps", proficiency: 5, projects: 3 },
        { name: "D3.js", category: "Frontend", proficiency: 6, projects: 2 },
        { name: "Three.js", category: "3D", proficiency: 5, projects: 2 },
        { name: "Bevy", category: "3D", proficiency: 6, projects: 2 },
        { name: "Node.js", category: "Backend", proficiency: 7, projects: 10 },
        { name: "Rails", category: "Backend", proficiency: 7, projects: 8 },
        { name: "Git", category: "Tools", proficiency: 9, projects: 30 },
        { name: "Linux", category: "Tools", proficiency: 8, projects: 20 },
    ];

    // Color palette by category
    const categoryColors = {
        Frontend: "#3498db",
        Backend: "#e74c3c",
        DevOps: "#f39c12",
        Data: "#9b59b6",
        "3D": "#e91e63",
        Tools: "#795548",
        Cloud: "#1abc9c",
        Database: "#16a085",
    };

    let container;
    let width = 800;
    let height = 600;
    let simulation;
    let tooltip;
    let animationTime = 0;
    let animationFrameId;

    // Mouse pause state machine
    const MouseState = {
        ACTIVE: "active", // Normal animation speed
        SLOWING: "slowing", // Mouse moving, increasing friction
        PAUSED: "paused", // Mouse stopped, high friction, waiting
        RESUMING: "resuming", // Gradually returning to normal
    };
    let mouseState = MouseState.ACTIVE;
    let mouseMoveTimeout;
    let pauseResumeInterval;

    // Movement type control
    export let movementType = "breathing";
    export let movementParams = {};

    // Configurable pause duration (seconds)
    export let mousePauseDuration = 4.0;

    // Reactive: filter by category
    export let selectedCategory = null;

    $: filteredSkills = selectedCategory
        ? skills.filter((s) => s.category === selectedCategory)
        : skills;

    $: categories = [...new Set(skills.map((s) => s.category))];

    function getColor(category) {
        return categoryColors[category] || "#999";
    }

    function getRadius(skill) {
        // Scale radius based on proficiency (min 20, max 60)
        return 15 + skill.proficiency * 5;
    }

    function getIconSlug(skillName) {
        return iconSlugs[skillName] || null;
    }

    function hasIcon(skillName) {
        return iconSlugs[skillName] !== undefined;
    }

    onMount(() => {
        createChart();
        window.addEventListener("resize", handleResize);
        startBreathingAnimation();
        setupMouseTracking();
    });

    onDestroy(() => {
        if (simulation) simulation.stop();
        window.removeEventListener("resize", handleResize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
        if (pauseResumeInterval) clearInterval(pauseResumeInterval);
        if (container) {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
        }
    });

    function startBreathingAnimation() {
        const animate = () => {
            animationTime += 0.01;

            // Apply state machine logic each frame
            applyMousePauseState();

            animationFrameId = requestAnimationFrame(animate);
        };
        animate();
    }

    function setupMouseTracking() {
        if (!container) return;

        logger.info("Setting up mouse tracking on container");
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);
    }

    function getNormalVelocityDecay() {
        // Get the normal velocity decay for current movement type
        if (movementType === "gravity") {
            return getGravityVelocityDecay(movementParams);
        } else if (movementType === "pulse") {
            return 0.5;
        } else {
            return 0.4;
        }
    }

    function applyMousePauseState() {
        if (!simulation) return;

        const normalDecay = getNormalVelocityDecay();
        const pausedDecay = 0.85; // High friction when paused
        const currentDecay = simulation.velocityDecay();

        switch (mouseState) {
            case MouseState.ACTIVE:
                // Normal operation - ensure decay is correct
                if (Math.abs(currentDecay - normalDecay) > 0.01) {
                    logger.debug("ACTIVE: Setting decay to", { normalDecay });
                    simulation.velocityDecay(normalDecay);
                }
                break;

            case MouseState.SLOWING:
                // Mouse is moving - gradually increase friction
                const targetDecay = pausedDecay;
                const slowingSpeed = 0.05; // How fast to apply friction
                const newDecay =
                    currentDecay + (targetDecay - currentDecay) * slowingSpeed;
                const clampedDecay = Math.min(newDecay, pausedDecay);
                logger.debug(
                    `SLOWING: decay ${currentDecay.toFixed(3)} → ${clampedDecay.toFixed(3)}`,
                );
                simulation.velocityDecay(clampedDecay);
                break;

            case MouseState.PAUSED:
                // Hold at high friction
                if (Math.abs(currentDecay - pausedDecay) > 0.01) {
                    logger.debug("PAUSED: Setting decay to", { pausedDecay });
                    simulation.velocityDecay(pausedDecay);
                }
                break;

            case MouseState.RESUMING:
                // Gradually decrease friction back to normal
                const resumeSpeed = 0.02; // Slower resume for smooth transition
                const resumeDecay =
                    currentDecay + (normalDecay - currentDecay) * resumeSpeed;
                logger.debug(
                    `RESUMING: decay ${currentDecay.toFixed(3)} → ${resumeDecay.toFixed(3)} target ${normalDecay.toFixed(3)}`,
                );
                simulation.velocityDecay(resumeDecay);

                // Check if we're close enough to normal to switch to ACTIVE
                if (Math.abs(resumeDecay - normalDecay) < 0.01) {
                    logger.info("RESUMING complete - back to ACTIVE");
                    mouseState = MouseState.ACTIVE;
                    simulation.velocityDecay(normalDecay);
                }
                break;
        }
    }

    function handleMouseMove() {
        logger.debug("Mouse move detected", { currentState: mouseState });
        // Transition to SLOWING state
        if (
            mouseState === MouseState.ACTIVE ||
            mouseState === MouseState.RESUMING
        ) {
            logger.info("Transitioning to SLOWING");
            mouseState = MouseState.SLOWING;
        }

        // Reset timeout - will transition to PAUSED when mouse stops
        if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);

        // After 200ms of no movement, transition to PAUSED
        mouseMoveTimeout = setTimeout(() => {
            logger.info("Mouse stopped - transitioning to PAUSED");
            mouseState = MouseState.PAUSED;

            // After pause duration, transition to RESUMING
            setTimeout(() => {
                if (mouseState === MouseState.PAUSED) {
                    logger.info(
                        "Pause duration complete - transitioning to RESUMING",
                    );
                    mouseState = MouseState.RESUMING;
                    if (simulation) {
                        simulation.alpha(0.3).restart();
                    }
                }
            }, mousePauseDuration * 1000);
        }, 200);
    }

    function handleMouseLeave() {
        // Clear any timeouts
        if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);

        // Immediately resume
        mouseState = MouseState.RESUMING;
        if (simulation) {
            simulation.alpha(0.3).restart();
        }
    }

    function handleResize() {
        if (container) {
            width = container.clientWidth;
            height = Math.max(400, container.clientHeight);
            createChart();
        }
    }

    function createChart() {
        if (!container) return;

        // Clear previous
        d3.select(container).selectAll("*").remove();

        width = container.clientWidth || 800;
        height = Math.max(400, container.clientHeight || 600);

        const svg = d3
            .select(container)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        // Tooltip
        tooltip = d3
            .select(container)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Prepare nodes with initial positions
        const nodes = filteredSkills.map((skill, i) => ({
            ...skill,
            radius: getRadius(skill),
            x: width / 2 + (Math.random() - 0.5) * 100,
            y: height / 2 + (Math.random() - 0.5) * 100,
        }));

        // Create simulation with movement-based forces
        simulation = d3
            .forceSimulation(nodes)
            .force("x", d3.forceX(width / 2).strength(0.05))
            .force("y", d3.forceY(height / 2).strength(0.05));

        // Apply velocity decay and centering forces based on movement type
        if (movementType === "gravity") {
            const velocityDecay = getGravityVelocityDecay(movementParams);
            simulation.velocityDecay(velocityDecay);
            // For gravity mode, weaken centering forces to let gravity dominate
            simulation.force(
                "x",
                d3
                    .forceX(width / 2)
                    .strength(movementParams.springStrength || 0.03),
            );
            simulation.force("y", null); // Remove y centering, gravity handles it
        } else if (movementType === "clustering") {
            // Very weak centering for clustering - let categories organize naturally
            simulation.velocityDecay(0.4);
            simulation.force("x", d3.forceX(width / 2).strength(0.01));
            simulation.force("y", d3.forceY(height / 2).strength(0.01));
        } else if (movementType === "pulse") {
            // Weak centering for pulse - let the radial movement dominate
            simulation.velocityDecay(0.5);
            simulation.force("x", d3.forceX(width / 2).strength(0.02));
            simulation.force("y", d3.forceY(height / 2).strength(0.02));
        }

        // Apply charge force based on movement type
        if (movementType === "gravity") {
            // Weaker charge for gravity mode - let physics handle spacing
            simulation.force("charge", d3.forceManyBody().strength(-80));
        } else if (
            movementType === "breathing" ||
            movementType === "breathingOrbit"
        ) {
            const chargeStrength = getBreathingChargeStrength(
                animationTime,
                movementParams,
            );
            simulation.force(
                "charge",
                d3.forceManyBody().strength(chargeStrength),
            );
        } else {
            simulation.force("charge", d3.forceManyBody().strength(-150));
        }

        // Collide force with breathing effect if enabled
        if (movementType === "breathing" || movementType === "breathingOrbit") {
            const breathingMultiplier = getBreathingRadiusMultiplier(
                animationTime,
                movementParams,
            );
            const collideStrength = getBreathingCollideStrength(animationTime);
            simulation.force(
                "collide",
                d3
                    .forceCollide((d) => (d.radius + 20) * breathingMultiplier)
                    .strength(collideStrength),
            );
        } else if (movementType === "randomPulse") {
            simulation.force(
                "collide",
                d3
                    .forceCollide((d) => (d.radius + 20) * (d.pulseScale || 1))
                    .strength(1.0),
            );
        } else if (movementType === "clustering" || movementType === "pulse") {
            // Standard collide for clustering and pulse modes
            simulation.force(
                "collide",
                d3.forceCollide((d) => d.radius + 20).strength(1.0),
            );
        } else {
            simulation.force(
                "collide",
                d3.forceCollide((d) => d.radius + 20).strength(1.0),
            );
        }

        // Apply movement-specific force
        const movementForce = createMovementForce(
            movementType,
            width,
            height,
            animationTime,
            movementParams,
        );
        simulation.force("movement", movementForce);

        simulation.on("tick", ticked);

        // Create velocity trails group (rendered behind bubbles)
        const trailsGroup = svg.append("g").attr("class", "velocity-trails");

        // Create bubble groups
        const bubbles = svg
            .selectAll(".bubble")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "bubble")
            .call(drag(simulation));

        // Add velocity trail lines for gravity mode
        if (
            movementType === "gravity" &&
            movementParams.showVelocity !== false
        ) {
            trailsGroup
                .selectAll(".velocity-trail")
                .data(nodes)
                .enter()
                .append("line")
                .attr("class", "velocity-trail")
                .attr("stroke", (d) => getColor(d.category))
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 2)
                .attr("stroke-linecap", "round");
        }

        // Add circles
        bubbles
            .append("circle")
            .attr("r", (d) => d.radius)
            .attr("fill", (d) => getColor(d.category))
            .attr("fill-opacity", 0.8)
            .attr("stroke", (d) => d3.color(getColor(d.category)).darker(0.5))
            .attr("stroke-width", 2)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

        // Add SVG icons from Simple Icons for skills with icons
        bubbles
            .filter((d) => hasIcon(d.name))
            .append("image")
            .attr(
                "xlink:href",
                (d) =>
                    `https://cdn.simpleicons.org/${getIconSlug(d.name)}/white`,
            )
            .attr("width", (d) => Math.min(d.radius * 1.2, 48))
            .attr("height", (d) => Math.min(d.radius * 1.2, 48))
            .attr("x", (d) => -Math.min(d.radius * 0.6, 24))
            .attr("y", (d) => -Math.min(d.radius * 0.6, 24))
            .attr("pointer-events", "none")
            .attr("opacity", 0.9);

        // Add text labels for skills without icons
        bubbles
            .filter((d) => !hasIcon(d.name))
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("font-size", (d) => Math.max(10, d.radius / 3))
            .attr("fill", "white")
            .attr("pointer-events", "none")
            .text((d) => d.name);

        function ticked() {
            bubbles.attr("transform", (d) => {
                // Keep bubbles within bounds
                d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
                d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
                return `translate(${d.x},${d.y})`;
            });

            // Update velocity trails for gravity mode
            if (
                movementType === "gravity" &&
                movementParams.showVelocity !== false
            ) {
                trailsGroup
                    .selectAll(".velocity-trail")
                    .attr("x1", (d) => d.x)
                    .attr("y1", (d) => d.y)
                    .attr("x2", (d) => {
                        // Trail length based on velocity
                        const speed = getNodeSpeed(d);
                        const trailLength = Math.min(speed * 8, 60);
                        return d.x - ((d.vx || 0) * trailLength) / (speed || 1);
                    })
                    .attr("y2", (d) => {
                        const speed = getNodeSpeed(d);
                        const trailLength = Math.min(speed * 8, 60);
                        return d.y - ((d.vy || 0) * trailLength) / (speed || 1);
                    })
                    .attr("stroke-opacity", (d) => {
                        // Fade trail based on speed
                        const speed = getNodeSpeed(d);
                        return Math.min(0.6, speed * 0.15);
                    })
                    .attr("stroke-width", (d) => {
                        const speed = getNodeSpeed(d);
                        return Math.max(1, Math.min(4, speed * 0.5));
                    });
            }

            // Apply breathing effect to radii (only for breathing modes)
            if (
                movementType === "breathing" ||
                movementType === "breathingOrbit"
            ) {
                const breathingMultiplier = getBreathingRadiusMultiplier(
                    animationTime,
                    movementParams,
                );
                bubbles.selectAll("circle").attr("r", (d) => {
                    return d.radius * breathingMultiplier;
                });
            } else if (movementType === "randomPulse") {
                // Apply pulse scale to radii
                bubbles.selectAll("circle").attr("r", (d) => {
                    return d.radius * (d.pulseScale || 1);
                });
            } else {
                // Reset to base radius for other modes
                bubbles.selectAll("circle").attr("r", (d) => d.radius);
            }
        }
    }

    function handleMouseOver(event, d) {
        d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr("fill-opacity", 1)
            .attr("stroke-width", 4);

        tooltip
            .style("opacity", 1)
            .html(
                `
        <strong>${d.name}</strong><br/>
        Category: ${d.category}<br/>
        Proficiency: ${d.proficiency}/10<br/>
        Projects: ${d.projects}
      `,
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px");
    }

    function handleMouseOut(event) {
        d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr("fill-opacity", 0.8)
            .attr("stroke-width", 2);

        tooltip.style("opacity", 0);
    }

    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    // Re-create chart when filtered skills or movement type change
    $: if (container && filteredSkills) {
        createChart();
    }

    // Explode bubbles outward from center
    function explode() {
        if (!simulation) return;
        const nodes = simulation.nodes();
        const centerX = width / 2;
        const centerY = height / 2;
        for (let node of nodes) {
            // Calculate angle from center
            const dx = node.x - centerX;
            const dy = node.y - centerY;
            const angle = Math.atan2(dy, dx);
            const force = 15 + Math.random() * 10;
            // Add explosive velocity
            node.vx += Math.cos(angle) * force;
            node.vy += Math.sin(angle) * force;
        }
        simulation.alpha(1).restart();
    }

    // Drop all bubbles from the top with random initial velocities
    function dropFromTop() {
        if (!simulation) return;
        const nodes = simulation.nodes();
        for (let node of nodes) {
            // Position at top with random horizontal spread
            node.y = node.radius + 20 + Math.random() * 50;
            node.x = node.radius + Math.random() * (width - node.radius * 2);
            // Give random initial velocity
            node.vx = (Math.random() - 0.5) * 5;
            node.vy = Math.random() * 3; // Slight downward push
        }
        simulation.alpha(1).restart();
    }

    // Track previous movement type to detect changes
    let prevMovementType = movementType;

    // Update simulation forces when movement type changes
    $: if (simulation && (movementType || movementParams)) {
        // When switching TO gravity mode, drop bubbles from top for dramatic effect
        if (movementType === "gravity" && prevMovementType !== "gravity") {
            setTimeout(() => dropFromTop(), 100);
        }
        prevMovementType = movementType;

        // Update velocity decay and centering forces based on movement type
        // BUT: Don't override if mouse pause state machine is active
        if (movementType === "gravity") {
            const velocityDecay = getGravityVelocityDecay(movementParams);
            // Only set decay if we're in ACTIVE state
            if (mouseState === MouseState.ACTIVE) {
                simulation.velocityDecay(velocityDecay);
            }
            simulation.force(
                "x",
                d3
                    .forceX(width / 2)
                    .strength(movementParams.springStrength || 0.03),
            );
            simulation.force("y", null);
            simulation.force("charge", d3.forceManyBody().strength(-80));
        } else if (movementType === "clustering") {
            // Very weak centering for clustering - let categories organize naturally
            simulation.velocityDecay(0.4);
            simulation.force("x", d3.forceX(width / 2).strength(0.01));
            simulation.force("y", d3.forceY(height / 2).strength(0.01));
            simulation.force("charge", d3.forceManyBody().strength(-150));
        } else if (movementType === "pulse") {
            // Weak centering for pulse - let the radial movement dominate
            if (mouseState === MouseState.ACTIVE) {
                simulation.velocityDecay(0.5);
            }
            simulation.force("x", d3.forceX(width / 2).strength(0.02));
            simulation.force("y", d3.forceY(height / 2).strength(0.02));
            simulation.force("charge", d3.forceManyBody().strength(-150));
        } else {
            // Reset to default velocity decay for other modes
            if (mouseState === MouseState.ACTIVE) {
                simulation.velocityDecay(0.4);
            }
            simulation.force("x", d3.forceX(width / 2).strength(0.05));
            simulation.force("y", d3.forceY(height / 2).strength(0.05));
        }

        // Apply charge force with breathing modulation if enabled (skip if already set above)
        if (movementType === "breathing" || movementType === "breathingOrbit") {
            const chargeStrength = getBreathingChargeStrength(
                animationTime,
                movementParams,
            );
            const breathingMultiplier = getBreathingRadiusMultiplier(
                animationTime,
                movementParams,
            );
            const collideStrength = getBreathingCollideStrength(animationTime);
            simulation.force(
                "charge",
                d3.forceManyBody().strength(chargeStrength),
            );
            simulation.force(
                "collide",
                d3
                    .forceCollide((d) => (d.radius + 20) * breathingMultiplier)
                    .strength(collideStrength),
            );
        } else if (movementType === "randomPulse") {
            simulation.force("charge", d3.forceManyBody().strength(-150));
            simulation.force(
                "collide",
                d3
                    .forceCollide((d) => (d.radius + 20) * (d.pulseScale || 1))
                    .strength(1.0),
            );
        } else if (movementType === "clustering" || movementType === "pulse") {
            // Already set charge above, just set collide
            simulation.force(
                "collide",
                d3.forceCollide((d) => d.radius + 20).strength(1.0),
            );
        } else {
            simulation.force("charge", d3.forceManyBody().strength(-150));
            simulation.force(
                "collide",
                d3.forceCollide((d) => d.radius + 20).strength(1.0),
            );
        }
        // Update movement force
        const movementForce = createMovementForce(
            movementType,
            width,
            height,
            animationTime,
            movementParams,
        );
        simulation.force("movement", movementForce);
        simulation.alpha(0.3).restart();
    }

    function selectCategory(cat) {
        selectedCategory = selectedCategory === cat ? null : cat;
    }
</script>

<div class="chart-wrapper">
    <div class="filters">
        <button
            class="filter-btn"
            class:active={selectedCategory === null}
            on:click={() => (selectedCategory = null)}
        >
            All
        </button>
        {#each categories as cat}
            <button
                class="filter-btn"
                class:active={selectedCategory === cat}
                style="--cat-color: {getColor(cat)}"
                on:click={() => selectCategory(cat)}
            >
                {cat}
            </button>
        {/each}
        {#if movementType === "gravity"}
            <button class="filter-btn drop-btn" on:click={dropFromTop}>
                🎯 Drop!
            </button>
            <button class="filter-btn explode-btn" on:click={explode}>
                💥 Explode!
            </button>
        {/if}
    </div>
    <div class="chart-container" bind:this={container}>
        <!-- State indicator for debugging -->
        <div
            class="state-indicator"
            class:visible={mouseState !== MouseState.ACTIVE}
        >
            {mouseState === MouseState.SLOWING ? "🐌 Slowing" : ""}
            {mouseState === MouseState.PAUSED ? "⏸️ Paused" : ""}
            {mouseState === MouseState.RESUMING ? "▶️ Resuming" : ""}
        </div>
    </div>
</div>

<style>
    .chart-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 16px;
        justify-content: center;
    }

    .filter-btn {
        padding: 8px 16px;
        border: 2px solid #ddd;
        border-radius: 20px;
        background: white;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
    }

    .filter-btn:hover {
        border-color: var(--cat-color, #333);
        background: var(--cat-color, #f0f0f0);
        color: white;
    }

    .filter-btn.active {
        background: var(--cat-color, #333);
        border-color: var(--cat-color, #333);
        color: white;
    }

    .drop-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
        color: white;
        font-weight: bold;
    }

    .drop-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .explode-btn {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        border-color: #f5576c;
        color: white;
        font-weight: bold;
    }

    .explode-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
    }

    .chart-container {
        flex: 1;
        min-height: 400px;
        position: relative;
    }

    .state-indicator {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 10;
    }

    .state-indicator.visible {
        opacity: 1;
    }

    :global(.tooltip) {
        position: absolute;
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 10px 14px;
        border-radius: 6px;
        font-size: 13px;
        pointer-events: none;
        z-index: 100;
        line-height: 1.5;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    :global(.bubble) {
        cursor: grab;
    }

    :global(.bubble:active) {
        cursor: grabbing;
    }
</style>
