import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider }  from './context/ThemeContext';
import { AuthProvider }   from './context/AuthContext';
import { ToastProvider }  from './context/ToastContext';
import './index.css';

// ── Global Error Boundary ────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#0f0f1a', fontFamily: 'Inter, sans-serif', padding: 24,
        }}>
          <div style={{
            maxWidth: 560, width: '100%', padding: 40,
            background: '#1a1a2e', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}>
              <i className="fas fa-triangle-exclamation" style={{ color: '#f87171', fontSize: 24 }} />
            </div>
            <h2 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 20, marginBottom: 8 }}>
              Application Error
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <div style={{
              background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 24,
              fontSize: 12, color: '#8b949e', fontFamily: 'monospace',
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {this.state.error?.stack?.split('\n').slice(0, 4).join('\n')}
            </div>
            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>
              💡 If you see a Firebase error, make sure your <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4 }}>.env</code> file
              contains valid <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4 }}>VITE_FIREBASE_*</code> keys.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '10px 20px', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14,
              }}
            >
              <i className="fas fa-rotate-right" style={{ marginRight: 8 }} />
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Could not find root element to mount to');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
