import React, { useState } from "react";
import { comparePapers } from "../services/gemini";
import { useToast } from "../context/ToastContext";

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-muted)" }}>
      <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.4 }}>⚖️</div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>No papers in your library</div>
      <div style={{ fontSize: 13 }}>Upload research papers first, then use this tool to compare them side by side.</div>
    </div>
  );
}

function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className="btn-ghost" style={{ fontSize: 12, gap: 6 }}
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>
      <i className={`fas ${copied ? "fa-check" : "fa-copy"}`} /> {copied ? "Copied!" : label}
    </button>
  );
}

export default function ComparePapersPage({ documents = [] }) {
  const toast = useToast();
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [activeTab, setActiveTab] = useState("narrative");

  const toggleDoc = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectedDocs = documents.filter(d => selected.has(d.id));

  const handleCompare = async () => {
    if (selectedDocs.length < 2) { toast.error("Select at least 2 papers to compare."); return; }
    if (selectedDocs.length > 5) { toast.error("Maximum 5 papers can be compared at once."); return; }
    setLoading(true); setResult(null);
    try {
      const res = await comparePapers(selectedDocs);
      setResult(res);
      toast.success("Comparison complete!");
    } catch (err) {
      toast.error(err?.message || "Comparison failed. Please try again.");
    } finally { setLoading(false); }
  };

  const tabs = [
    { id: "narrative", label: "AI Analysis", icon: "fa-brain" },
    { id: "table", label: "Comparison Table", icon: "fa-table" },
    { id: "takeaways", label: "Key Takeaways", icon: "fa-star" },
  ];

  return (
    <div className="fade-in-up" style={{ height: "100%", overflowY: "auto", padding: "32px 28px", boxSizing: "border-box", fontFamily: "Inter, sans-serif", color: "var(--text-primary)", maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(99,102,241,0.4)", flexShrink: 0 }}>
          <i className="fas fa-code-compare" style={{ color: "#fff", fontSize: 20 }} />
        </div>
        <div>
          <h1 className="gradient-text" style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Compare Papers</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Select 2–5 papers for AI-powered side-by-side comparative analysis</p>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="glass-card"><EmptyState /></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>

          {/* Left: Selection Panel */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Select Papers</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{selectedDocs.length}/5</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 400, overflowY: "auto" }}>
              {documents.map((doc, idx) => {
                const isSel = selected.has(doc.id);
                const isDisabled = !isSel && selectedDocs.length >= 5;
                const colors = ["#0ea5e9","#10b981","#6366f1","#f59e0b","#f43f5e"];
                return (
                  <label key={doc.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: isDisabled ? "not-allowed" : "pointer", opacity: isDisabled ? 0.4 : 1, background: isSel ? "rgba(99,102,241,0.1)" : "var(--glass)", border: `1px solid ${isSel ? "#6366f1" : "var(--glass-border)"}`, transition: "all 0.15s" }}>
                    {isSel && <div style={{ width: 18, height: 18, borderRadius: "50%", background: colors[Array.from(selected).indexOf(doc.id) % colors.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{Array.from(selected).indexOf(doc.id) + 1}</div>}
                    {!isSel && <input type="checkbox" checked={false} onChange={() => !isDisabled && toggleDoc(doc.id)} disabled={isDisabled} style={{ marginTop: 2, accentColor: "#6366f1", flexShrink: 0 }} />}
                    {isSel && <input type="checkbox" checked={true} onChange={() => toggleDoc(doc.id)} style={{ display: "none" }} />}
                    {isSel && <div onClick={() => toggleDoc(doc.id)} style={{ minWidth: 0, cursor: "pointer" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4, wordBreak: "break-word" }}>{doc.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{doc.author} · {doc.year}</div>
                    </div>}
                    {!isSel && <div onClick={() => !isDisabled && toggleDoc(doc.id)} style={{ minWidth: 0, cursor: isDisabled ? "not-allowed" : "pointer" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4, wordBreak: "break-word" }}>{doc.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{doc.author} · {doc.year}</div>
                    </div>}
                  </label>
                );
              })}
            </div>

            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--glass-border)" }}>
              {selectedDocs.length < 2 && <div style={{ fontSize: 11, color: "var(--warning)", marginBottom: 10 }}>⚠ Select at least 2 papers</div>}
              {selectedDocs.length >= 2 && <div style={{ fontSize: 11, color: "var(--success)", marginBottom: 10 }}>✓ Ready to compare {selectedDocs.length} papers</div>}
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }} onClick={handleCompare} disabled={loading || selectedDocs.length < 2}>
                {loading ? <><i className="fas fa-spinner fa-spin" /> Comparing…</> : <><i className="fas fa-code-compare" /> Compare Papers</>}
              </button>
            </div>
          </div>

          {/* Right: Results Panel */}
          <div className="glass-card" style={{ padding: 24, minHeight: 480 }}>
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse-glow 1.5s infinite" }}>
                  <i className="fas fa-code-compare" style={{ color: "#fff", fontSize: 28 }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Comparing {selectedDocs.length} Papers…</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Gemini AI is analyzing methodologies, findings, and limitations</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[0,1,2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}
                </div>
              </div>
            )}

            {!loading && !result && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 16, color: "var(--text-muted)" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(99,102,241,0.08)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(99,102,241,0.15)" }}>
                  <i className="fas fa-code-compare" style={{ fontSize: 36, color: "#6366f1", opacity: 0.5 }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Comparison results will appear here</div>
                  <div style={{ fontSize: 12 }}>Select 2–5 papers on the left and click Compare Papers</div>
                </div>
              </div>
            )}

            {!loading && result && (
              <div>
                {/* Tab bar */}
                <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--glass)", borderRadius: 10, padding: 4 }}>
                  {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                      style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                        background: activeTab === t.id ? "var(--primary)" : "transparent",
                        color: activeTab === t.id ? "#fff" : "var(--text-muted)",
                        boxShadow: activeTab === t.id ? "0 2px 8px rgba(14,165,233,0.3)" : "none" }}>
                      <i className={`fas ${t.icon}`} style={{ marginRight: 6 }} />{t.label}
                    </button>
                  ))}
                </div>

                {/* AI Narrative */}
                {activeTab === "narrative" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                      <CopyButton text={result.narrative} label="Copy Analysis" />
                    </div>
                    <div style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.85, color: "var(--text-secondary)", padding: 20, background: "var(--glass)", borderRadius: 12, border: "1px solid var(--glass-border)", maxHeight: 520, overflowY: "auto" }}>
                      {result.narrative || "No narrative generated."}
                    </div>
                  </div>
                )}

                {/* Comparison Table */}
                {activeTab === "table" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                      <CopyButton text={result.table} label="Copy Table" />
                    </div>
                    <div style={{ whiteSpace: "pre-wrap", fontSize: 12, lineHeight: 1.8, color: "var(--text-secondary)", padding: 20, background: "var(--glass)", borderRadius: 12, border: "1px solid var(--glass-border)", maxHeight: 520, overflowY: "auto", fontFamily: "monospace" }}>
                      {result.table || result.raw}
                    </div>
                  </div>
                )}

                {/* Key Takeaways */}
                {activeTab === "takeaways" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                      <CopyButton text={result.takeaways} label="Copy Takeaways" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 520, overflowY: "auto" }}>
                      {(result.takeaways || "").split("\n").filter(l => l.trim()).map((line, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, padding: "12px 16px", background: "var(--glass)", borderRadius: 10, border: "1px solid var(--glass-border)" }}>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#6366f1", fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{line.replace(/^•\s*/, "")}</div>
                        </div>
                      ))}
                      {!result.takeaways && <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: 40 }}>No takeaways extracted. View the AI Analysis tab.</div>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
