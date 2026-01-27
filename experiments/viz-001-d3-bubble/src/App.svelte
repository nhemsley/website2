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
    let showDebug = false;

    // Load debug preference from localStorage
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem("viz-debug-mode");
        if (stored !== null) {
            showDebug = stored === "true";
        }
    }

    // Toggle debug and save to localStorage
    function toggleDebug() {
        showDebug = !showDebug;
        if (typeof window !== "undefined") {
            localStorage.setItem("viz-debug-mode", showDebug.toString());
        }
    }

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
    <!-- Top-right controls -->
    <div class="top-controls">
        <a
            href="https://github.com/nhemsley/website2"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-btn"
            title="View source on GitHub"
        >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                />
            </svg>
        </a>
        <button
            class="icon-btn"
            on:click={toggleDebug}
            title="Toggle debug toolbar"
        >
            {#if showDebug}
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                </svg>
            {:else}
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                    />
                    <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
            {/if}
        </button>
    </div>

    <div class="toolbar">
        <!-- Commented out: Visualization type chooser -->
        <!--
        <div class="control-group">
            <label for="viz-type">Visualization:</label>
            <select id="viz-type" bind:value={vizType}>
                {#each vizTypes as viz}
                    <option value={viz.id}>{viz.label}</option>
                {/each}
            </select>
        </div>
        -->

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
            <SkillBubbleChart {movementType} {movementParams} {showDebug} />
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
        position: relative;
    }

    .top-controls {
        position: absolute;
        top: 16px;
        right: 16px;
        display: flex;
        gap: 8px;
        z-index: 1000;
    }

    .icon-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border: 2px solid #ddd;
        border-radius: 50%;
        background: white;
        color: #333;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .icon-btn:hover {
        border-color: #333;
        background: #f0f0f0;
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .icon-btn:active {
        transform: scale(0.95);
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
