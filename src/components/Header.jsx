import React from 'react';
import { Mail, Globe, MapPin, Briefcase, Calendar, FileText } from 'lucide-react';

export default function Header({ profileData, onBuildResumeClick, isAdmin, projects, onUpdateProfile }) {
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
    uxTag = "",
    totalProjectsVal = projects ? String(projects.length) : "4",
    totalProjectsLbl = "Total Projects",
    impactfulWorkVal = "100%",
    impactfulWorkLbl = "Impactful Work Done",
    categoryWiseVal = "4 Video, 3 Graphics",
    categoryWiseLbl = "Category Breakdown"
  } = profileData;

  return (
    <section className="profile-cover-section animate-fade-in">
      <div className="profile-card">
        
        {/* Left Column/Half: Profile Avatar, Name, Taglines, Bio, Socials, Skills */}
        <div className="profile-left-half">
          
          {/* Row 1: Profile picture + Name and Taglines */}
          <div className="profile-header-row">
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
            
            <div className="profile-header-text">
              <h1 className="profile-title" style={{ margin: 0 }}>{name}</h1>
              {taglines && taglines.length > 0 && (
                <div className="profile-taglines">
                  {taglines.map((tagline, idx) => (
                    <span key={idx} className="tagline-pill">{tagline}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Profile Description */}
          <p className="profile-bio">{bio}</p>

          {/* Socials / Location details */}
          <div className="profile-socials-row">
            {location && (
              <span className="social-item">
                <MapPin size={14} /> {location}
              </span>
            )}
            {email && (
              <span className="social-item">
                <Mail size={14} /> {email}
              </span>
            )}
            {website && (
              <span className="social-item">
                <Globe size={14} /> {website}
              </span>
            )}
          </div>

          {/* Skills Grid */}
          <div className="profile-skills-grid">
            {skills.map((skill, index) => (
              <span key={index} className="skill-badge">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column/Half: Work Experience Timeline above Stats */}
        <div className="profile-right-half">
          
          {/* Work Experience Timeline Section */}
          {experience && experience.length > 0 && (
            <div className="experience-timeline-container">
              <div className="experience-timeline-title">
                <Briefcase size={12} />
                Work Experience Timeline
              </div>
              <div className="experience-timeline-list">
                {experience.map((exp, idx) => (
                  <div key={idx} className="experience-timeline-item">
                    <div>
                      <strong className="timeline-company">{exp.company}</strong>
                      <span className="timeline-role"> — {exp.role}</span>
                    </div>
                    <span className="timeline-period">
                      <Calendar size={10} style={{ display: 'inline', marginRight: 4 }} />
                      {exp.period}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Stats & Resume Builder */}
          <div className="profile-stats-container">
            <div className="profile-stats-grid">
              <div className="stat-item">
                <input 
                  type="text"
                  className="stat-input-val"
                  value={totalProjectsVal}
                  onChange={(e) => {
                    if (onUpdateProfile) {
                      onUpdateProfile({
                        ...profileData,
                        totalProjectsVal: e.target.value
                      });
                    }
                  }}
                  placeholder="4"
                  title="Click to edit Total Projects value"
                />
                <input 
                  type="text"
                  className="stat-input-lbl"
                  value={totalProjectsLbl}
                  onChange={(e) => {
                    if (onUpdateProfile) {
                      onUpdateProfile({
                        ...profileData,
                        totalProjectsLbl: e.target.value
                      });
                    }
                  }}
                  placeholder="Total Projects"
                  title="Click to edit Total Projects label"
                />
              </div>
              
              <div className="stat-item">
                <input 
                  type="text"
                  className="stat-input-val"
                  value={categoryWiseVal}
                  onChange={(e) => {
                    if (onUpdateProfile) {
                      onUpdateProfile({
                        ...profileData,
                        categoryWiseVal: e.target.value
                      });
                    }
                  }}
                  placeholder="4 Video, 3 Graphics"
                  title="Click to edit Category breakdown value"
                />
                <input 
                  type="text"
                  className="stat-input-lbl"
                  value={categoryWiseLbl}
                  onChange={(e) => {
                    if (onUpdateProfile) {
                      onUpdateProfile({
                        ...profileData,
                        categoryWiseLbl: e.target.value
                      });
                    }
                  }}
                  placeholder="Category Breakdown"
                  title="Click to edit Category breakdown label"
                />
              </div>

              <div className="stat-item">
                <input 
                  type="text"
                  className="stat-input-val"
                  value={impactfulWorkVal}
                  onChange={(e) => {
                    if (onUpdateProfile) {
                      onUpdateProfile({
                        ...profileData,
                        impactfulWorkVal: e.target.value
                      });
                    }
                  }}
                  placeholder="100%"
                  title="Click to edit Impactful Work value"
                />
                <input 
                  type="text"
                  className="stat-input-lbl"
                  value={impactfulWorkLbl}
                  onChange={(e) => {
                    if (onUpdateProfile) {
                      onUpdateProfile({
                        ...profileData,
                        impactfulWorkLbl: e.target.value
                      });
                    }
                  }}
                  placeholder="Impactful Work Done"
                  title="Click to edit Impactful Work label"
                />
              </div>
            </div>
            
            <button 
              type="button" 
              className="btn-admin" 
              style={{ 
                marginTop: 8, 
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

      </div>
    </section>
  );
}
