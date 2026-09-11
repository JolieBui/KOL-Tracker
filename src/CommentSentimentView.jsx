import React, { useState, useEffect, useMemo } from "react";

export default function CommentSentimentView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/comments")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load comment sentiment:", err);
        setLoading(false);
      });
  }, []);

  const filteredComments = useMemo(() => {
    if (!data?.comments) return [];
    return data.comments.filter(c => {
      const matchSentiment = filterSentiment === "all" || c.sentiment === filterSentiment;
      const matchText = !search || (c.text || "").toLowerCase().includes(search.toLowerCase()) || (c.nickname || "").toLowerCase().includes(search.toLowerCase());
      return matchSentiment && matchText;
    });
  }, [data, filterSentiment, search]);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--ink-soft)" }}>
        ⏳ Đang tải dữ liệu phân tích cảm xúc bình luận...
      </div>
    );
  }

  const { totalVideos, totalComments, sentimentCounts, topKeywords } = data || {};

  const sentimentMeta = {
    Positive: { label: "Tích Cực (Khen/Ủng hộ)", color: "#15803D", bg: "#DCFCE7", icon: "🥰" },
    Neutral: { label: "Trung Lập", color: "#475569", bg: "#F1F5F9", icon: "💬" },
    Inquiry: { label: "Hỏi Đáp / Xin Công Thức", color: "#0284C7", bg: "#E0F2FE", icon: "🍳" },
    BuyingIntent: { label: "Ý Định Mua Hàng / Mua Sản Phẩm", color: "#7C3AED", bg: "#EDE9FE", icon: "🛒" },
    Negative: { label: "Tiêu Cực / Nghi Ngại / Chê", color: "#E11D48", bg: "#FFE4E6", icon: "⚠️" }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1300px", margin: "0 auto", height: "100%", overflowY: "auto" }}>
      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)",
        color: "#FFF",
        padding: "24px",
        borderRadius: "16px",
        marginBottom: "24px",
        boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.25)"
      }}>
        <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#A7F3D0", fontWeight: 700, marginBottom: "4px" }}>
          NLP Comment Intelligence
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: 800, margin: 0 }}>
          💬 Phân Tích Cảm Xúc & Phản Hồi Khán Giả TikTok
        </h2>
        <p style={{ margin: "6px 0 0 0", color: "#94A3B8", fontSize: "14px" }}>
          Tổng hợp từ {totalVideos || 0} video TikTok chiến dịch | {totalComments || 0} bình luận đã được quét và phân loại NLP.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {Object.entries(sentimentCounts || {}).map(([key, count]) => {
          const meta = sentimentMeta[key] || { label: key, color: "#000", bg: "#FFF", icon: "💬" };
          const pct = totalComments ? ((count / totalComments) * 100).toFixed(1) : 0;

          return (
            <div
              key={key}
              className="kt-card"
              onClick={() => setFilterSentiment(filterSentiment === key ? "all" : key)}
              style={{
                padding: "16px",
                cursor: "pointer",
                borderLeft: `4px solid ${meta.color}`,
                background: filterSentiment === key ? meta.bg : "var(--card)",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "20px" }}>{meta.icon}</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: meta.color, background: meta.bg, padding: "2px 8px", borderRadius: "12px" }}>
                  {pct}%
                </span>
              </div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--ink)" }}>
                {count.toLocaleString()}
              </div>
              <div style={{ fontSize: "12px", color: "var(--ink-soft)", fontWeight: 600, marginTop: "2px" }}>
                {meta.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Analysis Section */}
      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "24px", marginBottom: "24px" }}>
        
        {/* Top Keywords Word Cloud Panel */}
        <div className="kt-card" style={{ padding: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 16px 0", color: "var(--ink)" }}>
            🏷️ Từ Khóa Xuất Hiện Nổi Bật
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {(topKeywords || []).map((item, idx) => (
              <span
                key={idx}
                style={{
                  background: idx < 5 ? "#E0F2FE" : "var(--surface)",
                  color: idx < 5 ? "#0284C7" : "var(--ink)",
                  border: "1px solid var(--rule)",
                  padding: "4px 10px",
                  borderRadius: "16px",
                  fontSize: idx < 5 ? "13px" : "12px",
                  fontWeight: idx < 5 ? 700 : 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                #{item.word} <span style={{ fontSize: "10px", opacity: 0.7 }}>({item.count})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Comment Explorer Table */}
        <div className="kt-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
              🔍 Danh Sách Bình Luận ({filteredComments.length})
            </h3>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="Tìm nội dung bình luận..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--rule)",
                  fontSize: "13px",
                  width: "200px"
                }}
              />
              <select
                value={filterSentiment}
                onChange={e => setFilterSentiment(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--rule)",
                  fontSize: "13px"
                }}
              >
                <option value="all">Tất cả Cảm Xúc</option>
                <option value="Positive">🥰 Tích Cực</option>
                <option value="Inquiry">🍳 Hỏi Đáp / Công Thức</option>
                <option value="BuyingIntent">🛒 Ý Định Mua Hàng</option>
                <option value="Neutral">💬 Trung Lập</option>
                <option value="Negative">⚠️ Tiêu Cực</option>
              </select>
            </div>
          </div>

          <div style={{ maxHeight: "400px", overflowY: "auto" }} className="kt-scrollbar">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--rule)", textAlign: "left" }}>
                  <th style={{ padding: "10px", color: "var(--ink-soft)" }}>Người dùng</th>
                  <th style={{ padding: "10px", color: "var(--ink-soft)" }}>Nội dung bình luận</th>
                  <th style={{ padding: "10px", color: "var(--ink-soft)", textCenter: "center" }}>Lượt thích</th>
                  <th style={{ padding: "10px", color: "var(--ink-soft)" }}>Phân loại Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {filteredComments.slice(0, 50).map((item, idx) => {
                  const meta = sentimentMeta[item.sentiment] || { label: item.sentiment, color: "#000", bg: "#FFF" };
                  return (
                    <tr key={idx} style={{ borderBottom: "1px solid var(--rule)" }}>
                      <td style={{ padding: "10px", fontWeight: 600, color: "var(--ink)" }}>
                        {item.nickname || item.unique_id || "User"}
                        <div style={{ fontSize: "11px", color: "var(--ink-soft)", fontWeight: 400 }}>@{item.unique_id}</div>
                      </td>
                      <td style={{ padding: "10px", color: "var(--ink)" }}>
                        {item.text}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center", color: "var(--ink-soft)", fontWeight: 600 }}>
                        ❤️ {item.digg_count}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span style={{
                          background: meta.bg,
                          color: meta.color,
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 700
                        }}>
                          {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
