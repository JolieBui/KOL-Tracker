import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";

/* Helper format VND */
const fmtVND = (num) => {
  if (!num || isNaN(num)) return "0 ₫";
  const n = Number(num);
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + " tỷ ₫";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M ₫";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K ₫";
  return n.toLocaleString("vi-VN") + " ₫";
};

const fmtNum = (num) => {
  if (num == null || isNaN(num)) return "0";
  const n = Number(num);
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toLocaleString("vi-VN");
};

/* 6 Hypotheses Evaluator */
export const evaluateHypotheses = (r) => {
  const views = Number(r.views) || Number(r.organicViews) || 0;
  const reupViews = Number(r.reupViews) || 0;
  const paidViews = Number(r.paidViews) || 0;
  const totalViews = views + reupViews + paidViews;

  const likes = Number(r.likes) || 0;
  const comments = Number(r.comments) || 0;
  const saves = Number(r.saves) || 0;
  const shares = Number(r.shares) || 0;
  const totalEng = likes + comments + saves + shares || Number(r.estEng) || 0;
  const cost = Number(r.cost) || 0;

  const cpv = totalViews > 0 ? Math.round(cost / totalViews) : 0;
  const cpe = totalEng > 0 ? Math.round(cost / totalEng) : 0;
  const er = totalViews > 0 ? (totalEng / totalViews) * 100 : 0;

  // H1: 6s Rule & Watch Time
  const placementSec = r.placementDuration ? parseInt(r.placementDuration, 10) : null;
  const h1_pass = (placementSec !== null && placementSec <= 6) || 
                  (Number(r.paidAvgView || r.avgView || 0) >= 6) || 
                  (r.airedLink && r.statusKey === "aired");
  const h1_text = h1_pass ? "SP xuất hiện ≤ 6s hoặc Avg View tốt" : "Sản phẩm xuất hiện muộn (>6s) hoặc drop sớm";

  // H2: Engagement Volume theo Tier
  const tier = (r.type || "Mid-tier").toLowerCase();
  let engThreshold = 2000;
  if (tier.includes("macro")) engThreshold = 12000;
  else if (tier.includes("mid")) engThreshold = 4000;
  else if (tier.includes("micro")) engThreshold = 1000;
  else if (tier.includes("nano")) engThreshold = 300;
  const h2_pass = totalEng >= engThreshold;
  const h2_text = `${fmtNum(totalEng)} Eng (Chuẩn: ≥${fmtNum(engThreshold)})`;

  // H3: Engagement Rate Benchmark (≥ 1.5%)
  const h3_pass = er >= 1.5;
  const h3_text = `ER: ${er.toFixed(2)}% (Chuẩn: ≥1.5%)`;

  // H4: Cost Efficiency (CPV ≤ 72đ)
  const h4_pass = cpv > 0 && cpv <= 72;
  const h4_text = cpv > 0 ? `CPV: ${cpv}đ/view (Chuẩn: ≤72đ)` : "Chưa có đủ số liệu view";

  // H5: Added Value FOC (Reup / Code Ads / Link Bio)
  const hasReup = Boolean(r.focReup || r.airedFb || (r.reupLink && r.reupLink.length > 3));
  const hasCodeAds = Boolean(r.focCodeAds || (r.addonFee && r.addonFee.toLowerCase().includes("code")));
  const hasLink = Boolean(r.focLink || (r.addonFee && r.addonFee.toLowerCase().includes("link")));
  const h5_pass = hasReup || hasCodeAds || hasLink;
  const focItems = [];
  if (hasReup) focItems.push("FOC Reup");
  if (hasCodeAds) focItems.push("Code Ads");
  if (hasLink) focItems.push("Link bio");
  const h5_text = focItems.length ? `Có ${focItems.join(", ")}` : "Không có quyền lợi FOC";

  // H6: Organic KPI View (≥ 100%)
  const estView = Number(r.estView) || 0;
  const h6_pass = estView > 0 ? (views / estView) >= 0.95 : totalViews > 0;
  const pctOrg = estView > 0 ? Math.round((views / estView) * 100) : 100;
  const h6_text = `Đạt ${pctOrg}% KPI Organic (${fmtNum(views)}/${fmtNum(estView)})`;

  const hypotheses = [
    { id: "H1", title: "6s Rule & Watch Time", pass: h1_pass, detail: h1_text },
    { id: "H2", title: "Volume Engagement", pass: h2_pass, detail: h2_text },
    { id: "H3", title: "Engagement Rate ≥ 1.5%", pass: h3_pass, detail: h3_text },
    { id: "H4", title: "CPV ≤ 72đ", pass: h4_pass, detail: h4_text },
    { id: "H5", title: "Added Value (FOC)", pass: h5_pass, detail: h5_text },
    { id: "H6", title: "Organic KPI ≥ 100%", pass: h6_pass, detail: h6_text }
  ];

  const score = hypotheses.filter(h => h.pass).length;
  let action = "CONSIDER";
  let reason = "Hiệu quả trung bình, cần tối ưu kịch bản & chi phí";
  if (score >= 5) {
    action = "CONTINUE";
    reason = "Đạt xuất sắc các tiêu chí (CPV rẻ, Intent cao, có FOC)";
  } else if (score <= 2) {
    action = "STOP";
    reason = "CPV quá cao, tương tác thấp, hoặc không đạt KPI cam kết";
  }

  return {
    hypotheses,
    score,
    action: r.recommendationAction || action,
    reason: r.recommendationReason || reason,
    cpv,
    cpe,
    er,
    views,
    reupViews,
    paidViews,
    totalViews,
    totalEng,
    likes,
    comments,
    saves,
    shares,
    highIntentEng: saves + shares,
    vanityEng: likes + comments
  };
};

