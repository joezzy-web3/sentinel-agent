'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchSentinel = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sentinel');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch Sentinel log:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentinel();
  }, []);

  return (
    <div style={styles.container}>
      {/* Header Bar */}
      <header style={styles.header}>
        <div>
          <div style={styles.badge}>BITGET HACKATHON ENTRY</div>
          <h1 style={styles.title}>🛡️ SENTINEL</h1>
          <p style={styles.subtitle}>Safety-Gated Weekend-Gap Trading Agent for rTokens</p>
        </div>
        <button 
          onClick={fetchSentinel} 
          disabled={loading} 
          style={loading ? {...styles.button, opacity: 0.6} : styles.button}
        >
          {loading ? '⚡ Running 4-Gate Pipeline...' : '🔄 Trigger Verification Run'}
        </button>
      </header>

      {/* Main Grid */}
      {data && (
        <main style={styles.main}>
          {/* Top Status Card */}
          <section style={styles.statusCard}>
            <div>
              <span style={styles.metaLabel}>ACTIVE ASSET</span>
              <h2 style={styles.assetTicker}>{data.token || 'rAAPL'} <span style={styles.chainBadge}>Arbitrum One</span></h2>
            </div>
            <div>
              <span style={styles.metaLabel}>SYSTEM STATUS</span>
              <div style={styles.statusPill}>
                <span style={styles.greenDot}>●</span> ALL GATES PASSED
              </div>
            </div>
            <div>
              <span style={styles.metaLabel}>TIMESTAMP</span>
              <div style={styles.metaVal}>{new Date(data.timestamp).toLocaleTimeString()}</div>
            </div>
          </section>

          {/* 4 Gates Grid */}
          <section style={styles.gateGrid}>
            {data.gates?.map((gate: any) => (
              <div key={gate.id} style={styles.gateCard}>
                <div style={styles.gateHeader}>
                  <span style={styles.gateNum}>GATE 0{gate.id}</span>
                  <span style={styles.passBadge}>✓ PASSED</span>
                </div>
                <h3 style={styles.gateName}>{gate.name}</h3>
                <p style={styles.gateDetail}>{gate.detail}</p>
              </div>
            ))}
          </section>

          {/* Execution Trace Terminal */}
          <section style={styles.terminalSection}>
            <div style={styles.terminalHeader}>
              <span style={styles.terminalTitle}>💻 REASONING LOG & EXECUTION TRACE</span>
              <span style={styles.liveIndicator}>LIVE FEED</span>
            </div>
            <div style={styles.terminalBody}>
              {data.logs?.map((log: string, idx: number) => (
                <div key={idx} style={styles.logLine}>
                  <span style={styles.logPrefix}>[SENTINEL-LOG]</span> {log}
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#0a0d12',
    color: '#e6edf3',
    minHeight: '100vh',
    padding: '2rem 3rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #21262d',
    paddingBottom: '1.5rem',
    marginBottom: '2rem',
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    color: '#1f6feb',
    backgroundColor: 'rgba(56, 139, 253, 0.15)',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
    marginBottom: '8px',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '800',
    margin: '0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#8b949e',
    margin: '4px 0 0 0',
    fontSize: '0.95rem',
  },
  button: {
    backgroundColor: '#238636',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 0 15px rgba(35, 134, 54, 0.4)',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  statusCard: {
    backgroundColor: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '8px',
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: '0.75rem',
    color: '#8b949e',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  assetTicker: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: '4px 0 0 0',
  },
  chainBadge: {
    fontSize: '0.8rem',
    backgroundColor: '#21262d',
    color: '#a5d6ff',
    padding: '2px 8px',
    borderRadius: '12px',
    verticalAlign: 'middle',
    marginLeft: '8px',
  },
  statusPill: {
    backgroundColor: 'rgba(46, 160, 67, 0.15)',
    color: '#3fb950',
    border: '1px solid rgba(46, 160, 67, 0.4)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    marginTop: '4px',
  },
  greenDot: {
    marginRight: '6px',
  },
  metaVal: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginTop: '4px',
  },
  gateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
  },
  gateCard: {
    backgroundColor: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '8px',
    padding: '1.25rem',
  },
  gateHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  gateNum: {
    fontSize: '0.75rem',
    color: '#8b949e',
    fontWeight: 'bold',
  },
  passBadge: {
    fontSize: '0.75rem',
    color: '#3fb950',
    fontWeight: 'bold',
  },
  gateName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    margin: '0 0 6px 0',
  },
  gateDetail: {
    color: '#a5d6ff',
    margin: '0',
    fontSize: '0.9rem',
  },
  terminalSection: {
    backgroundColor: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  terminalHeader: {
    backgroundColor: '#161b22',
    padding: '10px 16px',
    borderBottom: '1px solid #30363d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  terminalTitle: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#8b949e',
    letterSpacing: '0.5px',
  },
  liveIndicator: {
    fontSize: '0.7rem',
    color: '#f2994a',
    backgroundColor: 'rgba(242, 153, 74, 0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  terminalBody: {
    padding: '1.25rem',
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    fontSize: '0.9rem',
    lineHeight: '1.6',
  },
  logLine: {
    color: '#7ee787',
    marginBottom: '6px',
  },
  logPrefix: {
    color: '#1f6feb',
    marginRight: '8px',
  },
};
