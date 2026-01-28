# viz-002: Projects Visualization

A Svelte component to display and explore GitHub projects with sorting, filtering, and technology insights.

## Overview

This visualization showcases projects from three GitHub accounts:
- **nhemsley** (personal account)
- **rezural** (alternate account - important Rust/infrastructure work)
- **fluid-notion-systems** (organization - collaborative projects)

Projects are ranked by:
1. **Recent activity** (commits in last 6 months)
2. **Total commits** (project scale and maturity)
3. **Stars** (community interest)
4. **Importance level** (manual categorization)

## Features

- **Sorting Options**
  - Total Commits: Project scale and longevity
  - Recent Activity (6m): Current/active projects
  - Last Commit: Most recently updated
  - Stars: Community adoption

- **Filtering**
  - By Category: visualization, infrastructure, web, data, ml, gamedev, tools
  - By Importance: high, medium, low

- **Project Information**
  - Description and purpose
  - Technology stack (languages, frameworks, tools, databases, cloud)
  - Commit statistics (total, monthly rate)
  - Last update date
  - GitHub stars
  - Direct link to repository

- **Tech Stack Display**
  - Color-coded technology badges
  - Organized by type (Languages, Frameworks, Tools, Databases, Cloud)
  - At-a-glance tech diversity

## Data Structure

Projects are stored in `projects.json` with the following schema:

```json
{
  "id": "unique-id",
  "name": "Project Name",
  "owner": "account-name",
  "url": "https://github.com/...",
  "description": "What this project does",
  "languages": { "Rust": 95, "TOML": 5 },
  "stats": {
    "totalCommits": 342,
    "commitsPerMonth6m": 8.5,
    "createdAt": "2021-06-15",
    "lastCommitAt": "2025-01-20",
    "stars": 156
  },
  "technologies": {
    "languages": ["Rust"],
    "frameworks": ["Bevy"],
    "tools": ["GitHub Actions"]
  },
  "importance": "high",
  "category": "gamedev"
}
```

## Usage

### Display the component in your app

```svelte
<script>
  import ProjectList from './ProjectList.svelte';
</script>

<ProjectList />
```

### Update project data

1. Edit `projects.json` to add/update projects
2. Component automatically re-renders with new data
3. Sorting and filtering work on the updated dataset

## Sample Projects Included

- **bevy-inspector** (rezural): Bevy game engine inspector tool
- **fluid-state-machine** (fluid-notion): Async state machine for workflows
- **viz-001-d3-bubble** (nhemsley): D3 force-directed bubble chart with physics
- **data-pipeline** (rezural): High-performance data processing
- **admin-dashboard** (nhemsley): Full-featured React admin dashboard
- **cli-framework** (rezural): Ergonomic Rust CLI framework
- **tensor-tools** (nhemsley): PyTorch ML utilities library

## Next Steps

### Phase 1: Data Collection
- [ ] Write GitHub API scraper
- [ ] Fetch real project data from three accounts
- [ ] Extract README summaries
- [ ] Parse Cargo.toml, package.json, requirements.txt
- [ ] Calculate commit statistics

### Phase 2: Enhancement
- [ ] Add filtering by technology
- [ ] Show contributor information
- [ ] Add project timeline view
- [ ] Create tech stack heatmap
- [ ] Add search functionality

### Phase 3: Visualization
- [ ] Convert to interactive visualization (not just list)
- [ ] Bubble chart sized by commits
- [ ] Connected by shared technologies
- [ ] Timeline view of project creation/activity

### Phase 4: Integration
- [ ] Integrate into interactive resume
- [ ] Link from skill bubbles to projects that use that skill
- [ ] Add animation on scroll

## Design Notes

- **Responsive**: Works on mobile, tablet, desktop
- **Accessible**: Semantic HTML, ARIA labels where needed
- **Fast**: All sorting/filtering happens client-side
- **Extensible**: Easy to add new fields or sorting options

## Color Palette

Technologies are color-coded:
- Rust: #ce422b (red-brown)
- JavaScript: #f7df1e (yellow)
- Python: #3776ab (blue)
- Svelte: #ff3e00 (red)
- React: #61dafb (cyan)
- D3.js: #f9a825 (orange)
- PostgreSQL: #336791 (blue)
- Docker: #2496ed (blue)
- Kubernetes: #326ce5 (blue)

## Files

- `ProjectList.svelte` - Main component
- `projects.json` - Project data
- `README.md` - This file
- `PARAMETERS.md` - Configuration details (TBD)

## Related

- **viz-001-d3-bubble**: Skill bubble chart with physics
- **docs/GITHUB-DATA-EXTRACTION.md**: Strategy for extracting real project data
- **docs/RESUME-VIZ-DESIGN.md**: Interactive resume architecture

## Future: Automated Data Sync

Plan to automatically fetch and update project data:

```bash
npm run fetch-projects
# Pulls from GitHub API
# Extracts metadata, commits, technologies
# Updates projects.json
# Commits changes
```
