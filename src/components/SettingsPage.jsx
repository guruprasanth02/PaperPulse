import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme() || { theme: 'dark', toggleTheme: () => {} };

  return (
    <div
      className="fade-in-up"
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: '36px 28px',
        maxWidth: 880,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
          Settings
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Configure your research assistant preferences
        </p>
      </div>

      {/* 1. AI Model Section Card */}
      <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(99,102,241,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-light)',
                fontSize: 16,
              }}
            >
              <i className="fas fa-brain" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                AI Model
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                LLM engine for extraction, summarizing, and paper analysis
              </p>
            </div>
          </div>
          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <i className="fas fa-circle-check" /> Gemini 3.5 Flash
          </span>
        </div>

        <div
          style={{
            background: 'var(--input-bg)',
            borderRadius: 12,
            padding: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            border: '1px solid var(--glass-border)',
          }}
        >
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Current Model
            </span>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              Gemini 3.5 Flash
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Provider
            </span>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 2 }}>
              Google Gemini AI
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Capabilities
            </span>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 2 }}>
              Multimodal PDF & Cross-Doc RAG
            </div>
          </div>
        </div>
      </div>

      {/* 2. Theme Section Card */}
      <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(99,102,241,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-light)',
                fontSize: 16,
              }}
            >
              <i className="fas fa-palette" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Theme
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                Customize visual interface appearance and color mode
              </p>
            </div>
          </div>
          <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
            {theme} Mode
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--input-bg)',
            borderRadius: 12,
            padding: '14px 18px',
            border: '1px solid var(--glass-border)',
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              Appearance Toggle
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Switch between Dark glassmorphism and Light mode interface styles
            </div>
          </div>

          <button
            className="btn-ghost"
            onClick={toggleTheme}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}
          >
            <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} />
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </div>

      {/* 3. Session Section Card */}
      <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(99,102,241,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-light)',
                fontSize: 16,
              }}
            >
              <i className="fas fa-database" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Session
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                Manage local storage persistence and session workspace
              </p>
            </div>
          </div>
          <span className="badge badge-warning">Active Workspace</span>
        </div>

        <div
          style={{
            background: 'var(--input-bg)',
            borderRadius: 12,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            border: '1px solid var(--glass-border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                LocalStorage Auto-Save
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Automatically persists document library index and chat history in local browser cache
              </div>
            </div>
            <span className="badge badge-success">Enabled</span>
          </div>
          <div
            style={{
              paddingTop: 10,
              borderTop: '1px solid var(--glass-border)',
              fontSize: 12,
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <i className="fas fa-circle-info" style={{ color: 'var(--primary-light)' }} />
            Note: Session reset and data purging options can be executed directly from the sidebar menu.
          </div>
        </div>
      </div>

      {/* 4. About Section Card */}
      <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(99,102,241,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-light)',
              fontSize: 16,
            }}
          >
            <i className="fas fa-circle-info" />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              About
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
              Application metadata and architecture details
            </p>
          </div>
        </div>

        <div
          style={{
            background: 'var(--input-bg)',
            borderRadius: 12,
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            border: '1px solid var(--glass-border)',
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              AI-Based Intelligent Research Paper Recommendation and Literature Survey Assistant
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              An intelligent assistant for literature surveying, document QA, and citation discovery.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              paddingTop: 12,
              borderTop: '1px solid var(--glass-border)',
            }}
          >
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Version
              </span>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-light)' }}>
                1.0.0
              </div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Engine
              </span>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                Powered by Google Gemini AI
              </div>
            </div>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Stack
              </span>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                React 18 + Vite + FontAwesome
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
