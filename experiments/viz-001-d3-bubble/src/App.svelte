<script>
    import SkillBubbleChart from "./lib/SkillBubbleChart.svelte";
    import { MOVEMENT_TYPES } from "./lib/movements.js";
    import {
        getDefaultParams,
        getParamDefinitions,
    } from "./lib/movementParams.js";

    let vizType = "bubble";
    let movementType = "breathing";
    let movementParams = getDefaultParams(movementType);
    let showParams = false;

    // Update params when movement type changes
    $: {
        movementParams = getDefaultParams(movementType);
    }

    $: paramDefinitions = getParamDefinitions(movementType);
    $: hasParams = Object.keys(paramDefinitions).length > 0;

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
    <div class="toolbar">
        <div class="control-group">
            <label for="viz-type">Visualization:</label>
            <select id="viz-type" bind:value={vizType}>
                {#each vizTypes as viz}
                    <option value={viz.id}>{viz.label}</option>
                {/each}
            </select>
        </div>

        {#if vizType === "bubble"}
            <div class="control-group">
                <label for="movement-type">Movement:</label>
                <select id="movement-type" bind:value={movementType}>
                    {#each movementTypeEntries as movement}
                        <option value={movement.id}>{movement.label}</option>
                    {/each}
                </select>
            </div>

            {#if hasParams}
                <button
                    class="params-toggle"
                    on:click={() => (showParams = !showParams)}
                    title="Adjust movement parameters"
                >
                    ⚙️ Parameters
                </button>
            {/if}
        {/if}
    </div>

    {#if vizType === "bubble" && showParams && hasParams}
        <div class="params-panel">
            {#each Object.entries(paramDefinitions) as [key, param]}
                <div class="param-control">
                    <label for={key}>
                        {param.label}
                        <span class="param-desc">{param.desc}</span>
                    </label>
                    <div class="param-input-group">
                        <input
                            id={key}
                            type="range"
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            bind:value={movementParams[key]}
                        />
                        <span class="param-value">{movementParams[key]}</span>
                    </div>
                </div>
            {/each}
            <button
                class="reset-button"
                on:click={() =>
                    (movementParams = getDefaultParams(movementType))}
            >
                Reset to Defaults
            </button>
        </div>
    {/if}

    {#if vizType === "bubble"}
        <div class="viz-container">
            <SkillBubbleChart {movementType} {movementParams} />
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
        max-width: 100%;
        height: 100vh;
        margin: 0;
        padding: 0;
        font-family:
            system-ui,
            -apple-system,
            sans-serif;
        display: flex;
        flex-direction: column;
    }

    .toolbar {
        display: flex;
        align-items: center;
        gap: 24px;
        padding: 12px 20px;
        background: white;
        border-bottom: 1px solid #e0e0e0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        flex-shrink: 0;
    }

    .control-group {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    label {
        font-size: 14px;
        font-weight: 500;
        color: #555;
        white-space: nowrap;
    }

    select {
        padding: 6px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.15s ease;
        background: white;
        min-width: 150px;
    }

    select:hover {
        border-color: #aaa;
    }

    select:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
    }

    .viz-container {
        flex: 1;
        overflow: hidden;
        background: #fafafa;
    }

    .viz-placeholder {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px dashed #ddd;
        margin: 20px;
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

    .params-toggle {
        padding: 6px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .params-toggle:hover {
        background: #f5f5f5;
        border-color: #aaa;
    }

    .params-panel {
        padding: 16px 20px;
        background: #f9f9f9;
        border-bottom: 1px solid #e0e0e0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
        max-height: 200px;
        overflow-y: auto;
    }

    .param-control {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .param-control label {
        font-size: 13px;
        font-weight: 500;
        color: #333;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .param-desc {
        font-size: 11px;
        color: #888;
        font-weight: 400;
    }

    .param-input-group {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .param-input-group input[type="range"] {
        flex: 1;
        cursor: pointer;
    }

    .param-value {
        font-size: 12px;
        font-family: monospace;
        color: #555;
        min-width: 50px;
        text-align: right;
    }

    .reset-button {
        grid-column: 1 / -1;
        padding: 6px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.15s ease;
        max-width: 150px;
    }

    .reset-button:hover {
        background: #f0f0f0;
        border-color: #aaa;
    }
</style>
