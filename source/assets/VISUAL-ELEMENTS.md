# Visual Elements

`visual-elements.svg` is a centralized library of all technology/skill definitions with their visual properties, metadata, and color associations.

## Structure

The SVG contains technology symbols organized by category:

```
<svg>
  <defs>
    <style>
      /* Proficiency-based styling */
      .tech-symbol[data-proficiency="9"] .tech-badge { fill: #f39c12; } /* Expert *)
      .tech-symbol[data-proficiency="8"] .tech-badge { fill: #3498db; } /* Proficient *)
      /* ... etc ... */
    </style>
  </defs>
  
  <g id="technologies">
    <g class="tech-symbol" id="ruby" data-name="Ruby" data-category="backend" data-proficiency="9" data-years="15" data-tags="language">
      <!-- SVG content -->
    </g>
    <!-- More technology symbols... -->
  </g>
</svg>
```

## Data Attributes

Each technology symbol has:

| Attribute | Type | Example | Purpose |
|-----------|------|---------|---------|
| `id` | string | `ruby` | Unique identifier, slug format |
| `data-name` | string | `Ruby` | Display name |
| `data-category` | string | `backend` | Category grouping |
| `data-proficiency` | number | `9` | 1-10 skill level |
| `data-years` | number | `15` | Years of experience |
| `data-tags` | string | `language,framework` | Comma-separated tags |

## Categories

- **frontend** - UI frameworks, client-side technologies
- **backend** - Server-side languages and frameworks
- **database** - Database systems
- **data** - Data processing, analytics, caching
- **devops** - Infrastructure, deployment, orchestration
- **cloud** - Cloud platforms and services
- **3d** - 3D graphics, game engines, visualization
- **tools** - Development tools and methodologies

## Proficiency Scale

