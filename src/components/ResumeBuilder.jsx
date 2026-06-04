import React, { useState, useEffect } from 'react';
import { 
  X, Download, Eye, Layout, Settings, Trash2, ArrowUp, ArrowDown, 
  Plus, Save, Edit2, RotateCcw, Check, Square, CheckSquare, Sparkles 
} from 'lucide-react';

const TEMPLATES = [
  { id: 'minimalist', name: 'Minimalist Corporate', desc: 'Clean, professional sans-serif grid' },
  { id: 'editorial', name: 'Creative Editorial', desc: 'Warm cream, playfair serifs, literary style' },
  { id: 'cyberpunk', name: 'Cyberpunk Technologist', desc: 'Neon highlights, monospaced tech grid' },
  { id: 'executive', name: 'Modern Executive', desc: 'Navy blue highlights, structured headers' },
  { id: 'brutalist', name: 'Brutalist Grid', desc: 'Thick boundaries, high contrast headings' },
  { id: 'compact', name: 'Single-Column Compact', desc: 'Tight margins to fit maximum experience' },
  { id: 'sidebar', name: 'Split Left Sidebar', desc: 'Left column links & skills, right column history' },
  { id: 'swiss', name: 'Swiss Design Grid', desc: 'Asymmetrical alignment, clean geo borders' },
  { id: 'typewriter', name: 'Classic Typewriter', desc: 'Courier typewriter style, classic spacing' },
  { id: 'royal', name: 'Royal Gold & Ivory', desc: 'Ivory background, gold titles, serif layout' },
  { id: 'slate', name: 'Slate Minimalist', desc: 'Charcoal borders, soft rounded skills pills' }
];

