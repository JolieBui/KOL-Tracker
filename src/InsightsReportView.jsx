import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";

/* Format VND gọn gàng */
const fmtVND = (num) => {
  if (!num || isNaN(num)) return "0 ₫";
  const n = Number(num);
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + " tỷ";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + " tr";
  if (n >= 1000) return (n / 1000).toFixed(0) + " k";
  return n.toLocaleString("vi-VN") + " ₫";
};

const fmtNum = (num) => {
  if (num == null || isNaN(num)) return "0";
  const n = Number(num);
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toLocaleString("vi-VN");
};

/* Cắt gọn text/link món ăn */
const cleanDish = (text) => {
  if (!text) return "Món ăn chiến dịch";
  let str = text.replace(/https?:\/\/\S+/gi, "").replace(/[\r\n]+/g, " ").trim();
  if (str.startsWith("-") || str.startsWith("*")) str = str.substring(1).trim();
  if (str.length > 45) return str.substring(0, 42) + "...";
  return str || "Món ăn chiến dịch";
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
  const h1_text = h1_pass ? "Xuất hiện SP ≤ 6s / Watch time tốt" : "Sản phẩm xuất hiện muộn (>6s)";

  // H2: Engagement Volume theo Tier
  const tier = (r.type || "Mid-tier").toLowerCase();
  let engThreshold = 2000;
  if (tier.includes("macro")) engThreshold = 12000;
  else if (tier.includes("mid")) engThreshold = 4000;
  else if (tier.includes("micro")) engThreshold = 1000;
  else if (tier.includes("nano")) engThreshold = 300;
  const h2_pass = totalEng >= engThreshold;
  const h2_text = `${fmtNum(totalEng)} tương tác (Chuẩn: ≥${fmtNum(engThreshold)})`;

  // H3: Engagement Rate Benchmark (≥ 1.5%)
  const h3_pass = er >= 1.5;
  const h3_text = `ER: ${er.toFixed(2)}% (Chuẩn: ≥1.5%)`;

  // H4: Cost Efficiency (CPV ≤ 72đ)
  const h4_pass = cpv > 0 && cpv <= 72;
  const h4_text = cpv > 0 ? `CPV: ${cpv}đ (Chuẩn: ≤72đ)` : "Chưa có đủ view";

  // H5: Added Value FOC (Reup / Code Ads / Link Bio)
  const hasReup = Boolean(r.focReup || r.airedFb || (r.reupLink && r.reupLink.length > 3));
  const hasCodeAds = Boolean(r.focCodeAds || (r.addonFee && r.addonFee.toLowerCase().includes("code")));
  const hasLink = Boolean(r.focLink || (r.addonFee && r.addonFee.toLowerCase().includes("link")));
  const h5_pass = hasReup || hasCodeAds || hasLink;
  const focItems = [];
  if (hasReup) focItems.push("Reup");
  if (hasCodeAds) focItems.push("Code Ads");
  if (hasLink) focItems.push("Link Bio");
  const h5_text = focItems.length ? `Quyền lợi FOC: ${focItems.join(", ")}` : "Không có FOC";

  // H6: Organic KPI View (≥ 100%)
  const estView = Number(r.estView) || 0;
  const h6_pass = estView > 0 ? (views / estView) >= 0.95 : totalViews > 0;
  const pctOrg = estView > 0 ? Math.round((views / estView) * 100) : 100;
  const h6_text = `Đạt ${pctOrg}% KPI Organic (${fmtNum(views)}/${fmtNum(estView)})`;

  const hypotheses = [
    { id: "H1", code: "6s", title: "Placement ≤ 6s", pass: h1_pass, detail: h1_text },
    { id: "H2", code: "Eng", title: "Volume Eng", pass: h2_pass, detail: h2_text },
    { id: "H3", code: "ER", title: "ER ≥ 1.5%", pass: h3_pass, detail: h3_text },
    { id: "H4", code: "CPV", title: "CPV ≤ 72đ", pass: h4_pass, detail: h4_text },
    { id: "H5", code: "FOC", title: "Added Value FOC", pass: h5_pass, detail: h5_text },
    { id: "H6", code: "KPI", title: "Organic KPI ≥ 100%", pass: h6_pass, detail: h6_text }
  ];

  const score = hypotheses.filter(h => h.pass).length;
  let action = "CONSIDER";
  let reason = "Hiệu quả trung bình, cần tối ưu kịch bản & chi phí";
  if (score >= 5) {
    action = "CONTINUE";
    reason = "Đạt xuất sắc (CPV rẻ, Intent cao, có FOC)";
  } else if (score <= 2) {
    action = "STOP";
    reason = "CPV cao hoặc không đạt KPI cam kết";
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
}) {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [activeTab, setActiveTab] = useState("hypotheses"); // "hypotheses" | "funnel" | "matrix"
  const [filterAction, setFilterAction] = useState("all");

  const filteredRows = useMemo(() => {
    return data.filter(r => {
      if (selectedCampaign !== "all") {
        const camp = (r.campaign || "").trim();
        if (camp !== selectedCampaign && r.group !== selectedCampaign) return false;
      }
      return true;
    });
  }, [data, selectedCampaign]);

  const evaluatedRows = useMemo(() => {
    return filteredRows.map(r => ({
      ...r,
      eval: evaluateHypotheses(r)
    }));
  }, [filteredRows]);

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
    const avgCPV = totalViews > 0 ? Math.round(totalCost / totalViews) : 0;
    const avgER = totalViews > 0 ? ((totalEng / totalViews) * 100).toFixed(2) : "0.00";

    return {
      totalKOLs: evaluatedRows.length,
      totalCost,
      bookingBudget: Math.round(totalCost * 0.85),
      mediaBudget: Math.round(totalCost * 0.15),
      totalViews,
      totalOrganicViews,
      totalReupViews,
      totalPaidViews,
      totalEng,
      highIntentEng,
      totalLikes,
      totalComments,
      totalSaves,
      totalShares,
      avgCPV,
      avgER,
      continueCount,
      considerCount,
      stopCount
    };
  }, [evaluatedRows]);

  // Export sạch
  const handleExportFY26Template = () => {
    const headers1 = [
      "No.", "KOL", "Tier", "Followers", "Chi phí (VND)",
      "Món ăn", "Tuyến Creator", "Vùng miền", "KPI Organic View",
      "Organic View", "Reup View", "Paid View", "Tổng Views",
      "Likes", "Comments", "Saves", "Shares", "Tổng Tương tác",
      "ER (%)", "CPV (VND)", "FOC Quyền Lợi",
      "Điểm Đạt (0-6)", "Đánh Giá", "Lý do / Key Learning"
    ];

    const rows1 = evaluatedRows.map((r, i) => {
      const e = r.eval;
      const focList = [];
      if (r.focReup || r.airedFb) focList.push("Reup");
      if (r.focCodeAds) focList.push("Code Ads");
      if (r.focLink) focList.push("Link Bio");

      return [
        i + 1,
        r.kol || `KOL ${i + 1}`,
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
        focList.join(", ") || "Không",
        `${e.score}/6`,
        e.action,
        e.reason
      ];
    });

    const headers2 = [
      "No.", "KOL", "Tier", "Chi phí", 
      "H1 (6s Rule)", "H2 (Volume Eng)", "H3 (ER ≥ 1.5%)",
      "H4 (CPV ≤ 72đ)", "H5 (Added Value FOC)", "H6 (Organic KPI ≥ 100%)",
      "Tổng điểm", "Đánh giá"
    ];

    const rows2 = evaluatedRows.map((r, i) => {
      const e = r.eval;
      return [
        i + 1,
        r.kol,
        r.type || "",
        Number(r.cost) || 0,
        e.hypotheses[0].pass ? "Đạt" : "Không",
        e.hypotheses[1].pass ? "Đạt" : "Không",
        e.hypotheses[2].pass ? "Đạt" : "Không",
        e.hypotheses[3].pass ? "Đạt" : "Không",
        e.hypotheses[4].pass ? "Đạt" : "Không",
        e.hypotheses[5].pass ? "Đạt" : "Không",
        `${e.score}/6`,
        e.action
      ];
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers1, ...rows1]), "Detailed Perf (FY26)");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers2, ...rows2]), "Hypothesis Review");

    const fileName = `KOL_Report_FY26_${selectedCampaign === "all" ? "All" : selectedCampaign}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F8FAFC" }}>
      
      {/* ── TOP NAV BAR (Minimal & Flat) ── */}
      <div style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexShrink: 0
      }}>
        {/* Left: Campaign Picker */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.01em" }}>
            Báo Cáo FY26
          </span>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            style={{
              padding: "4px 10px",
              fontSize: 12,
              borderRadius: 6,
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#334155",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            <option value="all">Tất cả chiến dịch ({data.length} KOLs)</option>
            {dynamicCampaigns.map(c => (
              <option key={c.key} value={c.key}>
                {campaignLabels[c.key] || c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Center: Segment Tabs (Flat minimal) */}
        <div style={{ display: "flex", background: "#F1F5F9", padding: 2, borderRadius: 6 }}>
          {[
            { id: "hypotheses", label: "Ma trận 6 Giả thuyết" },
            { id: "funnel", label: "Phễu Ý định & 3 Tầng View" },
            { id: "matrix", label: "Món ăn & Creator" }
          ].map(t => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "5px 12px",
                  fontSize: 12,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#0F172A" : "#64748B",
                  background: active ? "#FFFFFF" : "transparent",
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer",
                  boxShadow: active ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                  transition: "all 0.15s ease"
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Right: Clean Export Button */}
        <button
          onClick={handleExportFY26Template}
          style={{
            padding: "5px 12px",
            fontSize: 12,
            fontWeight: 600,
            color: "#FFFFFF",
            background: "#0F172A",
            border: "none",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer"
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Xuất Excel FY26</span>
        </button>
      </div>

      {/* ── 4 KPI TILES (Clean & Compact) ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        padding: "14px 20px 0",
        flexShrink: 0
      }}>
        {/* Tile 1 */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>TỔNG NGÂN SÁCH</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginTop: 2 }}>{fmtVND(stats.totalCost)}</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
            Booking: {fmtVND(stats.bookingBudget)} · Media: {fmtVND(stats.mediaBudget)}
          </div>
        </div>

        {/* Tile 2 */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>TỔNG LƯỢT XEM</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginTop: 2 }}>{fmtNum(stats.totalViews)}</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
            Organic: {fmtNum(stats.totalOrganicViews)} · Reup: {fmtNum(stats.totalReupViews)}
          </div>
        </div>

        {/* Tile 3 */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>TƯƠNG TÁC Ý ĐỊNH (SAVE/SHARE)</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginTop: 2 }}>
            {fmtNum(stats.highIntentEng)} <span style={{ fontSize: 12, fontWeight: 500, color: "#64748B" }}>({stats.totalEng > 0 ? Math.round((stats.highIntentEng / stats.totalEng) * 100) : 0}%)</span>
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
            Saves: {fmtNum(stats.totalSaves)} · Shares: {fmtNum(stats.totalShares)}
          </div>
        </div>

        {/* Tile 4 */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>CPV & KẾT LUẬN</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: stats.avgCPV <= 72 ? "#16A34A" : "#D97706", marginTop: 2 }}>
            {stats.avgCPV} ₫ <span style={{ fontSize: 11, fontWeight: 500, color: "#64748B" }}>/ view</span>
          </div>
          <div style={{ fontSize: 11, marginTop: 2, display: "flex", gap: 6 }}>
            <span style={{ color: "#16A34A", fontWeight: 600 }}>{stats.continueCount} Tiếp tục</span>
            <span style={{ color: "#94A3B8" }}>·</span>
            <span style={{ color: "#D97706", fontWeight: 600 }}>{stats.considerCount} Cân nhắc</span>
            <span style={{ color: "#94A3B8" }}>·</span>
            <span style={{ color: "#DC2626", fontWeight: 600 }}>{stats.stopCount} Dừng</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT (Scrollable) ── */}
      <div className="kt-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "14px 20px 24px" }}>
        
        {/* =========================================================
            TAB 1: MA TRẬN 6 GIẢ THUYẾT (Clean Table)
        ========================================================= */}
        {activeTab === "hypotheses" && (
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, overflow: "hidden" }}>
            
            {/* Filter Bar inside Table */}
            <div style={{
              padding: "10px 14px",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#F8FAFC"
            }}>
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
                    style={{
                      padding: "3px 9px",
                      fontSize: 11,
                      fontWeight: filterAction === btn.id ? 600 : 500,
                      color: filterAction === btn.id ? "#0F172A" : "#64748B",
                      background: filterAction === btn.id ? "#FFFFFF" : "transparent",
                      border: filterAction === btn.id ? "1px solid #CBD5E1" : "1px solid transparent",
                      borderRadius: 4,
                      cursor: "pointer"
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              <div style={{ fontSize: 11, color: "#64748B" }}>
                Rê chuột vào chỉ số để xem chi tiết
              </div>
            </div>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", fontSize: 11 }}>
                  <th style={{ padding: "8px 12px", fontWeight: 600 }}>KOL / Kênh</th>
                  <th style={{ padding: "8px 12px", fontWeight: 600 }}>Món ăn</th>
                  <th style={{ padding: "8px 12px", fontWeight: 600 }}>Chi phí</th>
                  <th style={{ padding: "8px 12px", fontWeight: 600 }}>Lượt xem</th>
                  <th style={{ padding: "8px 12px", fontWeight: 600 }}>CPV</th>
                  <th style={{ padding: "8px 12px", fontWeight: 600, textAlign: "center" }}>6 Tiêu chí ($H_1 \to H_6$)</th>
                  <th style={{ padding: "8px 12px", fontWeight: 600, textAlign: "center" }}>Điểm</th>
                  <th style={{ padding: "8px 12px", fontWeight: 600, textAlign: "right" }}>Kết luận</th>
                </tr>
              </thead>
              <tbody>
                {evaluatedRows
                  .filter(r => filterAction === "all" || r.eval.action === filterAction)
                  .map((r, idx) => {
                    const e = r.eval;
                    return (
                      <tr
                        key={r.id || idx}
                        style={{
                          borderBottom: "1px solid #F1F5F9",
                          transition: "background 0.1s"
                        }}
                      >
                        {/* KOL */}
                        <td style={{ padding: "8px 12px" }}>
                          <span
                            onClick={() => onOpenProfile && onOpenProfile(r)}
                            style={{ fontWeight: 600, color: "#0F172A", cursor: "pointer", textDecoration: "underline" }}
                          >
                            {r.kol}
                          </span>
                          <span style={{ fontSize: 10, color: "#94A3B8", marginLeft: 6 }}>{r.type || "Mid"}</span>
                        </td>

                        {/* Món ăn */}
                        <td style={{ padding: "8px 12px", color: "#334155", maxWidth: 220 }}>
                          <span title={r.monAn}>{cleanDish(r.monAn)}</span>
                        </td>

                        {/* Chi phí */}
                        <td style={{ padding: "8px 12px", color: "#0F172A", fontWeight: 500 }}>
                          {fmtVND(r.cost)}
                        </td>

                        {/* Views */}
                        <td style={{ padding: "8px 12px", color: "#334155" }}>
                          {fmtNum(e.totalViews)}
                        </td>

                        {/* CPV */}
                        <td style={{ padding: "8px 12px", fontWeight: 600, color: e.cpv <= 72 ? "#16A34A" : "#D97706" }}>
                          {e.cpv > 0 ? `${e.cpv} ₫` : "—"}
                        </td>

                        {/* 6 Hypotheses Mini Dots with detail tooltip */}
                        <td style={{ padding: "8px 12px", textAlign: "center" }}>
                          <div style={{ display: "inline-flex", gap: 4 }}>
                            {e.hypotheses.map(h => (
                              <div
                                key={h.id}
                                title={`${h.title}: ${h.detail}`}
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  background: h.pass ? "#16A34A" : "#E2E8F0",
                                  cursor: "help"
                                }}
                              />
                            ))}
                          </div>
                        </td>

                        {/* Score */}
                        <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, color: e.score >= 5 ? "#16A34A" : e.score >= 3 ? "#D97706" : "#DC2626" }}>
                          {e.score}/6
                        </td>

                        {/* Action Badge */}
                        <td style={{ padding: "8px 12px", textAlign: "right" }}>
                          <span style={{
                            padding: "2px 6px",
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 600,
                            background: e.action === "CONTINUE" ? "#DCFCE7" : e.action === "CONSIDER" ? "#FEF3C7" : "#FEE2E2",
                            color: e.action === "CONTINUE" ? "#166534" : e.action === "CONSIDER" ? "#92400E" : "#991B1B"
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
        )}

        {/* =========================================================
            TAB 2: PHỄU Ý ĐỊNH & 3 TẦNG VIEW (Minimal)
        ========================================================= */}
        {activeTab === "funnel" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            
            {/* Phễu Ý Định */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "16px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>
                Phễu Ý Định Sử Dụng (Intent Funnel)
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "#64748B" }}>Tương tác bề nổi (Likes & Comments)</span>
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>{fmtNum(stats.totalLikes + stats.totalComments)}</span>
                </div>
                <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${stats.totalEng > 0 ? ((stats.totalLikes + stats.totalComments) / stats.totalEng) * 100 : 0}%`, height: "100%", background: "#94A3B8" }} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "#16A34A", fontWeight: 600 }}>Ý định nấu ăn cao (Saves & Shares)</span>
                  <span style={{ fontWeight: 700, color: "#16A34A" }}>{fmtNum(stats.highIntentEng)}</span>
                </div>
                <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${stats.totalEng > 0 ? (stats.highIntentEng / stats.totalEng) * 100 : 0}%`, height: "100%", background: "#16A34A" }} />
                </div>
              </div>

              <div style={{ fontSize: 11, color: "#64748B", background: "#F8FAFC", padding: 10, borderRadius: 6, lineHeight: 1.5 }}>
                💡 <strong>Insight Nhân Quả:</strong> Nhóm KOL dạy nấu ăn làm giảm 20% like thông thường nhưng tăng <strong>300% lượng lưu công thức (Save)</strong>, chứng minh ý định sử dụng sản phẩm thực tế tăng lên.
              </div>
            </div>

            {/* Cơ Cấu 3 Tầng View */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "16px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>
                Cơ Cấu 3 Tầng View
              </div>

              <div style={{ height: 10, background: "#F1F5F9", borderRadius: 5, overflow: "hidden", display: "flex", marginBottom: 14 }}>
                <div style={{ width: `${stats.totalViews > 0 ? (stats.totalOrganicViews / stats.totalViews) * 100 : 0}%`, background: "#0F172A" }} title="Organic" />
                <div style={{ width: `${stats.totalViews > 0 ? (stats.totalReupViews / stats.totalViews) * 100 : 0}%`, background: "#16A34A" }} title="FOC Reup" />
                <div style={{ width: `${stats.totalViews > 0 ? (stats.totalPaidViews / stats.totalViews) * 100 : 0}%`, background: "#3B82F6" }} title="Paid Ads" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 11 }}>
                <div style={{ background: "#F8FAFC", padding: 8, borderRadius: 6 }}>
                  <div style={{ color: "#64748B" }}>Organic TikTok</div>
                  <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 13, marginTop: 2 }}>{fmtNum(stats.totalOrganicViews)}</div>
                </div>
                <div style={{ background: "#F8FAFC", padding: 8, borderRadius: 6 }}>
                  <div style={{ color: "#16A34A" }}>FOC Reup (FB/YT)</div>
                  <div style={{ fontWeight: 700, color: "#16A34A", fontSize: 13, marginTop: 2 }}>{fmtNum(stats.totalReupViews)}</div>
                </div>
                <div style={{ background: "#F8FAFC", padding: 8, borderRadius: 6 }}>
                  <div style={{ color: "#3B82F6" }}>Paid Spark Ads</div>
                  <div style={{ fontWeight: 700, color: "#3B82F6", fontSize: 13, marginTop: 2 }}>{fmtNum(stats.totalPaidViews)}</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================
            TAB 3: MÓN ĂN & CREATOR (Minimal)
        ========================================================= */}
        {activeTab === "matrix" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            
            {/* Cooking vs Mom */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "16px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>
                Cooking Specialist vs Mom & Family
              </div>
              <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>
                • <strong>Cooking Specialist:</strong> Giữ chân tốt trong 6s đầu nhờ hình ảnh món ăn sôi bọt hấp dẫn. Lượng Save công thức cao nhất.<br />
                • <strong>Mom & Family:</strong> Reach rộng nhưng cần tránh ép kịch bản thương mại quá dài để hạn chế tụt view sớm.
              </div>
            </div>

            {/* Món Canh vs Nộm */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "16px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>
                Món Canh/Nước vs Món Nộm/Salad
              </div>
              <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>
                • <strong>Món Canh / Lẩu / Nước:</strong> Đạt 95% KPI, gắn chặt với bữa cơm hàng ngày của gia đình Việt.<br />
                • <strong>Món Nộm / Salad:</strong> Gặp rào cản hành vi do người dùng thắc mắc việc dùng chanh thay giấm.
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