- **9-10** - Expert/Advanced (gold badge: #f39c12)
- **7-8** - Proficient/Competent (blue badge: #3498db)
- **5-6** - Intermediate/Basic (purple badge: #9b59b6)
- **3-4** - Beginner/Novice

## Usage

### JavaScript API

```javascript
import { visualElements } from '/source/assets/visual-elements.js';

// Load the SVG
await visualElements.load();

// Get a single technology
const ruby = visualElements.get('ruby');
const ruby2 = visualElements.get('Ruby'); // Case-insensitive

// Get all technologies
const all = visualElements.getAll();

// Filter by category
const backendTechs = visualElements.getByCategory('backend');
const frontendTechs = visualElements.getByCategory('frontend');

// Filter by tag
const languages = visualElements.getByTag('language');
const frameworks = visualElements.getByTag('framework');

// Filter by proficiency
const expert = visualElements.getByMinProficiency(9);
const intermediate = visualElements.getByMinProficiency(6);

// Get unique lists
const categories = visualElements.getCategories();
const tags = visualElements.getTags();

// Complex queries
const results = visualElements.query({
  category: 'frontend',
  minProficiency: 7,
  sortBy: 'years-desc'
});

// Get stats
const stats = visualElements.getStats();
// {
//   total: 40,
//   byProficiency: { 9: 8, 8: 6, 7: 10, ... },
//   byCategory: { frontend: 9, backend: 8, ... },
//   byYears: { total: 312, average: 8 },
//   categories: ['backend', 'cloud', 'database', ...],
//   tags: ['api', 'cache', 'container', ...]
// }
```

### Svelte Component Example

```svelte
<script>
  import { visualElements } from '/source/assets/visual-elements.js';
  import { onMount } from 'svelte';

  let technologies = [];
  let selectedCategory = 'frontend';

  onMount(async () => {
    await visualElements.load();
    technologies = visualElements.getByCategory(selectedCategory);
  });

  function handleCategoryChange(category) {
    selectedCategory = category;
    technologies = visualElements.getByCategory(category);
  }
</script>

<div>
  <h2>{selectedCategory}</h2>
  <div class="tech-grid">
    {#each technologies as tech}
      <div class="tech-card" data-proficiency={tech.proficiency}>
        <h3>{tech.name}</h3>
        <p>{tech.years} years experience</p>
        <p class="proficiency">Level {tech.proficiency}/10</p>
        <div class="tags">
          {#each tech.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .tech-card[data-proficiency="9"] { border-color: #f39c12; }
  .tech-card[data-proficiency="8"] { border-color: #3498db; }
  .tech-card[data-proficiency="7"] { border-color: #2ecc71; }
  .tech-card[data-proficiency="6"] { border-color: #9b59b6; }
</style>
```

### CSS Selectors

Query elements directly from SVG:

```javascript
// Get all frontend technologies
document.querySelectorAll('[data-category="frontend"]')

// Get all expert-level skills
document.querySelectorAll('[data-proficiency="9"]')

// Get skills with specific tag
document.querySelectorAll('[data-tags*="language"]')

// Get by category AND proficiency
document.querySelectorAll('[data-category="backend"][data-proficiency="9"]')
```

### In Visualizations

```javascript
// Bubble chart sizing based on proficiency
const radius = 15 + tech.proficiency * 5;

// Color by category using data attribute
const color = categoryColors[tech.category];

// Filter for display
const displayedTechs = visualElements.query({
  category: 'frontend',
  minYears: 3,
  sortBy: 'proficiency-desc'
});
```

## Querying API Reference

### Basic Getters

| Method | Returns | Example |
|--------|---------|---------|
| `get(id \| name)` | Single tech object or null | `get('ruby')` |
| `getAll()` | Array of all techs | `getAll()` |
| `getByCategory(cat)` | Array filtered by category | `getByCategory('backend')` |
| `getByTag(tag)` | Array filtered by tag | `getByTag('framework')` |
| `getByMinProficiency(num)` | Array at or above level | `getByMinProficiency(7)` |
| `getCategories()` | Unique category names | `getCategories()` |
| `getTags()` | Unique tag names | `getTags()` |
| `getSVGSymbol(id)` | SVG element | `getSVGSymbol('ruby')` |
| `createUseElement(id, x, y)` | SVG use element | `createUseElement('ruby', 10, 20)` |
| `getStats()` | Statistics object | `getStats()` |

### Advanced Query

```javascript
visualElements.query({
  category: 'frontend',          // Filter by category
  tag: 'framework',              // Filter by tag
  minProficiency: 7,             // Minimum proficiency
  maxProficiency: 9,             // Maximum proficiency
  minYears: 5,                   // Minimum years experience
  search: 'script',              // Search name/id
  sortBy: 'proficiency-desc'     // Sort: proficiency-desc, proficiency-asc, years-desc, years-asc, name-asc, name-desc
})
```

## Adding New Technologies

1. Add to `source/metadata/skills.yaml`
2. Add corresponding `<g>` element to `visual-elements.svg` with:
   - Unique `id` (lowercase, hyphenated)
   - `data-name`, `data-category`, `data-proficiency`, `data-years`, `data-tags`
   - SVG circle and text elements
3. SVG will auto-index on next load

## Use Cases

- 🎨 **Skill Visualizations** - Render tech cards with proficiency coloring
- 📊 **Resume/Portfolio** - Display all skills grouped by category
- 🔍 **Filtering** - Category/tag/proficiency filters for UIs
- 🏷️ **Labeling** - Auto-generate badge colors based on proficiency
- 📈 **Analytics** - Track skill distribution, years of experience
- 🧩 **Reusable Asset** - Single source of truth across all visualizations

## Benefits

✅ **DRY Principle** - One definition, used everywhere  
✅ **Type-Safe Queries** - Consistent data structure  
✅ **CSS-Queryable** - Direct DOM selection via data attributes  
✅ **Easy to Maintain** - Update YAML, rebuild SVG, changes propagate  
✅ **Visual Consistency** - Colors, badges, styling in one place  
✅ **Scalable** - Add hundreds of skills without code changes  