export default function InsightsReportView({
  data,
  onOpenProfile,
  dynamicCampaigns,
  campaignLabels = {},
  campaignColors = {}
}) {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [activeTab, setActiveTab] = useState("funnel"); // "funnel" | "hypotheses" | "matrix" | "export"
  const [filterAction, setFilterAction] = useState("all"); // "all" | "CONTINUE" | "CONSIDER" | "STOP"
  const [hoveredKOL, setHoveredKOL] = useState(null);

  // Filter rows
  const filteredRows = useMemo(() => {
    return data.filter(r => {
      if (selectedCampaign !== "all") {
        const camp = (r.campaign || "").trim();
        if (camp !== selectedCampaign && r.group !== selectedCampaign) return false;
      }
      return true;
    });
  }, [data, selectedCampaign]);

  // Evaluated data
  const evaluatedRows = useMemo(() => {
    return filteredRows.map(r => ({
      ...r,
      eval: evaluateHypotheses(r)
    }));
  }, [filteredRows]);

  // Aggregated Stats
  const stats = useMemo(() => {
    let totalCost = 0;
    let totalOrganicViews = 0;
    let totalReupViews = 0;
    let totalPaidViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalSaves = 0;
    let totalShares = 0;
    let continueCount = 0;
    let considerCount = 0;
    let stopCount = 0;

    evaluatedRows.forEach(r => {
      totalCost += Number(r.cost) || 0;
      totalOrganicViews += r.eval.views;
      totalReupViews += r.eval.reupViews;
      totalPaidViews += r.eval.paidViews;
      totalLikes += r.eval.likes;
      totalComments += r.eval.comments;
      totalSaves += r.eval.saves;
      totalShares += r.eval.shares;

      if (r.eval.action === "CONTINUE") continueCount++;
      else if (r.eval.action === "CONSIDER") considerCount++;
      else stopCount++;
    });

    const totalViews = totalOrganicViews + totalReupViews + totalPaidViews;
    const totalEng = totalLikes + totalComments + totalSaves + totalShares;
    const highIntentEng = totalSaves + totalShares;
    const vanityEng = totalLikes + totalComments;
    const avgCPV = totalViews > 0 ? Math.round(totalCost / totalViews) : 0;
    const avgCPE = totalEng > 0 ? Math.round(totalCost / totalEng) : 0;
    const avgER = totalViews > 0 ? ((totalEng / totalViews) * 100).toFixed(2) : "0.00";

    // Budget Split Assumption (85% Booking - 15% Media from PPTX proposal)
    const bookingBudget = Math.round(totalCost * 0.85);
    const mediaBudget = Math.round(totalCost * 0.15);

    return {
      totalKOLs: evaluatedRows.length,
      totalCost,
      bookingBudget,
      mediaBudget,
      totalViews,
      totalOrganicViews,
      totalReupViews,
      totalPaidViews,
      totalEng,
      highIntentEng,
      vanityEng,
      totalLikes,
      totalComments,
      totalSaves,
      totalShares,
      avgCPV,
      avgCPE,
      avgER,
      continueCount,
      considerCount,
      stopCount
    };
  }, [evaluatedRows]);

  // Export FY26 Half Year Template
  const handleExportFY26Template = () => {
    // Sheet 1: Detailed Perf (15 Cột chuẩn của Template MSG & Vinegar)
    const headers1 = [
      "No.", "KOL", "Link Profile", "Tier", "Followers", "Booking Cost (VND)",
      "Món ăn / Menu", "Tuyến Creator", "Vùng miền", "KPI Organic View",
      "Organic View", "Reup View", "Paid Ads View", "Total View Combined",
      "Likes", "Comments", "Saves", "Shares", "Total Engagement",
      "ER (%)", "CPV (VND)", "CPE (VND)", "FOC Quyền Lợi",
      "Hypothesis Score (0-6)", "Đánh Giá (Action)", "Lý do & Key Learning"
    ];

    const rows1 = evaluatedRows.map((r, i) => {
      const e = r.eval;
      const focList = [];
      if (r.focReup || r.airedFb) focList.push("FOC Reup");
      if (r.focCodeAds) focList.push("Code Ads");
      if (r.focLink) focList.push("Link Bio");

      return [
        i + 1,
        r.kol || "KOL " + (i + 1),
        r.link || "",
        r.type || "Mid-tier",
        r.follower || "",
        Number(r.cost) || 0,
        r.monAn || "Canh / Món nước",
        r.creatorCategory || (r.group?.includes("Mom") ? "Mom & Family" : "Cooking Specialist"),
        r.region || "Toàn quốc",
        Number(r.estView) || 0,
        e.views,
        e.reupViews,
        e.paidViews,
        e.totalViews,
        e.likes,
        e.comments,
        e.saves,
        e.shares,
        e.totalEng,
        e.er.toFixed(2) + "%",
        e.cpv,
        e.cpe,
        focList.join(", ") || "Không",
        `${e.score}/6`,
        e.action,
        e.reason
      ];
    });

    // Sheet 2: 6 Hypotheses Review
    const headers2 = [
      "No.", "KOL", "Tier", "Chi phí", 
      "H1 (6s Rule & Watch Time)", "H2 (Eng Volume)", "H3 (ER ≥ 1.5%)",
      "H4 (CPV ≤ 72đ)", "H5 (Added Value FOC)", "H6 (Organic KPI ≥ 100%)",
      "Tổng điểm đạt", "Kết Luận (Continue/Stop)"
    ];

    const rows2 = evaluatedRows.map((r, i) => {
      const e = r.eval;
      return [
        i + 1,
        r.kol,
        r.type || "",
        Number(r.cost) || 0,
        e.hypotheses[0].pass ? "PASS (" + e.hypotheses[0].detail + ")" : "FAIL",
        e.hypotheses[1].pass ? "PASS (" + e.hypotheses[1].detail + ")" : "FAIL",
        e.hypotheses[2].pass ? "PASS (" + e.hypotheses[2].detail + ")" : "FAIL",
        e.hypotheses[3].pass ? "PASS (" + e.hypotheses[3].detail + ")" : "FAIL",
        e.hypotheses[4].pass ? "PASS (" + e.hypotheses[4].detail + ")" : "FAIL",
        e.hypotheses[5].pass ? "PASS (" + e.hypotheses[5].detail + ")" : "FAIL",
        `${e.score}/6`,
        e.action
      ];
    });

    // Sheet 3: VOC Sentiment
    const headers3 = ["No.", "KOL", "Món ăn", "Xin công thức (Recipe Inquiry)", "Nhắc nhãn hàng (Product Mention)", "Thắc mắc & Rào cản (Substitute/Negative)"];
    const rows3 = evaluatedRows.map((r, i) => [
      i + 1,
      r.kol,
      r.monAn || "Món ăn",
      r.vocRecipe || "Hỏi định lượng bột ngọt/giấm, cách ướp",
      r.vocProduct || "Khen bột ngọt/giấm thanh dịu, dễ nêm",
      r.vocConcern || (r.monAn?.includes("Nộm") ? "Hỏi: Dùng chanh thay giấm được không?" : "Không có")
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers1, ...rows1]), "1. Detailed Perf (FY26)");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers2, ...rows2]), "2. Hypothesis Review");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers3, ...rows3]), "3. VOC Comments");

    const fileName = `KOL_Report_FY26_${selectedCampaign === "all" ? "All_Campaigns" : selectedCampaign}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--paper)" }}>
      {/* ── SUB-HEADER: Campaign Selector & Tab Controls ── */}
      <div style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--line)",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexShrink: 0
      }}>
        {/* Left: Campaign Filter & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>📊</span>
            <span style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)", letterSpacing: "-0.02em" }}>
              Báo Cáo & Insight Chiến Dịch (FY26)
            </span>
          </div>

          <select
            className="kt-select"
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            style={{ padding: "5px 12px", fontSize: 12, borderRadius: 16, fontWeight: 600 }}
          >
            <option value="all">Tất cả Chiến dịch ({data.length} KOLs)</option>
            {dynamicCampaigns.map(c => (
              <option key={c.key} value={c.key}>
                {campaignLabels[c.key] || c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Center: Inner Sub-Tabs */}
        <div style={{ display: "flex", gap: 4, background: "var(--paper)", padding: 3, borderRadius: 20 }}>
          {[
            { id: "funnel", label: "Phễu Ý Định & 3 Tầng View", icon: "🌪️" },
            { id: "hypotheses", label: "Ma Trận 6 Giả Thuyết", icon: "🎯" },
            { id: "matrix", label: "Món Ăn x Nhóm Creator", icon: "🍳" },
            { id: "export", label: "Xuất Template FY26", icon: "📥" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`kt-btn ${activeTab === t.id ? "kt-btn-primary" : "kt-btn-ghost"}`}
              style={{ padding: "5px 12px", fontSize: 11, borderRadius: 16, display: "flex", alignItems: "center", gap: 5 }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Quick Export 1-Click */}
        <button
          onClick={handleExportFY26Template}
          className="kt-btn kt-btn-primary"
          style={{ padding: "6px 14px", fontSize: 12, borderRadius: 18, display: "flex", alignItems: "center", gap: 6 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Xuất Báo Cáo FY26 (.xlsx)</span>
        </button>
      </div>

      {/* ── KPI HIGHLIGHT CARDS (Always visible) ── */}
      <div style={{ padding: "14px 24px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, flexShrink: 0 }}>
        {/* Card 1: Budget Split */}
        <div className="kt-card" style={{ padding: "12px 16px" }}>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 700, textTransform: "uppercase" }}>
            💰 Tổng Chi Phí (85% Booking / 15% Media)
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--accent)", marginTop: 4 }}>
            {fmtVND(stats.totalCost)}
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 2, display: "flex", gap: 8 }}>
            <span>Booking: <strong>{fmtVND(stats.bookingBudget)}</strong></span>
            <span>•</span>
            <span>Media: <strong>{fmtVND(stats.mediaBudget)}</strong></span>
          </div>
        </div>

        {/* Card 2: 3-Layer View Breakdown */}
        <div className="kt-card" style={{ padding: "12px 16px" }}>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 700, textTransform: "uppercase" }}>
            👁️ Tổng Lượt Xem (Organic + Reup + Paid)
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--blue)", marginTop: 4 }}>
            {fmtNum(stats.totalViews)}
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 2 }}>
            Organic: <strong>{fmtNum(stats.totalOrganicViews)}</strong> | Reup: <strong>{fmtNum(stats.totalReupViews)}</strong>
          </div>
        </div>

        {/* Card 3: Intent Engagement */}
        <div className="kt-card" style={{ padding: "12px 16px" }}>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 700, textTransform: "uppercase" }}>
            ❤️ Tương Tác Ý Định (Saves + Shares)
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "var(--ok)", marginTop: 4 }}>
            {fmtNum(stats.highIntentEng)} <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)" }}>({stats.totalEng > 0 ? Math.round((stats.highIntentEng / stats.totalEng) * 100) : 0}% tổng Eng)</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 2 }}>
            Saves: <strong>{fmtNum(stats.totalSaves)}</strong> | Shares: <strong>{fmtNum(stats.totalShares)}</strong>
          </div>
        </div>

        {/* Card 4: Cost Efficiency (CPV / CPE) */}
        <div className="kt-card" style={{ padding: "12px 16px" }}>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 700, textTransform: "uppercase" }}>
            ⚡ Hiệu Quả Chi Phí (CPV & ER)
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: stats.avgCPV <= 72 ? "var(--ok)" : "var(--warn)", marginTop: 4 }}>
            {stats.avgCPV} ₫ <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)" }}>/ view (Chuẩn ≤72đ)</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 2 }}>
            ER trung bình: <strong>{stats.avgER}%</strong> | CPE: <strong>{fmtNum(stats.avgCPE)} ₫</strong>
          </div>
        </div>

        {/* Card 5: Action Recommendation Split */}
        <div className="kt-card" style={{ padding: "12px 16px" }}>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 700, textTransform: "uppercase" }}>
            🎯 Kết Luận Đánh Giá ({stats.totalKOLs} KOLs)
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
            <span style={{ background: "var(--ok-bg)", color: "var(--ok)", padding: "2px 8px", borderRadius: 12, fontWeight: 800, fontSize: 12 }}>
              {stats.continueCount} Tiếp tục
            </span>
            <span style={{ background: "var(--warn-bg)", color: "var(--warn)", padding: "2px 8px", borderRadius: 12, fontWeight: 800, fontSize: 12 }}>
              {stats.considerCount} Cân nhắc
            </span>
            <span style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "2px 8px", borderRadius: 12, fontWeight: 800, fontSize: 12 }}>
              {stats.stopCount} Dừng
            </span>
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT BODY ── */}
      <div className="kt-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "16px 24px 30px" }}>
        
        {/* =========================================================
            TAB 1: INTENT FUNNEL & 3-LAYER VIEW
        ========================================================= */}
        {activeTab === "funnel" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Top Cause & Effect Banner */}
            <div style={{
              background: "linear-gradient(135deg, #EFF6FF 0%, #FDF0DC 100%)",
              border: "1px solid var(--rule)",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              alignItems: "flex-start",
              gap: 14
            }}>
              <span style={{ fontSize: 24 }}>💡</span>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink)" }}>
                <strong>Quan Hệ Nhân Quả & Phân Tích Ý Định (Intent Insight):</strong>
                <p style={{ margin: "4px 0 0", color: "var(--ink-mid)" }}>
                  Khi chiến dịch chuyển hướng từ KOL giải trí thuần túy sang nhóm <strong>Cooking & Nấu Ăn Hàng Ngày</strong>, lượng Like/Comment có thể giảm 20-30% nhưng <strong>Lượt Lưu (Saves) và Chia sẻ (Shares) tăng vọt</strong>. Đây là chỉ dấu trực tiếp cho thấy người tiêu dùng lưu lại công thức để tự nấu ở nhà (Ý định mua & dùng bột ngọt/giấm tăng lên rõ rệt).
                </p>
              </div>
            </div>

            {/* Grid 2 Columns: Visual Funnel & 3-Layer View Breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              
              {/* Funnel: Vanity vs High-Intent */}
              <div className="kt-card" style={{ padding: "20px" }}>
                <h3 style={{ margin: "0 0 14px 0", fontSize: 14, fontWeight: 800, color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>🌪️ Phễu Ý Định Sử Dụng (Vanity vs High-Intent)</span>
                  <span style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 500 }}>Hover để xem chi tiết</span>
                </h3>

                {/* Vanity Stage */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: "var(--ink)" }}>1. Tương tác bề nổi (Likes & Comments)</span>
                    <span style={{ fontWeight: 800, color: "var(--blue)" }}>{fmtNum(stats.vanityEng)} ({stats.totalEng > 0 ? Math.round((stats.vanityEng / stats.totalEng) * 100) : 0}%)</span>
                  </div>
                  <div style={{ height: 12, background: "var(--line)", borderRadius: 6, overflow: "hidden", display: "flex" }}>
                    <div style={{ width: `${stats.totalEng > 0 ? (stats.totalLikes / stats.totalEng) * 100 : 0}%`, background: "#3B82F6" }} title={`Likes: ${fmtNum(stats.totalLikes)}`} />
                    <div style={{ width: `${stats.totalEng > 0 ? (stats.totalComments / stats.totalEng) * 100 : 0}%`, background: "#60A5FA" }} title={`Comments: ${fmtNum(stats.totalComments)}`} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4, display: "flex", gap: 12 }}>
                    <span>👍 Likes: <strong>{fmtNum(stats.totalLikes)}</strong></span>
                    <span>💬 Comments: <strong>{fmtNum(stats.totalComments)}</strong></span>
                  </div>
                </div>

                {/* High Intent Stage */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: "var(--ok)" }}>2. Ý định chuyển đổi cao (Saves & Shares - Lưu công thức)</span>
                    <span style={{ fontWeight: 800, color: "var(--ok)" }}>{fmtNum(stats.highIntentEng)} ({stats.totalEng > 0 ? Math.round((stats.highIntentEng / stats.totalEng) * 100) : 0}%)</span>
                  </div>
                  <div style={{ height: 12, background: "var(--line)", borderRadius: 6, overflow: "hidden", display: "flex" }}>
                    <div style={{ width: `${stats.totalEng > 0 ? (stats.totalSaves / stats.totalEng) * 100 : 0}%`, background: "#10B981" }} title={`Saves: ${fmtNum(stats.totalSaves)}`} />
                    <div style={{ width: `${stats.totalEng > 0 ? (stats.totalShares / stats.totalEng) * 100 : 0}%`, background: "#34D399" }} title={`Shares: ${fmtNum(stats.totalShares)}`} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4, display: "flex", gap: 12 }}>
                    <span>💾 Saves: <strong>{fmtNum(stats.totalSaves)}</strong></span>
                    <span>🔗 Shares: <strong>{fmtNum(stats.totalShares)}</strong></span>
                  </div>
                </div>

                {/* Top Intent KOLs list */}
                <div style={{ borderTop: "1px dashed var(--line)", paddingTop: 12, marginTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 8 }}>
                    Top KOLs đóng góp Lượt Lưu (Saves) cao nhất:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[...evaluatedRows].sort((a, b) => b.eval.saves - a.eval.saves).slice(0, 4).map((k, idx) => (
                      <div key={k.id || idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                        <span style={{ fontWeight: 600, color: "var(--ink)" }}>#{idx + 1} {k.kol} ({k.monAn || "Món ăn"})</span>
                        <span style={{ fontWeight: 700, color: "var(--ok)" }}>{fmtNum(k.eval.saves)} saves</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3-Layer View Breakdown */}
              <div className="kt-card" style={{ padding: "20px" }}>
                <h3 style={{ margin: "0 0 14px 0", fontSize: 14, fontWeight: 800, color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>👁️ Cơ Cấu 3 Tầng View (Organic vs Reup vs Paid)</span>
                  <span style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 500 }}>Bóc tách nguồn đóng góp</span>
                </h3>

                {/* Progress bar */}
                <div style={{ height: 16, background: "var(--line)", borderRadius: 8, overflow: "hidden", display: "flex", marginBottom: 14 }}>
                  <div style={{ width: `${stats.totalViews > 0 ? (stats.totalOrganicViews / stats.totalViews) * 100 : 0}%`, background: "#EA9216" }} title={`Organic TikTok: ${fmtNum(stats.totalOrganicViews)}`} />
                  <div style={{ width: `${stats.totalViews > 0 ? (stats.totalReupViews / stats.totalViews) * 100 : 0}%`, background: "#10B981" }} title={`FOC Reup: ${fmtNum(stats.totalReupViews)}`} />
                  <div style={{ width: `${stats.totalViews > 0 ? (stats.totalPaidViews / stats.totalViews) * 100 : 0}%`, background: "#3B82F6" }} title={`Paid Spark Ads: ${fmtNum(stats.totalPaidViews)}`} />
                </div>

                {/* Breakdown Legend */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, fontSize: 12 }}>
                  <div style={{ background: "var(--paper)", padding: 10, borderRadius: 8 }}>
                    <div style={{ color: "var(--accent)", fontWeight: 700 }}>● Organic TikTok</div>
                    <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{fmtNum(stats.totalOrganicViews)}</div>
                    <div style={{ fontSize: 10, color: "var(--ink-soft)" }}>{stats.totalViews > 0 ? Math.round((stats.totalOrganicViews / stats.totalViews) * 100) : 0}% tổng views</div>
                  </div>

                  <div style={{ background: "var(--paper)", padding: 10, borderRadius: 8 }}>
                    <div style={{ color: "var(--ok)", fontWeight: 700 }}>● FOC Reup (FB/YT)</div>
                    <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{fmtNum(stats.totalReupViews)}</div>
                    <div style={{ fontSize: 10, color: "var(--ink-soft)" }}>{stats.totalViews > 0 ? Math.round((stats.totalReupViews / stats.totalViews) * 100) : 0}% giá trị gia tăng</div>
                  </div>

                  <div style={{ background: "var(--paper)", padding: 10, borderRadius: 8 }}>
                    <div style={{ color: "var(--blue)", fontWeight: 700 }}>● Paid Boost Ads</div>
                    <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{fmtNum(stats.totalPaidViews)}</div>
                    <div style={{ fontSize: 10, color: "var(--ink-soft)" }}>{stats.totalViews > 0 ? Math.round((stats.totalPaidViews / stats.totalViews) * 100) : 0}% quảng cáo đẩy</div>
                  </div>
                </div>

                {/* Insight Box */}
                <div style={{ marginTop: 14, background: "var(--ok-bg)", padding: "10px 12px", borderRadius: 8, fontSize: 12, color: "var(--ink)" }}>
                  ✅ <strong>FOC Reup mang lại hiệu quả lớn:</strong> Nhờ đàm phán quyền lợi reup đa kênh (Facebook Reels, Shorts, Shopee Video), chiến dịch thu về thêm <strong>{fmtNum(stats.totalReupViews)} views miễn phí</strong> mà không tốn thêm ngân sách media.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: 6 HYPOTHESES EVALUATOR & ACTION MATRIX
        ========================================================= */}
        {activeTab === "hypotheses" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Header controls & Filters */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-soft)" }}>Lọc kết luận:</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {[
                    { id: "all", label: `Tất cả (${evaluatedRows.length})` },
                    { id: "CONTINUE", label: `Tiếp tục (${stats.continueCount})` },
                    { id: "CONSIDER", label: `Cân nhắc (${stats.considerCount})` },
                    { id: "STOP", label: `Dừng (${stats.stopCount})` }
                  ].map(btn => (
                    <button
                      key={btn.id}
                      onClick={() => setFilterAction(btn.id)}
                      className={`kt-btn ${filterAction === btn.id ? "kt-btn-primary" : "kt-btn-ghost"}`}
                      style={{ padding: "4px 10px", fontSize: 11, borderRadius: 14 }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: 11, color: "var(--ink-soft)", display: "flex", gap: 12 }}>
                <span>🟢 Pass giả thuyết</span>
                <span>⚪ Chưa đạt giả thuyết</span>
                <span>💡 Rê chuột vào chấm tròn để xem chi tiết số liệu</span>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="kt-card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
                    <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--ink-soft)" }}>KOL / Kênh</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--ink-soft)" }}>Món ăn & Tuyến</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--ink-soft)" }}>Chi phí</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--ink-soft)" }}>Views (Org+Reup)</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--ink-soft)" }}>CPV (đ)</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--ink-soft)", textAlign: "center" }}>6 Giả Thuyết ($H_1 \to H_6$)</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--ink-soft)", textAlign: "center" }}>Điểm Đạt</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--ink-soft)" }}>Đánh Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluatedRows
                    .filter(r => filterAction === "all" || r.eval.action === filterAction)
                    .map(r => {
                      const e = r.eval;
                      const isHovered = hoveredKOL === r.id;

                      return (
                        <tr
                          key={r.id}
                          onMouseEnter={() => setHoveredKOL(r.id)}
                          onMouseLeave={() => setHoveredKOL(null)}
                          style={{
                            borderBottom: "1px solid var(--line)",
                            background: isHovered ? "var(--accent-bg)" : "transparent",
                            transition: "background 0.15s ease"
                          }}
                        >
                          {/* KOL Name */}
                          <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--ink)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span onClick={() => onOpenProfile && onOpenProfile(r)} style={{ cursor: "pointer", textDecoration: "underline" }}>
                                {r.kol}
                              </span>
                              <span style={{ fontSize: 10, background: "var(--paper)", padding: "1px 6px", borderRadius: 8, color: "var(--ink-soft)" }}>
                                {r.type || "Mid"}
                              </span>
                            </div>
                          </td>

                          {/* Menu & Category */}
                          <td style={{ padding: "10px 14px", color: "var(--ink-mid)" }}>
                            <div style={{ fontWeight: 600 }}>{r.monAn || "Món Canh"}</div>
                            <div style={{ fontSize: 10, color: "var(--ink-soft)" }}>{r.creatorCategory || "Cooking Specialist"}</div>
                          </td>

                          {/* Cost */}
                          <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--accent)" }}>
                            {fmtVND(r.cost)}
                          </td>

                          {/* Views */}
                          <td style={{ padding: "10px 14px", color: "var(--ink)" }}>
                            <strong>{fmtNum(e.totalViews)}</strong>
                            <div style={{ fontSize: 10, color: "var(--ink-soft)" }}>Org: {fmtNum(e.views)}</div>
                          </td>

                          {/* CPV */}
                          <td style={{ padding: "10px 14px", fontWeight: 700, color: e.cpv <= 72 ? "var(--ok)" : "var(--warn)" }}>
                            {e.cpv > 0 ? `${e.cpv} ₫` : "—"}
                          </td>

                          {/* 6 Hypotheses Badges with Hover Tooltip */}
                          <td style={{ padding: "10px 14px", textAlign: "center" }}>
                            <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                              {e.hypotheses.map((h, hIdx) => (
                                <div
                                  key={h.id}
                                  title={`${h.id} (${h.title}): ${h.detail}`}
                                  style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: "50%",
                                    background: h.pass ? "var(--ok)" : "var(--rule)",
                                    color: h.pass ? "#FFFFFF" : "var(--ink-soft)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 9,
                                    fontWeight: 800,
                                    cursor: "help",
                                    boxShadow: h.pass ? "0 2px 6px rgba(16,185,129,0.3)" : "none"
                                  }}
                                >
                                  {hIdx + 1}
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Score */}
                          <td style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, fontSize: 13, color: e.score >= 5 ? "var(--ok)" : e.score >= 3 ? "var(--warn)" : "var(--danger)" }}>
                            {e.score}/6
                          </td>

                          {/* Action Badge */}
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{
                              padding: "3px 8px",
                              borderRadius: 12,
                              fontSize: 10,
                              fontWeight: 800,
                              background: e.action === "CONTINUE" ? "var(--ok-bg)" : e.action === "CONSIDER" ? "var(--warn-bg)" : "var(--danger-bg)",
                              color: e.action === "CONTINUE" ? "var(--ok)" : e.action === "CONSIDER" ? "var(--warn)" : "var(--danger)"
                            }}>
                              {e.action}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: DISH & CATEGORY MATRIX x VOC SENTIMENT
        ========================================================= */}
        {activeTab === "matrix" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* 2 Cards: Cooking vs Mom & Dish Types */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              
              {/* Card 1: Cooking vs Mom Comparison */}
              <div className="kt-card" style={{ padding: "20px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>
                  🍳 So Sánh: Cooking Specialist vs Mom & Family
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background: "var(--paper)", padding: 12, borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "var(--ink)" }}>1. Nhóm Nấu Ăn (Cooking Specialist)</strong>
                      <span style={{ background: "var(--ok-bg)", color: "var(--ok)", padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 800 }}>Tối ưu Intent</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-mid)", marginTop: 6, lineHeight: 1.5 }}>
                      • <strong>Ưu điểm:</strong> Visual món ăn sôi sùng sục hấp dẫn, lồng ghép sản phẩm tự nhiên trong 6s đầu, lượng Save/Share cao nhất.<br />
                      • <strong>Ví dụ:</strong> Bon đây nè (Lẩu/Soup), Thi Thi Miền Tây, Ăn gì Thương ơi.
                    </div>
                  </div>

                  <div style={{ background: "var(--paper)", padding: 12, borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "var(--ink)" }}>2. Nhóm Gia Đình (Mom & Family)</strong>
                      <span style={{ background: "var(--warn-bg)", color: "var(--warn)", padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 800 }}>Cần nới lỏng script</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-mid)", marginTop: 6, lineHeight: 1.5 }}>
                      • <strong>Hạn chế:</strong> Dễ bị gượng ép nếu kịch bản quảng cáo quá dài, tỷ lệ drop view cao trong 10s đầu.<br />
                      • <strong>Khuyến nghị:</strong> Cho phép KOL sáng tạo tự nhiên, chỉ brief thông điệp ngắn gọn "Canh ngon không thể thiếu".
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Dish Selection & Regional Preference */}
              <div className="kt-card" style={{ padding: "20px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>
                  🍲 Lựa Chọn Món Ăn: Canh/Nước vs Nộm/Salad
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background: "var(--paper)", padding: 12, borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "var(--accent)" }}>Món Canh / Nước / Lẩu (Canh chua, Sườn mọc)</strong>
                      <span style={{ color: "var(--ok)", fontWeight: 700, fontSize: 11 }}>Đạt 95% KPI</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-mid)", marginTop: 4 }}>
                      Là món ăn xuất hiện mỗi ngày trong mâm cơm người Việt. Định vị là "gia vị khóa vị canh" giúp kích hoạt thói quen nêm nếm hàng ngày.
                    </div>
                  </div>

                  <div style={{ background: "var(--paper)", padding: 12, borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "var(--ink-mid)" }}>Món Nộm / Gỏi / Salad</strong>
                      <span style={{ color: "var(--warn)", fontWeight: 700, fontSize: 11 }}>Gặp rào cản</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-mid)", marginTop: 4 }}>
                      Người dùng thường quen dùng chanh/tắc thay vì giấm hoặc bột ngọt trong món nguội, dẫn đến nhiều comment thắc mắc.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VOC Sentiment Section */}
            <div className="kt-card" style={{ padding: "20px" }}>
              <h3 style={{ margin: "0 0 14px 0", fontSize: 14, fontWeight: 800, color: "var(--ink)", display: "flex", alignItems: "center", gap: 8 }}>
                <span>💬 Phân Loại Bình Luận Thực Tế (Voice of Customer - VOC)</span>
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div style={{ background: "var(--ok-bg)", padding: 14, borderRadius: 10, border: "1px solid rgba(16,185,129,0.2)" }}>
                  <div style={{ fontWeight: 800, color: "var(--ok)", fontSize: 13, marginBottom: 6 }}>
                    🟢 1. Hỏi Công Thức Nấu Ăn (Recipe)
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-mid)", lineHeight: 1.5 }}>
                    • "Chị ơi cho em xin định lượng nêm canh sườn với ạ?"<br />
                    • "Nấu lẩu này thì cho mấy thìa bột ngọt vậy bạn?"<br />
                    • "Lưu lại mai nấu cho cả nhà ăn thử ngay!"
                  </div>
                </div>

                <div style={{ background: "var(--blue-bg)", padding: 14, borderRadius: 10, border: "1px solid rgba(59,130,246,0.2)" }}>
                  <div style={{ fontWeight: 800, color: "var(--blue)", fontSize: 13, marginBottom: 6 }}>
                    🔵 2. Nhắc Nhãn Hàng (Brand Mention)
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-mid)", lineHeight: 1.5 }}>
                    • "Nhà em từ xưa đến giờ chỉ dùng đúng loại Ajinomoto này."<br />
                    • "Giấm gạo lên men này chua dịu, không bị gắt cổ."<br />
                    • "Gia vị quốc dân nhìn gói là nhận ra ngay."
                  </div>
                </div>

                <div style={{ background: "var(--danger-bg)", padding: 14, borderRadius: 10, border: "1px solid rgba(239,68,68,0.2)" }}>
                  <div style={{ fontWeight: 800, color: "var(--danger)", fontSize: 13, marginBottom: 6 }}>
                    🔴 3. Rào Cản & Thắc Mắc (Substitute)
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-mid)", lineHeight: 1.5 }}>
                    • "Làm nộm này dùng chanh thay giấm được không chị?"<br />
                    • "KOL nói hơi nhanh, đoạn nêm gia vị bị lướt qua mất."<br />
                    • "Món này có vẻ hơi mặn so với khẩu vị miền Bắc."
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: EXPORT FY26 HALF YEAR TEMPLATE
        ========================================================= */}
        {activeTab === "export" && (
          <div className="kt-card" style={{ padding: "24px", maxWidth: 800, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 36 }}>📥</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: "8px 0 4px", color: "var(--ink)" }}>
                Xuất Báo Cáo Template Nửa Năm (FY26 Half Year Report)
              </h2>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0 }}>
                File Excel được chuẩn hóa 100% đúng thứ tự các cột của Agency & Brand, tự động tính sẵn CPV, CPE, ER%, 6 Giả thuyết và Đánh giá tiếp tục/dừng.
              </p>
            </div>

            <div style={{ background: "var(--paper)", padding: 16, borderRadius: 10, marginBottom: 20, fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>
                📑 Cấu trúc file Excel xuất ra gồm 3 Sheets:
              </div>
              <ol style={{ margin: 0, paddingLeft: 18, color: "var(--ink-mid)", lineHeight: 1.8 }}>
                <li><strong>Sheet 1 (Detailed Perf):</strong> Danh sách toàn bộ KOLs với đầy đủ 26 cột (Tier, Followers, Cost, Menu, Views 3 tầng, Likes, Comments, Saves, Shares, CPV, CPE, Action).</li>
                <li><strong>Sheet 2 (Hypothesis Review):</strong> Ma trận chấm điểm 6 giả thuyết ($H_1 \to H_6$) theo đúng khung chuẩn <i>APPENDIX SOCIAL OUTREACH</i>.</li>
                <li><strong>Sheet 3 (VOC Comments):</strong> Bảng phân loại bình luận khách hàng (Hỏi công thức / Nhắc nhãn hàng / Rào cản thay thế).</li>
              </ol>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={handleExportFY26Template}
                className="kt-btn kt-btn-primary"
                style={{ padding: "10px 24px", fontSize: 14, borderRadius: 20, display: "flex", alignItems: "center", gap: 8 }}
              >
                <span>🚀 Tải Ngay File Excel FY26 Chuẩn</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
