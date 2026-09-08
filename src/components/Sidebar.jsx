import React from 'react';

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

export default function Sidebar({ activeTab, setActiveTab, docCount, sessionStats, user, onClearSession, onLogout }) {
  return (
    <nav style={{
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
      {/* Logo */}
      <div style={{ padding: '8px 12px 20px' }}>
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
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Research & Survey AI</div>
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
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: active ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: active ? 'var(--primary-light)' : 'var(--text-muted)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13, fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  position: 'relative',
                  borderLeft: active ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: 1,
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--glass)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
              >
                <i className={`fas ${item.icon}`} style={{ width: 16, textAlign: 'center', fontSize: 13 }} />
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
      <div style={{ flex: 1 }} />

      {/* Stats */}
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

      {/* User info + sign out */}
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
    </nav>
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
