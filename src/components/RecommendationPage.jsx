import React, { useState, useEffect } from 'react';
import {
  fetchTopicRecommendations,
  fetchAbstractRecommendations,
  fetchPDFRecommendations,
  toggleSavePaper
} from '../services/recommendation';
import { useToast } from '../context/ToastContext';

const DOMAINS = ['All', 'RAG & LLMs', 'AI & Deep Learning', 'NLP', 'Computer Vision', 'Systems & Vector DB', 'Data Mining'];

export default function RecommendationPage({ savedPapers = [], onSavePaper, onNavigateToAssistant }) {
  const toast = useToast();

  // Search Modes: 'topic' | 'abstract' | 'pdf' | 'browse'
  const [searchMode, setSearchMode] = useState('topic');

  // Search Inputs
  const [topicInput, setTopicInput]       = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [abstractInput, setAbstractInput] = useState('');

  // PDF Upload state
  const [pdfFile, setPdfFile]         = useState(null);
  const [pdfText, setPdfText]         = useState('');
  const [pdfUploading, setPdfUploading] = useState(false);

  // Filters State
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    yearStart: 2017,
    yearEnd: 2026,
    domain: 'All',
    author: '',
    minScore: 0.0,
  });

  // Recommendations State
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-fetch default recommendations on mount
  useEffect(() => {
    handleSearch('topic', 'Retrieval-Augmented Generation LLM Transformers');
  }, []);

  const handleSearch = async (overrideMode, overrideQuery) => {
    const mode = overrideMode || searchMode;
    setLoading(true);
    setHasSearched(true);

    try {
      let res = null;
      if (mode === 'topic' || mode === 'browse') {
        const query = overrideQuery !== undefined ? overrideQuery : topicInput;
        const kw = keywordsInput ? keywordsInput.split(',').map(k => k.trim()) : [];
        res = await fetchTopicRecommendations(query || 'AI LLM Research', kw, filters);
      } else if (mode === 'abstract') {
        if (!abstractInput || abstractInput.trim().length < 10) {
          toast.warning('Please enter an abstract with at least 10 characters.');
          setLoading(false);
          return;
        }
        res = await fetchAbstractRecommendations(abstractInput, filters);
      } else if (mode === 'pdf') {
        if (!pdfText && !pdfFile) {
          toast.warning('Please upload a PDF or text file first.');
          setLoading(false);
          return;
        }
        res = await fetchPDFRecommendations(pdfFile?.name || 'document.pdf', pdfText || pdfFile?.name, filters);
      }

      if (res && res.recommendations) {
        setResults(res.recommendations);
        if (res.recommendations.length === 0) {
          toast.info('No papers match your filters. Try relaxing year or similarity score filters.');
        }
      }
    } catch (err) {
      toast.error(`Recommendation error: ${err.message || 'Failed to fetch'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFile(file);
    setPdfUploading(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result || '';
      setPdfText(typeof text === 'string' ? text : file.name);
      setPdfUploading(false);
      toast.success(`Loaded "${file.name}". Click "Get Recommendations" to search!`);
    };
    reader.onerror = () => {
      setPdfText(file.name);
      setPdfUploading(false);
    };

    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      // PDF or binary fallback
      setPdfText(`Research paper: ${file.name}`);
      setPdfUploading(false);
      toast.success(`Loaded "${file.name}" for recommendation matching.`);
    }
  };

  const isSaved = (paperId) => savedPapers.some(p => p.id === paperId);

  const handleToggleSave = (e, paper) => {
    e?.stopPropagation();
    onSavePaper(paper);
    if (isSaved(paper.id)) {
      toast.info(`Removed "${paper.title.slice(0, 30)}..." from My Papers.`);
    } else {
      toast.success(`Saved "${paper.title.slice(0, 30)}..." to My Papers!`);
    }
  };

  return (
    <div
      className="fade-in-up"
      style={{
        height: '100%',
        overflowY: 'auto',
        padding: '28px 32px',
        boxSizing: 'border-box',
        color: 'var(--text-primary)',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {/* ── Page Header & Title ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 className="gradient-text" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Research Recommendation Engine
            </h1>
            <span className="badge badge-success" style={{ fontSize: 10 }}>Phase 2 Active</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Discover semantically relevant papers powered by Sentence Transformers &amp; Cosine Vector Matching.
          </p>
        </div>

        <button
          className="btn-ghost"
          onClick={() => setFiltersOpen(o => !o)}
          style={{
            borderColor: filtersOpen ? 'var(--primary)' : 'var(--glass-border)',
            background: filtersOpen ? 'rgba(14,165,233,0.15)' : 'transparent',
            color: filtersOpen ? 'var(--primary-light)' : 'var(--text-secondary)',
          }}
        >
          <i className="fas fa-sliders" />
          <span>Filters</span>
          {(filters.domain !== 'All' || filters.minScore > 0 || filters.yearStart > 2017 || filters.author) && (
            <span className="badge badge-primary" style={{ padding: '2px 6px', fontSize: 9 }}>Active</span>
          )}
        </button>
      </div>

      {/* ── Search Mode Selection Tabs ── */}
      <div className="glass-card" style={{ padding: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[
          { id: 'topic',    label: 'Topic & Keywords', icon: 'fa-magnifying-glass' },
          { id: 'abstract', label: 'Search by Abstract', icon: 'fa-align-left' },
          { id: 'pdf',      label: 'Upload Paper / PDF', icon: 'fa-file-arrow-up' },
          { id: 'browse',   label: 'Browse Domains', icon: 'fa-layer-group' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => { setSearchMode(m.id); }}
            style={{
              flex: 1, minWidth: 140,
              padding: '10px 16px', borderRadius: 10,
              border: 'none',
              background: searchMode === m.id ? 'linear-gradient(135deg, #0284c7, #0d9488)' : 'transparent',
              color: searchMode === m.id ? '#fff' : 'var(--text-muted)',
              fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: searchMode === m.id ? 700 : 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
            }}
          >
            <i className={`fas ${m.icon}`} />
            {m.label}
          </button>
        ))}
      </div>

      {/* ── Search Bar Input Area ── */}
      <div className="glass-card" style={{ padding: 20 }}>
        {/* Mode 1: Topic & Keywords */}
        {searchMode === 'topic' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 2, minWidth: 260, position: 'relative' }}>
                <i className="fas fa-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }} />
                <input
                  type="text"
                  value={topicInput}
                  onChange={e => setTopicInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSearch('topic'); }}
                  placeholder="Enter research topic (e.g. Retrieval-Augmented Generation, Transformer Attention)..."
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px',
                    background: 'var(--input-bg)', border: '1px solid var(--glass-border)',
                    borderRadius: 12, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', fontSize: 14,
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                <i className="fas fa-tag" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }} />
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={e => setKeywordsInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSearch('topic'); }}
                  placeholder="Keywords (comma separated)..."
                  style={{
                    width: '100%', padding: '12px 14px 12px 38px',
                    background: 'var(--input-bg)', border: '1px solid var(--glass-border)',
                    borderRadius: 12, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', fontSize: 14,
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <button className="btn-primary" onClick={() => handleSearch('topic')} disabled={loading} style={{ padding: '12px 24px' }}>
                {loading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-sparkles" />}
                Recommend
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Quick Topics:</span>
              {['RAG & Vector DB', 'Vision Transformers', 'LoRA Fine-tuning', 'Graph Neural Networks', 'LLM Hallucinations'].map(t => (
                <button
                  key={t}
                  onClick={() => { setTopicInput(t); handleSearch('topic', t); }}
                  className="badge badge-primary"
                  style={{ cursor: 'pointer', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', textTransform: 'none', fontSize: 11 }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mode 2: Abstract Search */}
        {searchMode === 'abstract' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <textarea
              rows={4}
              value={abstractInput}
              onChange={e => setAbstractInput(e.target.value)}
              placeholder="Paste your research abstract or project proposal summary here for deep semantic embedding matching..."
              style={{
                width: '100%', padding: 16,
                background: 'var(--input-bg)', border: '1px solid var(--glass-border)',
                borderRadius: 12, color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', fontSize: 14,
                lineHeight: 1.6, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {abstractInput.length} characters entered
              </span>
              <button className="btn-primary" onClick={() => handleSearch('abstract')} disabled={loading || abstractInput.length < 10}>
                {loading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-wand-magic-sparkles" />}
                Find Similar Papers
              </button>
            </div>
          </div>
        )}

        {/* Mode 3: PDF Upload */}
        {searchMode === 'pdf' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center', padding: '16px 0' }}>
            <input type="file" id="pdf-recommender-upload" accept=".pdf,.txt,.md" style={{ display: 'none' }} onChange={handlePdfUpload} />
            <label
              htmlFor="pdf-recommender-upload"
              style={{
                width: '100%', maxWidth: 500, padding: '32px 24px',
                border: '2px dashed var(--primary)', borderRadius: 16,
                background: 'rgba(14,165,233,0.04)', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                transition: 'all 0.2s',
              }}
            >
              <i className="fas fa-cloud-arrow-up" style={{ fontSize: 32, color: 'var(--primary-light)' }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {pdfFile ? pdfFile.name : 'Upload PDF or Draft Paper'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB loaded` : 'Drag and drop your research draft to recommend related literature'}
                </div>
              </div>
            </label>

            {pdfFile && (
              <button className="btn-primary" onClick={() => handleSearch('pdf')} disabled={loading || pdfUploading}>
                {loading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-compass" />}
                Recommend Papers from PDF
              </button>
            )}
          </div>
        )}

        {/* Mode 4: Browse Domains */}
        {searchMode === 'browse' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Select Domain Category:</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {DOMAINS.map(d => (
                <button
                  key={d}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, domain: d }));
                    handleSearch('browse', d === 'All' ? '' : d);
                  }}
                  style={{
                    padding: '10px 18px', borderRadius: 12,
                    background: filters.domain === d ? 'rgba(14,165,233,0.2)' : 'var(--input-bg)',
                    border: filters.domain === d ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                    color: filters.domain === d ? 'var(--primary-light)' : 'var(--text-secondary)',
                    fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Collapsible Filter Panel ── */}
      {filtersOpen && (
        <div className="glass-card slide-right" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-filter" style={{ color: 'var(--primary-light)' }} />
              Search Filters &amp; Thresholds
            </div>
            <button
              onClick={() => {
                setFilters({ yearStart: 2017, yearEnd: 2026, domain: 'All', author: '', minScore: 0.0 });
              }}
              style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: 12, cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {/* Year Range */}
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Publication Year ({filters.yearStart} - {filters.yearEnd})
              </label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="number"
                  min="2000" max="2026"
                  value={filters.yearStart}
                  onChange={e => setFilters(p => ({ ...p, yearStart: parseInt(e.target.value) || 2000 }))}
                  style={{ width: '100%', padding: '8px 10px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }}
                />
                <span style={{ color: 'var(--text-muted)' }}>-</span>
                <input
                  type="number"
                  min="2000" max="2026"
                  value={filters.yearEnd}
                  onChange={e => setFilters(p => ({ ...p, yearEnd: parseInt(e.target.value) || 2026 }))}
                  style={{ width: '100%', padding: '8px 10px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13 }}
                />
              </div>
            </div>

            {/* Min Similarity Score Slider */}
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Min Similarity Score ({filters.minScore}%)
              </label>
              <input
                type="range"
                min="0" max="90" step="5"
                value={filters.minScore}
                onChange={e => setFilters(p => ({ ...p, minScore: parseFloat(e.target.value) || 0 }))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Domain Filter */}
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Domain Area
              </label>
              <select
                value={filters.domain}
                onChange={e => setFilters(p => ({ ...p, domain: e.target.value }))}
                style={{ width: '100%', padding: '8px 10px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
              >
                {DOMAINS.map(d => <option key={d} value={d} style={{ background: 'var(--bg-card)' }}>{d}</option>)}
              </select>
            </div>

            {/* Author Filter */}
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Author Name
              </label>
              <input
                type="text"
                value={filters.author}
                onChange={e => setFilters(p => ({ ...p, author: e.target.value }))}
                placeholder="Filter by author..."
                style={{ width: '100%', padding: '8px 10px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Recommendations Results Grid ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            Recommended Research Papers ({results.length})
          </div>
          {results.length > 0 && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Sorted by vector cosine similarity
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="shimmer" style={{ height: 20, width: '70%' }} />
                <div className="shimmer" style={{ height: 14, width: '40%' }} />
                <div className="shimmer" style={{ height: 60, width: '100%' }} />
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="glass-card" style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <i className="fas fa-lightbulb" style={{ fontSize: 40, color: 'var(--text-muted)', opacity: 0.5 }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>No recommendations found</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 400, margin: 0 }}>
              Try entering a broader topic, resetting search filters, or uploading a research paper draft.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {results.map((paper) => {
              const score = paper.score || 75.0;
              const scoreColor = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--primary-light)' : 'var(--warning)';
              const saved = isSaved(paper.id);

              return (
                <div
                  key={paper.id}
                  className="glass-card fade-in-up"
                  onClick={() => setSelectedPaper(paper)}
                  style={{
                    padding: 22, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    gap: 14, transition: 'all 0.25s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                  }}
                >
                  <div>
                    {/* Top Row: Score Badge & Save Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span className="badge" style={{ background: `${scoreColor}18`, color: scoreColor, border: `1px solid ${scoreColor}40`, fontSize: 11 }}>
                        <i className="fas fa-bullseye" style={{ marginRight: 4 }} />
                        {score}% Match
                      </span>

                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span className="badge badge-primary" style={{ fontSize: 10 }}>{paper.domain}</span>
                        <button
                          onClick={(e) => handleToggleSave(e, paper)}
                          style={{
                            background: saved ? 'rgba(16,185,129,0.2)' : 'var(--input-bg)',
                            border: saved ? '1px solid var(--success)' : '1px solid var(--glass-border)',
                            color: saved ? 'var(--success)' : 'var(--text-muted)',
                            borderRadius: '50%', width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                          title={saved ? 'Remove from saved papers' : 'Save paper'}
                        >
                          <i className={saved ? 'fas fa-bookmark' : 'far fa-bookmark'} style={{ fontSize: 13 }} />
                        </button>
                      </div>
                    </div>

                    {/* Paper Title */}
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {paper.title}
                    </h3>

                    {/* Authors & Year */}
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <i className="fas fa-user-graduate" style={{ fontSize: 11 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
                        {(paper.authors || []).join(', ')}
                      </span>
                      <span>•</span>
                      <span>{paper.year}</span>
                    </div>

                    {/* Abstract snippet */}
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 14 }}>
                      {paper.abstract}
                    </p>

                    {/* Keywords pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {(paper.keywords || []).slice(0, 3).map((kw, i) => (
                        <span key={i} className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', fontSize: 9, textTransform: 'none' }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--glass-border)' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className="fas fa-building-columns" style={{ fontSize: 10 }} />
                      {paper.source || 'arXiv'}
                    </span>

                    <span style={{ fontSize: 12, color: 'var(--primary-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      View Details <i className="fas fa-arrow-right" style={{ fontSize: 10 }} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Paper Details Modal ── */}
      {selectedPaper && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: 24,
          }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedPaper(null); }}
        >
          <div className="bounce-in glass-card" style={{ width: '100%', maxWidth: 760, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
            {/* Modal Header */}
            <div style={{ padding: '24px 28px 18px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <span className="badge badge-success">{selectedPaper.score}% Match</span>
                  <span className="badge badge-primary">{selectedPaper.domain}</span>
                  <span className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)' }}>{selectedPaper.year}</span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, margin: 0 }}>
                  {selectedPaper.title}
                </h2>
              </div>

              <button onClick={() => setSelectedPaper(null)} className="btn-ghost" style={{ padding: '6px 10px' }}>
                <i className="fas fa-xmark" />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 28, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Authors & Source info */}
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: 14, background: 'var(--input-bg)', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Authors</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                    {(selectedPaper.authors || []).join(', ')}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Source Repository</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                    {selectedPaper.source || 'arXiv'}
                  </div>
                </div>

                {selectedPaper.citationCount > 0 && (
                  <div>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Citations</span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)', marginTop: 2 }}>
                      {selectedPaper.citationCount.toLocaleString()} citations
                    </div>
                  </div>
                )}
              </div>

              {/* Abstract */}
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 8 }}>
                  Abstract
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-primary)', background: 'var(--bg-dark)', padding: 20, borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                  {selectedPaper.abstract}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 8 }}>
                  Keywords &amp; Concept Embeddings
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(selectedPaper.keywords || []).map((kw, i) => (
                    <span key={i} className="badge badge-primary" style={{ fontSize: 11, textTransform: 'none' }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="btn-ghost"
                onClick={(e) => handleToggleSave(e, selectedPaper)}
                style={{
                  color: isSaved(selectedPaper.id) ? 'var(--success)' : 'var(--text-secondary)',
                  borderColor: isSaved(selectedPaper.id) ? 'var(--success)' : 'var(--glass-border)',
                }}
              >
                <i className={isSaved(selectedPaper.id) ? 'fas fa-bookmark' : 'far fa-bookmark'} />
                {isSaved(selectedPaper.id) ? 'Saved in My Papers' : 'Save to My Papers'}
              </button>

              <div style={{ display: 'flex', gap: 12 }}>
                {onNavigateToAssistant && (
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      setSelectedPaper(null);
                      onNavigateToAssistant('assistant');
                    }}
                  >
                    <i className="fas fa-robot" />
                    Ask Assistant About Paper
                  </button>
                )}

                {selectedPaper.pdfUrl && (
                  <a
                    href={selectedPaper.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{ textDecoration: 'none', padding: '10px 20px' }}
                  >
                    <i className="fas fa-file-pdf" />
                    Open PDF Document
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
