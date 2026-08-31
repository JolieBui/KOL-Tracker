import React, { useState, useMemo } from "react";

/* =========================================================================
   PROJECT 1: [MSG] BỘT NGỌT — QUANTITATIVE METRICS
   ========================================================================= */
const MSG_DATA = {
  key: "MSG",
  name: "[MSG] Bột Ngọt",
  stats: {
    kolsCount: 25,
    totalViews: 20000000,
    organicViews: 8830000,
    targetViews: 8150000,
    lyViews: 7492067,
    pctVsTargetViews: "+8.3%",
    pctVsLYViews: "+17.9%",

    actualCPV: 42.01,
    targetCPV: 65.0,
    lyCPV: 52.0,
    pctVsTargetCPV: "-35.4%",
    pctVsLYCPV: "-19.2%",

    totalBudget: 720182071,
    targetBudget: 144722071,
    lyBudget: 501715977,
    bookingCost: 500400000,
    mediaSpend: 219782071,
    pctVsLYBudget: "+43.5%",

    totalEng: 325000,
    organicEng: 244000,
    targetEng: 263622,
    lyEng: 340531,
    pctVsTargetEng: "-7.5%",
    pctVsLYEng: "-28.4%",
    sharesGrowth: "+52.0%",
    savesGrowth: "+21.0%",

    avgWatchTime: "7.2s",
    targetWatchTime: "6.0s",
    lyWatchTime: "20.8s",
    vtr: "3.78%",
    reupViews: 1202000,
    reupShare: "14.5%",
    focRatio: "20/25 KOLs"
  },
  kols: [
    { id: "M1", kol: "Min Cookie", type: "Mid-tier", followers: "794.7K", cost: 28000000, targetViews: 500000, organicViews: 520000, reupViews: 85000, totalViews: 605000, targetEng: 4600, actualEng: 24200, avgTime: 7.8, cpv: 35.2, mediaSpend: 0 },
    { id: "M2", kol: "Bon đây nè", type: "Macro", followers: "1.6M", cost: 34000000, targetViews: 800000, organicViews: 820000, reupViews: 95000, totalViews: 915000, targetEng: 13000, actualEng: 34000, avgTime: 7.5, cpv: 40.1, mediaSpend: 0 },
    { id: "M3", kol: "Ăn gì Thương ơi", type: "Mid-tier", followers: "522.0K", cost: 15400000, targetViews: 400000, organicViews: 860000, reupViews: 120000, totalViews: 980000, targetEng: 9700, actualEng: 36500, avgTime: 8.4, cpv: 38.5, mediaSpend: 0 },
    { id: "M4", kol: "Khánh Linh", type: "Macro", followers: "1.1M", cost: 15000000, targetViews: 400000, organicViews: 430000, reupViews: 60000, totalViews: 490000, targetEng: 1500, actualEng: 19800, avgTime: 7.1, cpv: 39.0, mediaSpend: 0 },
    { id: "M5", kol: "taydayroi", type: "Micro", followers: "105.4K", cost: 15000000, targetViews: 50000, organicViews: 65000, reupViews: 15000, totalViews: 80000, targetEng: 5400, actualEng: 4200, avgTime: 37.8, cpv: 41.0, mediaSpend: 0 },
    { id: "M6", kol: "Babykopo Home", type: "Macro", followers: "6.7M", cost: 35000000, targetViews: 500000, organicViews: 890000, reupViews: 110000, totalViews: 1000000, targetEng: 37300, actualEng: 42000, avgTime: 7.2, cpv: 41.0, mediaSpend: 5000000 },
    { id: "M7", kol: "Chú Đàn", type: "Micro", followers: "368.5K", cost: 35000000, targetViews: 200000, organicViews: 225000, reupViews: 30000, totalViews: 255000, targetEng: 31000, actualEng: 32500, avgTime: 6.8, cpv: 41.5, mediaSpend: 0 },
    { id: "M8", kol: "Thi Thi Miền Tây", type: "Mid-tier", followers: "730.4K", cost: 15000000, targetViews: 400000, organicViews: 420000, reupViews: 50000, totalViews: 470000, targetEng: 15000, actualEng: 16200, avgTime: 6.7, cpv: 40.2, mediaSpend: 0 },
    { id: "M9", kol: "let Nhân cook", type: "Mid-tier", followers: "516.6K", cost: 30000000, targetViews: 300000, organicViews: 340000, reupViews: 40000, totalViews: 380000, targetEng: 3000, actualEng: 8500, avgTime: 6.9, cpv: 41.8, mediaSpend: 0 },
    { id: "M10", kol: "Sườn Sóc Homie", type: "Mid-tier", followers: "555.0K", cost: 35000000, targetViews: 300000, organicViews: 330000, reupViews: 35000, totalViews: 365000, targetEng: 3000, actualEng: 9200, avgTime: 6.6, cpv: 42.0, mediaSpend: 0 },
    { id: "M11", kol: "Châu Kiều My", type: "Mid-tier", followers: "565.1K", cost: 8000000, targetViews: 400000, organicViews: 450000, reupViews: 45000, totalViews: 495000, targetEng: 20000, actualEng: 22400, avgTime: 7.1, cpv: 39.5, mediaSpend: 0 },
    { id: "M12", kol: "Quân Cooking", type: "Micro", followers: "147.6K", cost: 8000000, targetViews: 200000, organicViews: 235000, reupViews: 25000, totalViews: 260000, targetEng: 1500, actualEng: 5800, avgTime: 6.8, cpv: 39.0, mediaSpend: 0 },
    { id: "M13", kol: "My Huyền", type: "Mid-tier", followers: "511.2K", cost: 15000000, targetViews: 400000, organicViews: 440000, reupViews: 40000, totalViews: 480000, targetEng: 330, actualEng: 7200, avgTime: 6.5, cpv: 40.5, mediaSpend: 0 },
    { id: "M14", kol: "Nấu Ăn Dễ Lắm", type: "Micro", followers: "407.1K", cost: 5000000, targetViews: 200000, organicViews: 245000, reupViews: 28000, totalViews: 273000, targetEng: 1000, actualEng: 8900, avgTime: 7.0, cpv: 37.8, mediaSpend: 0 },
    { id: "M15", kol: "Hảo Thích Vào Bếp", type: "Micro", followers: "207.6K", cost: 10000000, targetViews: 200000, organicViews: 230000, reupViews: 25000, totalViews: 255000, targetEng: 150, actualEng: 6400, avgTime: 7.3, cpv: 39.2, mediaSpend: 0 },
    { id: "M16", kol: "Bếp Nga Nè", type: "Nano", followers: "47.8K", cost: 5000000, targetViews: 50000, organicViews: 95000, reupViews: 15000, totalViews: 110000, targetEng: 132, actualEng: 2100, avgTime: 7.0, cpv: 38.9, mediaSpend: 0 },
    { id: "M17", kol: "Mai Hà thích nấu ăn", type: "Nano", followers: "78.4K", cost: 15000000, targetViews: 50000, organicViews: 94000, reupViews: 12000, totalViews: 106000, targetEng: 4900, actualEng: 5200, avgTime: 6.8, cpv: 41.0, mediaSpend: 0 },
    { id: "M18", kol: "Cơm nhà Bông", type: "Micro", followers: "223.2K", cost: 5000000, targetViews: 200000, organicViews: 220000, reupViews: 20000, totalViews: 240000, targetEng: 300, actualEng: 4800, avgTime: 6.5, cpv: 39.5, mediaSpend: 0 },
    { id: "M19", kol: "Nhi say Hi", type: "Micro", followers: "282.7K", cost: 15000000, targetViews: 200000, organicViews: 210000, reupViews: 22000, totalViews: 232000, targetEng: 150, actualEng: 3900, avgTime: 6.4, cpv: 42.0, mediaSpend: 0 },
    { id: "M20", kol: "Út Tình", type: "Micro", followers: "242.8K", cost: 15000000, targetViews: 200000, organicViews: 215000, reupViews: 20000, totalViews: 235000, targetEng: 3900, actualEng: 4600, avgTime: 6.5, cpv: 41.8, mediaSpend: 0 },
    { id: "M21", kol: "Bùi Khánh Hà", type: "Micro", followers: "180.0K", cost: 30000000, targetViews: 200000, organicViews: 185000, reupViews: 15000, totalViews: 200000, targetEng: 50, actualEng: 1800, avgTime: 6.0, cpv: 49.5, mediaSpend: 4200000 },
    { id: "M22", kol: "Gia đình Sầu", type: "Micro", followers: "178.7K", cost: 15000000, targetViews: 200000, organicViews: 190000, reupViews: 18000, totalViews: 208000, targetEng: 31000, actualEng: 12800, avgTime: 6.0, cpv: 51.0, mediaSpend: 3500000 },
    { id: "M23", kol: "Mẹ Bảo Bối", type: "Micro", followers: "217.1K", cost: 15000000, targetViews: 200000, organicViews: 192000, reupViews: 16000, totalViews: 208000, targetEng: 110, actualEng: 2200, avgTime: 6.0, cpv: 50.2, mediaSpend: 2800000 },
    { id: "M24", kol: "Emmer Sweet", type: "Mid-tier", followers: "784.7K", cost: 44000000, targetViews: 1000000, organicViews: 631000, reupViews: 75000, totalViews: 706000, targetEng: 18200, actualEng: 23000, avgTime: 6.2, cpv: 46.2, mediaSpend: 8600000 },
    { id: "M25", kol: "Trang Tấm", type: "Mid-tier", followers: "696.4K", cost: 38000000, targetViews: 600000, organicViews: 662000, reupViews: 80000, totalViews: 742000, targetEng: 48400, actualEng: 36200, avgTime: 6.1, cpv: 48.0, mediaSpend: 6800000 }
  ]
};

