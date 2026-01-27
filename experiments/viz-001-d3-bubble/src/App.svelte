<script>
    import SkillBubbleChart from "./lib/SkillBubbleChart.svelte";
</script>

<main>
    <h1>Skill Bubble Chart</h1>
    <p>D3.js + Svelte visualization experiment</p>
    <SkillBubbleChart />
</main>

<style>
    main {
        max-width: 900px;
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
</style>
