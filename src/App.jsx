import React, { useState, useEffect } from 'react';
import { initialProjects } from './data/initialProjects';
import Navbar from './components/Navbar';
import Header from './components/Header';
import ProjectGrid from './components/ProjectGrid';
import ProjectModal from './components/ProjectModal';
import AdminPanel from './components/AdminPanel';
import ResumeBuilder from './components/ResumeBuilder';
import { CheckCircle2 } from 'lucide-react';
import './App.css';

const DEFAULT_PROFILE = {
  name: "Shalini",
  location: "New Delhi, India",
  email: "shalini.design@studio.art",
  website: "shalini.art",
  bio: "Visual Storyteller & Motion Designer. Crafting immersive cinematic videos, fluid 3D simulations, and impact-driven visual assets. I blend core artistic graphic principles with interactive web prototyping to deliver dynamic, high-fidelity experiences.",
  logoMark: "CS",
  logoText: "CREATIVE.STUDIO",
  avatarUrl: "/images/profile_avatar.png",
  skills: [
    'Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Cinema 4D', 
    'Figma', 'Illustrator', 'Color Grading', '3D Fluids', 'Typography', 
    'Branding', 'UI/UX Prototypes', 'Storyboarding'
  ],
  experience: [
    { company: "E3Group", role: "Lead Motion Designer & Editor", period: "2024 - Present" },
    { company: "Surie Polex", role: "Junior Motion Designer", period: "2021 - 2024 (3 Years)" }
  ],
  taglines: [
    '🎥 Video Editor', '✨ Motion Graphics', '📐 Graphic Designer', '🎨 UI/UX Specialist'
  ],
  uxTag: "UI/UX Lite",
  totalProjectsVal: "4",
  totalProjectsLbl: "Total Projects",
  impactfulWorkVal: "100%",
  impactfulWorkLbl: "Impactful Work Done",
  categoryWiseVal: "4 Video, 3 Graphics",
  categoryWiseLbl: "Category Breakdown"
};

