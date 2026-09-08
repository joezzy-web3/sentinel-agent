'use client';

import { useState, useEffect, useRef } from 'react';

const ASSETS = [
  { symbol: 'rAAPL', tvSymbol: 'NASDAQ:AAPL', name: 'Apple Inc. Tokenized' },
  { symbol: 'rNVDA', tvSymbol: 'NASDAQ:NVDA', name: 'NVIDIA Corp. Tokenized' },
  { symbol: 'rTSLA', tvSymbol: 'NASDAQ:TSLA', name: 'Tesla Inc. Tokenized' },
  { symbol: 'rMSFT', tvSymbol: 'NASDAQ:MSFT', name: 'Microsoft Corp. Tokenized' },
];

export default function Home() {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chart' | 'trace' | 'architecture'>('chart');
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Live Clock Component
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Sentinel Pipeline Status
  const fetchSentinel = async (symbol = selectedAsset.symbol) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sentinel?symbol=${symbol}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch Sentinel data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentinel(selectedAsset.symbol);
  }, [selectedAsset]);

  // Inject TradingView Widget Script Dynamically
  useEffect(() => {
    if (!chartContainerRef.current) return;
    chartContainerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": selectedAsset.tvSymbol,
      "interval": "15",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1", // Candlesticks (Red & Green)
      "locale": "en",
      "enable_publishing": false,
      "hide_side_toolbar": false,
      "allow_symbol_change": false,
      "container_id": "tradingview_chart_container",
      "backgroundColor": "#0d1117",
      "gridColor": "rgba(42, 46, 57, 0.3)"
    });

    const widgetDiv = document.createElement('div');
    widgetDiv.id = 'tradingview_chart_container';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    chartContainerRef.current.appendChild(widgetDiv);
    widgetDiv.appendChild(script);
  }, [selectedAsset]);

  return (
    <div style={styles.container}>
      {/* Top Navigation Bar */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={styles.logoBadge}>🛡️ SENTINEL TERMINAL</div>
          <span style={styles.clockText}>🕒 {currentTime || 'SYNCING UTC CLOCK...'}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={styles.networkPill}>
            <span style={styles.greenPulse} /> Arbitrum One
          </span>
          <button 
            onClick={() => fetchSentinel(selectedAsset.symbol)} 
            disabled={loading} 
            style={styles.actionBtn}
          >
            {loading ? '⚡ Scanning L2 & Qwen...' : '▶ Run Gate Scan'}
          </button>
        </div>
      </header>

      {/* Metric Ticker Header Strip */}
      <section style={styles.tickerStrip}>
        <div style={styles.tickerItem}>
          <span style={styles.tickerLabel}>SELECTED ASSET</span>
          <span style={styles.tickerVal}>{selectedAsset.symbol} ({selectedAsset.name})</span>
        </div>
        <div style={styles.tickerItem}>
          <span style={styles.tickerLabel}>BITGET L2 DEPTH</span>
          <span style={{ ...styles.tickerVal, color: '#3fb950' }}>{data?.data?.orderbookDepth || '$0'}</span>
        </div>
        <div style={styles.tickerItem}>
          <span style={styles.tickerLabel}>WEEKEND GAP</span>
          <span style={{ ...styles.tickerVal, color: data?.data?.spread?.startsWith('+') ? '#3fb950' : '#f85149' }}>
            {data?.data?.spread || '0.00%'}
          </span>
        </div>
        <div style={styles.tickerItem}>
          <span style={styles.tickerLabel}>PROOF OF RESERVES</span>
          <span style={{ ...styles.tickerVal, color: '#58a6ff' }}>{data?.data?.porRatio || '102.4%'}</span>
        </div>
        <div style={styles.tickerItem}>
          <span style={styles.tickerLabel}>QWEN DECISION</span>
          <span style={{ ...styles.tickerVal, color: data?.gates?.[2]?.status === 'passed' ? '#3fb950' : '#f85149' }}>
            {data?.gates?.[2]?.status?.toUpperCase() || 'EVALUATING'}
          </span>
        </div>
      </section>

      {/* Main Terminal Layout */}
      <div style={styles.gridContainer}>
        {/* Sidebar Controls */}
        <aside style={styles.sidebar}>
          <h4 style={styles.sidebarTitle}>SELECT TOKENIZED STOCK</h4>
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
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{asset.symbol}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8b949e' }}>{asset.name}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Gate Verification Cards */}
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <h4 style={styles.sidebarTitle}>4-GATE SAFETY STATUS</h4>
            {data?.gates?.map((gate: any) => (
              <div key={gate.id} style={styles.gateMiniCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#8b949e', fontWeight: 'bold' }}>GATE 0{gate.id}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    color: gate.status === 'passed' ? '#3fb950' : gate.status === 'vetoed' ? '#d29922' : '#f85149'
                  }}>
                    ● {gate.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{gate.name}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Workspace (Chart & Terminal) */}
        <main style={styles.mainWorkspace}>
          <div style={styles.tabNav}>
            <button 
              onClick={() => setActiveTab('chart')}
              style={{ ...styles.tabBtn, ...(activeTab === 'chart' ? styles.tabBtnActive : {}) }}
            >
              📈 Live Candlestick Chart
            </button>
            <button 
              onClick={() => setActiveTab('trace')}
              style={{ ...styles.tabBtn, ...(activeTab === 'trace' ? styles.tabBtnActive : {}) }}
            >
              💻 Agentic Log Terminal
            </button>
            <button 
              onClick={() => setActiveTab('architecture')}
              style={{ ...styles.tabBtn, ...(activeTab === 'architecture' ? styles.tabBtnActive : {}) }}
            >
              ⚙️ Architecture & Safety Spec
            </button>
          </div>

          {/* Tab 1: Live Candlestick Chart View */}
          {activeTab === 'chart' && (
            <div style={{ height: '520px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #30363d' }}>
              <div ref={chartContainerRef} style={{ height: '100%', width: '100%' }} />
            </div>
          )}

          {/* Tab 2: Agent Terminal Output */}
          {activeTab === 'trace' && (
            <div style={styles.terminalBox}>
              <div style={styles.terminalHeader}>
                <span>TERMINAL REASONING TRACE — {selectedAsset.symbol}</span>
                <span style={{ color: '#3fb950', fontSize: '0.75rem' }}>● LIVE REASONING LOG</span>
              </div>
              <div style={styles.terminalBody}>
                {loading ? (
                  <div style={{ color: '#d29922' }}>[SENTINEL-SYSTEM] Querying Bitget L2 Depth & Executing Qwen LLM Scan...</div>
                ) : (
                  data?.logs?.map((log: string, idx: number) => (
                    <div key={idx} style={styles.terminalLine}>
                      <span style={{ color: '#58a6ff' }}>[REASONING-ENGINE]</span> {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 3: System Architecture */}
          {activeTab === 'architecture' && (
            <div style={styles.archBox}>
              <h3 style={{ marginTop: 0, color: '#58a6ff' }}>Sentinel 4-Gate Safety Architecture</h3>
              <div style={styles.flowCard}><strong>Gate 1 (Safety):</strong> Arbitrum One Contract Verification & Reality Protocol Proof-of-Reserves check.</div>
              <div style={styles.flowCard}><strong>Gate 2 (Edge):</strong> Live Bitget Level 2 Orderbook depth integration and gap measurement.</div>
              <div style={styles.flowCard}><strong>Gate 3 (Context):</strong> Qwen Agentic LLM macro check with independent trade veto authority.</div>
              <div style={styles.flowCard}><strong>Gate 4 (Execution):</strong> Mathematical risk engine positioning: <code>edge_score × confidence × depth_cap</code>.</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { backgroundColor: '#06080c', color: '#f0f6fc', minHeight: '100vh', padding: '1.5rem 2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #21262d', marginBottom: '1rem' },
  logoBadge: { backgroundColor: 'rgba(31, 111, 235, 0.15)', border: '1px solid rgba(56, 139, 253, 0.4)', color: '#58a6ff', fontWeight: 'bold', padding: '6px 12px', borderRadius: '6px', fontSize: '0.9rem' },
  clockText: { color: '#8b949e', fontSize: '0.85rem', fontFamily: 'monospace' },
  networkPill: { backgroundColor: '#161b22', border: '1px solid #30363d', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#c9d1d9', display: 'flex', alignItems: 'center', gap: '6px' },
  greenPulse: { width: '8px', height: '8px', backgroundColor: '#3fb950', borderRadius: '50%', display: 'inline-block' },
  actionBtn: { backgroundColor: '#238636', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 12px rgba(35, 134, 54, 0.3)' },
  tickerStrip: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '0.75rem 1.25rem', marginBottom: '1rem' },
  tickerItem: { display: 'flex', flexDirection: 'column' },
  tickerLabel: { fontSize: '0.65rem', color: '#8b949e', fontWeight: 'bold' },
  tickerVal: { fontSize: '1rem', fontWeight: 'bold', marginTop: '2px' },
  gridContainer: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.25rem' },
  sidebar: { backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '1rem' },
  sidebarTitle: { fontSize: '0.7rem', color: '#8b949e', fontWeight: 'bold', margin: '0 0 8px 0' },
  assetBtn: { backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '6px', padding: '10px 12px', color: '#f0f6fc', width: '100%', cursor: 'pointer', textAlign: 'left' },
  assetBtnActive: { backgroundColor: 'rgba(31, 111, 235, 0.15)', borderColor: '#58a6ff' },
  gateMiniCard: { backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '6px', padding: '8px 10px' },
  mainWorkspace: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  tabNav: { display: 'flex', gap: '0.5rem', borderBottom: '1px solid #21262d', paddingBottom: '0.5rem' },
  tabBtn: { backgroundColor: 'transparent', border: 'none', color: '#8b949e', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' },
  tabBtnActive: { backgroundColor: '#21262d', color: '#f0f6fc' },
  terminalBox: { backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', overflow: 'hidden' },
  terminalHeader: { backgroundColor: '#161b22', padding: '10px 14px', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b949e', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #30363d' },
  terminalBody: { padding: '1rem', fontSize: '0.85rem', fontFamily: 'Consolas, Monaco, monospace', lineHeight: '1.6', height: '450px', overflowY: 'auto' },
  terminalLine: { marginBottom: '8px' },
  archBox: { backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '8px', padding: '1.25rem' },
  flowCard: { backgroundColor: '#0d1117', border: '1px solid #21262d', borderRadius: '6px', padding: '12px', marginBottom: '10px', fontSize: '0.85rem' }
};
