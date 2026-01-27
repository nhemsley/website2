<script>
    import { onMount, onDestroy } from "svelte";
    import * as d3 from "d3";
    import {
        MOVEMENT_TYPES,
        createMovementForce,
        getBreathingChargeStrength,
        getBreathingCollideStrength,
    } from "./movements.js";

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

    // Movement type control
    export let movementType = "breathing";

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

    onMount(() => {
        createChart();
        window.addEventListener("resize", handleResize);
        startBreathingAnimation();
    });

    onDestroy(() => {
        if (simulation) simulation.stop();
        window.removeEventListener("resize", handleResize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });

    function startBreathingAnimation() {
        const animate = () => {
            animationTime += 0.01;
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();
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

        // Apply charge force with breathing modulation if enabled
        if (movementType === "breathing") {
            const chargeStrength = getBreathingChargeStrength(animationTime);
            simulation.force(
                "charge",
                d3.forceManyBody().strength(chargeStrength),
            );
        } else {
            simulation.force("charge", d3.forceManyBody().strength(-60));
        }

        // Collide force with breathing effect if enabled
        if (movementType === "breathing") {
            const collideStrength = getBreathingCollideStrength(animationTime);
            simulation.force(
                "collide",
                d3.forceCollide((d) => d.radius + 8).strength(collideStrength),
            );
        } else {
            simulation.force(
                "collide",
                d3.forceCollide((d) => d.radius + 8).strength(0.9),
            );
        }

        // Apply movement-specific force
        const movementForce = createMovementForce(
            movementType,
            width,
            height,
            animationTime,
        );
        simulation.force("movement", movementForce);

        simulation.on("tick", ticked);

        // Create bubble groups
        const bubbles = svg
            .selectAll(".bubble")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "bubble")
            .call(drag(simulation));

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

        // Add labels
        bubbles
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

            // Apply breathing effect to radii (only for breathing mode)
            if (movementType === "breathing") {
                bubbles.selectAll("circle").attr("r", (d) => {
                    const breathing = Math.sin(animationTime * 2) * 0.15;
                    return d.radius * (1 + breathing);
                });
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

    // Update simulation forces when movement type changes
    $: if (simulation && movementType) {
        if (movementType === "breathing") {
            const chargeStrength = getBreathingChargeStrength(animationTime);
            simulation.force(
                "charge",
                d3.forceManyBody().strength(chargeStrength),
            );
            const collideStrength = getBreathingCollideStrength(animationTime);
            simulation.force(
                "collide",
                d3.forceCollide((d) => d.radius + 8).strength(collideStrength),
            );
        } else {
            simulation.force("charge", d3.forceManyBody().strength(-60));
            simulation.force(
                "collide",
                d3.forceCollide((d) => d.radius + 8).strength(0.9),
            );
        }
        const movementForce = createMovementForce(
            movementType,
            width,
            height,
            animationTime,
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
    </div>
    <div class="chart-container" bind:this={container}></div>
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

    .chart-container {
        flex: 1;
        min-height: 400px;
        position: relative;
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