export default function ResumeBuilder({ onClose, profileData, projects, isAdmin }) {
  const [selectedTemplate, setSelectedTemplate] = useState('minimalist');
  const [toastMsg, setToastMsg] = useState('');

  // Reorderable sections state
  const [sections, setSections] = useState([
    { id: 'header', name: 'Contact & Title Header', visible: true },
    { id: 'summary', name: 'Professional Summary', visible: true },
    { id: 'experience', name: 'Work Experience Timeline', visible: true },
    { id: 'projects', name: 'Featured Portfolio Projects', visible: true },
    { id: 'skills', name: 'Technical Skills & Badges', visible: true },
    { id: 'education', name: 'Education & Credentials', visible: true }
  ]);

  // Main editable fields state, auto-parsed from profileData
  const [resumeData, setResumeData] = useState({
    name: profileData?.name || 'Shalini',
    title: profileData?.title || 'Senior Motion Graphics & Video Editor',
    avatarUrl: profileData?.avatarUrl || '/images/profile_avatar.png',
    email: profileData?.email || 'shalini.design@studio.art',
    website: profileData?.website || 'shalini.art',
    location: profileData?.location || 'New Delhi, India',
    phone: '+91 98765 43210',
    bio: profileData?.bio || '',
    skills: profileData?.skills || [],
    experience: profileData?.experience || [],
    education: [
      { degree: 'Master of Fine Arts (MFA) in Motion Design', school: 'National Institute of Design', period: '2019 - 2021' },
      { degree: 'Bachelor of Design (B.Des) in Communication', school: 'College of Art, Delhi', period: '2015 - 2019' }
    ],
    // Project selection toggles: keep all enabled by default
    projectsList: (projects || []).map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      tools: p.tools,
      role: p.role,
      client: p.client,
      visible: true
    }))
  });

  // Inline section editing indices
  const [editingExpIdx, setEditingExpIdx] = useState(null);
  const [editingEduIdx, setEditingEduIdx] = useState(null);
  const [editingProjIdx, setEditingProjIdx] = useState(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  // Reorder sections
  const moveSection = (index, direction) => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    
    // Swap positions
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);
    triggerToast(`Moved ${temp.name} ${direction}.`);
  };

  // Toggle visibility of sections
  const toggleSectionVisible = (id) => {
    setSections(prev => prev.map(sec => 
      sec.id === id ? { ...sec, visible: !sec.visible } : sec
    ));
  };

  // Toggle project inclusion in resume
  const toggleProjectVisible = (projId) => {
    setResumeData(prev => ({
      ...prev,
      projectsList: prev.projectsList.map(p => 
        p.id === projId ? { ...p, visible: !p.visible } : p
      )
    }));
  };

  // PDF Download Trigger via Window Print
  const handleDownload = () => {
    window.print();
  };

  // State update handlers for inputs
  const handleBasicChange = (field, val) => {
    setResumeData(prev => ({ ...prev, [field]: val }));
  };

  const handleSkillsChange = (e) => {
    const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setResumeData(prev => ({ ...prev, skills: arr }));
  };

  // Experience crud
  const handleExpChange = (index, field, val) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: val } : exp
      )
    }));
  };

  const deleteExp = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
    setEditingExpIdx(null);
  };

  const addExp = () => {
    const newItem = { company: 'New Company', role: 'Designer Role', period: '2026' };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newItem]
    }));
    setEditingExpIdx(resumeData.experience.length);
  };

  // Education crud
  const handleEduChange = (index, field, val) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: val } : edu
      )
    }));
  };

  const deleteEdu = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
    setEditingEduIdx(null);
  };

  const addEdu = () => {
    const newItem = { degree: 'Degree Name', school: 'University Name', period: 'Period' };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newItem]
    }));
    setEditingEduIdx(resumeData.education.length);
  };

  return (
    <div className="admin-modal-overlay blur-backdrop" onClick={onClose} style={{ zIndex: 1500 }}>
      {/* Dynamic Printing Style rules targeting only the resume-print-area container */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          .resume-print-area, .resume-print-area * {
            visibility: visible !important;
          }
          .resume-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 20mm !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            z-index: 99999 !important;
          }
          .modal-overlay, .admin-modal-overlay, .modal-action-bar, .config-panel {
            display: none !important;
          }
        }
      `}} />

      {/* Styled Inner Workspace */}
      <div 
        className="modal-content-container animate-scale-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '1200px', width: '95vw', height: '90vh' }}
      >
        {/* Top Header */}
        <header className="modal-action-bar" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px' }}>
          <div>
            <h2 className="form-title" style={{ fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={20} style={{ color: 'var(--accent)' }} />
              Shalini's Resume Architect & Parser
            </h2>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {isAdmin 
                ? "Auto-parsed from portfolio. Drag modules & select from 11 templates." 
                : "Auto-parsed from portfolio layout. Ready to preview and download."
              }
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              type="button" 
              className="btn-primary" 
              style={{ padding: '8px 18px', display: 'flex', gap: 8, fontSize: 13, borderRadius: '30px' }}
              onClick={handleDownload}
            >
              <Download size={15} />
              Export to PDF
            </button>
            <button type="button" className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Workspace Body */}
        <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden', height: 'calc(100% - 70px)' }}>
          
          {/* LEFT SIDE: CONFIGURATION PANEL */}
          {isAdmin && (
            <div className="config-panel" style={{ 
              width: '40%', 
              borderRight: '1px solid var(--border-color)', 
              overflowY: 'auto', 
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              background: 'var(--bg-secondary)'
            }}>

            {/* Step 1: Select Template */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
                <Layout size={14} /> 1. Select Template Layout ({TEMPLATES.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    style={{
                      padding: '10px 14px',
                      background: selectedTemplate === tmpl.id ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      border: '1px solid',
                      borderColor: selectedTemplate === tmpl.id ? 'var(--accent)' : 'var(--border-color)',
                      borderRadius: 8,
                      textAlign: 'left',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: 13, color: selectedTemplate === tmpl.id ? 'var(--accent)' : 'var(--text-primary)' }}>
                      {tmpl.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{tmpl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Reorder & Toggle Sections */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
                <Settings size={14} /> 2. Reorder & Toggle Sections
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sections.map((sec, idx) => (
                  <div 
                    key={sec.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: 'var(--bg-tertiary)',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--border-color)',
                      fontSize: 12
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button 
                        type="button" 
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: sec.visible ? 'var(--accent)' : 'var(--text-secondary)' }}
                        onClick={() => toggleSectionVisible(sec.id)}
                      >
                        {sec.visible ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                      <span style={{ fontWeight: 600, color: sec.visible ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: sec.visible ? 'none' : 'line-through' }}>
                        {sec.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 4 }}>
                      <button 
                        type="button" 
                        className="control-btn"
                        style={{ padding: 4 }}
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, 'up')}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button 
                        type="button" 
                        className="control-btn"
                        style={{ padding: 4 }}
                        disabled={idx === sections.length - 1}
                        onClick={() => moveSection(idx, 'down')}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Edit Section Contents */}
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>
                ✍️ 3. Modify Content In-Place
              </h3>

              {/* Edit Header Info */}
              <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--text-secondary)' }}>HEADER CONTACT DATA</div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 10 }}>Display Name</label>
                  <input type="text" className="form-input" value={resumeData.name} onChange={(e) => handleBasicChange('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 10 }}>Title Title</label>
                  <input type="text" className="form-input" value={resumeData.title} onChange={(e) => handleBasicChange('title', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 10 }}>Email</label>
                    <input type="email" className="form-input" value={resumeData.email} onChange={(e) => handleBasicChange('email', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 10 }}>Phone</label>
                    <input type="text" className="form-input" value={resumeData.phone} onChange={(e) => handleBasicChange('phone', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 10 }}>Website</label>
                    <input type="text" className="form-input" value={resumeData.website} onChange={(e) => handleBasicChange('website', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: 10 }}>Location</label>
                    <input type="text" className="form-input" value={resumeData.location} onChange={(e) => handleBasicChange('location', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 10 }}>Avatar Image Link</label>
                  <input type="text" className="form-input" value={resumeData.avatarUrl} onChange={(e) => handleBasicChange('avatarUrl', e.target.value)} />
                </div>
              </div>

              {/* Edit Bio Summary */}
              <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--text-secondary)' }}>PROFESSIONAL PROFILE BIO</div>
                <textarea className="form-textarea" rows={3} value={resumeData.bio} onChange={(e) => handleBasicChange('bio', e.target.value)} />
              </div>

              {/* Edit Skills */}
              <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--text-secondary)' }}>TECHNICAL SKILLS (Comma separated)</div>
                <input type="text" className="form-input" value={resumeData.skills.join(', ')} onChange={handleSkillsChange} />
              </div>

              {/* Edit Experience list */}
              <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--text-secondary)' }}>EXPERIENCE CREDENTIALS</div>
                  <button type="button" className="btn-admin" style={{ padding: '2px 8px', fontSize: 10 }} onClick={addExp}>
                    <Plus size={10} /> Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 6, padding: 8 }}>
                      {editingExpIdx === idx ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <input type="text" placeholder="Company" className="form-input" style={{ fontSize: 12, padding: '4px 8px' }} value={exp.company} onChange={(e) => handleExpChange(idx, 'company', e.target.value)} />
                          <input type="text" placeholder="Role" className="form-input" style={{ fontSize: 12, padding: '4px 8px' }} value={exp.role} onChange={(e) => handleExpChange(idx, 'role', e.target.value)} />
                          <input type="text" placeholder="Period" className="form-input" style={{ fontSize: 12, padding: '4px 8px' }} value={exp.period} onChange={(e) => handleExpChange(idx, 'period', e.target.value)} />
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button type="button" className="btn-danger" style={{ fontSize: 10, padding: '2px 6px' }} onClick={() => deleteExp(idx)}>Delete</button>
                            <button type="button" className="btn-primary" style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => setEditingExpIdx(null)}>Done</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 'bold' }}>{exp.company} — {exp.role}</span>
                          <button type="button" className="btn-admin" style={{ padding: '2px 6px' }} onClick={() => setEditingExpIdx(idx)}>
                            <Edit2 size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit Education list */}
              <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--text-secondary)' }}>EDUCATION HISTORY</div>
                  <button type="button" className="btn-admin" style={{ padding: '2px 8px', fontSize: 10 }} onClick={addEdu}>
                    <Plus size={10} /> Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 6, padding: 8 }}>
                      {editingEduIdx === idx ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <input type="text" placeholder="Degree" className="form-input" style={{ fontSize: 12, padding: '4px 8px' }} value={edu.degree} onChange={(e) => handleEduChange(idx, 'degree', e.target.value)} />
                          <input type="text" placeholder="School" className="form-input" style={{ fontSize: 12, padding: '4px 8px' }} value={edu.school} onChange={(e) => handleEduChange(idx, 'school', e.target.value)} />
                          <input type="text" placeholder="Period" className="form-input" style={{ fontSize: 12, padding: '4px 8px' }} value={edu.period} onChange={(e) => handleEduChange(idx, 'period', e.target.value)} />
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button type="button" className="btn-danger" style={{ fontSize: 10, padding: '2px 6px' }} onClick={() => deleteEdu(idx)}>Delete</button>
                            <button type="button" className="btn-primary" style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => setEditingEduIdx(null)}>Done</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 'bold' }}>{edu.degree} — {edu.school}</span>
                          <button type="button" className="btn-admin" style={{ padding: '2px 6px' }} onClick={() => setEditingEduIdx(idx)}>
                            <Edit2 size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggle featured projects list */}
              <div style={{ background: 'var(--bg-tertiary)', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--text-secondary)' }}>INCLUDE PORTFOLIO PROJECTS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {resumeData.projectsList.map((proj) => (
                    <div 
                      key={proj.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8, 
                        fontSize: 11, 
                        background: 'var(--bg-secondary)', 
                        padding: '6px 10px', 
                        borderRadius: 6,
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <button 
                        type="button" 
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: proj.visible ? 'var(--accent)' : 'var(--text-secondary)' }}
                        onClick={() => toggleProjectVisible(proj.id)}
                      >
                        {proj.visible ? <CheckSquare size={14} /> : <Square size={14} />}
                      </button>
                      <span style={{ color: proj.visible ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: proj.visible ? 'bold' : 'normal' }}>
                        {proj.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

          {/* RIGHT SIDE: RESUME A4 SHEET PREVIEW SHEET */}
          <div style={{ 
            width: isAdmin ? '60%' : '100%', 
            background: '#2b2d35', 
            overflowY: 'auto', 
            padding: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}>
            
            {/* A4 Sheet Container */}
            <div 
              className={`resume-print-area theme-resume-${selectedTemplate}`}
              style={{
                width: '210mm',
                minHeight: '297mm',
                background: '#ffffff',
                color: '#2d3748',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                padding: '24mm 20mm',
                boxSizing: 'border-box',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11pt',
                lineHeight: '1.5',
                transition: 'all 0.3s'
              }}
            >
              {/* Inject local CSS specific to templates into A4 sheet block container */}
              <style dangerouslySetInnerHTML={{ __html: `
                .theme-resume-minimalist { font-family: 'Inter', sans-serif; color: #1a202c; }
                .theme-resume-minimalist h2 { border-bottom: 1.5px solid #2d3748; padding-bottom: 4px; margin-bottom: 12px; font-size: 14pt; text-transform: uppercase; letter-spacing: 0.5px; color: #1a202c; font-weight: bold; }
                .theme-resume-minimalist .res-title { color: #4a5568; font-weight: 500; font-size: 12pt; }
                
                .theme-resume-editorial { font-family: 'Playfair Display', Georgia, serif; color: #2d2621; background-color: #faf8f5 !important; }
                .theme-resume-editorial h2 { font-family: 'Playfair Display', serif; border-bottom: 1px italic # decbb4; font-size: 15pt; color: #b84c2a; font-style: italic; margin-bottom: 8px; font-weight: normal; }
                .theme-resume-editorial .res-title { font-family: 'Inter', sans-serif; font-size: 11pt; color: #6e5e54; font-weight: bold; }
                
                .theme-resume-cyberpunk { font-family: 'Space Mono', Courier, monospace; color: #00f0ff; background-color: #0b0c10 !important; }
                .theme-resume-cyberpunk h2 { border: 1px dashed #ff007f; padding: 6px 12px; font-size: 13pt; color: #ff007f; letter-spacing: 1px; margin-bottom: 12px; font-weight: bold; }
                .theme-resume-cyberpunk .res-title { color: #fff; font-size: 11pt; }
                .theme-resume-cyberpunk p, .theme-resume-cyberpunk span, .theme-resume-cyberpunk strong { color: #a5b4fc; }
                .theme-resume-cyberpunk .text-muted { color: #6366f1 !important; }
                
                .theme-resume-executive { font-family: 'Inter', sans-serif; color: #2d3748; }
                .theme-resume-executive h2 { font-size: 13pt; color: #0f172a; border-left: 4px solid #1e3a8a; padding-left: 8px; margin-bottom: 12px; font-weight: bold; text-transform: uppercase; }
                .theme-resume-executive .res-header-block { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; }
                
                .theme-resume-brutalist { font-family: 'Space Mono', sans-serif; color: #000; }
                .theme-resume-brutalist h2 { border: 2.5px solid #000; padding: 4px 10px; font-size: 14pt; font-weight: bold; color: #000; text-transform: uppercase; margin-bottom: 12px; background: #fff; }
                .theme-resume-brutalist .res-title { font-weight: bold; font-size: 12pt; text-decoration: underline; }
                
                .theme-resume-compact { font-family: 'Inter', sans-serif; color: #2d3748; font-size: 9.5pt; }
                .theme-resume-compact h2 { border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; font-size: 11pt; color: #0f172a; margin-bottom: 6px; font-weight: bold; text-transform: uppercase; }
                .theme-resume-compact p, .theme-resume-compact .res-item { margin-bottom: 4px; }
                
                .theme-resume-sidebar { display: grid; grid-template-columns: 28% 68%; gap: 4%; color: #2d3748; }
                .theme-resume-sidebar h2 { font-size: 12pt; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px; font-weight: bold; }
                .theme-resume-sidebar .sidebar-col { border-right: 1px solid #e2e8f0; padding-right: 16px; }
                
                .theme-resume-swiss { font-family: 'Inter', sans-serif; color: #111; }
                .theme-resume-swiss h2 { font-size: 18pt; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 12px; color: #000; border: none; padding: 0; }
                .theme-resume-swiss .res-item { display: grid; grid-template-columns: 120px 1fr; gap: 16px; margin-bottom: 12px; }
                
                .theme-resume-typewriter { font-family: 'Courier New', Courier, monospace; color: #111; }
                .theme-resume-typewriter h2 { font-size: 13pt; text-decoration: underline; margin-bottom: 12px; font-weight: bold; text-transform: uppercase; }
                .theme-resume-typewriter .res-title { font-weight: bold; }
                
                .theme-resume-royal { font-family: 'Playfair Display', Georgia, serif; color: #2d2722; background-color: #fffffb !important; }
                .theme-resume-royal h2 { font-size: 14pt; color: #a78bfa; border-bottom: 1px solid #f59e0b; padding-bottom: 4px; margin-bottom: 12px; font-weight: normal; font-style: uppercase; text-align: center; }
                .theme-resume-royal .res-title { color: #d97706; font-size: 12pt; }
                .theme-resume-royal .royal-center-head { text-align: center; }
                
                .theme-resume-slate { font-family: 'Inter', sans-serif; color: #334155; }
                .theme-resume-slate h2 { font-size: 12pt; color: #475569; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; }
                .theme-resume-slate .slate-badge { background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 20px; font-size: 10px; display: inline-block; margin: 2px; }

                /* Common utilities */
                .res-header-info { display: flex; flex-direction: column; gap: 4px; }
                .res-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
                .res-item { margin-bottom: 14px; }
                .text-muted { color: #718096; font-size: 9.5pt; }
                .res-badge { background: #edf2f7; padding: 2px 8px; border-radius: 4px; font-size: 9.5pt; display: inline-block; margin-right: 6px; margin-top: 4px; }
              `}} />

              {/* Render dynamic reorderable components */}
              {selectedTemplate === 'sidebar' ? (
                /* Specialized layout for Sidebar template */
                <div className="theme-resume-sidebar">
                  {/* Left Column */}
                  <div className="sidebar-col">
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                      <img 
                        src={resumeData.avatarUrl} 
                        alt={resumeData.name} 
                        style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} 
                      />
                      <h3 style={{ fontSize: '14pt', fontWeight: 'bold', margin: '8px 0 2px' }}>{resumeData.name}</h3>
                      <div className="text-muted" style={{ fontSize: '9pt' }}>{resumeData.title}</div>
                    </div>
                    
                    <div style={{ fontSize: '9pt', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                      <div>📍 {resumeData.location}</div>
                      <div>📧 {resumeData.email}</div>
                      <div>🔗 {resumeData.website}</div>
                      <div>📞 {resumeData.phone}</div>
                    </div>

                    <h2>Skills</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {resumeData.skills.map((s, i) => (
                        <span key={i} className="res-badge" style={{ fontSize: '8pt', padding: '1px 6px' }}>{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {sections.filter(s => s.id !== 'header' && s.id !== 'skills').map((sec) => {
                      if (!sec.visible) return null;
                      
                      return (
                        <div key={sec.id} style={{ marginBottom: 24 }}>
                          <h2>{sec.name}</h2>
                          
                          {sec.id === 'summary' && (
                            <p style={{ fontSize: '10pt', lineHeight: 1.5, color: '#4a5568' }}>{resumeData.bio}</p>
                          )}

                          {sec.id === 'experience' && (
                            <div>
                              {resumeData.experience.map((exp, idx) => (
                                <div key={idx} className="res-item">
                                  <div className="res-row">
                                    <strong>{exp.company}</strong>
                                    <span className="text-muted">{exp.period}</span>
                                  </div>
                                  <div className="res-title">{exp.role}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {sec.id === 'projects' && (
                            <div>
                              {resumeData.projectsList.filter(p => p.visible).map((proj, idx) => (
                                <div key={idx} className="res-item">
                                  <div className="res-row">
                                    <strong>{proj.title}</strong>
                                    <span className="text-muted">{proj.client}</span>
                                  </div>
                                  <div className="res-title" style={{ fontSize: '9.5pt' }}>Role: {proj.role}</div>
                                  <p style={{ fontSize: '9pt', color: '#4a5568', marginTop: 4 }}>{proj.description}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {sec.id === 'education' && (
                            <div>
                              {resumeData.education.map((edu, idx) => (
                                <div key={idx} className="res-item">
                                  <div className="res-row">
                                    <strong>{edu.degree}</strong>
                                    <span className="text-muted">{edu.period}</span>
                                  </div>
                                  <div className="res-title">{edu.school}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Standard layout for other templates */
                <div>
                  {sections.map((sec) => {
                    if (!sec.visible) return null;

                    // Header component
                    if (sec.id === 'header') {
                      const isRoyal = selectedTemplate === 'royal';
                      return (
                        <header key="header" className={isRoyal ? 'royal-center-head' : 'res-header-block'} style={{ marginBottom: 24 }}>
                          <div style={{ display: 'flex', justifyContent: isRoyal ? 'center' : 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                            <div>
                              <h1 style={{ fontSize: '24pt', fontWeight: 800, color: 'inherit', letterSpacing: '-1px', margin: 0 }}>
                                {resumeData.name}
                              </h1>
                              <div className="res-title">{resumeData.title}</div>
                            </div>
                            
                            {/* Avatar render inside header if template is not typewriter */}
                            {selectedTemplate !== 'typewriter' && (
                              <img 
                                src={resumeData.avatarUrl} 
                                alt={resumeData.name} 
                                style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }} 
                              />
                            )}
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            justifyContent: isRoyal ? 'center' : 'flex-start', 
                            gap: '12px', 
                            fontSize: '9pt', 
                            marginTop: 10, 
                            flexWrap: 'wrap', 
                            color: '#718096',
                            borderTop: '1px solid #edf2f7',
                            paddingTop: 8
                          }}>
                            <span>📍 {resumeData.location}</span>
                            <span>•</span>
                            <span>📧 {resumeData.email}</span>
                            <span>•</span>
                            <span>🔗 {resumeData.website}</span>
                            <span>•</span>
                            <span>📞 {resumeData.phone}</span>
                          </div>
                        </header>
                      );
                    }

                    // Summary component
                    if (sec.id === 'summary') {
                      return (
                        <section key="summary" style={{ marginBottom: 20 }}>
                          <h2>Professional Summary</h2>
                          <p style={{ fontSize: '10pt', color: '#4a5568' }}>{resumeData.bio}</p>
                        </section>
                      );
                    }

                    // Experience component
                    if (sec.id === 'experience') {
                      return (
                        <section key="experience" style={{ marginBottom: 20 }}>
                          <h2>Work Experience</h2>
                          {resumeData.experience.map((exp, idx) => (
                            <div key={idx} className="res-item">
                              <div className="res-row">
                                <strong>{exp.company}</strong>
                                <span className="text-muted">{exp.period}</span>
                              </div>
                              <div className="res-title">{exp.role}</div>
                            </div>
                          ))}
                        </section>
                      );
                    }

                    // Featured Projects component
                    if (sec.id === 'projects') {
                      return (
                        <section key="projects" style={{ marginBottom: 20 }}>
                          <h2>Featured Creative Projects</h2>
                          {resumeData.projectsList.filter(p => p.visible).map((proj, idx) => (
                            <div key={idx} className="res-item">
                              <div className="res-row">
                                <strong>{proj.title}</strong>
                                <span className="text-muted">{proj.client}</span>
                              </div>
                              <div className="res-title" style={{ fontSize: '9.5pt' }}>Role: {proj.role}</div>
                              <p style={{ fontSize: '9.5pt', color: '#4a5568', marginTop: 4 }}>{proj.description}</p>
                              <div style={{ marginTop: 4 }}>
                                {proj.tools.map((t, i) => (
                                  <span key={i} className="res-badge" style={{ fontSize: '8pt', padding: '1px 6px' }}>{t}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </section>
                      );
                    }

                    // Skills component
                    if (sec.id === 'skills') {
                      const isSlate = selectedTemplate === 'slate';
                      return (
                        <section key="skills" style={{ marginBottom: 20 }}>
                          <h2>Technical Skills & Tools</h2>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {resumeData.skills.map((s, i) => (
                              <span 
                                key={i} 
                                className={isSlate ? 'slate-badge' : 'res-badge'}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </section>
                      );
                    }

                    // Education component
                    if (sec.id === 'education') {
                      return (
                        <section key="education" style={{ marginBottom: 20 }}>
                          <h2>Education & Credentials</h2>
                          {resumeData.education.map((edu, idx) => (
                            <div key={idx} className="res-item">
                              <div className="res-row">
                                <strong>{edu.degree}</strong>
                                <span className="text-muted">{edu.period}</span>
                              </div>
                              <div className="res-title">{edu.school}</div>
                            </div>
                          ))}
                        </section>
                      );
                    }

                    return null;
                  })}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Action Toasts */}
      {toastMsg && (
        <div className="toast-msg" style={{ zIndex: 3000 }}>
          <Check size={16} style={{ color: '#10b981' }} />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
