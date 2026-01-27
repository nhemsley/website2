# Interactive Resume Visualization Design

## Overview

Transform the traditional resume into an **interactive vertical story** that uses data visualizations and animations to tell your professional journey. Users scroll through different sections, each featuring tailored visualizations that reveal skills, experience, projects, and growth over time.

## Core Concept

Instead of a static PDF or HTML resume, create a **scrollytelling** experience where:
- Each section focuses on a specific narrative (skills, timeline, projects, etc.)
- Visualizations activate and animate as sections come into view
- Interactions are graceful and reveal more detail on demand
- The overall flow tells a cohesive story of growth and expertise

## Layout Structure

```
┌─────────────────────────────────────────┐
│  Hero Section                            │
│  - Name, title, brief intro             │
│  - Subtle animation (breathing orbits?)  │
├─────────────────────────────────────────┤
│  Transition / Divider                   │
├─────────────────────────────────────────┤
│  Section: Skills Journey                │
│  - Timeline: "2015-2025 Tech Evolution" │
│  - Visualization: Skill bubble chart    │
│  - Movement: Breathing + Orbit          │
│  - Interaction: Pause on hover          │
├─────────────────────────────────────────┤
│  Transition / Divider                   │
├─────────────────────────────────────────┤
│  Section: Experience Arc                │
│  - Title: "Companies & Roles"           │
│  - Visualization: Timeline or network   │
│  - Shows progression, skills acquired   │
├─────────────────────────────────────────┤
│  Transition / Divider                   │
├─────────────────────────────────────────┤
│  Section: Projects & Impact             │
│  - Title: "Work & Contributions"        │
│  - Visualization: Pack hierarchy tree   │
│  - Size = impact, color = category      │
├─────────────────────────────────────────┤
│  Transition / Divider                   │
├─────────────────────────────────────────┤
│  Section: Contact & Links               │
│  - GitHub, LinkedIn, email              │
│  - Maybe a constellation/network viz    │
└─────────────────────────────────────────┘
```

## Sections & Visualizations

### 1. Hero Section
**Purpose:** Introduce yourself and set the tone

**Content:**
- Name, current title/role
- One-line tagline
- Brief summary (2-3 sentences)
- Links to GitHub, LinkedIn

**Visualization Idea:**
- Subtle breathing orbit effect with tech icons
- Or constellation of your main skills
- Background animation (non-intrusive)

---

### 2. Skills Journey (2015-2025)
**Purpose:** Show how your skills evolved over time

**Content:**
- Chronological timeline of skills acquired
- Proficiency levels for each skill
- Categories: Languages, Frameworks, Tools, Databases, etc.

**Visualization:**
- **Skill Bubble Chart** (viz-001-d3-bubble)
- Movement: Breathing Orbit (smooth, organic)
- Size: Proficiency level (larger = more skilled)
- Color: Category (Frontend = blue, Backend = red, etc.)
- Interactive: Hover to see project count, years experience

**Scroll Trigger:**
- Activate when section enters viewport
- Pause animations during interaction (already implemented!)
- Show debug toolbar in development mode

---

### 3. Experience Timeline
**Purpose:** Show career progression and context

**Content:**
- Company → Role → Duration → Key responsibilities
- Technologies used at each role
- Growth arc (junior → senior, contractor → employee, etc.)

**Visualization Options:**
- **Timeline (vertical):** Companies on Y-axis, years on X-axis
- **Force-directed network:** Companies as hubs, skills as nodes, connections = where you used them
- **Horizontal bar chart:** Roles over time with tech stack badges

**Interaction:**
- Click company to expand details
- Hover role to highlight related skills

---

### 4. Projects & Impact
**Purpose:** Showcase tangible work and contributions

**Content:**
- Featured projects (top 5-10)
- For each: name, description, tech stack, impact/outcome
- Links to GitHub, live demo, or case study

**Visualization:**
- **Pack Hierarchy:** Projects grouped by category, sized by complexity/impact
- **Treemap:** Similar, but rectangular layout
- **Network Graph:** Projects connected by shared technologies

**Interaction:**
- Hover to see details
- Click to expand or link to project
- Filter by category or technology

---

### 5. Expertise Clusters
**Purpose:** Show depth and breadth of knowledge

**Content:**
- Key areas of expertise (e.g., "Full-stack JavaScript", "DevOps", "Data Viz")
- Related skills and projects for each cluster

**Visualization:**
- **Constellation/Network:** Clusters as hubs, skills as stars, connections = relationships
- **Radial/Polar chart:** Expertise areas as spokes, proficiency as radius

---

### 6. Contact & Call-to-Action
**Purpose:** Make it easy to reach out

**Content:**
- Email
- GitHub profile
- LinkedIn
- Personal website/blog
- Optional: Calendar link for scheduling

**Visualization:**
- Clean, minimal
- Maybe a subtle animation inviting interaction

---

## Technical Architecture

### Data Model

