import React, { useState } from 'react';

export default function DocBrowser({ documents = [], savedPapers = [], onDeleteDoc, onRemoveSavedPaper }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState('');
  const [tabFilter, setTabFilter] = useState('all'); // 'all' | 'uploaded' | 'saved'

  // Standardize papers list for combined browsing
  const uploadedList = documents.map(d => ({
    ...d,
    itemType: 'uploaded',
    authorName: d.author || 'Unknown Author',
  }));

  const savedList = savedPapers.map(sp => ({
    ...sp,
    itemType: 'saved',
    authorName: Array.isArray(sp.authors) ? sp.authors.join(', ') : (sp.author || 'Unknown Author'),
  }));

  let combined = [];
  if (tabFilter === 'uploaded') {
    combined = uploadedList;
  } else if (tabFilter === 'saved') {
    combined = savedList;
  } else {
    // deduplicate by id or title
    const ids = new Set(uploadedList.map(u => u.id));
    combined = [...uploadedList, ...savedList.filter(s => !ids.has(s.id))];
  }

  const filtered = combined.filter(d =>
    !search ||
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.authorName.toLowerCase().includes(search.toLowerCase()) ||
    d.keywords?.some(k => k.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (doc, e) => {
    e?.stopPropagation();
    if (doc.itemType === 'saved') {
      if (window.confirm('Remove this paper from Saved Recommendations?')) {
        onRemoveSavedPaper(doc);
        if (selected?.id === doc.id) setSelected(null);
      }
    } else {
      if (window.confirm('Remove this document from the research library?')) {
        onDeleteDoc(doc.id);
        if (selected?.id === doc.id) setSelected(null);
      }
    }
  };

  const colors = ['#0ea5e9', '#10b981', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'];

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 28, boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            My Papers Library
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Access and manage your uploaded PDFs and saved paper recommendations
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-primary" style={{ fontSize: 11, padding: '6px 12px' }}>
            {uploadedList.length} Uploaded
          </span>
          <span className="badge badge-success" style={{ fontSize: 11, padding: '6px 12px' }}>
            {savedList.length} Saved
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-card" style={{ padding: 4, display: 'flex', gap: 4, marginBottom: 20, maxWidth: 450 }}>
        {[
          { id: 'all',      label: `All Papers (${combined.length})` },
          { id: 'uploaded', label: `Uploaded (${uploadedList.length})` },
          { id: 'saved',    label: `Saved Recs (${savedList.length})` },
        ].map(tf => (
          <button
            key={tf.id}
            onClick={() => setTabFilter(tf.id)}
            style={{
              flex: 1, padding: '8px 12px', borderRadius: 8,
              border: 'none',
              background: tabFilter === tf.id ? 'var(--primary-dark)' : 'transparent',
              color: tabFilter === tf.id ? '#fff' : 'var(--text-muted)',
              fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: tabFilter === tf.id ? 700 : 500,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Search */}
      {combined.length > 0 && (
        <div style={{ marginBottom: 20, position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search papers by title, author, keyword..."
            style={{
              width: '100%', padding: '10px 14px 10px 38px',
              background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
              borderRadius: 10, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', fontSize: 13,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* Empty state */}
      {combined.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50%', gap: 16 }}>
          <div style={{ width: 72, height: 72, background: 'var(--bg-card)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
            <i className="fas fa-folder-open" style={{ fontSize: 28, color: 'var(--text-muted)' }} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>No papers found in your library</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            Use "Upload Papers" in the header or save recommendations from the "Recommendation" tab
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {filtered.map((doc, idx) => {
            const accent = colors[idx % colors.length];
            const isSavedRec = doc.itemType === 'saved';

            return (
              <div
                key={doc.id}
                onClick={() => setSelected(doc)}
                className="glass-card fade-in-up"
                style={{
                  cursor: 'pointer', overflow: 'hidden', position: 'relative',
                  transition: 'all 0.25s', borderTop: `3px solid ${accent}`,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.3), 0 0 0 1px ${accent}40`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ padding: '18px 18px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span className={isSavedRec ? "badge badge-success" : "badge badge-primary"}>
                      <i className={isSavedRec ? "fas fa-bookmark" : "fas fa-file-pdf"} style={{ marginRight: 4 }} />
                      {isSavedRec ? 'Saved Rec' : 'Uploaded PDF'}
                    </span>
                    <button
                      onClick={e => handleDelete(doc, e)}
                      title={isSavedRec ? 'Remove saved paper' : 'Delete document'}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 6, fontSize: 12, transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {doc.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                    <i className="fas fa-user-graduate" style={{ fontSize: 10 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>{doc.authorName}</span>
                    <span>•</span>
                    <span>{doc.year || 'N/A'}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                    {(doc.keywords || []).slice(0, 3).map((kw, i) => (
                      <span key={i} className="badge" style={{ background: 'var(--glass)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', fontSize: 9, textTransform: 'none' }}>{kw}</span>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '12px 18px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Indexed</span>
                  </div>
                  <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>View Details →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div className="bounce-in glass-card" style={{ width: '100%', maxWidth: 840, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className={selected.itemType === 'saved' ? "badge badge-success" : "badge badge-primary"} style={{ marginBottom: 10 }}>
                  {selected.itemType === 'saved' ? 'Saved Paper Recommendation' : 'Uploaded Document'}
                </span>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, margin: 0 }}>{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="btn-ghost" style={{ padding: '8px 10px' }}><i className="fas fa-xmark" /></button>
            </div>

            <div style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 0 }}>
              {/* Meta panel */}
              <div style={{ padding: '24px 20px', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Author(s)</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selected.authorName}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Year</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selected.year || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Domain</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{selected.domain || 'General Research'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Keywords</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {(selected.keywords || []).map((kw, i) => (
                      <span key={i} className="badge badge-primary" style={{ fontSize: 10, textTransform: 'none' }}>{kw}</span>
                    ))}
                  </div>
                </div>
                <button onClick={e => handleDelete(selected, e)} className="btn-ghost" style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)', marginTop: 'auto' }}>
                  <i className="fas fa-trash-alt" /> Remove Paper
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    {selected.abstract ? 'Abstract' : 'Extracted Text Content'}
                  </span>
                  <span className="badge badge-success">Verified Integrity</span>
                </div>
                <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: '20px 22px', flex: 1, overflow: 'auto', maxHeight: '55vh' }}>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                    {selected.abstract || selected.fullText || 'No text content available.'}
                  </p>
                </div>
                {selected.pdfUrl && (
                  <a
                    href={selected.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{ textDecoration: 'none', justifyContent: 'center', marginTop: 8 }}
                  >
                    <i className="fas fa-file-pdf" /> Open Original PDF Document
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
