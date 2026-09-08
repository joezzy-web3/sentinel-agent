'use client';

import { useState, useEffect } from 'react';

const ASSETS = [
  { symbol: 'rAAPL', name: 'Apple Inc. Tokenized' },
  { symbol: 'rNVDA', name: 'NVIDIA Corp. Tokenized' },
  { symbol: 'rTSLA', name: 'Tesla Inc. Tokenized' },
  { symbol: 'rMSFT', name: 'Microsoft Corp. Tokenized' },
];

export default function Home() {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'architecture' | 'raw'>('pipeline');

  const fetchSentinel = async (symbol = selectedAsset.symbol) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sentinel?symbol=${symbol}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch Sentinel log:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentinel(selectedAsset.symbol);
  }, [selectedAsset]);

  return (
    <div style={styles.container}>
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />

      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={styles.logoBadge}>🛡️ SENTINEL v1.0</div>
          <span style={styles.tagline}>Autonomous Safety & Edge Verification Agent</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={styles.networkPill}>
            <span style={styles.greenPulse} /> Arbitrum One Mainnet
          </span>
          <button 
            onClick={() => fetchSentinel(selectedAsset.symbol)} 
            disabled={loading} 
            style={styles.actionBtn}
          >
            {loading ? '⚡ Running 4-Gate Scan...' : '▶ Execute Gate Pipeline'}
          </button>
        </div>
      </header>

      {/* Live Metrics Row (Powered directly by Bitget API) */}
      <section style={styles.metricsRow}>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>TARGET ASSET & LIVE PRICE</span>
          <div style={styles.metricValue}>
            {data?.data?.price || '$---.--'}{' '}
            <span style={{ fontSize: '0.8rem', color: '#8b949e' }}>USDT</span>
          </div>
          <span style={styles.metricSub}>{selectedAsset.name}</span>
        </div>

        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>BITGET L2 DEPTH</span>
          <div style={styles.metricValue}>{data?.data?.orderbookDepth || '$0'}</div>
          <span style={{ ...styles.metricSub, color: '#3fb950' }}>
            {data?.isLiveBitgetFeed ? '✓ Live Bitget Orderbook Feed' : '⚠️ Fallback Feed'}
          </span>
        </div>

        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>WEEKEND GAP SPREAD</span>
          <div style={{ 
            ...styles.metricValue, 
            color: data?.data?.spread?.startsWith('+') ? '#3fb950' : '#f85149' 
          }}>
            {data?.data?.spread || '0.00%'}
          </div>
          <span style={styles.metricSub}>Statistical Edge Signal</span>
        </div>

        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>PROOF OF RESERVES</span>
          <div style={{ ...styles.metricValue, color: '#58a6ff' }}>
            {data?.data?.porRatio || '100%'}
          </div>
          <span style={styles.metricSub}>Reality Protocol On-Chain</span>
        </div>
      </section>

      {/* Grid Layout */}
      <div style={styles.gridContainer}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>SELECT TOKENIZED STOCK</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ASSETS.map((asset) => (
              <button
                key={asset.symbol}
                onClick={() => setSelectedAsset(asset)}
                style={{
                  ...styles.assetBtn,
                  ...(selectedAsset.symbol === asset.symbol ? styles.assetBtnActive : {})
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{asset.symbol}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8b949e' }}>{asset.name}</div>
                </div>
              </button>
            ))}
          </div>

          <div style={styles.infoBox}>
            <h4 style={{ margin: '0 0 6px 0', color: '#58a6ff' }}>📌 Contract Address</h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#8b949e', wordBreak: 'break-all' }}>
              {data?.contractAddress || 'Fetching...'}
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={styles.mainContent}>
          <div style={styles.tabNav}>
            <button 
              onClick={() => setActiveTab('pipeline')}
              style={{ ...styles.tabBtn, ...(activeTab === 'pipeline' ? styles.tabBtnActive : {}) }}
            >
              📊 Live 4-Gate Trace
            </button>
            <button 
              onClick={() => setActiveTab('architecture')}
              style={{ ...styles.tabBtn, ...(activeTab === 'architecture' ? styles.tabBtnActive : {}) }}
            >
              ⚙️ Agentic Flow Diagram
            </button>
            <button 
              onClick={() => setActiveTab('raw')}
              style={{ ...styles.tabBtn, ...(activeTab === 'raw' ? styles.tabBtnActive : {}) }}
            >
              📄 Raw JSON Trace
            </button>
          </div>

          {activeTab === 'pipeline' && data && (
            <div>
              {/* Gate Grid */}
              <div style={styles.gateGrid}>
                {data.gates?.map((gate: any) => (
                  <div key={gate.id} style={styles.gateCard}>
                    <div style={styles.gateHeader}>
                      <span style={styles.gateBadge}>GATE 0{gate.id}</span>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        color: gate.status === 'passed' ? '#3fb950' : gate.status === 'vetoed' ? '#d29922' : '#f85149'
                      }}>
                        ● {gate.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 style={styles.gateTitle}>{gate.name}</h4>
                    <div style={styles.gateDetail}>{gate.detail}</div>
                  </div>
                ))}
              </div>

              {/* Terminal View */}
              <div style={styles.terminal}>
                <div style={styles.terminalHeader}>
                  <span>TERMINAL REASONING TRACE — {selectedAsset.symbol}</span>
                  <span style={{ color: '#3fb950', fontSize: '0.75rem' }}>● LIVE REASONING LOG</span>
                </div>
                <div style={styles.terminalBody}>
                  {loading ? (
                    <div style={{ color: '#d29922' }}>[SENTINEL-SYSTEM] Querying Bitget L2 Depth & Executing Qwen LLM Scan...</div>
                  ) : (
                    data.logs?.map((log: string, idx: number) => (
                      <div key={idx} style={styles.terminalLine}>
                        <span style={{ color: '#58a6ff' }}>[REASONING-ENGINE]</span> {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div style={styles.architectureBox}>
              <h3 style={{ marginTop: 0, color: '#58a6ff' }}>Sentinel 4-Gate Architecture</h3>
              <div style={styles.flowStep}><strong>Gate 1 (Safety):</strong> Bitget Wallet MCP Security Audit + On-Chain Arbitrum Verification + Reality Protocol PoR.</div>
              <div style={styles.flowStep}><strong>Gate 2 (Edge):</strong> Bitget L2 Orderbook Depth Pull + Weekend Gap Divergence Engine.</div>
              <div style={styles.flowStep}><strong>Gate 3 (Context):</strong> Qwen Agentic LLM Context Check with Trade Veto Power.</div>
              <div style={styles.flowStep}><strong>Gate 4 (Execution):</strong> Mathematical Sizing: <code>edge_score × confidence × pool_cap</code>.</div>
            </div>
          )}

          {activeTab === 'raw' && (
            <div style={styles.terminal}>
              <div style={styles.terminalHeader}>
                <span>RAW JSON RESPONSE</span>
              </div>
              <pre style={{ padding: '1rem', color: '#7ee787', margin: 0, overflowX: 'auto', fontSize: '0.85rem' }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { backgroundColor: '#06080c', color: '#f0f6fc', minHeight: '100vh', padding: '2rem 3rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace', position: 'relative' },
  bgGlow1: { position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(31,111,235,0.12) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' },
  bgGlow2: { position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(35,134,54,0.12) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid #21262d', marginBottom: '1.5rem' },
  logoBadge: { backgroundColor: 'rgba(31, 111, 235, 0.15)', border: '1px solid rgba(56, 139, 253, 0.4)', color: '#58a6ff', fontWeight: 'bold', padding: '6px 12px', borderRadius: '6px' },
  tagline: { color: '#8b949e', fontSize: '0.9rem' },
  networkPill: { backgroundColor: '#161b22', border: '1px solid #30363d', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#c9d1d9', display: 'flex', alignItems: 'center', gap: '6px' },
  greenPulse: { width: '8px', height: '8px', backgroundColor: '#3fb950', borderRadius: '50%', display: 'inline-block' },
  actionBtn: { backgroundColor: '#238636', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 12px rgba(35, 134, 54, 0.3)' },
  metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  metricCard: { backgroundColor: 'rgba(22, 27, 34, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid #30363d', borderRadius: '8px', padding: '1rem 1.25rem' },
  metricLabel: { fontSize: '0.7rem', color: '#8b949e', fontWeight: 'bold' },
  metricValue: { fontSize: '1.6rem', fontWeight: 'bold', margin: '4px 0' },
  metricSub: { fontSize: '0.75rem', color: '#8b949e' },
  gridContainer: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' },
  sidebar: { backgroundColor: 'rgba(22, 27, 34, 0.7)', border: '1px solid #30363d', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  sidebarTitle: { fontSize: '0.75rem', color: '#8b949e', fontWeight: 'bold', margin: 0 },
  assetBtn: { backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', padding: '10px 12px', color: '#f0f6fc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' },
  assetBtnActive: { backgroundColor: 'rgba(31, 111, 235, 0.15)', borderColor: '#58a6ff' },
  infoBox: { backgroundColor: '#0d1117', border: '1px solid #21262d', borderRadius: '6px', padding: '12px', marginTop: 'auto' },
  mainContent: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  tabNav: { display: 'flex', gap: '0.5rem', borderBottom: '1px solid #21262d', paddingBottom: '0.5rem' },
  tabBtn: { backgroundColor: 'transparent', border: 'none', color: '#8b949e', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  tabBtnActive: { backgroundColor: '#21262d', color: '#f0f6fc' },
  gateGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem' },
  gateCard: { backgroundColor: 'rgba(22, 27, 34, 0.7)', border: '1px solid #30363d', borderRadius: '8px', padding: '1rem' },
  gateHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  gateBadge: { fontSize: '0.65rem', color: '#8b949e', fontWeight: 'bold' },
  gateTitle: { fontSize: '0.95rem', fontWeight: 'bold', margin: '0 0 4px 0' },
  gateDetail: { fontSize: '0.8rem', color: '#a5d6ff' },
  terminal: { backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', overflow: 'hidden' },
  terminalHeader: { backgroundColor: '#161b22', padding: '10px 14px', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b949e', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #30363d' },
  terminalBody: { padding: '1rem', fontSize: '0.85rem', fontFamily: 'Consolas, Monaco, monospace', lineHeight: '1.6', maxHeight: '260px', overflowY: 'auto' },
  terminalLine: { marginBottom: '6px' },
  architectureBox: { backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '1.5rem' },
  flowStep: { backgroundColor: '#0d1117', border: '1px solid #21262d', borderRadius: '6px', padding: '12px', marginBottom: '10px', fontSize: '0.9rem' },
};