```javascript
// Resume data structure
const resumeData = {
  hero: {
    name: "Nick Hemsley",
    title: "Full-stack Engineer",
    summary: "...",
  },
  skills: [
    {
      name: "JavaScript",
      category: "Language",
      proficiency: 9,
      yearsExperience: 10,
      projectCount: 25,
      acquiredYear: 2015,
    },
    // ... more skills
  ],
  experience: [
    {
      company: "Acme Corp",
      role: "Senior Engineer",
      duration: "2020-2025",
      description: "...",
      technologies: ["JavaScript", "React", "Node.js"],
    },
    // ... more roles
  ],
  projects: [
    {
      name: "Project X",
      description: "...",
      category: "Frontend",
      technologies: ["React", "D3.js"],
      impact: "1M+ users",
      link: "https://...",
    },
    // ... more projects
  ],
};
```

### Component Structure

```
App.svelte
├── Hero.svelte
├── Section.svelte (reusable wrapper)
│   ├── Divider.svelte
│   ├── SkillBubbleChart.svelte (viz-001)
│   ├── TimelineViz.svelte (TBD)
│   ├── ProjectsViz.svelte (TBD)
│   └── NetworkViz.svelte (TBD)
├── Contact.svelte
└── scroll-observer.ts (Intersection Observer for triggers)
```

### Scroll Triggers

**Implementation:**
- Use Intersection Observer API
- Trigger animations when section enters viewport
- Pause animations when user is interacting
- Resume after 4-5 seconds of no interaction (already have this!)

```javascript
// Pseudo-code
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Activate visualization
      vizComponent.activate();
    } else {
      // Optionally pause
      vizComponent.pause();
    }
  });
});

observer.observe(vizSection);
```

---

## Navigation & Movement Modes

### Scroll Behavior
- **Primary:** Smooth scroll through sections
- **Default movement:** Breathing Orbit (calming, organic)
- **Optional:** Let user change movement mode mid-scroll

### Alternative Navigation (Future)
- Keyboard arrows/space to navigate sections
- Slideshow mode (auto-advance every N seconds)
- Waypoint links (jump to section)
- Animated transitions between sections (wipes, fades)

---

## Visual Design

### Color Palette
- **Skill categories:** Use existing viz-001 palette
  - Frontend: `#3498db` (blue)
  - Backend: `#e74c3c` (red)
  - DevOps: `#f39c12` (orange)
  - Database: `#16a085` (teal)
  - Tools: `#795548` (brown)

### Typography
- **Hero:** Large, bold (48-64px)
- **Section titles:** Medium-large (32-40px)
- **Body text:** 16-18px
- **Font:** System-ui or similar (clean, modern)

### Spacing
- **Section height:** 100vh (full viewport)
- **Padding:** 2rem sides, 4rem vertical
- **Transitions:** Smooth, 300-600ms

### Transitions
- Section enters: Fade in + subtle slide (200ms)
- Visualization activates: Smooth animation start
- Hover effects: 200ms ease
- Dividers: Subtle line or gradient

---

## Interactive Features

### Must-Have
- ✅ Scroll-triggered animations
- ✅ Mouse pause (already built!)
- ✅ Hover tooltips on visualizations
- ✅ Responsive design (mobile-first)

### Nice-to-Have
- Filter/search skills
- Click to expand project details
- Share specific sections
- Dark mode
- Accessibility (ARIA labels, keyboard nav)

---

## Development Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Create resume data model
- [ ] Build Section component wrapper
- [ ] Implement scroll observer
- [ ] Build Hero section
- [ ] Create dividers/transitions

### Phase 2: Visualizations (Weeks 2-4)
- [ ] Integrate viz-001 (Skill Bubble Chart)
- [ ] Create TimelineViz for experience
- [ ] Create ProjectsViz (pack hierarchy)
- [ ] Test scroll triggers

### Phase 3: Polish (Weeks 4-5)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Dark mode (optional)
- [ ] Analytics (tracking which sections people spend time on)

### Phase 4: Deployment (Week 5+)
- [ ] Deploy to nhemsley.github.io
- [ ] Set up analytics
- [ ] Monitor performance
- [ ] Gather feedback

---

## Success Metrics

- **Engagement:** Time spent in each section
- **Interactions:** Hover/click events on visualizations
- **Accessibility:** Keyboard navigation works, screen readers functional
- **Performance:** Load time < 3s, smooth 60fps animations
- **Mobile:** Fully functional on mobile devices

---

## Future Enhancements

- 🎬 **Cinematic Mode:** Auto-play with narration (audio/video)
- 🎮 **Gamification:** Unlock sections, badges for interaction
- 📊 **Custom Metrics:** Toggle between different skill groupings
- 🌍 **Internationalization:** Multiple languages
- 📱 **Progressive Web App:** Offline capability
- 🎨 **Theme Customization:** Let visitors customize colors

---

## References

- **Scrollytelling:** https://pudding.cool/ (examples)
- **D3 Visualizations:** https://d3js.org/
- **viz-001:** `experiments/viz-001-d3-bubble/`
- **Intersection Observer:** https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API