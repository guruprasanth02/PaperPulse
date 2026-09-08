import React, { useState } from "react";
import { analyzeResearchGaps } from "../services/gemini";
import { useToast } from "../context/ToastContext";

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-muted)" }}>
      <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.4 }}>🔍</div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>No papers in your library</div>
      <div style={{ fontSize: 13 }}>Upload research papers first to identify gaps in the literature.</div>
    </div>
  );
}

const SEVERITY_CONFIG = {
  high:   { color: "#f43f5e", bg: "rgba(244,63,94,0.1)",   border: "rgba(244,63,94,0.25)",   label: "High Priority" },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)",  label: "Medium Priority" },
  low:    { color: "#10b981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)",  label: "Low Priority" },
};

export default function ResearchGapPage({ documents = [] }) {
  const toast = useToast();
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading]   = useState(false);
  const [gaps, setGaps]         = useState([]);
  const [hasRun, setHasRun]     = useState(false);
  const [filterSev, setFilterSev] = useState("all");
  const [allSel, setAllSel]     = useState(false);

  const toggleDoc = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const handleSelectAll = () => { if (allSel) setSelected(new Set()); else setSelected(new Set(documents.map(d => d.id))); setAllSel(v => !v); };
  const selectedDocs = documents.filter(d => selected.has(d.id));

  const handleAnalyze = async () => {
    if (selectedDocs.length === 0) { toast.error("Select at least one paper to analyze."); return; }
    setLoading(true); setGaps([]); setHasRun(false);
    try {
      const result = await analyzeResearchGaps(selectedDocs);
      setGaps(result);
      setHasRun(true);
      toast.success(`Found ${result.length} research gaps!`);
    } catch (err) {
      toast.error(err?.message || "Gap analysis failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleExport = () => {
    const content = gaps.map((g, i) => `GAP ${i+1}: ${g.title}\n\nDescription: ${g.description}\n\nOpportunity: ${g.opportunity}\n\nSuggested Direction: ${g.suggestedDirection}\n\nSeverity: ${g.severity}\n\n${"─".repeat(60)}\n`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "research_gaps_report.txt"; a.click(); URL.revokeObjectURL(url);
  };

  const filteredGaps = filterSev === "all" ? gaps : gaps.filter(g => g.severity === filterSev);

  return (
    <div className="fade-in-up" style={{ height: "100%", overflowY: "auto", padding: "32px 28px", boxSizing: "border-box", fontFamily: "Inter, sans-serif", color: "var(--text-primary)", maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#f59e0b,#f43f5e)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(245,158,11,0.4)", flexShrink: 0 }}>
          <i className="fas fa-magnifying-glass-chart" style={{ color: "#fff", fontSize: 20 }} />
        </div>
        <div>
          <h1 className="gradient-text" style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Research Gap Analysis</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Identify unexplored areas and research opportunities across your uploaded papers</p>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="glass-card"><EmptyState /></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>

          {/* Left: Selection */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Select Papers</span>
              <button className="btn-ghost" style={{ fontSize: 11, padding: "4px 10px" }} onClick={handleSelectAll}>{allSel ? "Deselect All" : "Select All"}</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 380, overflowY: "auto" }}>
              {documents.map(doc => (
                <label key={doc.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", background: selected.has(doc.id) ? "rgba(245,158,11,0.1)" : "var(--glass)", border: `1px solid ${selected.has(doc.id) ? "#f59e0b" : "var(--glass-border)"}`, transition: "all 0.15s" }}>
                  <input type="checkbox" checked={selected.has(doc.id)} onChange={() => toggleDoc(doc.id)} style={{ marginTop: 2, accentColor: "#f59e0b", flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4, wordBreak: "break-word" }}>{doc.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{doc.author} · {doc.year}</div>
                  </div>
                </label>
              ))}
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--glass-border)" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>{selectedDocs.length} of {documents.length} selected</div>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg,#f59e0b,#f43f5e)" }} onClick={handleAnalyze} disabled={loading || selectedDocs.length === 0}>
                {loading ? <><i className="fas fa-spinner fa-spin" /> Analyzing…</> : <><i className="fas fa-magnifying-glass-chart" /> Identify Gaps</>}
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div>
            {loading && (
              <div className="glass-card" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#f59e0b,#f43f5e)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse-glow 1.5s infinite" }}>
                  <i className="fas fa-magnifying-glass-chart" style={{ color: "#fff", fontSize: 28 }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Analyzing Research Gaps…</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Gemini AI is scanning {selectedDocs.length} paper{selectedDocs.length > 1 ? "s" : ""} for unexplored research areas</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>{[0,1,2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}</div>
              </div>
            )}

            {!loading && !hasRun && (
              <div className="glass-card" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16, color: "var(--text-muted)" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(245,158,11,0.08)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(245,158,11,0.15)" }}>
                  <i className="fas fa-puzzle-piece" style={{ fontSize: 36, color: "#f59e0b", opacity: 0.5 }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Research gaps will appear here</div>
                  <div style={{ fontSize: 12 }}>Select papers and click Identify Gaps</div>
                </div>
              </div>
            )}

            {!loading && hasRun && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Controls */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["all","high","medium","low"].map(sev => (
                      <button key={sev} onClick={() => setFilterSev(sev)}
                        style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${filterSev === sev ? "var(--primary)" : "var(--glass-border)"}`, background: filterSev === sev ? "rgba(14,165,233,0.15)" : "var(--glass)", color: filterSev === sev ? "var(--primary-light)" : "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif", transition: "all 0.15s" }}>
                        {sev === "all" ? `All (${gaps.length})` : `${sev.charAt(0).toUpperCase()+sev.slice(1)} (${gaps.filter(g=>g.severity===sev).length})`}
                      </button>
                    ))}
                  </div>
                  {gaps.length > 0 && (
                    <button className="btn-ghost" style={{ fontSize: 12, gap: 6 }} onClick={handleExport}>
                      <i className="fas fa-download" /> Export Report
                    </button>
                  )}
                </div>

                {/* Gap Cards */}
                {filteredGaps.length === 0 ? (
                  <div className="glass-card" style={{ padding: 32, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                    {gaps.length === 0 ? "No gaps were identified. Try with more papers." : "No gaps match this filter."}
                  </div>
                ) : (
                  filteredGaps.map((gap, i) => {
                    const sev = SEVERITY_CONFIG[gap.severity] || SEVERITY_CONFIG.medium;
                    return (
                      <div key={i} className="glass-card" style={{ padding: 22, borderLeft: `4px solid ${sev.color}`, background: "var(--bg-card)" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{gap.title}</div>
                          </div>
                          <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: sev.bg, border: `1px solid ${sev.border}`, color: sev.color, whiteSpace: "nowrap", flexShrink: 0 }}>
                            {sev.label}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, margin: "0 0 16px 0" }}>{gap.description}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", marginBottom: 4 }}>
                              <i className="fas fa-bullseye" style={{ marginRight: 5 }} />Opportunity
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{gap.opportunity}</div>
                          </div>
                          <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(14,165,233,0.07)", border: "1px solid rgba(14,165,233,0.15)" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--primary-light)", marginBottom: 4 }}>
                              <i className="fas fa-compass" style={{ marginRight: 5 }} />Suggested Direction
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>{gap.suggestedDirection}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
