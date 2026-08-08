import React from 'react';

export default function ThemeRenderer({ theme, data, nodeRef }) {
  if (theme === 'cyberpunk') {
    return (
      <div className="theme-cyberpunk" ref={nodeRef}>
        <div className="cyber-title">{data.exercise || 'EXERCISE'}</div>
        <div className="cyber-stat">
          <span>WEIGHT</span>
          <span className="cyber-val">{data.weight || '0'} LBS</span>
        </div>
        <div className="cyber-stat">
          <span>REPS</span>
          <span className="cyber-val">{data.reps || '0'}</span>
        </div>
        <div className="cyber-stat">
          <span>TIME</span>
          <span className="cyber-val">{data.time || '0:00'}</span>
        </div>
        
        <div className="cyber-qr">
          <div style={{width: 60, height: 60, backgroundColor: '#fff', padding: 4}}>
            {/* Mock QR Code */}
            <div style={{width: '100%', height: '100%', border: '4px dashed #000'}}></div>
          </div>
          <div>
            <div style={{color: '#facc15', fontWeight: 'bold', fontSize: '1.25rem'}}>BEAT MY STAT</div>
            <div style={{fontSize: '0.875rem', color: '#9ca3af'}}>Scan to generate yours</div>
          </div>
        </div>
      </div>
    );
  }

  if (theme === 'retro') {
    return (
      <div className="theme-retro" ref={nodeRef}>
        <div className="retro-title">{data.exercise || 'STAGE 1'}</div>
        <div className="retro-stat">
          <span>WEIGHT LIFTED</span>
          <span className="retro-val">{data.weight || '0'} LBS</span>
        </div>
        <div className="retro-stat">
          <span>REPS COMPLETED</span>
          <span className="retro-val">{data.reps || '0'}</span>
        </div>
        <div className="retro-stat">
          <span>TIME ELAPSED</span>
          <span className="retro-val">{data.time || '0:00'}</span>
        </div>
        
        <div className="retro-qr">
          INSERT COIN TO BEAT THIS SCORE
          <br/><br/>
          SCAN QR LINK
        </div>
      </div>
    );
  }

  return (
    <div ref={nodeRef} style={{padding: 32, backgroundColor: '#fff', color: '#000', height: '100%'}}>
      <h1>{data.exercise}</h1>
    </div>
  );
}