/* =========================================================================
   PROJECT 2: VINEGAR (GIẤM GẠO) — QUANTITATIVE METRICS
   ========================================================================= */
const VINEGAR_DATA = {
  key: "VINEGAR",
  name: "VINEGAR Giấm Gạo",
  stats: {
    kolsCount: 10,
    totalViews: 7400000,
    organicViews: 2076777,
    targetViews: 2900000,
    lyViews: 4048198,
    pctVsTargetViews: "71.6%",
    pctVsLYViews: "-48.7%",

    actualCPV: 45.0,
    targetCPV: 85.0,
    lyCPV: 75.0,
    pctVsTargetCPV: "-47.1%",
    pctVsLYCPV: "-40.0%",

    totalBudget: 178000000,
    targetBudget: 178000000,
    lyBudget: 324000000,
    bookingCost: 178000000,
    mediaSpend: 0,
    pctVsLYBudget: "-58.0%",

    totalEng: 100000,
    organicEng: 71021,
    targetEng: 114000,
    lyEng: 170655,
    pctVsTargetEng: "62.3%",
    pctVsLYEng: "-58.4%",
    sharesGrowth: "-67.3%",
    savesGrowth: "+68.0% (Trang Tấm)",

    avgWatchTime: "2m15s",
    targetWatchTime: "1m30s",
    lyWatchTime: "2m00s",
    vtr: "3.50%",
    reupViews: 1153000,
    reupShare: "35.6%",
    focRatio: "9/10 KOLs"
  },
  kols: [
    { id: "V1", kol: "Trang Tấm", type: "Mid-tier", followers: "699.2K", cost: 38000000, targetViews: 600000, organicViews: 718000, reupViews: 120000, totalViews: 838000, targetEng: 30000, actualEng: 48970, avgTime: 169, cpv: 38.0, mediaSpend: 0 },
    { id: "V2", kol: "Khánh Linh", type: "Macro", followers: "1.1M", cost: 25000000, targetViews: 400000, organicViews: 341329, reupViews: 60000, totalViews: 401329, targetEng: 15000, actualEng: 2449, avgTime: 88, cpv: 42.0, mediaSpend: 0 },
    { id: "V3", kol: "Linh nấu", type: "Mid-tier", followers: "513.6K", cost: 18000000, targetViews: 300000, organicViews: 283832, reupViews: 45000, totalViews: 328832, targetEng: 12000, actualEng: 2276, avgTime: 105, cpv: 41.5, mediaSpend: 0 },
    { id: "V4", kol: "My Huyền", type: "Micro", followers: "148.2K", cost: 12000000, targetViews: 200000, organicViews: 195569, reupViews: 30000, totalViews: 225569, targetEng: 8000, actualEng: 3784, avgTime: 91, cpv: 43.0, mediaSpend: 0 },
    { id: "V5", kol: "Châu Kiều My", type: "Mid-tier", followers: "560.6K", cost: 18000000, targetViews: 300000, organicViews: 179723, reupViews: 35000, totalViews: 214723, targetEng: 10000, actualEng: 5494, avgTime: 128, cpv: 44.0, mediaSpend: 0 },
    { id: "V6", kol: "Nông Thôn Mới", type: "Micro", followers: "277.4K", cost: 12000000, targetViews: 200000, organicViews: 123992, reupViews: 25000, totalViews: 148992, targetEng: 6000, actualEng: 461, avgTime: 149, cpv: 45.0, mediaSpend: 0 },
    { id: "V7", kol: "Ăn gì Thương ơi", type: "Mid-tier", followers: "521.3K", cost: 15000000, targetViews: 250000, organicViews: 98667, reupViews: 20000, totalViews: 118667, targetEng: 8000, actualEng: 2226, avgTime: 196, cpv: 46.0, mediaSpend: 0 },
    { id: "V8", kol: "TOE NẤU GÌ ĐÓ", type: "Micro", followers: "287.6K", cost: 12000000, targetViews: 200000, organicViews: 65663, reupViews: 15000, totalViews: 80663, targetEng: 7000, actualEng: 2391, avgTime: 132, cpv: 48.0, mediaSpend: 0 },
    { id: "V9", kol: "Nấu Ăn Dễ Lắm", type: "Micro", followers: "407.2K", cost: 8000000, targetViews: 150000, organicViews: 37429, reupViews: 10000, totalViews: 47429, targetEng: 5000, actualEng: 1101, avgTime: 93, cpv: 49.0, mediaSpend: 0 },
    { id: "V10", kol: "Cơm nhà bếp xưa", type: "Nano", followers: "24.4K", cost: 5000000, targetViews: 100000, organicViews: 32573, reupViews: 8000, totalViews: 40573, targetEng: 3000, actualEng: 1871, avgTime: 209, cpv: 47.0, mediaSpend: 0 }
  ]
};

