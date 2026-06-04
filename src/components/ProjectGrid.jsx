import React, { useState } from 'react';
import { Eye, ThumbsUp, Search, Sparkles } from 'lucide-react';

const categories = ['All', 'Video Editing', 'Motion Graphics', 'Graphic Design', 'UI/UX Design'];

export default function ProjectGrid({ projects, onProjectClick, onAddProjectClick, isAdmin }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects based on category and search query
  const filteredProjects = projects.filter(project => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.tools.some(tool => tool.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="portfolio-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="filter-bar">
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%', maxWidth: '320px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search tools or titles..."
              style={{ paddingLeft: '36px', height: '40px', borderRadius: '20px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isAdmin && (
            <button 
              type="button" 
              className="btn-add-project" 
              onClick={onAddProjectClick}
              style={{ flexShrink: 0, height: '40px' }}
            >
              <Sparkles size={16} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">No projects found</div>
          <p>Try resetting your filters or adjusting your search query.</p>
        </div>
      ) : (
        <div className="project-grid">
          {filteredProjects.map((project) => (
            <article 
              key={project.id} 
              className="project-card"
              onClick={() => onProjectClick(project)}
            >
              <div className="card-media-wrapper">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="card-image"
                  loading="lazy" 
                />
                
                {/* Behance-like Hover Overlay */}
                <div className="card-hover-overlay">
                  <div className="overlay-top">
                    <span className="frame-type-badge">
                      {project.frameType === 'video' && '🎥 Cinema Frame'}
                      {project.frameType === 'motion' && '✨ Timeline Work'}
                      {project.frameType === 'uiux' && '📱 Mobile Frame'}
                      {project.frameType === 'graphic' && '🎨 Canvas Loupe'}
                    </span>
                  </div>
                  
                  <div className="overlay-bottom">
                    <h3 className="overlay-title">{project.title}</h3>
                    <div className="overlay-subtitle">
                      {project.tools.slice(0, 3).map((tool, i) => (
                        <span key={i} className="overlay-pill">{tool}</span>
                      ))}
                      {project.tools.length > 3 && <span className="overlay-pill">+{project.tools.length - 3}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-info">
                <div className="card-title-row">
                  <h3 className="card-title">{project.title}</h3>
                </div>
                
                <div className="card-meta-row">
                  <span className="card-category">{project.category}</span>
                  <div className="card-stats">
                    <span className="card-stat">
                      <Eye size={13} />
                      {project.views >= 1000 ? `${(project.views / 1000).toFixed(1)}k` : project.views}
                    </span>
                    <span className="card-stat">
                      <ThumbsUp size={13} />
                      {project.likes}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
