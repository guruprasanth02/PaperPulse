import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { fetchArxivClientSide, toggleSavePaper } from '../services/recommendation';

export default function DocBrowser({
  documents = [],
  savedPapers = [],
  onDeleteDoc,
  onSavePaper,
  onRemoveSavedPaper,
  onNavigateTab,
}) {
  const toast = useToast();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [tabFilter, setTabFilter] = useState('all'); // 'all' | 'uploaded' | 'saved'

  // Modal for "+ Save Paper"
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState('arxiv'); // 'arxiv' | 'manual'
  const [arxivQuery, setArxivQuery] = useState('');
  const [arxivResults, setArxivResults] = useState([]);
  const [arxivLoading, setArxivLoading] = useState(false);

  // Manual paper form state
  const [manualForm, setManualForm] = useState({
    title: '',
    authors: '',
    year: new Date().getFullYear(),
    domain: 'General Research',
    abstract: '',
    pdfUrl: '',
    keywords: '',
  });

  // Check if a paper is currently saved
  const isSaved = (id) => savedPapers.some(p => p.id === id);

  // Toggle save paper handler
  const handleToggleSave = (e, paper) => {
    e?.stopPropagation();
    if (!onSavePaper) return;
    const alreadySaved = isSaved(paper.id);
    onSavePaper(paper);
    toggleSavePaper(paper.id, paper).catch(() => {});
    if (alreadySaved) {
      toast.info(`Removed "${paper.title.slice(0, 32)}..." from Saved Papers.`);
    } else {
      toast.success(`Saved "${paper.title.slice(0, 32)}..." to Saved Papers!`);
    }
  };

  // Standardize papers list for combined browsing
  const uploadedList = documents.map(d => ({
    ...d,
    itemType: 'uploaded',
    authorName: Array.isArray(d.authors) ? d.authors.join(', ') : (d.author || 'Unknown Author'),
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
    // Deduplicate by id
    const ids = new Set(uploadedList.map(u => u.id));
    combined = [...uploadedList, ...savedList.filter(s => !ids.has(s.id))];
  }

  const filtered = combined.filter(d =>
    !search ||
    d.title?.toLowerCase().includes(search.toLowerCase()) ||
    d.authorName?.toLowerCase().includes(search.toLowerCase()) ||
    d.domain?.toLowerCase().includes(search.toLowerCase()) ||
    d.keywords?.some(k => k.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (doc, e) => {
    e?.stopPropagation();
    if (doc.itemType === 'saved') {
      if (window.confirm('Remove this paper from Saved Papers?')) {
        if (onRemoveSavedPaper) onRemoveSavedPaper(doc);
        else if (onSavePaper) onSavePaper(doc);
        if (selected?.id === doc.id) setSelected(null);
        toast.info('Paper removed from Saved Papers.');
      }
    } else {
      if (window.confirm('Remove this document from the research library?')) {
        onDeleteDoc(doc.id);
        if (selected?.id === doc.id) setSelected(null);
        toast.info('Document deleted.');
      }
    }
  };

  // Live arXiv search in Add Modal
  const handleSearchArxiv = async () => {
    if (!arxivQuery.trim()) return;
    setArxivLoading(true);
    try {
      const results = await fetchArxivClientSide(arxivQuery.trim());
      setArxivResults(results);
      if (results.length === 0) {
        toast.info('No arXiv papers found matching your query.');
      }
    } catch (err) {
      toast.error('Failed to search arXiv: ' + (err.message || 'Network error'));
    } finally {
      setArxivLoading(false);
    }
  };

  // Save manual paper
  const handleSaveManual = (e) => {
    e.preventDefault();
    if (!manualForm.title.trim()) {
      toast.warning('Please enter a paper title.');
      return;
    }
    const authorsArr = manualForm.authors
      ? manualForm.authors.split(',').map(a => a.trim()).filter(Boolean)
      : ['Author'];
    const keywordsArr = manualForm.keywords
      ? manualForm.keywords.split(',').map(k => k.trim()).filter(Boolean)
      : [manualForm.domain];

    const newPaper = {
      id: `saved-${Date.now()}`,
      title: manualForm.title.trim(),
      authors: authorsArr,
      author: authorsArr.join(', '),
      year: parseInt(manualForm.year) || new Date().getFullYear(),
      domain: manualForm.domain || 'General Research',
      abstract: manualForm.abstract.trim() || 'Manually saved research paper.',
      keywords: keywordsArr,
      pdfUrl: manualForm.pdfUrl.trim() || undefined,
      source: manualForm.pdfUrl ? 'Web Reference' : 'Custom Entry',
      savedAt: new Date().toISOString(),
    };

    if (onSavePaper) onSavePaper(newPaper);
    toggleSavePaper(newPaper.id, newPaper).catch(() => {});
    toast.success(`Saved "${newPaper.title.slice(0, 30)}..." to Saved Papers!`);
    setShowAddModal(false);
    setManualForm({
      title: '',
      authors: '',
      year: new Date().getFullYear(),
      domain: 'General Research',
      abstract: '',
      pdfUrl: '',
      keywords: '',
    });
    setTabFilter('saved');
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

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-primary" style={{ fontSize: 11, padding: '6px 12px' }}>
            {uploadedList.length} Uploaded
          </span>
          <span className="badge badge-success" style={{ fontSize: 11, padding: '6px 12px' }}>
            {savedList.length} Saved
          </span>

          <button
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 10,
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-bookmark" />
            <span>+ Save Paper</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-card" style={{ padding: 4, display: 'flex', gap: 4, marginBottom: 20, maxWidth: 480 }}>
        {[
          { id: 'all',      label: `All Papers (${combined.length})` },
          { id: 'uploaded', label: `Uploaded (${uploadedList.length})` },
          { id: 'saved',    label: `Saved Papers (${savedList.length})` },
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
            placeholder="Search papers by title, author, domain, keyword..."
            style={{
              width: '100%', padding: '10px 14px 10px 38px',
              background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
              borderRadius: 10, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', fontSize: 13,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* Empty states */}
      {combined.length === 0 ? (
        tabFilter === 'saved' ? (
          <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 68, height: 68, borderRadius: 20, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-bookmark" style={{ fontSize: 28, color: 'var(--success)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                No Saved Papers Yet
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
                You can save any uploaded paper with the bookmark icon, discover and save papers from the Recommendation tab, or add papers directly by searching arXiv.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
              <button
                className="btn-primary"
                onClick={() => setShowAddModal(true)}
                style={{ padding: '10px 20px', fontSize: 13 }}
              >
                <i className="fas fa-plus" /> Save Paper Now
              </button>
              {onNavigateTab && (
                <button
                  className="btn-ghost"
                  onClick={() => onNavigateTab('recommend')}
                  style={{ padding: '10px 20px', fontSize: 13 }}
                >
                  <i className="fas fa-sparkles" /> Discover Recommendations
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50%', gap: 16 }}>
            <div style={{ width: 72, height: 72, background: 'var(--bg-card)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
              <i className="fas fa-folder-open" style={{ fontSize: 28, color: 'var(--text-muted)' }} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>No papers found in your library</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
              Use "Upload Papers" in the header or save papers using the "+ Save Paper" button
            </p>
          </div>
        )
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {filtered.map((doc, idx) => {
            const accent = colors[idx % colors.length];
            const isSavedDoc = isSaved(doc.id);
            const isUploaded = doc.itemType === 'uploaded';

            return (
              <div
                key={doc.id}
                onClick={() => setSelected(doc)}
                className="glass-card fade-in-up"
                style={{
                  cursor: 'pointer', overflow: 'hidden', position: 'relative',
                  transition: 'all 0.25s', borderTop: `3px solid ${isSavedDoc ? 'var(--success)' : accent}`,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.3), 0 0 0 1px ${accent}40`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div style={{ padding: '18px 18px 14px' }}>
                  {/* Card Header with Badges & Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className={isUploaded ? "badge badge-primary" : "badge badge-success"}>
                        <i className={isUploaded ? "fas fa-file-pdf" : "fas fa-bookmark"} style={{ marginRight: 4 }} />
                        {isUploaded ? 'Uploaded PDF' : 'Saved Paper'}
                      </span>
                      {isUploaded && isSavedDoc && (
                        <span className="badge badge-success" style={{ fontSize: 9 }}>
                          <i className="fas fa-bookmark" style={{ marginRight: 2 }} /> Saved
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {/* Bookmark / Save Toggle Button */}
                      <button
                        onClick={(e) => handleToggleSave(e, doc)}
                        title={isSavedDoc ? 'Remove from Saved Papers' : 'Save to Saved Papers'}
                        style={{
                          background: isSavedDoc ? 'rgba(16,185,129,0.18)' : 'var(--input-bg)',
                          border: isSavedDoc ? '1px solid var(--success)' : '1px solid var(--glass-border)',
                          color: isSavedDoc ? 'var(--success)' : 'var(--text-muted)',
                          cursor: 'pointer', width: 28, height: 28, borderRadius: 6,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}
                      >
                        <i className={isSavedDoc ? 'fas fa-bookmark' : 'far fa-bookmark'} style={{ fontSize: 12 }} />
                      </button>

                      {/* Delete / Remove Button */}
                      <button
                        onClick={e => handleDelete(doc, e)}
                        title={doc.itemType === 'saved' ? 'Remove saved paper' : 'Delete document'}
                        style={{
                          background: 'transparent', border: 'none', color: 'var(--text-muted)',
                          cursor: 'pointer', padding: 4, borderRadius: 6, fontSize: 12,
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <i className="fas fa-trash-alt" />
                      </button>
                    </div>
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
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: isSavedDoc ? 'var(--success)' : 'var(--primary)' }} />
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {isSavedDoc ? 'Saved in Collection' : 'Indexed'}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>View Details →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div className="bounce-in glass-card" style={{ width: '100%', maxWidth: 840, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                  <span className={selected.itemType === 'saved' ? "badge badge-success" : "badge badge-primary"}>
                    {selected.itemType === 'saved' ? 'Saved Paper' : 'Uploaded Document'}
                  </span>
                  {isSaved(selected.id) && (
                    <span className="badge badge-success">
                      <i className="fas fa-check" style={{ marginRight: 4 }} /> Saved in Collection
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, margin: 0 }}>{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="btn-ghost" style={{ padding: '8px 10px' }}><i className="fas fa-xmark" /></button>
            </div>

            <div style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 0 }}>
              {/* Meta Panel */}
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

                {/* Save to Saved Papers button */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    onClick={(e) => handleToggleSave(e, selected)}
                    className="btn-ghost"
                    style={{
                      color: isSaved(selected.id) ? 'var(--success)' : 'var(--text-primary)',
                      borderColor: isSaved(selected.id) ? 'var(--success)' : 'var(--glass-border)',
                      background: isSaved(selected.id) ? 'rgba(16,185,129,0.1)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    <i className={isSaved(selected.id) ? 'fas fa-bookmark' : 'far fa-bookmark'} />
                    {isSaved(selected.id) ? 'Saved in My Papers' : 'Save to My Papers'}
                  </button>

                  <button
                    onClick={e => handleDelete(selected, e)}
                    className="btn-ghost"
                    style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <i className="fas fa-trash-alt" /> Remove Paper
                  </button>
                </div>
              </div>

              {/* Content Panel */}
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    {selected.abstract ? 'Abstract' : 'Extracted Text Content'}
                  </span>
                  <span className="badge badge-success">Verified Integrity</span>
                </div>
                <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: '20px 22px', flex: 1, overflow: 'auto', maxHeight: '52vh' }}>
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

      {/* ── Add / Save Paper Modal ── */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: 20,
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}
        >
          <div className="bounce-in glass-card" style={{ width: '100%', maxWidth: 680, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)' }}>
                  <i className="fas fa-bookmark" />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Save Paper to Library
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                    Search arXiv live or enter paper details manually
                  </p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="btn-ghost" style={{ padding: '6px 10px' }}>
                <i className="fas fa-xmark" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: 8, background: 'rgba(0,0,0,0.15)' }}>
              <button
                onClick={() => setAddMode('arxiv')}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none',
                  background: addMode === 'arxiv' ? 'var(--primary)' : 'transparent',
                  color: addMode === 'arxiv' ? '#fff' : 'var(--text-muted)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <i className="fas fa-magnifying-glass" /> Search arXiv Live
              </button>
              <button
                onClick={() => setAddMode('manual')}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none',
                  background: addMode === 'manual' ? 'var(--primary)' : 'transparent',
                  color: addMode === 'manual' ? '#fff' : 'var(--text-muted)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <i className="fas fa-pen-to-square" /> Enter Details Manually
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 24, flex: 1, overflowY: 'auto' }}>
              {addMode === 'arxiv' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Search Input */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <i className="fas fa-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }} />
                      <input
                        type="text"
                        value={arxivQuery}
                        onChange={e => setArxivQuery(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSearchArxiv(); }}
                        placeholder="Search paper title, topic (e.g. Deepfake detection), or arXiv ID..."
                        style={{
                          width: '100%', padding: '10px 14px 10px 38px',
                          background: 'var(--input-bg)', border: '1px solid var(--glass-border)',
                          borderRadius: 10, color: 'var(--text-primary)', fontSize: 13,
                          outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <button
                      className="btn-primary"
                      onClick={handleSearchArxiv}
                      disabled={arxivLoading || !arxivQuery.trim()}
                      style={{ padding: '10px 18px', fontSize: 13 }}
                    >
                      {arxivLoading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-search" />}
                      Search
                    </button>
                  </div>

                  {/* ArXiv Results List */}
                  {arxivLoading && (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                      <i className="fas fa-spinner fa-spin" style={{ fontSize: 24, marginBottom: 8, color: 'var(--primary-light)' }} />
                      <div style={{ fontSize: 13 }}>Fetching papers from arXiv API...</div>
                    </div>
                  )}

                  {!arxivLoading && arxivResults.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Found {arxivResults.length} Papers:
                      </div>
                      {arxivResults.map(p => {
                        const saved = isSaved(p.id);
                        return (
                          <div
                            key={p.id}
                            style={{
                              padding: 14, borderRadius: 10,
                              background: 'var(--input-bg)', border: '1px solid var(--glass-border)',
                              display: 'flex', flexDirection: 'column', gap: 8,
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                                {p.title}
                              </h4>
                              <button
                                onClick={() => {
                                  if (onSavePaper) onSavePaper(p);
                                  toggleSavePaper(p.id, p).catch(() => {});
                                  if (saved) {
                                    toast.info(`Removed "${p.title.slice(0, 25)}..." from Saved Papers.`);
                                  } else {
                                    toast.success(`Saved "${p.title.slice(0, 25)}..." to Saved Papers!`);
                                  }
                                }}
                                className={saved ? "btn-ghost" : "btn-primary"}
                                style={{
                                  padding: '6px 14px', fontSize: 11, flexShrink: 0,
                                  borderColor: saved ? 'var(--success)' : undefined,
                                  color: saved ? 'var(--success)' : undefined,
                                }}
                              >
                                <i className={saved ? "fas fa-check" : "fas fa-bookmark"} />
                                {saved ? 'Saved' : 'Save to Library'}
                              </button>
                            </div>

                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {(p.authors || []).join(', ')} • {p.year}
                            </div>

                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {p.abstract}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!arxivLoading && arxivResults.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                      <p style={{ fontSize: 13, margin: 0 }}>
                        Search for papers like <strong style={{ color: 'var(--primary-light)' }}>"Deepfake detection"</strong>, <strong style={{ color: 'var(--primary-light)' }}>"Transformer Attention"</strong>, or an arXiv ID.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Manual Entry Form */
                <form onSubmit={handleSaveManual} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                      Paper Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={manualForm.title}
                      onChange={e => setManualForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Attention Is All You Need"
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                        Authors (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={manualForm.authors}
                        onChange={e => setManualForm(f => ({ ...f, authors: e.target.value }))}
                        placeholder="e.g. Ashish Vaswani, Noam Shazeer"
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                        Year
                      </label>
                      <input
                        type="number"
                        min="1990"
                        max="2030"
                        value={manualForm.year}
                        onChange={e => setManualForm(f => ({ ...f, year: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                        Domain / Field
                      </label>
                      <input
                        type="text"
                        value={manualForm.domain}
                        onChange={e => setManualForm(f => ({ ...f, domain: e.target.value }))}
                        placeholder="e.g. NLP & Deep Learning"
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                        PDF URL / ArXiv Link
                      </label>
                      <input
                        type="url"
                        value={manualForm.pdfUrl}
                        onChange={e => setManualForm(f => ({ ...f, pdfUrl: e.target.value }))}
                        placeholder="https://arxiv.org/pdf/..."
                        style={{ width: '100%', padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                      Abstract / Paper Summary
                    </label>
                    <textarea
                      rows={4}
                      value={manualForm.abstract}
                      onChange={e => setManualForm(f => ({ ...f, abstract: e.target.value }))}
                      placeholder="Paste abstract or brief paper summary here..."
                      style={{ width: '100%', padding: '10px 12px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                    <button type="button" className="btn-ghost" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                      <i className="fas fa-bookmark" /> Save Paper to Library
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
