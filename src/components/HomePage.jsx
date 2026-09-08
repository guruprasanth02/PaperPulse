import React from 'react';

export default function HomePage({ docCount = 0, messageCount = 0, onNavigate }) {
  const modules = [
    {
      id: 'recommendation',
      title: 'Research Recommendation',
      icon: 'fa-lightbulb',
      description: 'Discover relevant literature using content matching, semantic similarity, and citation graph networks.',
      status: 'Active',
      badgeClass: 'badge-success',
    },
    {
      id: 'survey',
      title: 'Literature Survey',
      icon: 'fa-book-open',
      description: 'Automate multi-paper literature surveys, thematic clustering, and state-of-the-art summary generation.',
      status: 'Active',
      badgeClass: 'badge-success',
    },
    {
      id: 'compare',
      title: 'Compare Papers',
      icon: 'fa-code-compare',
      description: 'Perform side-by-side comparison of methodologies, datasets, experimental results, and key findings.',
      status: 'Active',
      badgeClass: 'badge-success',
    },
    {
      id: 'gap-analysis',
      title: 'Research Gap Analysis',
      icon: 'fa-magnifying-glass-chart',
      description: 'Identify unaddressed research questions, contradictory findings, and novel hypothesis opportunities.',
      status: 'Active',
      badgeClass: 'badge-success',
    },
    {
      id: 'trend-analysis',
      title: 'Trend Analysis',
      icon: 'fa-chart-line',
      description: 'Track publication velocity, emerging research topics, author influence networks, and keyword evolution.',
      status: 'Active',
      badgeClass: 'badge-success',
    },
    {
      id: 'citation-gen',
      title: 'Citation Generator',
      icon: 'fa-quote-right',
      description: 'Extract BibTeX, APA, IEEE, and Chicago references automatically with metadata verification.',
      status: 'Active',
      badgeClass: 'badge-success',
    },
  ];

  const quickSteps = [
    {
      step: '01',
      title: 'Upload Papers',
      icon: 'fa-cloud-arrow-up',
      desc: 'Import your PDF research papers to index full text, metadata, and citation references.',
    },
    {
      step: '02',
      title: 'Ask Questions',
      icon: 'fa-comments',
      desc: 'Query your paper collection using natural language with context-aware RAG search.',
    },
    {
      step: '03',
      title: 'Get Insights',
      icon: 'fa-wand-magic-sparkles',
      desc: 'Extract deep summaries, comparative tables, literature surveys, and citation networks.',
    },
  ];

  return (
    <div
      className="fade-in-up"
      style={{
        height: '100%',
        minHeight: 0,
        overflowY: 'auto',
        padding: '36px 32px',
        boxSizing: 'border-box',
        color: 'var(--text-primary)',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: 36,
      }}
    >
      {/* ── Hero Section ── */}
      <section
        className="glass-card"
        style={{
          padding: '36px 32px',
          position: 'relative',
          overflow: 'visible',
          background: 'linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(16,185,129,0.06) 100%)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <div style={{ maxWidth: 840 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              background: 'rgba(14,165,233,0.15)',
              border: '1px solid rgba(56,189,248,0.3)',
              marginBottom: 12,
      
            }}
          >
            <i className="fas fa-sparkles" style={{ color: 'var(--primary-light)', fontSize: 13 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-light)', letterSpacing: '0.05em' }}>
              NEXT-GEN RESEARCH ASSISTANT
            </span>
          </div>

          <h1
            className="gradient-text"
            style={{
              fontSize: 32,
              fontWeight: 800,
              lineHeight: 1.25,
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}
          >
            AI-Based Intelligent Research Paper Recommendation &amp; Literature Survey Assistant
          </h1>

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              marginBottom: 28,
            }}
          >
            Streamline your scientific literature reviews, uncover hidden research gaps, compare papers side-by-side,
            and generate intelligent recommendations powered by advanced AI and Retrieval-Augmented Generation.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            {onNavigate && (
              <button
                className="btn-primary"
                onClick={() => onNavigate('assistant')}
                style={{ padding: '12px 24px', fontSize: 14 }}
              >
                <i className="fas fa-robot" />
                Open Research Assistant
              </button>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '8px 18px',
                borderRadius: 12,
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="fas fa-file-pdf" style={{ color: 'var(--primary-light)', fontSize: 14 }} />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Indexed Papers:</span>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{docCount}</strong>
              </div>
              <div style={{ width: 1, height: 16, background: 'var(--glass-border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="fas fa-message" style={{ color: 'var(--success)', fontSize: 14 }} />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Messages:</span>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{messageCount}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Modules Grid (2 columns) ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              Core System Modules
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Explore AI-powered research capabilities designed for comprehensive literature survey workflows.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 20,
          }}
        >
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="glass-card"
              onClick={() => onNavigate && onNavigate(mod.id)}
              style={{
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                cursor: onNavigate ? 'pointer' : 'default',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(14,165,233,0.12)',
                      border: '1px solid rgba(56,189,248,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <i className={`fas ${mod.icon}`} style={{ color: 'var(--primary-light)', fontSize: 20 }} />
                  </div>
                  <span className={`badge ${mod.badgeClass}`}>{mod.status}</span>
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {mod.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  {mod.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--primary-light)' }}>
                <span>Explore module</span>
                <i className="fas fa-arrow-right" style={{ fontSize: 11 }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Start Section ── */}
      <section
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'var(--glass)',
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Quick Start Workflow
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Get started with AI literature survey assistance in three simple steps.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}
        >
          {quickSteps.map((qs) => (
            <div
              key={qs.step}
              style={{
                padding: 20,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--glass-border)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                  }}
                >
                  <i className={`fas ${qs.icon}`} style={{ color: '#fff', fontSize: 15 }} />
                </div>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: 'rgba(255,255,255,0.15)',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {qs.step}
                </span>
              </div>

              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                {qs.title}
              </h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{qs.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
