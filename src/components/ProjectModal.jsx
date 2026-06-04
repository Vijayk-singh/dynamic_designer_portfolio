import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ThumbsUp, Eye, Calendar, User, Briefcase, Play, Pause, 
  Volume2, VolumeX, FastForward, Maximize, Smartphone, Laptop, 
  ZoomIn, ZoomOut, RotateCcw, Copy, Check, Info 
} from 'lucide-react';

export default function ProjectModal({ project, onClose, onLikeToggle, isLiked }) {
  const [cinemaDimmed, setCinemaDimmed] = useState(false);
  
  // Video & Motion Frame State
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(0);

  // UI/UX Frame State
  const [activeDevice, setActiveDevice] = useState('iphone'); // 'iphone' or 'safari'
  const [activeUiTab, setActiveUiTab] = useState('dashboard'); // 'dashboard', 'analytics', 'wallet'
  const [mockTransactions, setMockTransactions] = useState(
    project.interactiveData?.transactions || []
  );
  const [mockBalance, setMockBalance] = useState(52430.80);

  // Graphic Design Frame State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState('0% 0%');
  const imageRef = useRef(null);
  const [copiedSwatch, setCopiedSwatch] = useState(null);

  // Sync video elements when playing/pausing
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      // Calculate current frame (approx. 24fps)
      setCurrentFrame(Math.floor(videoRef.current.currentTime * 24));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleScrubChange = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // UI/UX Mock Actions
  const handleUiAction = (action) => {
    if (action === 'deposit') {
      const amt = Math.floor(Math.random() * 800) + 100;
      setMockBalance(prev => prev + amt);
      setMockTransactions(prev => [
        { label: 'Mock Deposit Reference', amount: `+$${amt.toFixed(2)}`, date: 'Just now', positive: true },
        ...prev
      ]);
    } else if (action === 'withdraw') {
      const amt = Math.floor(Math.random() * 400) + 50;
      if (mockBalance >= amt) {
        setMockBalance(prev => prev - amt);
        setMockTransactions(prev => [
          { label: 'Mock Withdraw ATM', amount: `-$${amt.toFixed(2)}`, date: 'Just now', positive: false },
          ...prev
        ]);
      }
    }
  };

  // Graphic Design Magnifier Loupe Calculations
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    
    // Find absolute cursor coordinates relative to document scroll
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;
    
    // Boundary checks
    if (x < 0 || y < 0 || x > width || y > height) {
      setShowLens(false);
      return;
    }

    setShowLens(true);
    setLensPos({ x: e.clientX - 60, y: e.clientY - 60 }); // Center the 120px lens

    // Calculate background percentages for the magnified image
    const xp = (x / width) * 100;
    const yp = (y / height) * 100;
    setBgPos(`${xp}% ${yp}%`);
  };

  const copySwatchHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedSwatch(hex);
    setTimeout(() => setCopiedSwatch(null), 1500);
  };

  // Format time (MM:SS)
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={`modal-overlay blur-backdrop ${cinemaDimmed ? 'cinema-dimmed' : ''}`} onClick={onClose}>
      
      {/* Container card */}
      <div 
        className="modal-content-container animate-scale-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ background: cinemaDimmed ? '#08080a' : 'var(--bg-secondary)', borderColor: cinemaDimmed ? '#16171d' : 'var(--border-color)' }}
      >
        
        {/* Actions bar */}
        <header className="modal-action-bar" style={{ background: cinemaDimmed ? '#0f1015' : 'var(--bg-tertiary)' }}>
          <div className="modal-title-small" style={{ color: cinemaDimmed ? '#a1a1aa' : 'var(--text-primary)' }}>
            {project.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {project.frameType === 'video' && (
              <button 
                type="button"
                className="btn-admin"
                style={{ fontSize: 12, padding: '4px 10px' }}
                onClick={() => setCinemaDimmed(!cinemaDimmed)}
              >
                {cinemaDimmed ? '☀️ Normal Mode' : '🎬 Lights Out'}
              </button>
            )}
            <button type="button" className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Modal Scroll Body */}
        <div className="modal-scroll-body">
          
          {/* Custom Media Frame Container */}
          <div className="media-preview-container" style={{ background: cinemaDimmed ? '#050505' : '#0b0c10' }}>
            
            {/* FRAME 1: VIDEO PLAYER CINEMA FRAME */}
            {project.frameType === 'video' && (
              <div className="cinema-frame">
                {/* Viewfinder simulation markings */}
                <div className="cinema-viewfinder-overlay">
                  <div className="viewfinder-indicator top-left">
                    <span className="rec-dot"></span>
                    <span>REC</span>
                  </div>
                  <div className="viewfinder-indicator top-right">
                    <span>4K 24fps</span>
                  </div>
                  <div className="viewfinder-indicator bottom-left">
                    <span>TC: {formatTime(currentTime)}</span>
                  </div>
                  <div className="viewfinder-indicator bottom-right">
                    <span>LUT: ACTIVE</span>
                  </div>
                </div>

                <video
                  ref={videoRef}
                  src={project.videoUrl}
                  className="cinema-video"
                  loop
                  muted={isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlay}
                />

                {/* Custom Cinematic controls overlay */}
                <div className="custom-video-controls">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.01}
                    value={currentTime}
                    onChange={handleScrubChange}
                    className="video-scrub-bar"
                    style={{
                      background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) 100%)`
                    }}
                  />
                  <div className="controls-row">
                    <div className="controls-left">
                      <button type="button" className="control-btn" onClick={togglePlay}>
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <button type="button" className="control-btn" onClick={toggleMute}>
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                      <span className="time-display">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="controls-right">
                      <span style={{ fontSize: 10, color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>CINEMATIC FRAME</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FRAME 2: MOTION GRAPHICS WORKSPACE FRAME */}
            {project.frameType === 'motion' && (
              <div className="motion-workspace">
                <div className="workspace-header">
                  <div className="workspace-title">
                    <div className="workspace-dots">
                      <div className="workspace-dot red" />
                      <div className="workspace-dot yellow" />
                      <div className="workspace-dot green" />
                    </div>
                    <span>COMP_RENDER_PREVIEW.c4d</span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: 10, fontFamily: 'var(--font-mono)' }}>OCTANE RENDER</div>
                </div>

                <div className="workspace-body">
                  <video
                    ref={videoRef}
                    src={project.videoUrl}
                    className="motion-video-element"
                    loop
                    muted={isMuted}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={togglePlay}
                  />
                </div>

                <div className="timeline-panel">
                  {/* Scrubbing timeline */}
                  <div className="timeline-scrubber-wrapper">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#9ca3af', width: 44 }}>
                      F: {currentFrame}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      step={0.01}
                      value={currentTime}
                      onChange={handleScrubChange}
                      className="timeline-track"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, #252630 ${(currentTime / (duration || 1)) * 100}%, #252630 100%)`
                      }}
                    />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#9ca3af', width: 44, textAlign: 'right' }}>
                      {currentFrame + 120}f
                    </span>
                  </div>

                  {/* Playback speed & control elements */}
                  <div className="timeline-controls">
                    <div className="timeline-buttons-left">
                      <button 
                        type="button" 
                        className="control-btn" 
                        style={{ color: '#fff', background: '#252630', padding: 6 }}
                        onClick={togglePlay}
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </button>

                      <div className="timeline-speed-pills">
                        {[0.5, 1, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            type="button"
                            className={`speed-pill ${playbackSpeed === speed ? 'active' : ''}`}
                            onClick={() => setPlaybackSpeed(speed)}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Audio Waveform Loop */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#6b7280', fontSize: 10, fontFamily: 'var(--font-mono)' }}>AUDIO WAVE</span>
                      <div className="waveform-container">
                        {[16, 24, 12, 18, 8, 22, 14, 20, 10, 16, 6, 24, 12, 18].map((h, i) => (
                          <div 
                            key={i} 
                            className={`waveform-bar ${isPlaying ? 'active' : ''}`}
                            style={{ 
                              animationDelay: `${i * 0.08}s`,
                              height: isPlaying ? undefined : `${h}px`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FRAME 3: UI/UX INTERACTIVE DEVICE FRAME */}
            {project.frameType === 'uiux' && (
              <div className="device-frame-wrapper">
                
                {/* Device switches */}
                <div className="device-frame-toggle-bar">
                  <button
                    type="button"
                    className={`device-toggle-btn ${activeDevice === 'iphone' ? 'active' : ''}`}
                    onClick={() => setActiveDevice('iphone')}
                  >
                    <Smartphone size={14} /> iPhone Mockup
                  </button>
                  <button
                    type="button"
                    className={`device-toggle-btn ${activeDevice === 'safari' ? 'active' : ''}`}
                    onClick={() => setActiveDevice('safari')}
                  >
                    <Laptop size={14} /> Desktop Safari
                  </button>
                </div>

                {/* iPhone wrapper rendering */}
                {activeDevice === 'iphone' ? (
                  <div className="phone-mockup">
                    <div className="phone-notch"></div>
                    <div className="phone-screen">
                      
                      {/* App Mock content */}
                      <div className="mock-status-bar">
                        <span>9:41</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <span>📶</span>
                          <span>🔋</span>
                        </div>
                      </div>

                      {/* Mock header */}
                      <div className="mock-app-logo">
                        <Sparkles size={16} />
                        <span>VOLT</span>
                      </div>

                      {activeUiTab === 'dashboard' && (
                        <div className="animate-fade-in" style={{ animationDuration: '0.2s' }}>
                          {/* Balance Box */}
                          <div className="mock-balance-card">
                            <span className="mock-balance-lbl">Portfolio Balance</span>
                            <div className="mock-balance-val">${mockBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                            <div className="mock-balance-delta">⚡ +4.8% / +$2,240.50 today</div>
                          </div>

                          {/* Quick interactions */}
                          <div className="mock-actions-grid">
                            <button type="button" className="mock-action-btn" onClick={() => handleUiAction('deposit')}>
                              <span>📥</span>
                              <span>Deposit</span>
                            </button>
                            <button type="button" className="mock-action-btn" onClick={() => handleUiAction('withdraw')}>
                              <span>📤</span>
                              <span>Withdraw</span>
                            </button>
                            <button type="button" className="mock-action-btn" onClick={() => alert('Mock Buy Triggered!')}>
                              <span>📈</span>
                              <span>Trade</span>
                            </button>
                            <button type="button" className="mock-action-btn" onClick={() => alert('Mock Investing Plan Active!')}>
                              <span>💸</span>
                              <span>Invest</span>
                            </button>
                          </div>

                          {/* Transaction list */}
                          <div className="mock-tx-header">Recent Transactions</div>
                          <div className="mock-tx-list">
                            {mockTransactions.map((tx, idx) => (
                              <div key={idx} className="mock-tx-item">
                                <div className="mock-tx-info">
                                  <span className="mock-tx-title">{tx.label}</span>
                                  <span className="mock-tx-date">{tx.date}</span>
                                </div>
                                <span className={`mock-tx-amt ${tx.amount.startsWith('+') || tx.positive ? 'positive' : 'negative'}`}>
                                  {tx.amount}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeUiTab === 'analytics' && (
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div className="mock-balance-card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <span className="mock-balance-lbl">Monthly Performance</span>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, marginTop: 16 }}>
                              {[40, 60, 45, 75, 55, 90, 80, 110, 95].map((h, i) => (
                                <div 
                                  key={i} 
                                  style={{ 
                                    flexGrow: 1, 
                                    height: `${h}%`, 
                                    background: i === 7 ? 'var(--accent)' : 'rgba(168, 85, 247, 0.4)', 
                                    borderRadius: '4px',
                                    transition: 'height 0.3s'
                                  }} 
                                />
                              ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#8e8e93', marginTop: 8 }}>
                              <span>Jan</span>
                              <span>May</span>
                              <span>Sep</span>
                            </div>
                          </div>

                          <div className="mock-tx-item">
                            <span>Figma Prototyping Grade</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>HIGH-FIDELITY</span>
                          </div>
                        </div>
                      )}

                      {activeUiTab === 'wallet' && (
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div className="mock-tx-header">My Assets</div>
                          {[
                            { name: 'Bitcoin (BTC)', val: '0.45 BTC', usd: '$27,345.80', icon: '🪙' },
                            { name: 'Ethereum (ETH)', val: '1.20 ETH', usd: '$1,812.50', icon: '🔷' },
                            { name: 'USDC (USD Coin)', val: '5,000 USDC', usd: '$5,000.00', icon: '💵' }
                          ].map((coin, i) => (
                            <div key={i} className="mock-tx-item" style={{ padding: 14 }}>
                              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <span style={{ fontSize: 18 }}>{coin.icon}</span>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: 'bold' }}>{coin.name}</span>
                                  <span style={{ fontSize: 9, color: '#8e8e93' }}>{coin.val}</span>
                                </div>
                              </div>
                              <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{coin.usd}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Screen Navigation */}
                      <div className="phone-tabs">
                        <button
                          type="button"
                          className={`phone-tab-btn ${activeUiTab === 'dashboard' ? 'active' : ''}`}
                          onClick={() => setActiveUiTab('dashboard')}
                        >
                          <span>🏠</span>
                          <span>Home</span>
                        </button>
                        <button
                          type="button"
                          className={`phone-tab-btn ${activeUiTab === 'analytics' ? 'active' : ''}`}
                          onClick={() => setActiveUiTab('analytics')}
                        >
                          <span>📊</span>
                          <span>Stats</span>
                        </button>
                        <button
                          type="button"
                          className={`phone-tab-btn ${activeUiTab === 'wallet' ? 'active' : ''}`}
                          onClick={() => setActiveUiTab('wallet')}
                        >
                          <span>💼</span>
                          <span>Wallet</span>
                        </button>
                      </div>

                      <div className="phone-home-indicator"></div>
                    </div>
                  </div>
                ) : (
                  /* Desktop Safari Mockup */
                  <div className="browser-mockup">
                    <div className="browser-header">
                      <div className="workspace-dots">
                        <div className="workspace-dot red" />
                        <div className="workspace-dot yellow" />
                        <div className="workspace-dot green" />
                      </div>
                      <div className="browser-search-bar">
                        <span>🔒 volt-finance.app/dashboard</span>
                      </div>
                    </div>
                    <div className="browser-body">
                      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, height: '100%' }}>
                        
                        {/* Sidebar Mock */}
                        <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)', paddingRight: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 16 }}>⚡ VOLT.WEB</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
                            <span style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, color: '#fff', fontWeight: 600 }}>🏠 Dashboard</span>
                            <span style={{ padding: '8px 12px', color: '#8e8e93' }}>💼 Assets</span>
                            <span style={{ padding: '8px 12px', color: '#8e8e93' }}>📊 Report Analysis</span>
                            <span style={{ padding: '8px 12px', color: '#8e8e93' }}>⚙️ Settings</span>
                          </div>
                        </div>

                        {/* Main Body Mock */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, fontSize: 16 }}>Financial Overview</h4>
                            <span style={{ fontSize: 11, background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>Live Server</span>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="mock-balance-card" style={{ margin: 0 }}>
                              <span className="mock-balance-lbl">Main Vault</span>
                              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>$48,765.20</div>
                            </div>
                            <div className="mock-balance-card" style={{ margin: 0, background: 'rgba(255, 255, 255, 0.03)' }}>
                              <span className="mock-balance-lbl">Crypto Sub-Wallet</span>
                              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>$3,665.60</div>
                            </div>
                          </div>

                          <div style={{ padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                            <Info size={16} style={{ color: 'var(--accent)' }} />
                            <span>This interactive layout simulates Figma wireframes, showcasing reactive component design.</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* FRAME 4: GRAPHIC DESIGN CANVAS INSPECTOR */}
            {project.frameType === 'graphic' && (
              <div className="canvas-inspector-box">
                <div className="canvas-toolbar">
                  <div style={{ color: '#a1a1aa', fontSize: 11, fontFamily: 'var(--font-mono)' }}>CANVAS WORKSPACE</div>
                  
                  <div className="canvas-actions">
                    <div className="canvas-zoom-indicator">
                      {Math.round(zoomLevel * 100)}%
                    </div>
                    <button 
                      type="button" 
                      className="control-btn" 
                      style={{ background: '#1c1c1e', padding: 6 }}
                      onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
                      title="Zoom In"
                    >
                      <ZoomIn size={14} />
                    </button>
                    <button 
                      type="button" 
                      className="control-btn" 
                      style={{ background: '#1c1c1e', padding: 6 }}
                      onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}
                      title="Zoom Out"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <button 
                      type="button" 
                      className="control-btn" 
                      style={{ background: '#1c1c1e', padding: 6 }}
                      onClick={() => setZoomLevel(1)}
                      title="Reset Zoom"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>

                <div 
                  className="canvas-body" 
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setShowLens(false)}
                >
                  <div className="grid-overlay"></div>
                  <img
                    ref={imageRef}
                    src={project.image}
                    alt={project.title}
                    className="inspector-image"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />

                  {/* Magnifying Glass Loupe overlay */}
                  {showLens && (
                    <div
                      className="magnifier-lens"
                      style={{
                        left: `${lensPos.x}px`,
                        top: `${lensPos.y}px`,
                        backgroundImage: `url(${project.image})`,
                        backgroundPosition: bgPos,
                        backgroundSize: `${(imageRef.current?.width || 0) * 2}px ${(imageRef.current?.height || 0) * 2}px`
                      }}
                    />
                  )}
                </div>

                {/* Color Swatch inspector details */}
                {project.swatches && (
                  <div className="swatch-inspector-row">
                    <span className="swatch-title">Dominant Color Swatches (Click to copy hex)</span>
                    <div className="swatch-grid">
                      {project.swatches.map((swatch, idx) => (
                        <div 
                          key={idx} 
                          className="swatch-pill"
                          onClick={() => copySwatchHex(swatch.hex)}
                        >
                          <span 
                            className="swatch-color" 
                            style={{ backgroundColor: swatch.hex }} 
                          />
                          <span className="swatch-hex">{swatch.hex}</span>
                          <span className="swatch-name">{swatch.name}</span>
                          {copiedSwatch === swatch.hex ? (
                            <Check size={12} style={{ color: '#10b981' }} />
                          ) : (
                            <Copy size={10} style={{ color: '#6b7280' }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Details Metadata Row */}
          <div className="project-details-card">
            
            <div className="detail-main">
              <h2 className="detail-title">{project.title}</h2>
              <p className="detail-desc">{project.description}</p>
              
              <div style={{ marginTop: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>Workflow Notes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <p>
                    {project.frameType === 'video' && '⚠️ Try hovering over the movie player to reveal cinematic play/scrub controls, and toggle the "Lights Out" cinematic lighting mode above for dimmed environment focus.'}
                    {project.frameType === 'motion' && '⚠️ Adjust the playback speed controls (0.5x to 2x) or drag the timeline scrubber handle directly to evaluate render motion mechanics and keyframes.'}
                    {project.frameType === 'uiux' && '⚠️ Tap different devices (iPhone vs. Web Safari) or click the buttons like "Deposit", "Withdraw" or mobile tabs inside the iPhone screen for mock-interactive data simulation.'}
                    {project.frameType === 'graphic' && '⚠️ Hover over the artwork image container to activate the zoom magnification loupe. You can also zoom the grid using the inspector top bar toolbar.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="detail-sidebar">
              <div className="sidebar-meta-block">
                <span className="meta-block-lbl">Client</span>
                <span className="meta-block-val">{project.client || 'N/A'}</span>
              </div>
              <div className="sidebar-meta-block">
                <span className="meta-block-lbl">My Role</span>
                <span className="meta-block-val">{project.role || 'N/A'}</span>
              </div>
              <div className="sidebar-meta-block">
                <span className="meta-block-lbl">Created</span>
                <span className="meta-block-val">
                  <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {project.date || 'N/A'}
                </span>
              </div>
              <div className="sidebar-meta-block">
                <span className="meta-block-lbl">Software Tools</span>
                <div className="sidebar-tools-grid">
                  {project.tools.map((tool, idx) => (
                    <span key={idx} className="tool-tag">{tool}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Appreciations Footer */}
        <footer className="modal-footer-stats-row">
          <button 
            type="button" 
            className={`footer-btn-like ${isLiked ? 'liked' : ''}`}
            onClick={onLikeToggle}
          >
            <ThumbsUp size={16} />
            <span>{isLiked ? 'Appreciated!' : 'Appreciate Project'}</span>
          </button>
          
          <div className="footer-stats-text">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Eye size={16} /> {project.views.toLocaleString()} views
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ThumbsUp size={16} /> {project.likes} appreciations
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}
