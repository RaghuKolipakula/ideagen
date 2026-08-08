import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, Lock, Zap, Gamepad2, Settings2 } from 'lucide-react';
import ThemeRenderer from './components/ThemeRenderer';
import './index.css';

export default function App() {
  const [theme, setTheme] = useState('cyberpunk');
  const [data, setData] = useState({
    exercise: 'DEADLIFT',
    weight: '315',
    reps: '5',
    time: '0:45',
  });
  
  const cardRef = useRef(null);

  const handleExport = useCallback(() => {
    if (cardRef.current === null) {
      return;
    }
    
    // Simple export logic using html-to-image
    toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `fitflex-${theme}-card.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Oops, something went wrong!', err);
      });
  }, [cardRef, theme]);

  const handleInputChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="app-layout">
      {/* Left Panel: Editor */}
      <div className="editor-panel">
        <div className="header">
          <h1 style={{fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Zap size={24} color="#8b5cf6" fill="#8b5cf6" />
            FitFlex <span style={{color: 'var(--text-muted)', fontWeight: 400}}>Studio</span>
          </h1>
        </div>
        
        <div className="form-content">
          <div>
            <h3 style={{marginBottom: 16, fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-muted)'}}>
              1. Enter Workout Stats
            </h3>
            <div className="form-group" style={{marginBottom: 12}}>
              <label>Exercise Name</label>
              <input name="exercise" value={data.exercise} onChange={handleInputChange} className="form-input" placeholder="e.g. BENCH PRESS" />
            </div>
            
            <div style={{display: 'flex', gap: 12, marginBottom: 12}}>
              <div className="form-group" style={{flex: 1}}>
                <label>Weight (lbs)</label>
                <input name="weight" type="number" value={data.weight} onChange={handleInputChange} className="form-input" placeholder="225" />
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label>Reps</label>
                <input name="reps" type="number" value={data.reps} onChange={handleInputChange} className="form-input" placeholder="10" />
              </div>
            </div>

            <div className="form-group">
              <label>Time Elapsed</label>
              <input name="time" value={data.time} onChange={handleInputChange} className="form-input" placeholder="1:30" />
            </div>
          </div>

          <div style={{marginTop: 12}}>
            <h3 style={{marginBottom: 16, fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-muted)'}}>
              2. Select Theme
            </h3>
            <div className="theme-grid">
              <button 
                className={`theme-btn ${theme === 'cyberpunk' ? 'active' : ''}`}
                onClick={() => setTheme('cyberpunk')}
              >
                <Zap size={24} />
                Cyberpunk
              </button>
              
              <button 
                className={`theme-btn ${theme === 'retro' ? 'active' : ''}`}
                onClick={() => setTheme('retro')}
              >
                <Gamepad2 size={24} />
                Retro Arcade
              </button>
              
              <button className="theme-btn locked" title="Unlock for $1.99">
                <Lock size={20} color="#9ca3af" style={{position: 'absolute', top: 8, right: 8}} />
                <Settings2 size={24} />
                Mecha Anime
                <span style={{fontSize: '0.7rem', color: '#8b5cf6', fontWeight: 600}}>Premium $1.99</span>
              </button>
              
              <button className="theme-btn locked" title="Unlock for $1.99">
                <Lock size={20} color="#9ca3af" style={{position: 'absolute', top: 8, right: 8}} />
                <Settings2 size={24} />
                Minimalist
                <span style={{fontSize: '0.7rem', color: '#8b5cf6', fontWeight: 600}}>Premium $1.99</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{padding: 24, borderTop: '1px solid var(--border)'}}>
          <button className="export-btn" style={{width: '100%'}} onClick={handleExport}>
            <Download size={20} />
            Export for TikTok/IG
          </button>
        </div>
      </div>

      {/* Right Panel: Live Preview */}
      <div className="preview-panel">
        <div className="card-wrapper">
          {/* We pass a ref to the inner component so html-to-image can capture it */}
          <ThemeRenderer theme={theme} data={data} nodeRef={cardRef} />
        </div>
      </div>
    </div>
  );
}
