import React from 'react';
import { User, LogOut, ShieldAlert } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

export default function Navbar({ isAdmin, onAdminClick, onLogout, logoMark = "CS", logoText = "CREATIVE.STUDIO" }) {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <span className="logo-mark">{logoMark}</span>
        <span className="logo-text">{logoText}</span>
      </div>

      <div className="nav-actions">
        <ThemeSelector />
        
        {isAdmin ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4, 
              fontSize: 12, 
              fontWeight: 700, 
              color: 'var(--accent)',
              background: 'var(--accent-light)',
              padding: '6px 12px',
              borderRadius: '20px'
            }}>
              <ShieldAlert size={14} />
              Admin Mode
            </span>
            <button 
              type="button" 
              className="btn-admin logout" 
              onClick={onLogout}
              title="Logout from Admin Panel"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
            <button 
              type="button" 
              className="btn-admin" 
              onClick={onAdminClick}
            >
              Manage Projects
            </button>
          </div>
        ) : (
          <button 
            type="button" 
            className="btn-admin" 
            onClick={onAdminClick}
          >
            <User size={16} />
            <span>Admin Login</span>
          </button>
        )}
      </div>
    </nav>
  );
}
