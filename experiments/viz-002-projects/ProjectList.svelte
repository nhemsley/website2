<script>
  import projects from './projects.json';

  let sortBy = 'commits';
  let filterCategory = 'all';
  let filterImportance = 'all';

  $: sortedProjects = [...projects.projects].sort((a, b) => {
    switch (sortBy) {
      case 'commits':
        return b.stats.totalCommits - a.stats.totalCommits;
      case 'recent':
        return new Date(b.stats.lastCommitAt) - new Date(a.stats.lastCommitAt);
      case 'activity':
        return b.stats.commitsPerMonth6m - a.stats.commitsPerMonth6m;
      case 'stars':
        return b.stats.stars - a.stats.stars;
      default:
        return 0;
    }
  });

  $: filteredProjects = sortedProjects.filter((project) => {
    const categoryMatch = filterCategory === 'all' || project.category === filterCategory;
    const importanceMatch = filterImportance === 'all' || project.importance === filterImportance;
    return categoryMatch && importanceMatch;
  });

  $: categories = ['all', ...new Set(projects.projects.map((p) => p.category))];
  $: importanceLevels = ['all', 'high', 'medium', 'low'];

  function getTechColor(tech) {
    const colors = {
      Rust: '#ce422b',
      JavaScript: '#f7df1e',
      Python: '#3776ab',
      Svelte: '#ff3e00',
      React: '#61dafb',
      'D3.js': '#f9a825',
      Bevy: '#232428',
      Tokio: '#d26b47',
      PostgreSQL: '#336791',
      Docker: '#2496ed',
      Kubernetes: '#326ce5',
    };
    return colors[tech] || '#999';
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
</script>

<div class="container">
  <div class="header">
    <h1>Projects & Work</h1>
    <p>A curated selection of projects sorted by activity and impact</p>
  </div>

  <div class="controls">
    <div class="control-group">
      <label for="sort">Sort by:</label>
      <select id="sort" bind:value={sortBy}>
        <option value="commits">Total Commits</option>
        <option value="activity">Recent Activity (6m)</option>
        <option value="recent">Last Commit</option>
        <option value="stars">Stars</option>
      </select>
    </div>

    <div class="control-group">
      <label for="category">Category:</label>
      <select id="category" bind:value={filterCategory}>
        {#each categories as cat}
          <option value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
        {/each}
      </select>
    </div>

    <div class="control-group">
      <label for="importance">Importance:</label>
      <select id="importance" bind:value={filterImportance}>
        {#each importanceLevels as level}
          <option value={level}>{level === 'all' ? 'All Levels' : level}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="stats">
    <div class="stat">
      <strong>{filteredProjects.length}</strong> projects shown
    </div>
    <div class="stat">
      <strong>{filteredProjects.reduce((sum, p) => sum + p.stats.totalCommits, 0)}</strong> total commits
    </div>
    <div class="stat">
      <strong>{filteredProjects.reduce((sum, p) => sum + p.stats.stars, 0)}</strong> total stars
    </div>
  </div>

  <div class="projects-list">
    {#each filteredProjects as project (project.id)}
      <div class="project-card">
        <div class="project-header">
          <div class="project-title">
            <h2>{project.name}</h2>
            <span class="owner">by {project.owner}</span>
          </div>
          <div class="importance-badge" class:high={project.importance === 'high'} class:medium={project.importance === 'medium'} class:low={project.importance === 'low'}>
            {project.importance}
          </div>
        </div>

        <p class="description">{project.description}</p>

        <div class="tech-stack">
          {#each Object.keys(project.technologies) as category}
            <div class="tech-category">
              <span class="category-label">{category}:</span>
              <div class="tech-tags">
                {#each project.technologies[category] as tech}
                  <span class="tech-tag" style="--color: {getTechColor(tech)}">
                    {tech}
                  </span>
                {/each}
              </div>
            </div>
          {/each}
        </div>

        <div class="stats-row">
          <div class="stat-item">
            <span class="label">Commits</span>
            <span class="value">{project.stats.totalCommits}</span>
          </div>
          <div class="stat-item">
            <span class="label">Activity (6m)</span>
            <span class="value">{project.stats.commitsPerMonth6m.toFixed(1)}/mo</span>
          </div>
          <div class="stat-item">
            <span class="label">Last Update</span>
            <span class="value">{formatDate(project.stats.lastCommitAt)}</span>
          </div>
          <div class="stat-item">
            <span class="label">Stars</span>
            <span class="value">⭐ {project.stats.stars}</span>
          </div>
        </div>

        <a href={project.url} target="_blank" rel="noopener noreferrer" class="repo-link">
          View Repository →
        </a>
      </div>
    {/each}
  </div>

  {#if filteredProjects.length === 0}
    <div class="empty-state">
      <p>No projects match your filters. Try adjusting the selection.</p>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .header {
    text-align: center;
    margin-bottom: 40px;
  }

  .header h1 {
    font-size: 48px;
    margin: 0 0 10px 0;
    color: #333;
  }

  .header p {
    font-size: 18px;
    color: #666;
    margin: 0;
  }

  .controls {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    flex-wrap: wrap;
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
  }

  .control-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .control-group label {
    font-weight: 500;
    font-size: 14px;
    color: #555;
  }

  .control-group select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    background: white;
    cursor: pointer;
    min-width: 150px;
  }

  .control-group select:hover {
    border-color: #aaa;
  }

  .stats {
    display: flex;
    gap: 30px;
    margin-bottom: 40px;
    padding: 20px;
    background: #f0f7ff;
    border-radius: 8px;
  }

  .stat {
    font-size: 16px;
    color: #333;
  }

  .stat strong {
    font-size: 24px;
    color: #3498db;
  }

  .projects-list {
    display: grid;
    gap: 24px;
    margin-bottom: 40px;
  }

  .project-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 24px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .project-card:hover {
    border-color: #3498db;
    box-shadow: 0 8px 16px rgba(52, 152, 219, 0.1);
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .project-title h2 {
    margin: 0;
    font-size: 24px;
    color: #333;
  }

  .owner {
    display: block;
    font-size: 13px;
    color: #999;
    margin-top: 4px;
  }

  .importance-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .importance-badge.high {
    background: #d4edda;
    color: #155724;
  }

  .importance-badge.medium {
    background: #fff3cd;
    color: #856404;
  }

  .importance-badge.low {
    background: #e2e3e5;
    color: #383d41;
  }

  .description {
    font-size: 16px;
    color: #555;
    margin: 12px 0 20px 0;
    line-height: 1.5;
  }

  .tech-stack {
    margin-bottom: 20px;
  }

  .tech-category {
    margin-bottom: 12px;
  }

  .category-label {
    display: inline-block;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    color: #666;
    margin-right: 10px;
    min-width: 100px;
  }

  .tech-tags {
    display: inline-flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .tech-tag {
    display: inline-block;
    padding: 4px 10px;
    background: var(--color, #ddd);
    color: white;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-item .label {
    font-size: 12px;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-item .value {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    font-family: monospace;
  }

  .repo-link {
    display: inline-block;
    padding: 10px 16px;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .repo-link:hover {
    background: #2980b9;
    transform: translateX(2px);
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #999;
    font-size: 18px;
  }

  @media (max-width: 768px) {
    .controls {
      flex-direction: column;
    }

    .control-group {
      width: 100%;
    }

    .control-group select {
      width: 100%;
    }

    .stats {
      flex-direction: column;
      gap: 12px;
    }

    .project-header {
      flex-direction: column;
      gap: 12px;
    }

    .stats-row {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