export default function DashboardView({ onOpen = () => {} }) {
  const [activeProject, setActiveProject] = useState("MSG");
  const [activeTab, setActiveTab] = useState("charts"); // "charts" | "table"
  const [sortField, setSortField] = useState("totalViews");
  const [sortAsc, setSortAsc] = useState(false);

  const data = activeProject === "MSG" ? MSG_DATA : VINEGAR_DATA;
  const s = data.stats;

  // Sorting
  const sortedKols = useMemo(() => {
    let list = [...data.kols];
    list.sort((a, b) => {
      let vA = a[sortField];
      let vB = b[sortField];
      if (sortField === "pctKPI") {
        vA = (a.totalViews / a.targetViews) * 100;
        vB = (b.totalViews / b.targetViews) * 100;
      }
      if (typeof vA === "string") return sortAsc ? vA.localeCompare(vB, "vi") : vB.localeCompare(vA, "vi");
      return sortAsc ? (vA - vB) : (vB - vA);
    });
    return list;
  }, [data, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "var(--surface)", padding: "16px 20px", gap: 14 }}>
      
      {/* ── TOP SWITCHER: 2 DỰ ÁN & SUB-VIEWS ── */}
      <div style={{ 
        background: "var(--card)", 
        borderRadius: 14, 
        border: "1px solid var(--rule)", 
        padding: "10px 16px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexWrap: "wrap", 
        gap: 10
      }}>
        {/* Project Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase" }}>DỰ ÁN:</span>
          <div style={{ display: "flex", gap: 4, background: "var(--paper)", padding: 3, borderRadius: 16, border: "1px solid var(--rule)" }}>
            <button 
              onClick={() => setActiveProject("MSG")}
              style={{
                padding: "5px 14px",
                borderRadius: 14,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                background: activeProject === "MSG" ? "var(--ok)" : "transparent",
                color: activeProject === "MSG" ? "#fff" : "var(--ink)",
                transition: "all 0.15s"
              }}
            >
              🧂 [MSG] Bột Ngọt (25 KOLs)
            </button>
            <button 
              onClick={() => setActiveProject("VINEGAR")}
              style={{
                padding: "5px 14px",
                borderRadius: 14,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                background: activeProject === "VINEGAR" ? "var(--blue)" : "transparent",
                color: activeProject === "VINEGAR" ? "#fff" : "var(--ink)",
                transition: "all 0.15s"
              }}
            >
              🍶 VINEGAR Giấm Gạo (10 KOLs)
            </button>
          </div>
        </div>

        {/* View mode */}
        <div style={{ display: "flex", gap: 4, background: "var(--paper)", padding: 3, borderRadius: 10, border: "1px solid var(--rule)" }}>
          <button 
            className={`kt-btn ${activeTab === "charts" ? "kt-btn-primary" : "kt-btn-ghost"}`}
            style={{ padding: "5px 12px", fontSize: 11, borderRadius: 8 }}
            onClick={() => setActiveTab("charts")}
          >
            📊 Biểu Đồ Số Liệu
          </button>
          <button 
            className={`kt-btn ${activeTab === "table" ? "kt-btn-primary" : "kt-btn-ghost"}`}
            style={{ padding: "5px 12px", fontSize: 11, borderRadius: 8 }}
            onClick={() => setActiveTab("table")}
          >
            📋 Bảng Số Liệu KOLs ({data.kols.length})
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: PURE NUMERICAL & VISUAL CHARTS
         ========================================================================= */}
      {activeTab === "charts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          
          {/* 4 CORE KPI METRIC CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            
            {/* Total Views Card */}
            <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--rule)", padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-soft)", fontWeight: 700 }}>
                <span>TỔNG LƯỢT XEM</span>
                <span className="kt-badge" style={{ background: "var(--ok-bg)", color: "var(--ok)" }}>{s.pctVsTargetViews} KPI</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--ink)", fontFamily: "'IBM Plex Mono', monospace", margin: "4px 0" }}>
                {(s.totalViews / 1000000).toFixed(1)}M
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-mid)", display: "flex", justifyContent: "space-between" }}>
                <span>Org: <strong>{(s.organicViews / 1000000).toFixed(2)}M</strong></span>
                <span>Target: <strong>{(s.targetViews / 1000000).toFixed(2)}M</strong></span>
                <span>LY: <strong>{(s.lyViews / 1000000).toFixed(2)}M</strong></span>
              </div>
            </div>

            {/* CPV 6s Card */}
            <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--rule)", padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-soft)", fontWeight: 700 }}>
                <span>CPV 6S (Đ/VIEW)</span>
                <span className="kt-badge" style={{ background: "var(--ok-bg)", color: "var(--ok)" }}>{s.pctVsTargetCPV}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--ok)", fontFamily: "'IBM Plex Mono', monospace", margin: "4px 0" }}>
                {s.actualCPV}đ
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-mid)", display: "flex", justifyContent: "space-between" }}>
                <span>Target: <strong>{s.targetCPV}đ</strong></span>
                <span>LY: <strong>{s.lyCPV}đ</strong></span>
                <span>vs LY: <strong>{s.pctVsLYCPV}</strong></span>
              </div>
            </div>

            {/* Total Budget Card */}
            <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--rule)", padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-soft)", fontWeight: 700 }}>
                <span>TỔNG NGÂN SÁCH</span>
                <span className="kt-badge" style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>{s.kolsCount} KOLs</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--ink)", fontFamily: "'IBM Plex Mono', monospace", margin: "4px 0" }}>
                {(s.totalBudget / 1000000).toFixed(1)}M
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-mid)", display: "flex", justifyContent: "space-between" }}>
                <span>Booking: <strong>{(s.bookingCost / 1000000).toFixed(1)}M</strong></span>
                <span>LY: <strong>{(s.lyBudget / 1000000).toFixed(1)}M</strong></span>
              </div>
            </div>

            {/* Engagement Card */}
            <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--rule)", padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-soft)", fontWeight: 700 }}>
                <span>TỔNG TƯƠNG TÁC</span>
                <span className="kt-badge" style={{ background: "var(--paper)", color: "var(--ink)" }}>{s.pctVsTargetEng}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--ink)", fontFamily: "'IBM Plex Mono', monospace", margin: "4px 0" }}>
                {(s.totalEng / 1000).toFixed(1)}K
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-mid)", display: "flex", justifyContent: "space-between" }}>
                <span>Org: <strong>{(s.organicEng / 1000).toFixed(1)}K</strong></span>
                <span>LY: <strong>{(s.lyEng / 1000).toFixed(1)}K</strong></span>
              </div>
            </div>

          </div>

          {/* 2 SIDE-BY-SIDE VISUAL COMPARISON CHARTS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 14 }}>
            
            {/* CHART 1: TOTAL VIEWS (ACTUAL vs TARGET vs LY) */}
            <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--rule)", padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span className="kt-caps" style={{ color: "var(--ink-soft)" }}>SO SÁNH LƯỢT XEM (VIEWS)</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ok)" }}>YoY: {s.pctVsLYViews}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Actual Organic */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                    <span style={{ color: "var(--ok)" }}>Thực tế (Organic FY26)</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--ok)" }}>{(s.organicViews / 1000000).toFixed(2)}M</span>
                  </div>
                  <div style={{ height: 16, background: "var(--surface)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (s.organicViews / Math.max(s.organicViews, s.targetViews, s.lyViews)) * 100)}%`, height: "100%", background: "var(--ok)", borderRadius: 8 }} />
                  </div>
                </div>

                {/* Target */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                    <span style={{ color: "var(--accent)" }}>Mục tiêu (Target)</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{(s.targetViews / 1000000).toFixed(2)}M</span>
                  </div>
                  <div style={{ height: 16, background: "var(--surface)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (s.targetViews / Math.max(s.organicViews, s.targetViews, s.lyViews)) * 100)}%`, height: "100%", background: "var(--accent)", borderRadius: 8 }} />
                  </div>
                </div>

                {/* LY */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                    <span style={{ color: "var(--ink-soft)" }}>Năm trước (LY FY25)</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{(s.lyViews / 1000000).toFixed(2)}M</span>
                  </div>
                  <div style={{ height: 16, background: "var(--surface)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (s.lyViews / Math.max(s.organicViews, s.targetViews, s.lyViews)) * 100)}%`, height: "100%", background: "#CBD5E1", borderRadius: 8 }} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px dashed var(--rule)", display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span>📱 TT Organic: <strong>{(s.organicViews / 1000000).toFixed(2)}M</strong></span>
                <span>🌐 FB Reup: <strong>{(s.reupViews / 1000000).toFixed(2)}M</strong></span>
                <span>🏆 Total: <strong>{(s.totalViews / 1000000).toFixed(1)}M</strong></span>
              </div>
            </div>

            {/* CHART 2: COST PER VIEW (CPV 6S) */}
            <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--rule)", padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span className="kt-caps" style={{ color: "var(--ink-soft)" }}>SO SÁNH CHI PHÍ / VIEW 6S (CPV)</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ok)" }}>{s.pctVsTargetCPV}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Actual CPV */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                    <span style={{ color: "var(--ok)" }}>Thực tế FY26 (Thấp nhất)</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--ok)" }}>{s.actualCPV}đ</span>
                  </div>
                  <div style={{ height: 16, background: "var(--surface)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ width: `${(s.actualCPV / s.targetCPV) * 100}%`, height: "100%", background: "var(--ok)", borderRadius: 8 }} />
                  </div>
                </div>

                {/* LY CPV */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                    <span style={{ color: "var(--ink-soft)" }}>Năm trước (LY FY25)</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{s.lyCPV}đ</span>
                  </div>
                  <div style={{ height: 16, background: "var(--surface)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ width: `${(s.lyCPV / s.targetCPV) * 100}%`, height: "100%", background: "#CBD5E1", borderRadius: 8 }} />
                  </div>
                </div>

                {/* Target CPV */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                    <span style={{ color: "var(--accent)" }}>Mục tiêu trần (Target Max)</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{s.targetCPV}đ</span>
                  </div>
                  <div style={{ height: 16, background: "var(--surface)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", background: "var(--accent)", borderRadius: 8 }} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px dashed var(--rule)", display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span>🎯 Giảm vs Target: <strong>{(s.targetCPV - s.actualCPV).toFixed(1)}đ/view</strong></span>
                <span>🎁 FOC Reup & Ads: <strong>{s.focRatio}</strong></span>
              </div>
            </div>

          </div>

          {/* SUMMARY DATA MATRIX TABLE */}
          <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--rule)", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--rule)" }}>
              <span className="kt-caps" style={{ color: "var(--ink-soft)" }}>BẢNG MA TRẬN ĐỐI CHIẾU CHỈ SỐ ({data.name})</span>
            </div>
            <table className="kt-table" style={{ width: "100%", fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Chỉ số</th>
                  <th style={{ textAlign: "right" }}>Target (Kế hoạch)</th>
                  <th style={{ textAlign: "right" }}>LY (Năm trước)</th>
                  <th style={{ textAlign: "right" }}>Actual (Thực tế)</th>
                  <th style={{ textAlign: "center" }}>% vs Target</th>
                  <th style={{ textAlign: "center" }}>% vs LY (YoY)</th>
                  <th style={{ textAlign: "right" }}>Chênh lệch (+/-)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 700 }}>Total Views (kèm Reup)</td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{s.targetViews.toLocaleString()}</td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{s.lyViews.toLocaleString()}</td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "var(--ok)" }}>{s.totalViews.toLocaleString()}</td>
                  <td style={{ textAlign: "center" }}><span className="kt-badge" style={{ background: "var(--ok-bg)", color: "var(--ok)" }}>{s.pctVsTargetViews}</span></td>
                  <td style={{ textAlign: "center" }}><span className="kt-badge" style={{ background: "var(--ok-bg)", color: "var(--ok)" }}>{s.pctVsLYViews}</span></td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "var(--ok)" }}>+{(s.totalViews - s.targetViews).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>CPV 6s (đ/view)</td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{s.targetCPV.toFixed(1)}đ</td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{s.lyCPV.toFixed(1)}đ</td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "var(--ok)" }}>{s.actualCPV.toFixed(2)}đ</td>
                  <td style={{ textAlign: "center" }}><span className="kt-badge" style={{ background: "var(--ok-bg)", color: "var(--ok)" }}>{s.pctVsTargetCPV}</span></td>
                  <td style={{ textAlign: "center" }}><span className="kt-badge" style={{ background: "var(--ok-bg)", color: "var(--ok)" }}>{s.pctVsLYCPV}</span></td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "var(--ok)" }}>-{(s.targetCPV - s.actualCPV).toFixed(2)}đ</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Budget (VNĐ)</td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{s.targetBudget.toLocaleString()}đ</td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{s.lyBudget.toLocaleString()}đ</td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800 }}>{s.totalBudget.toLocaleString()}đ</td>
                  <td style={{ textAlign: "center" }}><span className="kt-badge" style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>100%</span></td>
                  <td style={{ textAlign: "center" }}><span className="kt-badge" style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>{s.pctVsLYBudget}</span></td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>+{(s.totalBudget - s.lyBudget).toLocaleString()}đ</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Organic Engagement</td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{s.targetEng.toLocaleString()}</td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{s.lyEng.toLocaleString()}</td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800 }}>{s.organicEng.toLocaleString()}</td>
                  <td style={{ textAlign: "center" }}><span className="kt-badge" style={{ background: "var(--paper)", color: "var(--ink)" }}>{s.pctVsTargetEng}</span></td>
                  <td style={{ textAlign: "center" }}><span className="kt-badge" style={{ background: "var(--danger-bg)", color: "var(--danger)" }}>{s.pctVsLYEng}</span></td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "var(--danger)" }}>{(s.organicEng - s.lyEng).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW 2: FULL DATA TABLE (NUMBERS ONLY)
         ========================================================================= */}
      {activeTab === "table" && (
        <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--rule)", overflow: "hidden" }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="kt-caps" style={{ color: "var(--ink-soft)" }}>BẢNG SỐ LIỆU CHI TIẾT TỪNG KOL ({sortedKols.length} KOLs)</span>
            <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>Click tiêu đề cột để sắp xếp</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="kt-table" style={{ width: "100%", fontSize: 12 }}>
              <thead>
                <tr>
                  <th onClick={() => handleSort("kol")} style={{ cursor: "pointer" }}>
                    Tên KOL {sortField === "kol" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th>Tier</th>
                  <th>Followers</th>
                  <th onClick={() => handleSort("cost")} style={{ textAlign: "right", cursor: "pointer" }}>
                    Cost {sortField === "cost" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("targetViews")} style={{ textAlign: "right", cursor: "pointer" }}>
                    Target View {sortField === "targetViews" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("organicViews")} style={{ textAlign: "right", cursor: "pointer" }}>
                    Organic View {sortField === "organicViews" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("reupViews")} style={{ textAlign: "right", cursor: "pointer" }}>
                    FB Reup {sortField === "reupViews" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("totalViews")} style={{ textAlign: "right", cursor: "pointer" }}>
                    Total View {sortField === "totalViews" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("pctKPI")} style={{ textAlign: "center", cursor: "pointer" }}>
                    % KPI {sortField === "pctKPI" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("actualEng")} style={{ textAlign: "right", cursor: "pointer" }}>
                    Engagement {sortField === "actualEng" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("avgTime")} style={{ textAlign: "center", cursor: "pointer" }}>
                    Avg Time {sortField === "avgTime" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("cpv")} style={{ textAlign: "right", cursor: "pointer" }}>
                    CPV 6s {sortField === "cpv" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("mediaSpend")} style={{ textAlign: "right", cursor: "pointer" }}>
                    Media Spend {sortField === "mediaSpend" && (sortAsc ? "▲" : "▼")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedKols.map(k => {
                  const pct = ((k.totalViews / k.targetViews) * 100).toFixed(1);
                  return (
                    <tr key={k.id} style={{ cursor: "pointer" }} onClick={() => onOpen(k)}>
                      <td style={{ fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap" }}>{k.kol}</td>
                      <td><span className="kt-badge" style={{ background: "var(--paper)", color: "var(--ink-mid)" }}>{k.type}</span></td>
                      <td style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{k.followers}</td>
                      <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{(k.cost / 1000000).toFixed(1)}M</td>
                      <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{k.targetViews.toLocaleString()}</td>
                      <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{k.organicViews.toLocaleString()}</td>
                      <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "var(--blue)" }}>+{k.reupViews.toLocaleString()}</td>
                      <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: k.totalViews >= k.targetViews ? "var(--ok)" : "var(--danger)" }}>
                        {k.totalViews.toLocaleString()}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="kt-badge" style={{ background: pct >= 100 ? "var(--ok-bg)" : "var(--danger-bg)", color: pct >= 100 ? "var(--ok)" : "var(--danger)", fontWeight: 700 }}>
                          {pct}%
                        </span>
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{k.actualEng.toLocaleString()}</td>
                      <td style={{ textAlign: "center", fontWeight: 700 }}>
                        {typeof k.avgTime === "number" && k.avgTime > 60 ? `${Math.floor(k.avgTime / 60)}m${k.avgTime % 60}s` : `${k.avgTime}s`}
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: k.cpv <= 45 ? "var(--ok)" : "var(--ink)" }}>{k.cpv}đ</td>
                      <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                        {k.mediaSpend > 0 ? `${(k.mediaSpend / 1000000).toFixed(1)}M` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: "var(--paper)", borderTop: "2px solid var(--rule)", fontWeight: 800 }}>
                  <td>TỔNG ({sortedKols.length} KOLs)</td>
                  <td>—</td>
                  <td>—</td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {(sortedKols.reduce((a, b) => a + b.cost, 0) / 1000000).toFixed(1)}M
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {sortedKols.reduce((a, b) => a + b.targetViews, 0).toLocaleString()}
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {sortedKols.reduce((a, b) => a + b.organicViews, 0).toLocaleString()}
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "var(--blue)" }}>
                    +{sortedKols.reduce((a, b) => a + b.reupViews, 0).toLocaleString()}
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "var(--ok)" }}>
                    {sortedKols.reduce((a, b) => a + b.totalViews, 0).toLocaleString()}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className="kt-badge" style={{ background: "var(--ok)", color: "#fff", fontWeight: 800 }}>
                      {((sortedKols.reduce((a, b) => a + b.totalViews, 0) / sortedKols.reduce((a, b) => a + b.targetViews, 0)) * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {sortedKols.reduce((a, b) => a + b.actualEng, 0).toLocaleString()}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    TB {(sortedKols.reduce((a, b) => a + (typeof b.avgTime === 'number' ? b.avgTime : 7), 0) / sortedKols.length).toFixed(1)}s
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "var(--ok)" }}>
                    TB {(sortedKols.reduce((a, b) => a + b.cpv, 0) / sortedKols.length).toFixed(1)}đ
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {(sortedKols.reduce((a, b) => a + b.mediaSpend, 0) / 1000000).toFixed(1)}M
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
