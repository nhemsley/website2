<script>
    import SkillBubbleChart from "./lib/SkillBubbleChart.svelte";
    import { MOVEMENT_TYPES } from "./lib/movements.js";

    let vizType = "bubble";
    let movementType = "breathing";

    const vizTypes = [
        {
            id: "bubble",
            label: "Bubble Chart",
            desc: "Force-directed, interactive bubbles with dynamic movement",
        },
        { id: "bars", label: "Bar Chart", desc: "Sorted by proficiency" },
        { id: "radar", label: "Radar/Spider", desc: "Profile overview" },
        { id: "pack", label: "Pack Hierarchy", desc: "Grouped by category" },
        { id: "network", label: "Force Network", desc: "Skill relationships" },
        { id: "timeline", label: "Timeline", desc: "Experience progression" },
        { id: "treemap", label: "Treemap", desc: "Hierarchy view" },
        {
            id: "constellation",
            label: "Constellation",
            desc: "Artistic stochastic movement",
        },
    ];

    const movementTypeEntries = Object.entries(MOVEMENT_TYPES).map(
        ([id, data]) => ({
            id,
            ...data,
        }),
    );
</script>

<main>
    <h1>Skill Visualizations</h1>
    <p>D3.js + Svelte visualization experiments</p>

    <div class="selector-group">
        <div class="viz-selector">
            <label for="viz-type">Choose visualization:</label>
            <select id="viz-type" bind:value={vizType}>
                {#each vizTypes as viz}
                    <option value={viz.id}>{viz.label}</option>
                {/each}
            </select>
        </div>

        {#if vizType === "bubble"}
            <div class="movement-selector">
                <label for="movement-type">Movement style:</label>
                <select id="movement-type" bind:value={movementType}>
                    {#each movementTypeEntries as movement}
                        <option value={movement.id}>{movement.label}</option>
                    {/each}
                </select>
                <span class="movement-desc">
                    {movementTypeEntries.find((m) => m.id === movementType)
                        ?.desc}
                </span>
            </div>
        {/if}
    </div>

    {#if vizType === "bubble"}
        <div class="viz-container">
            <div class="viz-description">
                <strong>Bubble Chart</strong> — Force-directed bubbles with interactive
                movement. Size by proficiency, color by category.
            </div>
            <SkillBubbleChart {movementType} />
        </div>
    {:else}
        <div class="viz-placeholder">
            <p>
                <strong>{vizTypes.find((v) => v.id === vizType)?.label}</strong>
            </p>
            <p>{vizTypes.find((v) => v.id === vizType)?.desc}</p>
            <p style="color: #999; margin-top: 20px;">Coming soon...</p>
        </div>
    {/if}
</main>

<style>
    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        font-family:
            system-ui,
            -apple-system,
            sans-serif;
    }

    h1 {
        text-align: center;
        color: #333;
        margin-bottom: 8px;
    }

    p {
        text-align: center;
        color: #666;
        margin-bottom: 24px;
    }

    .selector-group {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
        margin-bottom: 24px;
        flex-wrap: wrap;
        padding: 16px;
        background: #f9f9f9;
        border-radius: 8px;
        border: 1px solid #eee;
    }

    .viz-selector {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .movement-selector {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .movement-desc {
        font-size: 12px;
        color: #999;
        margin-left: 8px;
        max-width: 200px;
    }

    label {
        font-weight: 600;
        color: #333;
    }

    select {
        padding: 8px 12px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        font-family: inherit;
        cursor: pointer;
        transition: border-color 0.2s ease;
        background: white;
    }

    select:hover {
        border-color: #999;
    }

    select:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    .viz-container {
        display: flex;
        flex-direction: column;
        height: 600px;
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
        background: #fafafa;
    }

    .viz-description {
        padding: 16px;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        color: #666;
        background: white;
    }

    .viz-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 600px;
        border: 2px dashed #ddd;
        border-radius: 8px;
        color: #999;
    }

    .viz-placeholder p {
        margin: 8px 0;
    }

    .viz-placeholder strong {
        color: #333;
        font-size: 18px;
    }
</style>
