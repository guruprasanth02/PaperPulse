import React, { useState, useEffect } from 'react';

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { id: 'home',      icon: 'fa-house',                   label: 'Home' },
    ],
  },
  {
    label: 'Research Tools',
    items: [
      { id: 'assistant', icon: 'fa-robot',                   label: 'Research Assistant' },
      { id: 'recommend', icon: 'fa-lightbulb',               label: 'Recommendation' },
      { id: 'literature',icon: 'fa-book-open',               label: 'Literature Survey' },
      { id: 'compare',   icon: 'fa-code-compare',            label: 'Compare Papers' },
      { id: 'gap',       icon: 'fa-magnifying-glass-chart',  label: 'Research Gap' },
      { id: 'trend',     icon: 'fa-chart-line',              label: 'Trend Analysis' },
      { id: 'citation',  icon: 'fa-quote-left',              label: 'Citation Generator' },
    ],
  },
  {
    label: 'Library',
    items: [
      { id: 'papers',    icon: 'fa-folder-open',             label: 'My Papers' },
      { id: 'summary',   icon: 'fa-file-lines',              label: 'Summarize' },
      { id: 'export',    icon: 'fa-file-export',             label: 'Export Notes' },
    ],
  },
  {
    label: null,
    items: [
      { id: 'settings',  icon: 'fa-gear',                    label: 'Settings' },
    ],
  },
];

// Bottom nav items for mobile (most-used tabs)
const MOBILE_NAV = [
  { id: 'home',      icon: 'fa-house',       label: 'Home' },
  { id: 'assistant', icon: 'fa-robot',       label: 'Assistant' },
  { id: 'recommend', icon: 'fa-lightbulb',   label: 'Discover' },
  { id: 'papers',    icon: 'fa-folder-open', label: 'Library' },
  { id: 'menu',      icon: 'fa-bars',        label: 'More' },
];

export default function Sidebar({ activeTab, setActiveTab, docCount, sessionStats, user, onClearSession, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on tab change
  const handleNav = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  // Close drawer on outside click / escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <>
      {/* ─── Desktop Sidebar ─────────────────────────────── */}
      <nav className="sidebar-desktop" style={{
        width: 260,
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        gap: 2,
        flexShrink: 0,
        overflowY: 'auto',
      }}>
        <SidebarContent
          activeTab={activeTab}
          setActiveTab={handleNav}
          docCount={docCount}
          sessionStats={sessionStats}
          user={user}
          onClearSession={onClearSession}
          onLogout={onLogout}
        />
      </nav>

      {/* ─── Mobile: Bottom Navigation Bar ──────────────── */}
      <nav className="mobile-bottom-nav">
        {MOBILE_NAV.map((item) => {
          const isMenu = item.id === 'menu';
          const active = !isMenu && activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => isMenu ? setMobileOpen(true) : handleNav(item.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '8px 4px',
                background: 'none',
                border: 'none',
                color: active ? 'var(--primary-light)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: 10,
                fontFamily: 'Inter, sans-serif',
                fontWeight: active ? 700 : 500,
                transition: 'color 0.2s',
                position: 'relative',
              }}
            >
              {active && (
                <span style={{
                  position: 'absolute',
                  top: 0, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 32, height: 3,
                  background: 'var(--primary)',
                  borderRadius: '0 0 4px 4px',
                }} />
              )}
              <i className={`fas ${item.icon}`} style={{ fontSize: 18 }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ─── Mobile: Full Drawer Overlay ─────────────────── */}
      {mobileOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMobileOpen(false)}
        >
          <nav
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 12px', borderBottom: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #0ea5e9, #10b981)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-brain" style={{ color: '#fff', fontSize: 14 }} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>PaperPulse</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer', padding: 6 }}
              >
                <i className="fas fa-xmark" />
              </button>
            </div>

            {/* Drawer nav content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
              <SidebarContent
                activeTab={activeTab}
                setActiveTab={handleNav}
                docCount={docCount}
                sessionStats={sessionStats}
                user={user}
                onClearSession={onClearSession}
                onLogout={onLogout}
              />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

// ─── Shared nav content (used in both desktop & mobile drawer) ───────────────
function SidebarContent({ activeTab, setActiveTab, docCount, sessionStats, user, onClearSession, onLogout }) {
  return (
    <>
      {/* Logo — desktop only */}
      <div className="sidebar-logo" style={{ padding: '8px 12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(14,165,233,0.4)',
          }}>
            <i className="fas fa-brain" style={{ color: '#fff', fontSize: 16 }} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>PaperPulse</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Research &amp; Survey AI</div>
          </div>
        </div>
      </div>

      {/* Nav Groups */}
      {NAV_GROUPS.map((group, gIdx) => (
        <div key={gIdx} style={{ marginBottom: 4 }}>
          {group.label && (
            <div style={{
              fontSize: 10, fontWeight: 700, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '10px 12px 6px',
            }}>
              {group.label}
            </div>
          )}
          {group.items.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: active ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: active ? 'var(--primary-light)' : 'var(--text-muted)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14, fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  position: 'relative',
                  borderLeft: active ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: 1,
                  minHeight: 42,
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--glass)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
              >
                <i className={`fas ${item.icon}`} style={{ width: 18, textAlign: 'center', fontSize: 14, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.id === 'papers' && docCount > 0 && (
                  <span className="badge badge-primary">{docCount}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}

      {/* Spacer */}
      <div style={{ flex: 1, minHeight: 16 }} />

      {/* Session Stats */}
      <div className="glass-card" style={{ padding: 14, margin: '0 0 8px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Session Stats
        </div>
        <StatRow label="Documents" value={docCount} />
        <StatRow label="Messages"  value={sessionStats?.messages || 0} />
        <StatRow label="RAG Status" value="Active" color="var(--success)" />
      </div>

      {/* Clear session */}
      {(docCount > 0 || (sessionStats?.messages || 0) > 0) && (
        <button
          onClick={onClearSession}
          className="btn-ghost"
          style={{ width: '100%', justifyContent: 'center', fontSize: 12, color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)', marginBottom: 4 }}
        >
          <i className="fas fa-trash-can" />
          Clear Session
        </button>
      )}

      {/* User info */}
      {user && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px',
          background: 'var(--glass)', borderRadius: 10,
          border: '1px solid var(--glass-border)',
          marginBottom: 4,
        }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#0ea5e9,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 700, flexShrink: 0 }}>
              {(user.displayName || user.email || 'U')[0].toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.displayName || 'Researcher'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>
        </div>
      )}

      <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '4px 0' }}>
        Powered by Gemini AI
      </div>
    </>
  );
}

function StatRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: color || 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}
