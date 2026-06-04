import React from 'react';
import { Mail, Globe, MapPin, Briefcase, Calendar, FileText } from 'lucide-react';

export default function Header({ profileData, onBuildResumeClick, isAdmin }) {
  if (!profileData) return null;

  const {
    name = "Shalini",
    bio = "",
    location = "",
    email = "",
    website = "",
    skills = [],
    experience = [],
    avatarUrl = "/images/profile_avatar.png",
    taglines = [],
    uxTag = ""
  } = profileData;

  return (
    <section className="profile-cover-section animate-fade-in">
      <div className="profile-card" style={{ display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: '40px' }}>
        
        {/* Left Column: Avatar */}
        <div className="profile-avatar-wrapper">
          <img 
            src={avatarUrl} 
            alt={name} 
            className="profile-avatar" 
            onError={(e) => {
              e.target.src = "/images/profile_avatar.png";
            }}
          />
          {uxTag && <div className="profile-ux-tag">{uxTag}</div>}
        </div>

        {/* Center Column: Profile Info & Work Experience */}
        <div className="profile-info">
          <h1 className="profile-title" style={{ margin: 0 }}>{name}</h1>
          
          {taglines && taglines.length > 0 && (
            <div className="profile-taglines">
              {taglines.map((tagline, idx) => (
                <span key={idx} className="tagline-pill">{tagline}</span>
              ))}
            </div>
          )}

          <p className="profile-bio">{bio}</p>

          {/* Work Experience Timeline Section */}
          {experience && experience.length > 0 && (
            <div style={{ 
              marginTop: '12px', 
              padding: '16px', 
              background: 'var(--bg-tertiary)', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.5px' }}>
                <Briefcase size={12} />
                Work Experience Timeline
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {experience.map((exp, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '13px', flexWrap: 'wrap', gap: '4px' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{exp.company}</strong>
                      <span style={{ color: 'var(--text-secondary)' }}> — {exp.role}</span>
                    </div>
                    <span style={{ 
                      fontSize: '11px', 
                      fontFamily: 'var(--font-mono)', 
                      background: 'var(--bg-secondary)', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)'
                    }}>
                      <Calendar size={10} style={{ display: 'inline', marginRight: 4 }} />
                      {exp.period}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Socials / Location details */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 13, color: 'var(--text-secondary)', flexWrap: 'wrap', marginTop: 4 }}>
            {location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={14} /> {location}
              </span>
            )}
            {email && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Mail size={14} /> {email}
              </span>
            )}
            {website && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Globe size={14} /> {website}
              </span>
            )}
          </div>

          {/* Skills Grid */}
          <div className="profile-skills-grid" style={{ marginTop: 8 }}>
            {skills.map((skill, index) => (
              <span key={index} className="skill-badge">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Profile Stats & Resume builder Trigger */}
        <div className="profile-stats-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="stat-item">
              <div className="stat-val">52.4K</div>
              <div className="stat-lbl">Project Views</div>
            </div>
            <div className="stat-item">
              <div className="stat-val">6.8K</div>
              <div className="stat-lbl">Appreciations</div>
            </div>
          </div>
          
          <button 
            type="button" 
            className="btn-admin" 
            style={{ 
              marginTop: 20, 
              width: '100%', 
              justifyContent: 'center', 
              gap: 8,
              boxShadow: 'var(--shadow-sm)'
            }}
            onClick={onBuildResumeClick}
          >
            <FileText size={16} />
            <span>{isAdmin ? 'Build Resume' : 'View Resume'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
