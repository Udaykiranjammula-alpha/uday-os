import React, { useState, useMemo } from 'react';
import { ArrowUpRight, Search, CheckCircle2 } from 'lucide-react';
import type { Project, ProjectCategory } from '../types';
import { projects } from '../data/projects';

interface ProjectsAppProps {
  onOpenProject: (project: Project) => void;
}

const categories: ProjectCategory[] = [
  'All',
  'Web Development',
  'Embedded Systems',
  'Artificial Intelligence',
];

export function ProjectsApp({ onOpenProject }: ProjectsAppProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [searchFilter, setSearchFilter] = useState('');

  const visibleProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;
      const q = searchFilter.toLowerCase();
      const matchesSearch =
        !searchFilter.trim() ||
        project.title.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.stack.some((s) => s.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchFilter]);

  return (
    <div className="phone-screen-content">
      {/* Intro Header */}
      <div className="section-intro-block">
        <span className="eyebrow-accent">PORTFOLIO WORK</span>
        <h2>Selected Engineering</h2>
        <p className="muted-text">
          Real projects, verified architectures, hardware experiments, and web platforms.
        </p>
      </div>

      {/* Search Input */}
      <div className="project-search-wrapper">
        <Search size={14} className="search-icon-muted" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter by tech or keyword..."
          className="project-search-input"
          aria-label="Filter projects"
        />
      </div>

      {/* Category Pills */}
      <div className="category-scroll-strip" role="tablist" aria-label="Project Categories">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              type="button"
              key={cat}
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              role="tab"
              aria-selected={isActive}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Projects List */}
      <div className="project-cards-stack">
        {visibleProjects.map((project) => (
          <button
            type="button"
            key={project.id}
            className="project-summary-card"
            onClick={() => onOpenProject(project)}
            aria-label={`Open project details for ${project.title}`}
          >
            <div
              className="project-accent-indicator"
              style={{ background: project.accent }}
              aria-hidden="true"
            />
            <div className="project-card-body">
              <div className="project-category-row">
                <span className="category-tag">{project.category}</span>
                <span className="status-badge-inline">{project.status}</span>
              </div>
              <h3 className="project-card-title">{project.title}</h3>
              <p className="project-card-summary">{project.summary}</p>

              <div className="project-highlights-preview">
                <div className="highlight-item">
                  <CheckCircle2 size={12} className="check-icon" />
                  <span>{project.features[0]}</span>
                </div>
              </div>

              <div className="tech-badge-row">
                {project.stack.slice(0, 4).map((tech) => (
                  <span key={tech} className="tech-badge">
                    {tech}
                  </span>
                ))}
                {project.stack.length > 4 && (
                  <span className="tech-badge-more">+{project.stack.length - 4}</span>
                )}
              </div>
            </div>
            <ArrowUpRight size={16} className="card-open-arrow" />
          </button>
        ))}

        {visibleProjects.length === 0 && (
          <div className="empty-projects-state">
            <p>No projects match your filter criteria.</p>
            <button
              type="button"
              className="clear-filter-btn"
              onClick={() => {
                setSelectedCategory('All');
                setSearchFilter('');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
