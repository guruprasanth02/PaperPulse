import React from 'react';
import Sidebar        from './components/Sidebar';
import ChatContainer  from './components/ChatContainer';
import DocBrowser     from './components/DocBrowser';
import UploadZone     from './components/UploadZone';
import SummaryPanel   from './components/SummaryPanel';
import ExportPanel    from './components/ExportPanel';
import LoginPage      from './components/LoginPage';
import HomePage              from './components/HomePage';
import RecommendationPage    from './components/RecommendationPage';
import LiteratureSurveyPage  from './components/LiteratureSurveyPage';
import ComparePapersPage     from './components/ComparePapersPage';
import ResearchGapPage       from './components/ResearchGapPage';
import TrendAnalysisPage     from './components/TrendAnalysisPage';
import CitationGeneratorPage from './components/CitationGeneratorPage';
import SettingsPage          from './components/SettingsPage';
import { useTheme }   from './context/ThemeContext';
import { useAuth }    from './context/AuthContext';
import { useToast }   from './context/ToastContext';
import { useSessionPersistence } from './hooks/useSessionPersistence';

const INITIAL_SESSION = { id: `session-${Date.now()}`, docs: [], history: [], savedPapers: [] };

export default function App() {
  const [activeTab, setActiveTab] = React.useState('home');
  const { theme, toggleTheme }    = useTheme();
  const { user, logout }          = useAuth();
  const toast                     = useToast();

  const { session, setSession, clearSession } = useSessionPersistence(INITIAL_SESSION);

  // ── Auth loading splash ─────────────────────────────────────────────────────
  if (user === undefined) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #0ea5e9, #10b981)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-glow 1.5s infinite' }}>
            <i className="fas fa-layer-group" style={{ color: '#fff', fontSize: 24 }} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0,1,2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
          </div>
        </div>
      </div>
    );
  }

  // ── Not signed in → Login page ──────────────────────────────────────────────
  if (!user) return <LoginPage />;

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const handleDocsUploaded = (newDocs) => {
    setSession(prev => ({ ...prev, docs: [...(prev.docs || []), ...newDocs] }));
    toast.success(`${newDocs.length} paper${newDocs.length > 1 ? 's' : ''} indexed successfully!`);
  };

  const handleDeleteDoc = (docId) => {
    setSession(prev => ({ ...prev, docs: (prev.docs || []).filter(d => d.id !== docId) }));
    toast.info('Paper removed from library.');
  };

  const handleToggleSavePaper = (paper) => {
    setSession(prev => {
      const current = prev.savedPapers || [];
      const exists = current.some(p => p.id === paper.id);
      let updated = [];
      if (exists) {
        updated = current.filter(p => p.id !== paper.id);
      } else {
        updated = [...current, { ...paper, savedAt: new Date().toISOString() }];
      }
      return { ...prev, savedPapers: updated };
    });
  };

  const handleRemoveSavedPaper = (paper) => {
    setSession(prev => ({
      ...prev,
      savedPapers: (prev.savedPapers || []).filter(p => p.id !== paper.id)
    }));
  };

  const handleClearSession = () => {
    if (window.confirm('Clear all papers and chat history? This cannot be undone.')) {
      clearSession();
      toast.success('Session cleared.');
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out. See you next time!');
  };

  const totalPaperCount = (session.docs?.length || 0) + (session.savedPapers?.length || 0);

  const tabContent = {
    home:       <HomePage docCount={totalPaperCount} messageCount={session.history?.length || 0} onNavigate={setActiveTab} />,
    assistant:  <ChatContainer session={session} setSession={setSession} />,
    recommend:  <RecommendationPage savedPapers={session.savedPapers || []} onSavePaper={handleToggleSavePaper} onNavigateToAssistant={setActiveTab} />,
    literature: <LiteratureSurveyPage  documents={session.docs || []} />,
    compare:    <ComparePapersPage     documents={session.docs || []} />,
    gap:        <ResearchGapPage       documents={session.docs || []} />,
    trend:      <TrendAnalysisPage     documents={session.docs || []} />,
    citation:   <CitationGeneratorPage documents={session.docs || []} />,
    papers:     <DocBrowser documents={session.docs || []} savedPapers={session.savedPapers || []} onDeleteDoc={handleDeleteDoc} onRemoveSavedPaper={handleRemoveSavedPaper} />,
    summary:    <SummaryPanel documents={session.docs || []} />,
    export:     <ExportPanel session={session} />,
    settings:   <SettingsPage />,
  };

  const tabLabel = {
    home:       '🏠 Home',
    assistant:  '🤖 Research Assistant',
    recommend:  '💡 Research Recommendation',
    literature: '📚 Literature Survey',
    compare:    '⚖️ Compare Papers',
    gap:        '🔍 Research Gap Analysis',
    trend:      '📈 Trend Analysis',
    citation:   '📝 Citation Generator',
    papers:     '📂 My Papers',
    summary:    '📄 Summarization',
    export:     '📤 Export Notes',
    settings:   '⚙️ Settings',
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-dark)' }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        docCount={totalPaperCount}
        sessionStats={{ messages: session.history?.length || 0 }}
        user={user}
        onClearSession={handleClearSession}
        onLogout={handleLogout}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* ── Header ── */}
        <header style={{
          height: 62, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
          borderBottom: '1px solid var(--glass-border)',
          background: 'var(--header-bg)', backdropFilter: 'blur(12px)',
          position: 'relative', zIndex: 200,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              {tabLabel[activeTab]}
            </div>
            {totalPaperCount > 0 && (
              <span className="badge badge-success">{totalPaperCount} papers in library</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <UploadZone onUploadComplete={handleDocsUploaded} />

            {/* Theme toggle */}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
            >
              <span className="theme-toggle-knob">{theme === 'dark' ? '🌙' : '☀️'}</span>
            </button>

            {/* User avatar with logout dropdown */}
            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </header>

        {/* ── Main content ── */}
        <main style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {tabContent[activeTab]}
        </main>
      </div>
    </div>
  );
}

// ── User avatar + dropdown menu ───────────────────────────────────────────────
function UserMenu({ user, onLogout }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '2px solid var(--primary)',
          overflow: 'hidden', cursor: 'pointer',
          padding: 0, background: 'none',
          transition: 'box-shadow 0.2s',
          boxShadow: open ? '0 0 0 3px rgba(14,165,233,0.3)' : 'none',
        }}
        title={user.displayName || user.email}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#0ea5e9,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', fontWeight: 700 }}>
            {(user.displayName || user.email || 'U')[0].toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div className="bounce-in" style={{
          position: 'absolute', top: 44, right: 0, zIndex: 9999,
          background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
          borderRadius: 14, padding: 8, minWidth: 220,
          boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
        }}>
          <div style={{ padding: '10px 14px 12px', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
              {user.displayName || 'Researcher'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>
          <button
            onMouseDown={(e) => { e.preventDefault(); setOpen(false); onLogout(); }}
            style={{
              width: '100%', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', marginTop: 4,
              background: 'transparent', border: 'none',
              borderRadius: 8, cursor: 'pointer',
              color: 'var(--danger)', fontFamily: 'Inter, sans-serif',
              fontSize: 13, fontWeight: 600, transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <i className="fas fa-right-from-bracket" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
