import React, { useState, useEffect } from 'react';
import { X, Shield, PlusCircle, Trash, Edit, Check, UserCircle, Briefcase, Plus, Save } from 'lucide-react';

const HARDCODED_PASSWORD_HASH = '9881928f60e14fcbd7a28d2166ee4e8ba456daa9df696159dcae35050762895b'; // SHA-256 for "portfolio2026"

// Helper function to hash string with SHA-256 using Web Crypto API
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function AdminPanel({ 
  onClose, 
  projects, 
  onAddProject, 
  onDeleteProject, 
  onEditProject,
  onLoginSuccess,
  isLoggedIn,
  profileData,
  onUpdateProfile
}) {
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Navigation Tabs in Admin
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'profile'

  // --- Project Form states ---
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Video Editing');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/images/video_thumb.png');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4');
  const [frameType, setFrameType] = useState('video');
  const [toolsStr, setToolsStr] = useState('Premiere Pro, DaVinci Resolve');
  const [role, setRole] = useState('Lead Creator');
  const [client, setClient] = useState('Personal Project');
  const [date, setDate] = useState('June 2026');
  const [swatchesStr, setSwatchesStr] = useState('#E41C23, #1B365D, #F2C811');

  // --- Profile / Work Ex Form states ---
  const [profileName, setProfileName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileWebsite, setProfileWebsite] = useState('');
  const [profileSkillsStr, setProfileSkillsStr] = useState('');
  const [profileExperience, setProfileExperience] = useState([]);
  
  // Dynamic Logo & Profile Pic URL States
  const [profileLogoMark, setProfileLogoMark] = useState('CS');
  const [profileLogoText, setProfileLogoText] = useState('CREATIVE.STUDIO');
  const [profileAvatarUrl, setProfileAvatarUrl] = useState('/images/profile_avatar.png');
  const [profileTaglinesStr, setProfileTaglinesStr] = useState('');
  const [profileUxTag, setProfileUxTag] = useState('');

  // New experience item form states
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpPeriod, setNewExpPeriod] = useState('');

  // Sync profile data state when it loads
  useEffect(() => {
    if (profileData) {
      setProfileName(profileData.name || '');
      setProfileBio(profileData.bio || '');
      setProfileLocation(profileData.location || '');
      setProfileEmail(profileData.email || '');
      setProfileWebsite(profileData.website || '');
      setProfileSkillsStr(profileData.skills ? profileData.skills.join(', ') : '');
      setProfileExperience(profileData.experience || []);
      setProfileLogoMark(profileData.logoMark || 'CS');
      setProfileLogoText(profileData.logoText || 'CREATIVE.STUDIO');
      setProfileAvatarUrl(profileData.avatarUrl || '/images/profile_avatar.png');
      setProfileTaglinesStr(profileData.taglines ? profileData.taglines.join(', ') : '');
      setProfileUxTag(profileData.uxTag || '');
    }
  }, [profileData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const hashedInput = await hashPassword(password);
      if (hashedInput === HARDCODED_PASSWORD_HASH) {
        onLoginSuccess();
      } else {
        setLoginError('Invalid password. Access Denied.');
      }
    } catch (err) {
      setLoginError('Crypto error occurred.');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Parse tools list
    const tools = toolsStr.split(',').map(t => t.trim()).filter(Boolean);
    
    // Parse swatches (for graphic design frame)
    let swatches = [];
    if (frameType === 'graphic' && swatchesStr) {
      swatches = swatchesStr.split(',').map((hex, index) => {
        const cleanHex = hex.trim();
        return {
          name: `Color ${index + 1}`,
          hex: cleanHex.startsWith('#') ? cleanHex : `#${cleanHex}`
        };
      }).filter(s => s.hex.length === 7);
    }

    const projectData = {
      title,
      category,
      description,
      image,
      videoUrl: (frameType === 'video' || frameType === 'motion') ? videoUrl : undefined,
      frameType,
      frameStyle: frameType === 'video' ? 'cinema-viewfinder' : 
                  frameType === 'motion' ? 'timeline-workspace' :
                  frameType === 'uiux' ? 'iphone-mockup' : 'canvas-inspector',
      tools,
      role,
      client,
      date,
      swatches: frameType === 'graphic' ? swatches : undefined,
      interactiveData: frameType === 'uiux' ? {
        balance: "$12,450.00",
        change: "+2.5%",
        transactions: [
          { label: "Mock Initial Load", amount: "+$12,450.00", date: "June 2026", positive: true }
        ]
      } : undefined
    };

    if (editingId) {
      onEditProject(editingId, projectData);
      setEditingId(null);
    } else {
      onAddProject(projectData);
    }

    resetForm();
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      name: profileName,
      bio: profileBio,
      location: profileLocation,
      email: profileEmail,
      website: profileWebsite,
      skills: profileSkillsStr.split(',').map(s => s.trim()).filter(Boolean),
      experience: profileExperience,
      logoMark: profileLogoMark,
      logoText: profileLogoText,
      avatarUrl: profileAvatarUrl,
      taglines: profileTaglinesStr.split(',').map(t => t.trim()).filter(Boolean),
      uxTag: profileUxTag
    };
    onUpdateProfile(updatedProfile);
  };

  const addExperienceItem = () => {
    if (!newExpCompany || !newExpRole || !newExpPeriod) return;
    const newItem = {
      company: newExpCompany,
      role: newExpRole,
      period: newExpPeriod
    };
    setProfileExperience(prev => [...prev, newItem]);
    setNewExpCompany('');
    setNewExpRole('');
    setNewExpPeriod('');
  };

  const deleteExperienceItem = (indexToDelete) => {
    setProfileExperience(prev => prev.filter((_, idx) => idx !== indexToDelete));
  };

  const startEdit = (proj) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setCategory(proj.category);
    setDescription(proj.description);
    setImage(proj.image);
    setVideoUrl(proj.videoUrl || '');
    setFrameType(proj.frameType);
    setToolsStr(proj.tools.join(', '));
    setRole(proj.role || '');
    setClient(proj.client || '');
    setDate(proj.date || '');
    if (proj.swatches) {
      setSwatchesStr(proj.swatches.map(s => s.hex).join(', '));
    } else {
      setSwatchesStr('');
    }
    setActiveTab('projects');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Video Editing');
    setDescription('');
    setImage('/images/video_thumb.png');
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4');
    setFrameType('video');
    setToolsStr('Premiere Pro, DaVinci Resolve');
    setRole('Lead Creator');
    setClient('Personal Project');
    setDate('June 2026');
    setSwatchesStr('#E41C23, #1B365D, #F2C811');
  };

  const handleFrameTypeChange = (val) => {
    setFrameType(val);
    if (val === 'video') {
      setImage('/images/video_thumb.png');
      setCategory('Video Editing');
    } else if (val === 'motion') {
      setImage('/images/motion_thumb.png');
      setCategory('Motion Graphics');
    } else if (val === 'uiux') {
      setImage('/images/ui_design.png');
      setCategory('UI/UX Design');
    } else if (val === 'graphic') {
      setImage('/images/poster_design.png');
      setCategory('Graphic Design');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-modal-overlay blur-backdrop" onClick={onClose}>
        <div className="auth-form-card" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="modal-close-btn" style={{ position: 'absolute', top: 16, right: 16 }} onClick={onClose}>
            <X size={18} />
          </button>
          
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <div style={{ 
              background: 'var(--accent-light)', 
              color: 'var(--accent)', 
              width: 50, 
              height: 50, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <Shield size={24} />
            </div>
            <h2 className="form-title">Admin Access Required</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
              Unlock project and profile customization parameters.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="password-input">Password Key</label>
              <input
                id="password-input"
                type="password"
                className="form-input"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                Hint: Standard default key is <code>portfolio2026</code>
              </span>
            </div>

            {loginError && <div className="error-text">{loginError}</div>}

            <button type="submit" className="btn-primary">
              Verify Credentials
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-modal-overlay blur-backdrop" onClick={onClose}>
      <div className="admin-panel-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header and Close controls */}
        <div className="form-header-row" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '8px' }}>
          <div>
            <h2 className="form-title">Admin Management Suite</h2>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Manage your projects or edit your profile experience</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <button
            key="tab-projects"
            type="button"
            className={`filter-tab ${activeTab === 'projects' ? 'active' : ''}`}
            style={{ borderRadius: '6px', padding: '8px 16px' }}
            onClick={() => setActiveTab('projects')}
          >
            📂 Manage Projects
          </button>
          <button
            key="tab-profile"
            type="button"
            className={`filter-tab ${activeTab === 'profile' ? 'active' : ''}`}
            style={{ borderRadius: '6px', padding: '8px 16px' }}
            onClick={() => setActiveTab('profile')}
          >
            👤 Edit Profile, Brand Logo & Avatar
          </button>
        </div>

        {/* TAB 1: MANAGE PROJECTS */}
        {activeTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent)' }}>
                {editingId ? '⚡ EDITING CURRENT PROJECT' : '➕ ADD A NEW PORTFOLIO PROJECT'}
              </div>
              
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Project Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                    placeholder="e.g. Cybernetic Soundscape Video"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Interactive Preview Frame Type</label>
                  <select 
                    className="form-select" 
                    value={frameType} 
                    onChange={(e) => handleFrameTypeChange(e.target.value)}
                  >
                    <option value="video">🎥 Cinema Video Player Frame</option>
                    <option value="motion">✨ Motion Timeline Work Frame</option>
                    <option value="uiux">📱 UI/UX Phone / Desktop Web Frame</option>
                    <option value="graphic">🎨 Graphic Design Canvas Inspector Frame</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Display Category</label>
                  <select 
                    className="form-select" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Video Editing">Video Editing</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Thumbnail Asset Path</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={image} 
                    onChange={(e) => setImage(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              {(frameType === 'video' || frameType === 'motion') && (
                <div className="form-group">
                  <label className="form-label">Video Loop URL (MP4 Format)</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    value={videoUrl} 
                    onChange={(e) => setVideoUrl(e.target.value)} 
                    required 
                  />
                </div>
              )}

              {frameType === 'graphic' && (
                <div className="form-group">
                  <label className="form-label">Color Swatches (Comma separated Hex codes)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={swatchesStr} 
                    onChange={(e) => setSwatchesStr(e.target.value)} 
                    placeholder="e.g. #FF5733, #33FF57, #3357FF"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Project Description</label>
                <textarea 
                  className="form-textarea" 
                  rows="3" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  required
                  placeholder="Provide a compelling Behance-style project workflow story..."
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Software Tools (Comma separated)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={toolsStr} 
                    onChange={(e) => setToolsStr(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Created Date / Period</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">My Role / Responsibilities</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={client} 
                    onChange={(e) => setClient(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                {editingId && (
                  <button type="button" className="btn-secondary" onClick={resetForm}>
                    Cancel Edit
                  </button>
                )}
                <button type="submit" className="btn-primary">
                  <PlusCircle size={16} />
                  <span>{editingId ? 'Apply Update' : 'Publish Project'}</span>
                </button>
              </div>
            </form>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

            <div>
              <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>Modify Existing Projects</h3>
              <div className="admin-projects-list">
                {projects.map((proj) => (
                  <div key={proj.id} className="admin-project-item">
                    <span className="admin-proj-title">{proj.title}</span>
                    <div className="admin-proj-actions">
                      <button 
                        type="button" 
                        className="btn-admin" 
                        style={{ padding: '4px 8px', fontSize: 12 }} 
                        onClick={() => startEdit(proj)}
                      >
                        <Edit size={12} />
                      </button>
                      <button 
                        type="button" 
                        className="btn-danger" 
                        onClick={() => onDeleteProject(proj.id)}
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EDIT PROFILE, BRAND LOGO & AVATAR */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent)' }}>
              👤 UPDATE DISPLAY BIOGRAPHY, BRAND LOGO, AVATAR & WORK TIMELINE
            </div>

            {/* Logo Settings Row */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 16, background: 'var(--bg-tertiary)' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 12 }}>🛡️ Brand Logo Customization</label>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Logo Initials Mark (e.g. CS)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileLogoMark} 
                    onChange={(e) => setProfileLogoMark(e.target.value)} 
                    required 
                    placeholder="e.g. SL"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Logo Brand Text (e.g. CREATIVE.STUDIO)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileLogoText} 
                    onChange={(e) => setProfileLogoText(e.target.value)} 
                    required 
                    placeholder="e.g. SHALINI.DESIGN"
                  />
                </div>
              </div>
            </div>

            {/* Profile Avatar Settings */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 16, background: 'var(--bg-tertiary)' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 12 }}>📸 Profile Picture (Avatar)</label>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 11 }}>Avatar Image URL or Path</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={profileAvatarUrl} 
                  onChange={(e) => setProfileAvatarUrl(e.target.value)} 
                  required 
                  placeholder="e.g. /images/profile_avatar.png or http://external.link/pic.jpg"
                />
              </div>
            </div>

            {/* Profile Taglines & UX Tag Settings */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 16, background: 'var(--bg-tertiary)' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 12 }}>🏷️ Profile Taglines & UX Tag</label>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Profile UX Tag (e.g. UI/UX Lite)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileUxTag} 
                    onChange={(e) => setProfileUxTag(e.target.value)} 
                    placeholder="e.g. UI/UX Lite"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 11 }}>Profile Taglines (Comma separated)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profileTaglinesStr} 
                    onChange={(e) => setProfileTaglinesStr(e.target.value)} 
                    placeholder="e.g. 🎥 Video Editor, ✨ Motion Graphics"
                  />
                </div>
              </div>
            </div>

            {/* Basic Info Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Designer Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location / Hub</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={profileLocation} 
                  onChange={(e) => setProfileLocation(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Public Email Contact</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={profileEmail} 
                  onChange={(e) => setProfileEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Website Domain</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={profileWebsite} 
                  onChange={(e) => setProfileWebsite(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Creator Biography (Behance Headline)</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                value={profileBio} 
                onChange={(e) => setProfileBio(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Software Skills Tags (Comma separated)</label>
              <input 
                type="text" 
                className="form-input" 
                value={profileSkillsStr} 
                onChange={(e) => setProfileSkillsStr(e.target.value)} 
                required 
              />
            </div>

            {/* Experience timeline items section */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 16, background: 'var(--bg-tertiary)' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 12 }}>💼 Work Experience Timeline</label>
              
              {/* Existing items list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {profileExperience.length === 0 ? (
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>No work experience added yet.</div>
                ) : (
                  profileExperience.map((exp, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: 13 }}>
                        <strong>{exp.company}</strong> — <span style={{ color: 'var(--text-secondary)' }}>{exp.role}</span> <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', background: 'var(--bg-tertiary)', padding: '1px 6px', borderRadius: 4, marginLeft: 6 }}>{exp.period}</span>
                      </div>
                      <button 
                        type="button" 
                        className="btn-danger" 
                        style={{ padding: '3px 8px', fontSize: 11 }}
                        onClick={() => deleteExperienceItem(idx)}
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add experience element */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-secondary)', padding: 12, borderRadius: 6, border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--text-secondary)' }}>ADD AN EXPERIENCE RECORD</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <input 
                    type="text" 
                    placeholder="Company (e.g. Surie Polex)" 
                    className="form-input"
                    value={newExpCompany}
                    onChange={(e) => setNewExpCompany(e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Role (e.g. Graphic Designer)" 
                    className="form-input"
                    value={newExpRole}
                    onChange={(e) => setNewExpRole(e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Period (e.g. 3 Years / 2021-2024)" 
                    className="form-input"
                    value={newExpPeriod}
                    onChange={(e) => setNewExpPeriod(e.target.value)}
                  />
                </div>
                <button 
                  type="button" 
                  className="btn-primary" 
                  style={{ alignSelf: 'flex-end', padding: '6px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                  onClick={addExperienceItem}
                >
                  <Plus size={12} /> Add Record
                </button>
              </div>
            </div>

            {/* Save profile updates button */}
            <button type="submit" className="btn-primary" style={{ display: 'flex', gap: 8, alignSelf: 'flex-end', padding: '12px 24px' }}>
              <Save size={16} />
              <span>Save & Update Profile</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
