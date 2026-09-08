import React, { useState, useEffect } from "react";
import { analyzeTrends } from "../services/gemini";
import { useToast } from "../context/ToastContext";

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-muted)" }}>
      <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.4 }}>📈</div>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: "var(--text-secondary)" }}>No papers in your library</div>
      <div style={{ fontSize: 13 }}>Upload research papers to discover trends across your collection.</div>
    </div>
  );
}

// CSS-only bar chart component — no external dependencies
function BarChart({ data, color = "var(--primary)", labelKey = "label", valueKey = "value" }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d[valueKey] || 0));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((item, i) => {
        const pct = max > 0 ? (item[valueKey] / max) * 100 : 0;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 130, fontSize: 11, color: "var(--text-muted)", textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item[labelKey]}
            </div>
            <div style={{ flex: 1, height: 20, background: "var(--glass)", borderRadius: 4, overflow: "hidden", border: "1px solid var(--glass-border)" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s ease", minWidth: pct > 0 ? 4 : 0 }} />
            </div>
            <div style={{ width: 28, fontSize: 11, color: "var(--text-muted)", fontWeight: 700, flexShrink: 0, textAlign: "right" }}>
              {item[valueKey]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const TREND_COLORS = { rising: "#10b981", stable: "#f59e0b", declining: "#f43f5e" };

export default function TrendAnalysisPage({ documents = [] }) {
  const toast = useToast();
  const [loading, setLoading]   = useState(false);
  const [data, setData]         = useState(null);
  const [hasRun, setHasRun]     = useState(false);

  const handleAnalyze = async () => {
    if (documents.length === 0) { toast.error("Upload papers first."); return; }
    setLoading(true); setData(null); setHasRun(false);
    try {
      const result = await analyzeTrends(documents);
      setData(result);
      setHasRun(true);
      toast.success("Trend analysis complete!");
    } catch (err) {
      toast.error(err?.message || "Trend analysis failed. Please try again.");
    } finally { setLoading(false); }
  };

  const keywordChartData = data?.topKeywords?.map(k => ({ label: k.keyword, value: k.count, trend: k.trend })) || [];
  const yearChartData = data?.yearDistribution?.map(y => ({ label: String(y.year), value: y.count })) || [];

  return (
    <div className="fade-in-up" style={{ height: "100%", overflowY: "auto", padding: "32px 28px", boxSizing: "border-box", fontFamily: "Inter, sans-serif", color: "var(--text-primary)", maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(99,102,241,0.4)", flexShrink: 0 }}>
            <i className="fas fa-chart-line" style={{ color: "#fff", fontSize: 20 }} />
          </div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Trend Analysis</h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Discover keywords, publication patterns, and emerging research topics</p>
          </div>
        </div>
        <button className="btn-primary" onClick={handleAnalyze} disabled={loading || documents.length === 0}
          style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", flexShrink: 0 }}>
          {loading ? <><i className="fas fa-spinner fa-spin" /> Analyzing…</> : <><i className="fas fa-chart-line" /> Analyze Trends ({documents.length} papers)</>}
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="glass-card"><EmptyState /></div>
      ) : loading ? (
        <div className="glass-card" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#6366f1,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse-glow 1.5s infinite" }}>
            <i className="fas fa-chart-line" style={{ color: "#fff", fontSize: 28 }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Analyzing Research Trends…</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Processing {documents.length} paper{documents.length > 1 ? "s" : ""} with Gemini AI</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>{[0,1,2].map(i => <div key={i} className="typing-dot" style={{ animationDelay: `${i*0.2}s` }} />)}</div>
        </div>
      ) : !hasRun ? (
        <div className="glass-card" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16, color: "var(--text-muted)" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(99,102,241,0.08)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(99,102,241,0.15)" }}>
            <i className="fas fa-chart-bar" style={{ fontSize: 36, color: "#6366f1", opacity: 0.5 }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Trend insights will appear here</div>
            <div style={{ fontSize: 12 }}>Click "Analyze Trends" above to run analysis on all {documents.length} papers</div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Trend Summary */}
          {data?.trendSummary && (
            <div className="glass-card" style={{ padding: 22, background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <i className="fas fa-brain" style={{ color: "#6366f1", fontSize: 20, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>AI Trend Summary</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75 }}>{data.trendSummary}</div>
                </div>
              </div>
            </div>
          )}

          {/* Charts Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* Keyword frequency chart */}
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                <i className="fas fa-tags" style={{ marginRight: 8, color: "var(--primary-light)" }} />Top Keywords
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16 }}>Frequency by occurrence count</div>
              {keywordChartData.length > 0 ? (
                <div>
                  <BarChart data={keywordChartData} color="var(--primary)" labelKey="label" valueKey="value" />
                  {/* Trend indicators */}
                  {data?.topKeywords?.some(k => k.trend) && (
                    <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--glass-border)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {Object.entries(TREND_COLORS).map(([trend, color]) => (
                        <div key={trend} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                          {trend.charAt(0).toUpperCase() + trend.slice(1)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", padding: 20 }}>No keyword data</div>}
            </div>

            {/* Year distribution chart */}
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                <i className="fas fa-calendar-alt" style={{ marginRight: 8, color: "#6366f1" }} />Publication Timeline
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16 }}>Papers per year in your library</div>
              {yearChartData.length > 0 ? (
                <BarChart data={yearChartData} color="linear-gradient(90deg,#6366f1,#a855f7)" labelKey="label" valueKey="value" />
              ) : <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", padding: 20 }}>No year data</div>}
            </div>
          </div>

          {/* Emerging Topics + Dominant Themes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
                <i className="fas fa-rocket" style={{ marginRight: 8, color: "#10b981" }} />Emerging Topics
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(data?.emergingTopics || []).map((topic, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                    <i className="fas fa-arrow-trend-up" style={{ color: "#10b981", fontSize: 12, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{topic}</span>
                  </div>
                ))}
                {(!data?.emergingTopics || data.emergingTopics.length === 0) && (
                  <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", padding: 20 }}>No data</div>
                )}
              </div>
            </div>

            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
                <i className="fas fa-layer-group" style={{ marginRight: 8, color: "#f59e0b" }} />Dominant Themes
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(data?.dominantThemes || []).map((theme, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#f59e0b", fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{theme}</span>
                  </div>
                ))}
                {(!data?.dominantThemes || data.dominantThemes.length === 0) && (
                  <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", padding: 20 }}>No data</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
