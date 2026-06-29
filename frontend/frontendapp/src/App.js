import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('loading');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    fetch('http://backend-service:5000/api/message')
      .then(res => res.json())
      .then(data => {
        setMessage(data.message || 'Connected to backend!');
        setStatus('online');
      })
      .catch(() => {
        setMessage('Could not reach backend.');
        setStatus('offline');
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: 'Frontend', value: 'React',   sub: 'v18+',    color: '#61dafb' },
    { label: 'Backend',  value: 'Express', sub: 'Node.js', color: '#68d391' },
    { label: 'Status',   value: status === 'online' ? 'Live' : status === 'offline' ? 'Down' : '...', sub: 'API Health', color: status === 'online' ? '#68d391' : status === 'offline' ? '#fc8181' : '#f6ad55' },
    { label: 'Port',     value: '3000',    sub: 'Frontend', color: '#b794f4' },
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-dot" />
          FullStackApp
        </div>
        <div className="nav-time">
          {time.toLocaleTimeString()}
        </div>
        <div className={`nav-badge ${status}`}>
          <span className="pulse" />
          {status === 'loading' ? 'Connecting...' : status === 'online' ? 'All Systems Go' : 'Backend Offline'}
        </div>
      </nav>

      <header className="hero">
        <div className="hero-eyebrow">React + Express · Full Stack</div>
        <h1 className="hero-title">Your App is<br /><span className="hero-accent">Running.</span></h1>
        <p className="hero-sub">Local development environment is active. Both frontend and backend are connected and serving requests.</p>
      </header>

      <section className="stats-row">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </section>

      <section className="main-section">
        <div className="response-card">
          <div className="card-header">
            <span className="card-tag">GET /api/message</span>
            <span className={`card-status ${status}`}>
              {status === 'online' ? '200 OK' : status === 'offline' ? 'Failed' : 'Pending'}
            </span>
          </div>
          <div className="card-body">
            <div className="response-label">Response from Express backend</div>
            <div className="response-message">
              {status === 'loading' ? (
                <span className="loading-dots">Fetching<span>.</span><span>.</span><span>.</span></span>
              ) : (
                message
              )}
            </div>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">⚡</div>
            <div className="info-title">Frontend</div>
            <div className="info-desc">React app running on <strong>localhost:3000</strong>. Hot reload is active — changes reflect instantly.</div>
          </div>
          <div className="info-card">
            <div className="info-icon">🛠</div>
            <div className="info-title">Backend</div>
            <div className="info-desc">Express server running on <strong>localhost:5000</strong>. API requests are proxied from the frontend.</div>
          </div>
          <div className="info-card">
            <div className="info-icon">🔗</div>
            <div className="info-title">Connection</div>
            <div className="info-desc">Frontend fetches data from the backend via <strong>/api/message</strong> and renders it live on this page.</div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>FullStackApp · Local Dev</span>
        <span>React 18 · Express · Node.js</span>
      </footer>
    </div>
  );
}

export default App;
