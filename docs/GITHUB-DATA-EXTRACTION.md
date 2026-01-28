# GitHub Data Extraction Strategy

## Overview

Extract project data, technologies, and activity metrics from three GitHub accounts to build a comprehensive skill/project inventory for the interactive resume.

**Accounts:**
- https://github.com/nhemsley (personal account)
- https://github.com/rezural (alternate account - important projects)
- https://github.com/fluid-notion-systems/ (organization account - important projects)

## Data Points to Extract

### Per Repository
- **Metadata**
  - Name
  - Description
  - URL
  - Created date
  - Last updated date
  - Stars (if public)
  - Topics/tags

- **Activity Metrics**
  - Total commits (all time)
  - Commit frequency (commits/month over last 6/12 months)
  - Contributors
  - Last commit date

- **Technologies**
  - Primary language (from GitHub API)
  - Languages used (%, count from GitHub API)
  - Dependencies extracted from:
    - `Cargo.toml` (Rust)
    - `package.json` (JavaScript/Node)
    - `requirements.txt` (Python)
    - `go.mod` (Go)
    - `pom.xml` (Java)
    - `.gemspec` (Ruby)
  - Build tools (Make, Gradle, Maven, etc.)

- **Documentation**
  - README content (first section)
  - Key sections (Installation, Usage, Architecture)
  - License type

## Extraction Methods

### Method 1: GitHub API (Recommended)
**Pros:**
- No cloning needed
- Fast
- Get metadata, commits, languages directly
- Rate limited but sufficient for personal projects

**Cons:**
- Can't easily extract dependency files
- Requires authentication for higher rate limits

**Approach:**
```bash
# List repos for each account
curl https://api.github.com/users/nhemsley/repos?per_page=100

# For each repo, get:
# - Basic metadata (via API)
# - Languages breakdown
# - Commits count
# - File contents (README, Cargo.toml, etc.)
```

### Method 2: Local Clone + Analysis
**Pros:**
- Extract any file (Cargo.toml, package.json, etc.)
- Analyze git history deeply
- Full control

**Cons:**
- Slow (need to clone all repos)
- Disk space
- Network intensive

**Approach:**
```bash
# Clone each repo
git clone <repo-url> --depth=1  # Shallow clone for speed

# Analyze files
grep -r "^name\|^version" Cargo.toml
jq .dependencies package.json

# Get commit stats
git log --oneline | wc -l
git log --format="%ai" | sort | tail -1
```

### Method 3: Hybrid (Recommended)
1. Use GitHub API for metadata and basic info
2. Shallow clone only if needed for dependency extraction
3. Cache results to avoid re-fetching

## Data Processing Pipeline

### Phase 1: Data Collection
```
├── Fetch repo list (GitHub API)
│   ├── nhemsley (personal)
│   ├── rezural (alternate)
│   └── fluid-notion-systems (org)
├── For each repo:
│   ├── Fetch metadata (API)
│   ├── Fetch README (API: /repos/{owner}/{repo}/readme)
│   ├── Fetch languages (API: /repos/{owner}/{repo}/languages)
│   ├── Fetch commits (API: /repos/{owner}/{repo}/commits?per_page=1)
│   ├── Optionally shallow clone for Cargo.toml/package.json
│   └── Extract and parse tech stack
└── Store in JSON file (git-projects.json)
```

### Phase 2: Categorization & Filtering
```
Filter out:
- Forks (unless heavily modified)
- Archived repos (unless significant)
- Empty/no-README repos
- Fluff/test projects

Keep:
- Active projects (recent commits)
- High commit count
- Well-documented

Sort by:
1. Commit frequency (recent activity) - WEIGHT: 40%
2. Total commits (project scale) - WEIGHT: 30%
3. Stars/importance (manual tagging) - WEIGHT: 20%
4. Recency (last 6 months active) - WEIGHT: 10%
```

### Phase 3: Technology Extraction
```
From package.json / Cargo.toml / requirements.txt:
- Extract direct dependencies
- Categorize by type:
  ├── Languages (Rust, JavaScript, Python, etc.)
  ├── Frameworks (React, Django, Rails, etc.)
  ├── Databases (PostgreSQL, MongoDB, etc.)
  ├── Tools (Docker, Kubernetes, etc.)
  ├── Cloud (AWS, GCP, Azure, etc.)
  └── Other
```

### Phase 4: Generate Reports
```
outputs/
├── projects-by-activity.md
│   ├── High activity (commits/month > 10)
│   ├── Medium activity (2-10)
│   └── Low activity (< 2)
├── projects-by-tech.md
│   ├── Rust projects
│   ├── JavaScript projects
│   ├── Python projects
│   └── Multi-lang projects
├── all-projects.json (raw data)
├── tech-inventory.json (tech frequency count)
└── timeline.md (chronological by creation/activity)
```