export default function App() {
  // Projects State - persisted in localStorage
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('portfolio-projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  // Profile Information & Experience State - persisted in localStorage
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('portfolio-profile-data');
    if (saved) {
      const data = JSON.parse(saved);
      return {
        ...DEFAULT_PROFILE,
        ...data,
        taglines: data.taglines || DEFAULT_PROFILE.taglines,
        uxTag: data.uxTag !== undefined ? data.uxTag : DEFAULT_PROFILE.uxTag
      };
    }
    return DEFAULT_PROFILE;
  });

  // Admin Auth State - persisted in sessionStorage for safety
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('admin-logged-in') === 'true';
  });

  // UI Modals State
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  
  // Likes State - track appreciated projects
  const [likedProjects, setLikedProjects] = useState(() => {
    const saved = localStorage.getItem('portfolio-liked-projects');
    return saved ? JSON.parse(saved) : [];
  });

  // Notification Toast State
  const [toast, setToast] = useState({ show: false, message: '' });

  // Sync projects to localStorage on update
  useEffect(() => {
    localStorage.setItem('portfolio-projects', JSON.stringify(projects));
  }, [projects]);

  // Sync profile to localStorage on update
  useEffect(() => {
    localStorage.setItem('portfolio-profile-data', JSON.stringify(profileData));
  }, [profileData]);

  // Sync likes to localStorage on update
  useEffect(() => {
    localStorage.setItem('portfolio-liked-projects', JSON.stringify(likedProjects));
  }, [likedProjects]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('admin-logged-in', 'true');
    showToast('Admin session verified successfully.');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('admin-logged-in');
    setShowAdminPanel(false);
    showToast('Admin logged out.');
  };

  // Add Project
  const handleAddProject = (newProject) => {
    const createdProject = {
      ...newProject,
      id: `proj-${Date.now()}`,
      views: 0,
      likes: 0
    };
    setProjects(prev => [createdProject, ...prev]);
    showToast(`Successfully published "${newProject.title}".`);
  };

  // Delete Project
  const handleDeleteProject = (id) => {
    const projectToDelete = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast(`Deleted "${projectToDelete?.title}".`);
  };

  // Edit Project
  const handleEditProject = (id, updatedData) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === id) {
        return { 
          ...proj, 
          ...updatedData 
        };
      }
      return proj;
    }));
    showToast(`Successfully updated "${updatedData.title}".`);
  };

  // Update Profile Biography / Experience Info
  const handleUpdateProfile = (updatedProfile) => {
    setProfileData(updatedProfile);
    showToast('Profile and brand layout information updated successfully.');
  };

  // Project Click - Increases view counter (Behance style)
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    
    // Increase view count in state
    setProjects(prev => prev.map(p => {
      if (p.id === project.id) {
        return { ...p, views: p.views + 1 };
      }
      return p;
    }));
  };

  // Toggle appreciation/like
  const handleLikeToggle = (projectId) => {
    const isAlreadyLiked = likedProjects.includes(projectId);
    
    if (isAlreadyLiked) {
      // Unlike
      setLikedProjects(prev => prev.filter(id => id !== projectId));
      setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          return { ...p, likes: Math.max(0, p.likes - 1) };
        }
        return p;
      }));
      // Update selected project view sync
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(prev => ({ ...prev, likes: Math.max(0, prev.likes - 1) }));
      }
      showToast('Project appreciation removed.');
    } else {
      // Like
      setLikedProjects(prev => [...prev, projectId]);
      setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          return { ...p, likes: p.likes + 1 };
        }
        return p;
      }));
      // Update selected project view sync
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(prev => ({ ...prev, likes: prev.likes + 1 }));
      }
      showToast('Project appreciated! Thank you.');
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        isAdmin={isAdminLoggedIn} 
        onAdminClick={() => setShowAdminPanel(true)} 
        onLogout={handleAdminLogout} 
        logoMark={profileData.logoMark}
        logoText={profileData.logoText}
      />

      <main style={{ flexGrow: 1, paddingBottom: 60 }}>
        <Header 
          profileData={profileData} 
          onBuildResumeClick={() => setShowResumeBuilder(true)}
          isAdmin={isAdminLoggedIn}
          projects={projects}
          onUpdateProfile={handleUpdateProfile}
        />
        
        <ProjectGrid 
          projects={projects} 
          onProjectClick={handleProjectClick}
          onAddProjectClick={() => setShowAdminPanel(true)}
          isAdmin={isAdminLoggedIn}
        />
      </main>

      {/* Appreciate/Views Footer Bar */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '30px 20px', 
        borderTop: '1px solid var(--border-color)', 
        background: 'var(--bg-secondary)', 
        fontSize: '13px', 
        color: 'var(--text-secondary)' 
      }}>
        <div>CREATIVE.STUDIO Portfolio Layout © 2026. Made with Google Antigravity & React.</div>
      </footer>

      {/* Admin Panel Modal Overlay */}
      {showAdminPanel && (
        <AdminPanel
          isLoggedIn={isAdminLoggedIn}
          onClose={() => setShowAdminPanel(false)}
          projects={projects}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
          onEditProject={handleEditProject}
          onLoginSuccess={handleAdminLoginSuccess}
          profileData={profileData}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* Detail Showcase Modal Overlay */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isLiked={likedProjects.includes(selectedProject.id)}
          onClose={() => setSelectedProject(null)}
          onLikeToggle={() => handleLikeToggle(selectedProject.id)}
        />
      )}

      {/* Resume Builder Modal Overlay */}
      {showResumeBuilder && (
        <ResumeBuilder
          isAdmin={isAdminLoggedIn}
          profileData={profileData}
          projects={projects}
          onClose={() => setShowResumeBuilder(false)}
        />
      )}

      {/* Toast Notification Banner */}
      {toast.show && (
        <div className="toast-msg">
          <CheckCircle2 size={18} className="toast-success-icon" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
