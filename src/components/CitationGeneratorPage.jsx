import React, { useState } from "react";
import { generateCitations } from "../services/gemini";
import { useToast } from "../context/ToastContext";

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-muted)" }}>
      <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.4 }}>📝</div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>No papers in your library</div>
      <div style={{ fontSize: 13 }}>Upload research papers first to generate formatted citations.</div>
    </div>
  );
}

const FORMATS = [
  { id: "apa",     label: "APA 7th",  icon: "fa-a",          color: "#0ea5e9" },
  { id: "mla",     label: "MLA 9th",  icon: "fa-m",          color: "#10b981" },
  { id: "ieee",    label: "IEEE",     icon: "fa-i",          color: "#6366f1" },
  { id: "chicago", label: "Chicago",  icon: "fa-c",          color: "#f59e0b" },
  { id: "harvard", label: "Harvard",  icon: "fa-h",          color: "#f43f5e" },
  { id: "bibtex",  label: "BibTeX",   icon: "fa-code",       color: "#8b5cf6" },
];

function CopyButton({ text, small = false }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className="btn-ghost" style={{ fontSize: small ? 11 : 12, gap: 6, padding: small ? "4px 10px" : undefined }}
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>
      <i className={`fas ${copied ? "fa-check" : "fa-copy"}`} /> {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function CitationGeneratorPage({ documents = [] }) {
  const toast = useToast();
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [citations, setCitations]     = useState(null);
  const [activeFormat, setActiveFormat] = useState("apa");

  const handleGenerate = async () => {
    if (!selectedDoc) { toast.error("Select a paper first."); return; }
    setLoading(true); setCitations(null);
    try {
      const result = await generateCitations(selectedDoc);
      setCitations(result);
      toast.success("Citations generated!");
    } catch (err) {
      toast.error(err?.message || "Citation generation failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleDownloadBib = () => {
    if (!citations?.bibtex) return;
    const blob = new Blob([citations.bibtex], { type: "text/plain" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `${selectedDoc?.title?.replace(/\s+/g, "_") || "reference"}.bib`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = () => {
    if (!citations) return;
    const all = FORMATS.map(f => `${f.label}:\n${citations[f.id] || "N/A"}`).join("\n\n" + "─".repeat(50) + "\n\n");
    navigator.clipboard.writeText(all).then(() => toast.success("All formats copied!"));
  };

  return (
    <div className="fade-in-up" style={{ height: "100%", overflowY: "auto", padding: "32px 28px", boxSizing: "border-box", fontFamily: "Inter, sans-serif", color: "var(--text-primary)", maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#f43f5e,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(244,63,94,0.4)", flexShrink: 0 }}>
          <i className="fas fa-quote-left" style={{ color: "#fff", fontSize: 20 }} />
        </div>
        <div>
          <h1 className="gradient-text" style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Citation Generator</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Generate properly formatted citations in APA, MLA, IEEE, Chicago, Harvard, and BibTeX</p>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="glass-card"><EmptyState /></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>

          {/* Left: Paper Selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Select Paper</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 380, overflowY: "auto" }}>
                {documents.map(doc => (
                  <div key={doc.id} onClick={() => { setSelectedDoc(doc); setCitations(null); }}
                    style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer", background: selectedDoc?.id === doc.id ? "rgba(244,63,94,0.1)" : "var(--glass)", border: `1px solid ${selectedDoc?.id === doc.id ? "#f43f5e" : "var(--glass-border)"}`, transition: "all 0.15s" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      {selectedDoc?.id === doc.id && (
                        <i className="fas fa-circle-check" style={{ color: "#f43f5e", fontSize: 14, marginTop: 1, flexShrink: 0 }} />
                      )}
                      {selectedDoc?.id !== doc.id && (
                        <i className="fas fa-file-lines" style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 1, flexShrink: 0 }} />
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4, wordBreak: "break-word" }}>{doc.title}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{doc.author} · {doc.year}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--glass-border)" }}>
                {!selectedDoc && <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>Click a paper to select it</div>}
                {selectedDoc && <div style={{ fontSize: 11, color: "var(--success)", marginBottom: 10 }}>✓ "{selectedDoc.title.slice(0, 40)}..." selected</div>}
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg,#f43f5e,#8b5cf6)" }} onClick={handleGenerate} disabled={loading || !selectedDoc}>
                  {loading ? <><i className="fas fa-spinner fa-spin" /> Generating…</> : <><i className="fas fa-wand-magic-sparkles" /> Generate Citations</>}
                </button>
              </div>
            </div>

            {/* Format legend */}
            <div className="glass-card" style={{ padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Supported Formats</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {FORMATS.map(f => (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--text-muted)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.color, flexShrink: 0 }} />
                    {f.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Citation Output */}
          <div className="glass-card" style={{ padding: 24, minHeight: 480 }}>
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#f43f5e,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse-glow 1.5s infinite" }}>
                  <i className="fas fa-quote-left" style={{ color: "#fff", fontSize: 28 }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Generating Citations…</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Formatting in 6 academic citation styles</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>{[0,1,2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}</div>
              </div>
            )}

            {!loading && !citations && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 16, color: "var(--text-muted)" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(244,63,94,0.08)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(244,63,94,0.15)" }}>
                  <i className="fas fa-quote-left" style={{ fontSize: 36, color: "#f43f5e", opacity: 0.5 }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Citations will appear here</div>
                  <div style={{ fontSize: 12 }}>Select a paper and click Generate Citations</div>
                </div>
              </div>
            )}

            {!loading && citations && (
              <div>
                {/* Top bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Citations for "{selectedDoc?.title?.slice(0, 50)}…"</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>6 formats generated · Powered by Gemini AI</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-ghost" style={{ fontSize: 12, gap: 6 }} onClick={handleCopyAll}>
                      <i className="fas fa-copy" /> Copy All
                    </button>
                    {citations.bibtex && (
                      <button className="btn-ghost" style={{ fontSize: 12, gap: 6 }} onClick={handleDownloadBib}>
                        <i className="fas fa-download" /> Download .bib
                      </button>
                    )}
                  </div>
                </div>

                {/* Format tabs */}
                <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
                  {FORMATS.map(f => (
                    <button key={f.id} onClick={() => setActiveFormat(f.id)}
                      style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${activeFormat === f.id ? f.color : "var(--glass-border)"}`, background: activeFormat === f.id ? `${f.color}20` : "var(--glass)", color: activeFormat === f.id ? f.color : "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif", transition: "all 0.15s" }}>
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Active citation display */}
                {FORMATS.filter(f => f.id === activeFormat).map(f => (
                  <div key={f.id}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: f.color }}>
                        <i className={`fas ${f.icon}`} style={{ marginRight: 6 }} />{f.label} Format
                      </span>
                      <CopyButton text={citations[f.id] || ""} small />
                    </div>
                    <div style={{ padding: 20, background: "var(--glass)", borderRadius: 12, border: `1px solid ${f.color}30`, fontFamily: f.id === "bibtex" ? "monospace" : "Inter,sans-serif", fontSize: f.id === "bibtex" ? 12 : 13, lineHeight: 1.8, color: "var(--text-secondary)", whiteSpace: "pre-wrap", wordBreak: "break-word", minHeight: 80 }}>
                      {citations[f.id] || "Not available for this paper."}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
