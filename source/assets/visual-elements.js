/**
 * Visual Elements Utility
 * Query and interact with technologies defined in visual-elements.svg
 */

export class VisualElements {
  constructor(svgPath = '/source/assets/visual-elements.svg') {
    this.svgPath = svgPath;
    this.svg = null;
    this.technologies = new Map();
  }

  /**
   * Load SVG and parse technology definitions
   */
  async load() {
    try {
      const response = await fetch(this.svgPath);
      const svgText = await response.text();
      const parser = new DOMParser();
      this.svg = parser.parseFromString(svgText, 'image/svg+xml');
      this._parseTechnologies();
      return this;
    } catch (error) {
      console.error('Failed to load visual-elements.svg:', error);
      throw error;
    }
  }

  /**
   * Parse all technology symbols from SVG
   */
  _parseTechnologies() {
    const symbols = this.svg.querySelectorAll('[id][data-name]');

    symbols.forEach(el => {
      const tech = {
        id: el.id,
        name: el.getAttribute('data-name'),
        category: el.getAttribute('data-category'),
        proficiency: parseInt(el.getAttribute('data-proficiency')),
        years: parseInt(el.getAttribute('data-years')),
        tags: (el.getAttribute('data-tags') || '').split(',').map(t => t.trim()),
      };

      this.technologies.set(tech.id, tech);
      this.technologies.set(tech.name.toLowerCase(), tech);
    });
  }

  /**
   * Get technology by ID or name
   * @param {string} identifier - ID or name of technology
   * @returns {Object|null} Technology definition
   */
  get(identifier) {
    return this.technologies.get(identifier) ||
           this.technologies.get(identifier.toLowerCase()) ||
           null;
  }

  /**
   * Get all technologies
   * @returns {Array} All technology definitions
   */
  getAll() {
    const seen = new Set();
    return Array.from(this.technologies.values()).filter(tech => {
      if (seen.has(tech.id)) return false;
      seen.add(tech.id);
      return true;
    });
  }

  /**
   * Filter technologies by category
   * @param {string} category - Category to filter by
   * @returns {Array} Technologies in that category
   */
  getByCategory(category) {
    return this.getAll().filter(t => t.category === category);
  }

  /**
   * Filter technologies by tag
   * @param {string} tag - Tag to filter by
   * @returns {Array} Technologies with that tag
   */
  getByTag(tag) {
    return this.getAll().filter(t => t.tags.includes(tag));
  }

  /**
   * Filter technologies by minimum proficiency
   * @param {number} minProficiency - Minimum proficiency level (1-10)
   * @returns {Array} Technologies at or above proficiency
   */
  getByMinProficiency(minProficiency) {
    return this.getAll().filter(t => t.proficiency >= minProficiency);
  }

  /**
   * Get unique categories
   * @returns {Array} List of all categories
   */
  getCategories() {
    const categories = new Set(this.getAll().map(t => t.category));
    return Array.from(categories).sort();
  }

  /**
   * Get unique tags
   * @returns {Array} List of all tags
   */
  getTags() {
    const tags = new Set();
    this.getAll().forEach(t => t.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }

  /**
   * Get SVG symbol element for a technology
   * @param {string} identifier - ID or name of technology
   * @returns {Element|null} SVG group element
   */
  getSVGSymbol(identifier) {
    const tech = this.get(identifier);
    if (!tech) return null;
    return this.svg.getElementById(tech.id);
  }

  /**
   * Create an SVG use element for a technology
   * @param {string} identifier - ID or name of technology
   * @param {number} x - X position
   * @param {number} y - Y position
   * @returns {Element} SVG use element
   */
  createUseElement(identifier, x = 0, y = 0) {
    const tech = this.get(identifier);
    if (!tech) return null;

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${this.svgPath}#${tech.id}`);
    use.setAttribute('x', x);
    use.setAttribute('y', y);
    return use;
  }

  /**
   * Get technology stats
   * @returns {Object} Statistics about technologies
   */
  getStats() {
    const all = this.getAll();
    const byProficiency = {};
    const byCategory = {};
    const byYears = { total: 0, average: 0 };

    all.forEach(t => {
      byProficiency[t.proficiency] = (byProficiency[t.proficiency] || 0) + 1;
      byCategory[t.category] = (byCategory[t.category] || 0) + 1;
      byYears.total += t.years;
    });

    byYears.average = Math.round(byYears.total / all.length);

    return {
      total: all.length,
      byProficiency,
      byCategory,
      byYears,
      categories: this.getCategories(),
      tags: this.getTags(),
    };
  }

  /**
   * Query technologies with multiple filters
   * @param {Object} filters - Filter criteria
   * @returns {Array} Matching technologies
   */
  query(filters = {}) {
    let results = this.getAll();

    if (filters.category) {
      results = results.filter(t => t.category === filters.category);
    }

    if (filters.tag) {
      results = results.filter(t => t.tags.includes(filters.tag));
    }

    if (filters.minProficiency) {
      results = results.filter(t => t.proficiency >= filters.minProficiency);
    }

    if (filters.maxProficiency) {
      results = results.filter(t => t.proficiency <= filters.maxProficiency);
    }

    if (filters.minYears) {
      results = results.filter(t => t.years >= filters.minYears);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(t =>
        t.name.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower)
      );
    }

    if (filters.sortBy) {
      results = this._sortResults(results, filters.sortBy);
    }

    return results;
  }

  /**
   * Sort results by specified field
   */
  _sortResults(results, sortBy) {
    const copy = [...results];

    switch (sortBy) {
      case 'proficiency-desc':
        return copy.sort((a, b) => b.proficiency - a.proficiency);
      case 'proficiency-asc':
        return copy.sort((a, b) => a.proficiency - b.proficiency);
      case 'years-desc':
        return copy.sort((a, b) => b.years - a.years);
      case 'years-asc':
        return copy.sort((a, b) => a.years - b.years);
      case 'name-asc':
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return copy.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return copy;
    }
  }
}

// Export singleton instance
export const visualElements = new VisualElements();
