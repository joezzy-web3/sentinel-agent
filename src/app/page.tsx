'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const triggerSentinel = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sentinel');
      const data = await res.json();
      setLog(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    triggerSentinel();
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace', background: '#0d1117', color: '#c9d1d9', minHeight: '100vh' }}>
      <h1 style={{ color: '#58a6ff' }}>🛡️ SENTINEL — Safety-Gated Trading Agent</h1>
      <p style={{ color: '#8b949e' }}>Autonomous rToken verification and execution pipeline for Bitget Hackathon.</p>
      
      <button 
        onClick={triggerSentinel} 
        disabled={loading}
        style={{
          background: '#238636',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: '10px',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Running 4-Gate Pipeline...' : 'Run Pipeline Manually'}
      </button>

      {log && (
        <div style={{ marginTop: '20px', background: '#161b22', padding: '15px', borderRadius: '6px', border: '1px solid #30363d' }}>
          <h3>Latest Decision Log</h3>
          <pre style={{ overflowX: 'auto', color: '#7ee787' }}>{JSON.stringify(log, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
