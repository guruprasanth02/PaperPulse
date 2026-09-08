import React, { useState } from "react";
import { generateLiteratureSurvey } from "../services/gemini";
import { useToast } from "../context/ToastContext";

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-muted)" }}>
      <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.4 }}>📚</div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>
        No papers in your library
      </div>
      <div style={{ fontSize: 13 }}>
        Upload research papers using the "Upload Papers" button in the header.
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="btn-ghost"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      style={{ fontSize: 12, gap: 6 }}
    >
      <i className={`fas ${copied ? "fa-check" : "fa-copy"}`} />
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function LiteratureSurveyPage({ documents = [] }) {
  const toast = useToast();
  const [selected, setSelected]   = useState(new Set());
  const [loading, setLoading]     = useState(false);
  const [survey, setSurvey]       = useState("");
  const [allSel, setAllSel]       = useState(false);

  const toggleDoc = (id) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const handleSelectAll = () => {
    if (allSel) { setSelected(new Set()); } else { setSelected(new Set(documents.map(d => d.id))); }
    setAllSel(v => !v);
  };

  const selectedDocs = documents.filter(d => selected.has(d.id));

  const handleGenerate = async () => {
    if (selectedDocs.length === 0) { toast.error("Select at least one paper."); return; }
    setLoading(true); setSurvey("");
    try {
      const result = await generateLiteratureSurvey(selectedDocs);
      setSurvey(result);
      toast.success("Literature survey generated!");
    } catch (err) {
      toast.error(err?.message || "Failed to generate survey.");
    } finally { setLoading(false); }
  };

  const handleDownload = () => {
    const blob = new Blob([survey], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "literature_survey.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const cardHover = (e, enter) => {
    e.currentTarget.style.transform = enter ? "translateY(-2px)" : "translateY(0)";
    e.currentTarget.style.borderColor = enter ? "var(--primary)" : "var(--glass-border)";
  };

  return (
    <div className="fade-in-up" style={{ height: "100%", overflowY: "auto", padding: "32px 28px", boxSizing: "border-box", fontFamily: "Inter, sans-serif", color: "var(--text-primary)", maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#0ea5e9,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(14,165,233,0.35)", flexShrink: 0 }}>
          <i className="fas fa-book-open" style={{ color: "#fff", fontSize: 20 }} />
        </div>
        <div>
          <h1 className="gradient-text" style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Literature Survey Generator</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Select papers from your library and generate a structured academic literature survey</p>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="glass-card" style={{ padding: 0 }}><EmptyState /></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, alignItems: "start" }}>

          {/* Left Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>Select Papers</span>
                <button className="btn-ghost" style={{ fontSize: 11, padding: "4px 10px" }} onClick={handleSelectAll}>
                  {allSel ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 360, overflowY: "auto" }}>
                {documents.map(doc => (
                  <label key={doc.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", background: selected.has(doc.id) ? "rgba(14,165,233,0.1)" : "var(--glass)", border: `1px solid ${selected.has(doc.id) ? "var(--primary)" : "var(--glass-border)"}`, transition: "all 0.15s" }}>
                    <input type="checkbox" checked={selected.has(doc.id)} onChange={() => toggleDoc(doc.id)} style={{ marginTop: 2, accentColor: "var(--primary)", flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4, wordBreak: "break-word" }}>{doc.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{doc.author} · {doc.year}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--glass-border)" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
                  {selectedDocs.length} of {documents.length} papers selected
                </div>
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleGenerate} disabled={loading || selectedDocs.length === 0}>
                  {loading ? <><i className="fas fa-spinner fa-spin" /> Generating…</> : <><i className="fas fa-wand-magic-sparkles" /> Generate Survey</>}
                </button>
              </div>
            </div>

            <div className="glass-card" style={{ padding: 16, background: "rgba(14,165,233,0.04)", border: "1px solid rgba(14,165,233,0.15)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-light)", marginBottom: 8 }}>
                <i className="fas fa-lightbulb" style={{ marginRight: 6 }} />Tips for best results
              </div>
              <ul style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
                <li>Select papers from the same research domain</li>
                <li>3–8 papers give the best survey depth</li>
                <li>Papers with full text produce richer surveys</li>
              </ul>
            </div>
          </div>

          {/* Right Panel */}
          <div className="glass-card" style={{ padding: 24, minHeight: 480 }}>
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#0ea5e9,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse-glow 1.5s infinite" }}>
                  <i className="fas fa-book-open" style={{ color: "#fff", fontSize: 28 }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Generating Literature Survey…</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Analyzing {selectedDocs.length} paper{selectedDocs.length > 1 ? "s" : ""} with Gemini AI</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[0,1,2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                </div>
              </div>
            )}

            {!loading && !survey && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 16, color: "var(--text-muted)" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(14,165,233,0.08)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(14,165,233,0.15)" }}>
                  <i className="fas fa-file-lines" style={{ fontSize: 36, color: "var(--primary-light)", opacity: 0.5 }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Your survey will appear here</div>
                  <div style={{ fontSize: 12 }}>Select papers on the left and click Generate Survey</div>
                </div>
              </div>
            )}

            {!loading && survey && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Generated Literature Survey</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      Based on {selectedDocs.length} paper{selectedDocs.length > 1 ? "s" : ""} · Powered by Gemini AI
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <CopyButton text={survey} />
                    <button className="btn-ghost" style={{ fontSize: 12, gap: 6 }} onClick={handleDownload}>
                      <i className="fas fa-download" /> Download
                    </button>
                    <button className="btn-ghost" style={{ fontSize: 12, gap: 6 }} onClick={handleGenerate}>
                      <i className="fas fa-rotate" /> Regenerate
                    </button>
                  </div>
                </div>
                <div style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.85, color: "var(--text-secondary)", fontFamily: "Inter, sans-serif", padding: 20, background: "var(--glass)", borderRadius: 12, border: "1px solid var(--glass-border)", maxHeight: 560, overflowY: "auto" }}>
                  {survey}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