## Implementation Plan

### Step 1: Setup (30 min)
- [ ] Create GitHub API script (Node.js or Python)
- [ ] Add authentication (personal access token)
- [ ] Setup caching layer

### Step 2: Data Collection (1-2 hours)
- [ ] Fetch all repos for three accounts
- [ ] Extract metadata and commit stats
- [ ] Fetch README + tech files
- [ ] Parse dependencies
- [ ] Save to `git-projects.json`

### Step 3: Analysis & Generation (1-2 hours)
- [ ] Filter and categorize repos
- [ ] Generate markdown reports
- [ ] Create tech inventory
- [ ] Create activity timeline

### Step 4: Integration (30 min)
- [ ] Place outputs in `docs/GITHUB-PROJECTS/`
- [ ] Create index document
- [ ] Link from resume viz docs

## Technology Stack

**Suggested Tools:**
- **Language:** Node.js (Octokit library) or Python (PyGithub)
- **Data Storage:** JSON files (versioned in git)
- **Analysis:** JavaScript/Python scripts
- **Output:** Markdown + JSON

**Key Libraries:**
- `octokit` (GitHub API client for Node.js)
- `PyGithub` (GitHub API client for Python)
- `parse-package-json` (for parsing package.json)
- `toml` (for parsing Cargo.toml)

## Output Structure

```
docs/
├── GITHUB-PROJECTS/
│   ├── README.md (index/explanation)
│   ├── projects-by-activity.md
│   │   ├── High-Activity Projects
│   │   ├── Medium-Activity Projects
│   │   └── Low-Activity/Archive
│   ├── projects-by-tech.md
│   │   ├── Rust Ecosystem
│   │   ├── JavaScript/Web
│   │   ├── Python/Data
│   │   ├── DevOps/Infrastructure
│   │   └── Multi-Language
│   ├── all-projects.json (raw data)
│   ├── tech-inventory.json
│   └── timeline.md
```

### Example: projects-by-activity.md

```markdown
# Projects by Activity Level

## High Activity (Commits/Month > 10)

### 1. project-name
- **URL:** https://github.com/...
- **Commits:** 1,234 (avg 12/month last 6mo)
- **Languages:** Rust (75%), TOML (25%)
- **Tech Stack:** Tokio, serde, clap
- **Last Commit:** 2025-01-27
- **Description:** ...
- **Key Achievements:** ...

## Medium Activity (2-10 commits/month)
...

## Low Activity / Archived
...
```

### Example: all-projects.json

```json
{
  "projects": [
    {
      "name": "project-name",
      "owner": "nhemsley",
      "url": "https://github.com/...",
      "description": "...",
      "languages": {
        "Rust": 75,
        "TOML": 25
      },
      "stats": {
        "totalCommits": 1234,
        "commitsPerMonth6m": 12.5,
        "commitsPerMonth12m": 10.2,
        "createdAt": "2020-03-15",
        "lastCommitAt": "2025-01-27",
        "contributors": 3,
        "stars": 42
      },
      "technologies": {
        "languages": ["Rust"],
        "frameworks": ["Tokio"],
        "databases": [],
        "tools": ["Docker", "GitHub Actions"],
        "cloud": ["AWS S3"]
      },
      "readme": "First 500 chars of README...",
      "importance": "high"
    }
  ],
  "stats": {
    "totalRepos": 47,
    "totalCommits": 15234,
    "topLanguages": ["Rust", "JavaScript", "Python"],
    "topTechnologies": ["React", "Tokio", "PostgreSQL"]
  }
}
```

## Quality Metrics

Track the following:
- **Commit Density:** Commits / months since creation
- **Activity Score:** (Recent commits × 2) + (Total commits / max)
- **Importance Score:** Manual + Stars + Forks + Watchers
- **Language Distribution:** Tech breadth
- **Documentation Quality:** README length/completeness

## Future Enhancements

- [ ] Extract GitHub issues/PRs for contribution metrics
- [ ] Analyze code quality (via GitHub API or external tools)
- [ ] Extract specific achievements/milestones from READMEs
- [ ] Build interactive visualization of repos
- [ ] Automate weekly/monthly updates
- [ ] Link to resume visualization (tech timeline)

---

## Notes

- **Rezural account:** Likely contains important Rust/infrastructure work
- **Fluid-Notion Systems:** Organization with important collaborative projects
- **nhemsley:** Personal account with mix of experiments and core work
- **Filter strategy:** Prioritize recent activity + commit count over just stars
- **Caching:** Store results in git to track changes over time
