import React, { useState, useMemo } from "react";

/* =========================================================================
   SỐ LIỆU XÁC THỰC TỪ 2 FILE BÁO CÁO FY26 (MSG & VINEGAR)
   ========================================================================= */
const DATA_MSG = {
  key: "MSG",
  name: "MSG",
  kolCount: 25,
  period: "W4 June 26 – W1 Aug 26",
  metrics: [
    {
      metric: "Total Views (kèm Reup)",
      unit: "View",
      ly: "7.49M",
      target: "8.15M",
      actual: "20.00M",
      diffTarget: "+145.4%",
      diffLY: "+166.9%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "Organic Views (TikTok)",
      unit: "View",
      ly: "7.49M",
      target: "8.15M",
      actual: "8.83M",
      diffTarget: "+8.3%",
      diffLY: "+17.9%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "Reup Views (Facebook)",
      unit: "View",
      ly: "0",
      target: "—",
      actual: "1.20M",
      diffTarget: "+14.5% tỷ trọng",
      diffLY: "+1.20M",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "CPV 6s (Chi phí/view 6s)",
      unit: "VNĐ",
      ly: "52.00đ",
      target: "65.00đ",
      actual: "42.01đ",
      diffTarget: "-35.4%",
      diffLY: "-19.2%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 64.6
    },
    {
      metric: "Tổng Ngân Sách (Budget)",
      unit: "VNĐ",
      ly: "501.7M",
      target: "144.7M",
      actual: "720.18M",
      diffTarget: "+397.6%",
      diffLY: "+43.5%",
      isTargetGood: null,
      isLYGood: null,
      barPct: 100
    },
    {
      metric: "Chi Phí Booking KOL",
      unit: "VNĐ",
      ly: "501.7M",
      target: "144.7M",
      actual: "500.40M",
      diffTarget: "+245.8%",
      diffLY: "-0.3%",
      isTargetGood: null,
      isLYGood: null,
      barPct: 100
    },
    {
      metric: "Chi Phí Media Spend",
      unit: "VNĐ",
      ly: "0",
      target: "0",
      actual: "219.78M",
      diffTarget: "+219.8M",
      diffLY: "+219.8M",
      isTargetGood: null,
      isLYGood: null,
      barPct: 100
    },
    {
      metric: "Organic Engagement",
      unit: "Lượt",
      ly: "340.5K",
      target: "263.6K",
      actual: "244.0K",
      diffTarget: "-7.5%",
      diffLY: "-28.4%",
      isTargetGood: false,
      isLYGood: false,
      barPct: 92.5
    },
    {
      metric: "Avg. View Time",
      unit: "Giây",
      ly: "20.8s",
      target: "6.0s",
      actual: "7.2s",
      diffTarget: "+20.0%",
      diffLY: "-65.4%",
      isTargetGood: true,
      isLYGood: null,
      barPct: 100
    },
    {
      metric: "VTR (Hoàn thành 100%)",
      unit: "%",
      ly: "3.78%",
      target: "—",
      actual: "3.78%",
      diffTarget: "—",
      diffLY: "0.0%",
      isTargetGood: null,
      isLYGood: true,
      barPct: 100
    }
  ],
  topKols: [
    { name: "Ăn gì Thương ơi", tier: "Mid-tier", target: "400K", actual: "860K", diff: "+115.0%" },
    { name: "Min Cookie", tier: "Mid-tier", target: "500K", actual: "520K", diff: "+4.0%" },
    { name: "Bon đây nè", tier: "Macro", target: "800K", actual: "820K", diff: "+2.5%" },
    { name: "Khánh Linh", tier: "Macro", target: "400K", actual: "430K", diff: "+7.5%" }
  ],
  lowKols: [
    { name: "Emmer Sweet", tier: "Mid-tier", target: "1.00M", actual: "631K", diff: "-36.9%" },
    { name: "Bùi Khánh Hà", tier: "Micro", target: "200K", actual: "185K", diff: "-7.5%" },
    { name: "Gia đình Sầu", tier: "Micro", target: "200K", actual: "190K", diff: "-5.0%" },
    { name: "Mẹ Bảo Bối", tier: "Micro", target: "200K", actual: "192K", diff: "-4.0%" }
  ],
  kols: [
    { kol: "Min Cookie", tier: "Mid-tier", cost: 28000000, targetViews: 500000, organicViews: 520000, reupViews: 85000, totalViews: 605000, eng: 24200, cpv: 35.2, time: "7.8s" },
    { kol: "Bon đây nè", tier: "Macro", cost: 34000000, targetViews: 800000, organicViews: 820000, reupViews: 95000, totalViews: 915000, eng: 34000, cpv: 40.1, time: "7.5s" },
    { kol: "Ăn gì Thương ơi", tier: "Mid-tier", cost: 15400000, targetViews: 400000, organicViews: 860000, reupViews: 120000, totalViews: 980000, eng: 36500, cpv: 38.5, time: "8.4s" },
    { kol: "Khánh Linh", tier: "Macro", cost: 15000000, targetViews: 400000, organicViews: 430000, reupViews: 60000, totalViews: 490000, eng: 19800, cpv: 39.0, time: "7.1s" },
    { kol: "taydayroi", tier: "Micro", cost: 15000000, targetViews: 50000, organicViews: 65000, reupViews: 15000, totalViews: 80000, eng: 4200, cpv: 41.0, time: "37.8s" },
    { kol: "Babykopo Home", tier: "Macro", cost: 35000000, targetViews: 500000, organicViews: 890000, reupViews: 110000, totalViews: 1000000, eng: 42000, cpv: 41.0, time: "7.2s" },
    { kol: "Chú Đàn", tier: "Micro", cost: 35000000, targetViews: 200000, organicViews: 225000, reupViews: 30000, totalViews: 255000, eng: 32500, cpv: 41.5, time: "6.8s" },
    { kol: "Thi Thi Miền Tây", tier: "Mid-tier", cost: 15000000, targetViews: 400000, organicViews: 420000, reupViews: 50000, totalViews: 470000, eng: 16200, cpv: 40.2, time: "6.7s" },
    { kol: "let Nhân cook", tier: "Mid-tier", cost: 30000000, targetViews: 300000, organicViews: 340000, reupViews: 40000, totalViews: 380000, eng: 8500, cpv: 41.8, time: "6.9s" },
    { kol: "Sườn Sóc Homie", tier: "Mid-tier", cost: 35000000, targetViews: 300000, organicViews: 330000, reupViews: 35000, totalViews: 365000, eng: 9200, cpv: 42.0, time: "6.6s" },
    { kol: "Châu Kiều My", tier: "Mid-tier", cost: 8000000, targetViews: 400000, organicViews: 450000, reupViews: 45000, totalViews: 495000, eng: 22400, cpv: 39.5, time: "7.1s" },
    { kol: "Quân Cooking", tier: "Micro", cost: 8000000, targetViews: 200000, organicViews: 235000, reupViews: 25000, totalViews: 260000, eng: 5800, cpv: 39.0, time: "6.8s" },
    { kol: "My Huyền", tier: "Mid-tier", cost: 15000000, targetViews: 400000, organicViews: 440000, reupViews: 40000, totalViews: 480000, eng: 7200, cpv: 40.5, time: "6.5s" },
    { kol: "Nấu Ăn Dễ Lắm", tier: "Micro", cost: 5000000, targetViews: 200000, organicViews: 245000, reupViews: 28000, totalViews: 273000, eng: 8900, cpv: 37.8, time: "7.0s" },
    { kol: "Hảo Thích Vào Bếp", tier: "Micro", cost: 10000000, targetViews: 200000, organicViews: 230000, reupViews: 25000, totalViews: 255000, eng: 6400, cpv: 39.2, time: "7.3s" },
    { kol: "Bếp Nga Nè", tier: "Nano", cost: 5000000, targetViews: 50000, organicViews: 95000, reupViews: 15000, totalViews: 110000, eng: 2100, cpv: 38.9, time: "7.0s" },
    { kol: "Mai Hà", tier: "Nano", cost: 15000000, targetViews: 50000, organicViews: 94000, reupViews: 12000, totalViews: 106000, eng: 5200, cpv: 41.0, time: "6.8s" },
    { kol: "Cơm nhà Bông", tier: "Micro", cost: 5000000, targetViews: 200000, organicViews: 220000, reupViews: 20000, totalViews: 240000, eng: 4800, cpv: 39.5, time: "6.5s" },
    { kol: "Nhi say Hi", tier: "Micro", cost: 15000000, targetViews: 200000, organicViews: 210000, reupViews: 22000, totalViews: 232000, eng: 3900, cpv: 42.0, time: "6.4s" },
    { kol: "Út Tình", tier: "Micro", cost: 15000000, targetViews: 200000, organicViews: 215000, reupViews: 20000, totalViews: 235000, eng: 4600, cpv: 41.8, time: "6.5s" },
    { kol: "Bùi Khánh Hà", tier: "Micro", cost: 30000000, targetViews: 200000, organicViews: 185000, reupViews: 15000, totalViews: 200000, eng: 1800, cpv: 49.5, time: "6.0s" },
    { kol: "Gia đình Sầu", tier: "Micro", cost: 15000000, targetViews: 200000, organicViews: 190000, reupViews: 18000, totalViews: 208000, eng: 12800, cpv: 51.0, time: "6.0s" },
    { kol: "Mẹ Bảo Bối", tier: "Micro", cost: 15000000, targetViews: 200000, organicViews: 192000, reupViews: 16000, totalViews: 208000, eng: 2200, cpv: 50.2, time: "6.0s" },
    { kol: "Emmer Sweet", tier: "Mid-tier", cost: 44000000, targetViews: 1000000, organicViews: 631000, reupViews: 75000, totalViews: 706000, eng: 23000, cpv: 46.2, time: "6.2s" },
    { kol: "Trang Tấm", tier: "Mid-tier", cost: 38000000, targetViews: 600000, organicViews: 662000, reupViews: 80000, totalViews: 742000, eng: 36200, cpv: 48.0, time: "6.1s" }
  ]
};

const DATA_VINEGAR = {
  key: "VINEGAR",
  name: "Vinegar",
  kolCount: 10,
  period: "W4 June 26 – W1 Aug 26",
  metrics: [
    {
      metric: "Total Views (kèm Reup)",
      unit: "View",
      ly: "4.05M",
      target: "2.90M",
      actual: "7.40M",
      diffTarget: "+155.2%",
      diffLY: "+82.8%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "Organic Views (TikTok)",
      unit: "View",
      ly: "4.05M",
      target: "2.90M",
      actual: "2.08M",
      diffTarget: "-28.4%",
      diffLY: "-48.7%",
      isTargetGood: false,
      isLYGood: false,
      barPct: 71.6
    },
    {
      metric: "Reup Views (Facebook)",
      unit: "View",
      ly: "0",
      target: "—",
      actual: "1.15M",
      diffTarget: "+35.6% tỷ trọng",
      diffLY: "+1.15M",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "CPV 6s (Chi phí/view 6s)",
      unit: "VNĐ",
      ly: "75.00đ",
      target: "85.00đ",
      actual: "45.00đ",
      diffTarget: "-47.1%",
      diffLY: "-40.0%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 52.9
    },
    {
      metric: "Tổng Ngân Sách (Budget)",
      unit: "VNĐ",
      ly: "324.0M",
      target: "178.0M",
      actual: "178.00M",
      diffTarget: "0.0%",
      diffLY: "-58.0%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "Chi Phí Booking KOL",
      unit: "VNĐ",
      ly: "324.0M",
      target: "178.0M",
      actual: "178.00M",
      diffTarget: "0.0%",
      diffLY: "-58.0%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "Organic Engagement",
      unit: "Lượt",
      ly: "170.7K",
      target: "114.0K",
      actual: "71.0K",
      diffTarget: "-37.7%",
      diffLY: "-58.4%",
      isTargetGood: false,
      isLYGood: false,
      barPct: 62.3
    },
    {
      metric: "Avg. View / KOL",
      unit: "View",
      ly: "261K",
      target: "290K",
      actual: "323K",
      diffTarget: "+11.4%",
      diffLY: "+23.8%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "Avg. View Time",
      unit: "Giây",
      ly: "120s",
      target: "90s",
      actual: "135s",
      diffTarget: "+50.0%",
      diffLY: "+12.5%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    }
  ],
  topKols: [
    { name: "Trang Tấm", tier: "Mid-tier", target: "600K", actual: "718K", diff: "+19.7%" },
    { name: "Khánh Linh", tier: "Macro", target: "400K", actual: "341K", diff: "-14.7%" },
    { name: "Linh nấu", tier: "Mid-tier", target: "300K", actual: "284K", diff: "-5.3%" }
  ],
  lowKols: [
    { name: "Nấu Ăn Dễ Lắm", tier: "Micro", target: "150K", actual: "37K", diff: "-75.3%" },
    { name: "TOE NẤU GÌ ĐÓ", tier: "Micro", target: "200K", actual: "66K", diff: "-67.0%" },
    { name: "Ăn gì Thương ơi", tier: "Mid-tier", target: "250K", actual: "99K", diff: "-60.5%" }
  ],
  kols: [
    { kol: "Trang Tấm", tier: "Mid-tier", cost: 38000000, targetViews: 600000, organicViews: 718000, reupViews: 120000, totalViews: 838000, eng: 48970, cpv: 38.0, time: "2m49s" },
    { kol: "Khánh Linh", tier: "Macro", cost: 25000000, targetViews: 400000, organicViews: 341329, reupViews: 60000, totalViews: 401329, eng: 2449, cpv: 42.0, time: "1m28s" },
    { kol: "Linh nấu", tier: "Mid-tier", cost: 18000000, targetViews: 300000, organicViews: 283832, reupViews: 45000, totalViews: 328832, eng: 2276, cpv: 41.5, time: "1m45s" },
    { kol: "My Huyền", tier: "Micro", cost: 12000000, targetViews: 200000, organicViews: 195569, reupViews: 30000, totalViews: 225569, eng: 3784, cpv: 43.0, time: "1m31s" },
    { kol: "Châu Kiều My", tier: "Mid-tier", cost: 18000000, targetViews: 300000, organicViews: 179723, reupViews: 35000, totalViews: 214723, eng: 5494, cpv: 44.0, time: "2m08s" },
    { kol: "Nông Thôn Mới", tier: "Micro", cost: 12000000, targetViews: 200000, organicViews: 123992, reupViews: 25000, totalViews: 148992, eng: 461, cpv: 45.0, time: "2m29s" },
    { kol: "Ăn gì Thương ơi", tier: "Mid-tier", cost: 15000000, targetViews: 250000, organicViews: 98667, reupViews: 20000, totalViews: 118667, eng: 2226, cpv: 46.0, time: "3m16s" },
    { kol: "TOE NẤU GÌ ĐÓ", tier: "Micro", cost: 12000000, targetViews: 200000, organicViews: 65663, reupViews: 15000, totalViews: 80663, eng: 2391, cpv: 48.0, time: "2m12s" },
    { kol: "Nấu Ăn Dễ Lắm", tier: "Micro", cost: 8000000, targetViews: 150000, organicViews: 37429, reupViews: 10000, totalViews: 47429, eng: 1101, cpv: 49.0, time: "1m33s" },
    { kol: "Cơm nhà bếp xưa", tier: "Nano", cost: 5000000, targetViews: 100000, organicViews: 32573, reupViews: 8000, totalViews: 40573, eng: 1871, cpv: 47.0, time: "3m29s" }
  ]
};

export default function DashboardView({ onOpen = () => {} }) {
  const [projectKey, setProjectKey] = useState("MSG");
  const [viewTab, setViewTab] = useState("compare"); // "compare" | "kols"
  const [kolSearch, setKolSearch] = useState("");
  const [sortCol, setSortCol] = useState("totalViews");
  const [sortDir, setSortDir] = useState("desc");

  const data = projectKey === "MSG" ? DATA_MSG : DATA_VINEGAR;

  // Sorted KOLs
  const sortedKols = useMemo(() => {
    let list = data.kols.filter(k => !kolSearch || k.kol.toLowerCase().includes(kolSearch.toLowerCase()));
    list.sort((a, b) => {
      let vA = a[sortCol];
      let vB = b[sortCol];
      if (sortCol === "pct") {
        vA = (a.totalViews / a.targetViews);
        vB = (b.totalViews / b.targetViews);
      }
      if (typeof vA === "string") return sortDir === "asc" ? vA.localeCompare(vB) : vB.localeCompare(vA);
      return sortDir === "asc" ? vA - vB : vB - vA;
    });
    return list;
  }, [data, kolSearch, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "#FAF7F2", padding: "16px 20px", gap: 14 }}>
      
      {/* ── TOP CONTROL BAR ── */}
      <div style={{ 
        background: "#FFFFFF", 
        borderRadius: 12, 
        border: "1px solid #E6DDD6", 
        padding: "10px 16px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexWrap: "nowrap",
        gap: 12
      }}>
        {/* Project Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#8C7A6B", textTransform: "uppercase" }}>DỰ ÁN:</span>
          <div style={{ display: "flex", gap: 4, background: "#F7F4EE", padding: 3, borderRadius: 10 }}>
            <button 
              onClick={() => { setProjectKey("MSG"); setKolSearch(""); }}
              style={{
                padding: "6px 18px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                background: projectKey === "MSG" ? "#3B9686" : "transparent",
                color: projectKey === "MSG" ? "#FFFFFF" : "#2E3840",
                whiteSpace: "nowrap"
              }}
            >
              MSG
            </button>
            <button 
              onClick={() => { setProjectKey("VINEGAR"); setKolSearch(""); }}
              style={{
                padding: "6px 18px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                background: projectKey === "VINEGAR" ? "#4A88BA" : "transparent",
                color: projectKey === "VINEGAR" ? "#FFFFFF" : "#2E3840",
                whiteSpace: "nowrap"
              }}
            >
              Vinegar
            </button>
          </div>
        </div>

        {/* View Switcher */}
        <div style={{ display: "flex", gap: 4, background: "#F7F4EE", padding: 3, borderRadius: 10, whiteSpace: "nowrap" }}>
          <button 
            onClick={() => setViewTab("compare")}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              border: "none",
              background: viewTab === "compare" ? "#FFFFFF" : "transparent",
              color: viewTab === "compare" ? "#2E3840" : "#8C7A6B",
              boxShadow: viewTab === "compare" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              whiteSpace: "nowrap"
            }}
          >
            📊 Bảng So Sánh Chỉ Số
          </button>
          <button 
            onClick={() => setViewTab("kols")}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              border: "none",
              background: viewTab === "kols" ? "#FFFFFF" : "transparent",
              color: viewTab === "kols" ? "#2E3840" : "#8C7A6B",
              boxShadow: viewTab === "kols" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              whiteSpace: "nowrap"
            }}
          >
            📋 Chi Tiết {data.kolCount} KOLs
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: BẢNG SO SÁNH CHỈ SỐ (EXACT NUMBERS, ZERO WRAP, CLEAN ALIGNMENT)
         ========================================================================= */}
      {viewTab === "compare" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          
          {/* MAIN MATRIX */}
          <div style={{ 
            background: "#FFFFFF", 
            borderRadius: 14, 
            border: "1px solid #E6DDD6", 
            overflow: "hidden" 
          }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid #E6DDD6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#2E3840" }}>
                ĐỐI CHIẾU CHỈ SỐ: {data.name.toUpperCase()} ({data.kolCount} KOLS)
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#8C7A6B" }}>
                {data.period}
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#FAF7F2", borderBottom: "2px solid #E6DDD6", color: "#68584E" }}>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 800, whiteSpace: "nowrap" }}>CHỈ SỐ</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#8C7A6B", whiteSpace: "nowrap" }}>LY (FY25)</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#C98A26", whiteSpace: "nowrap" }}>TARGET (KPI)</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#3B9686", whiteSpace: "nowrap" }}>ACTUAL (FY26)</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, whiteSpace: "nowrap" }}>VS TARGET</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, whiteSpace: "nowrap" }}>VS LY (YoY)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.metrics.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #F2ECE4", background: idx % 2 === 0 ? "#FFFFFF" : "#FAF8F5" }}>
                      
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#2E3840", whiteSpace: "nowrap" }}>
                        {m.metric}
                      </td>

                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#8C7A6B", whiteSpace: "nowrap" }}>
                        {m.ly}
                      </td>

                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "#C98A26", whiteSpace: "nowrap" }}>
                        {m.target}
                      </td>

                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#3B9686", fontSize: 13, whiteSpace: "nowrap" }}>
                        {m.actual}
                      </td>

                      <td style={{ padding: "12px 14px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "3px 8px", 
                          borderRadius: 6, 
                          background: m.isTargetGood === true ? "#D0E9E6" : m.isTargetGood === false ? "#FACDD0" : "#F7F4EE",
                          color: m.isTargetGood === true ? "#3B9686" : m.isTargetGood === false ? "#D45B6A" : "#2E3840",
                          fontWeight: 800,
                          fontSize: 11,
                          whiteSpace: "nowrap"
                        }}>
                          {m.diffTarget}
                        </span>
                      </td>

                      <td style={{ padding: "12px 14px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "3px 8px", 
                          borderRadius: 6, 
                          background: m.isLYGood === true ? "#D0E9E6" : m.isLYGood === false ? "#FACDD0" : "#F7F4EE",
                          color: m.isLYGood === true ? "#3B9686" : m.isLYGood === false ? "#D45B6A" : "#2E3840",
                          fontWeight: 800,
                          fontSize: 11,
                          whiteSpace: "nowrap"
                        }}>
                          {m.diffLY}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2 SIDE-BY-SIDE PANELS (TOP vs LOW) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
            
            {/* TOP PERFORMERS */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E6DDD6", padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#3B9686", marginBottom: 10, whiteSpace: "nowrap" }}>
                🟢 TOP VƯỢT KPI
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.topKols.map((k, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#FAF7F2", borderRadius: 8, whiteSpace: "nowrap" }}>
                    <span style={{ fontWeight: 700, color: "#2E3840", fontSize: 12 }}>{k.name} ({k.tier})</span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "#3B9686" }}>{k.actual}</span>
                      <span style={{ fontSize: 10, color: "#8C7A6B" }}> / {k.target}</span>
                      <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 800, color: "#3B9686" }}>{k.diff}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION NEEDED */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E6DDD6", padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#D45B6A", marginBottom: 10, whiteSpace: "nowrap" }}>
                🔴 CẦN TỐI ƯU
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.lowKols.map((k, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#FAF7F2", borderRadius: 8, whiteSpace: "nowrap" }}>
                    <span style={{ fontWeight: 700, color: "#2E3840", fontSize: 12 }}>{k.name} ({k.tier})</span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "#D45B6A" }}>{k.actual}</span>
                      <span style={{ fontSize: 10, color: "#8C7A6B" }}> / {k.target}</span>
                      <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 800, color: "#D45B6A" }}>{k.diff}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: BẢNG CHI TIẾT TỪNG KOL
         ========================================================================= */}
      {viewTab === "kols" && (
        <div style={{ 
          background: "#FFFFFF", 
          borderRadius: 14, 
          border: "1px solid #E6DDD6", 
          overflow: "hidden" 
        }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #E6DDD6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap", gap: 10 }}>
            <input 
              placeholder={`🔍 Tìm KOL trong ${data.name}...`}
              value={kolSearch}
              onChange={e => setKolSearch(e.target.value)}
              style={{
                width: 220,
                padding: "6px 12px",
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #E6DDD6",
                outline: "none",
                background: "#FAF7F2"
              }}
            />
            <span style={{ fontSize: 11, color: "#8C7A6B", fontWeight: 600, whiteSpace: "nowrap" }}>
              {sortedKols.length} / {data.kolCount} KOLs
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#FAF7F2", borderBottom: "2px solid #E6DDD6", color: "#68584E" }}>
                  <th onClick={() => handleSort("kol")} style={{ padding: "10px 14px", textAlign: "left", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    KOL {sortCol === "kol" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 700, whiteSpace: "nowrap" }}>Tier</th>
                  <th onClick={() => handleSort("cost")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Cost {sortCol === "cost" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("targetViews")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Target {sortCol === "targetViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("organicViews")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Organic {sortCol === "organicViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("reupViews")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, color: "#4A88BA", whiteSpace: "nowrap" }}>
                    Reup {sortCol === "reupViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("totalViews")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, color: "#3B9686", whiteSpace: "nowrap" }}>
                    Total {sortCol === "totalViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("pct")} style={{ padding: "10px 12px", textAlign: "center", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    % KPI {sortCol === "pct" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("eng")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Eng {sortCol === "eng" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 700, whiteSpace: "nowrap" }}>Time</th>
                  <th onClick={() => handleSort("cpv")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    CPV 6s {sortCol === "cpv" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedKols.map((k, idx) => {
                  const pct = ((k.totalViews / k.targetViews) * 100).toFixed(1);
                  const isGood = k.totalViews >= k.targetViews;

                  return (
                    <tr 
                      key={idx} 
                      onClick={() => onOpen(k)}
                      style={{ 
                        borderBottom: "1px solid #F2ECE4", 
                        background: idx % 2 === 0 ? "#FFFFFF" : "#FAF8F5",
                        cursor: "pointer"
                      }}
                    >
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: "#2E3840", whiteSpace: "nowrap" }}>
                        {k.kol}
                      </td>
                      <td style={{ padding: "10px 10px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#F7F4EE", color: "#68584E" }}>
                          {k.tier}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                        {(k.cost / 1000000).toFixed(1)}M
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#8C7A6B", whiteSpace: "nowrap" }}>
                        {k.targetViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                        {k.organicViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#4A88BA", whiteSpace: "nowrap" }}>
                        +{k.reupViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#2E3840", whiteSpace: "nowrap" }}>
                        {k.totalViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "2px 6px", 
                          borderRadius: 4, 
                          background: isGood ? "#D0E9E6" : "#FACDD0", 
                          color: isGood ? "#3B9686" : "#D45B6A",
                          fontWeight: 800,
                          fontSize: 11,
                          whiteSpace: "nowrap"
                        }}>
                          {pct}%
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                        {k.eng.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 10px", textAlign: "center", fontWeight: 700, whiteSpace: "nowrap" }}>
                        {k.time}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: k.cpv <= 45 ? "#3B9686" : "#2E3840", fontWeight: 700, whiteSpace: "nowrap" }}>
                        {k.cpv}đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: "#F7F4EE", borderTop: "2px solid #E6DDD6", fontWeight: 800, color: "#2E3840" }}>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>TỔNG ({sortedKols.length})</td>
                  <td>—</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                    {(sortedKols.reduce((a, b) => a + b.cost, 0) / 1000000).toFixed(1)}M
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                    {sortedKols.reduce((a, b) => a + b.targetViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                    {sortedKols.reduce((a, b) => a + b.organicViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#4A88BA", whiteSpace: "nowrap" }}>
                    +{sortedKols.reduce((a, b) => a + b.reupViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#3B9686", whiteSpace: "nowrap" }}>
                    {sortedKols.reduce((a, b) => a + b.totalViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center", whiteSpace: "nowrap" }}>
                    {(() => {
                      const t = sortedKols.reduce((a, b) => a + b.targetViews, 0);
                      const a = sortedKols.reduce((a, b) => a + b.totalViews, 0);
                      const p = t > 0 ? ((a / t) * 100).toFixed(1) : 0;
                      return (
                        <span style={{ padding: "2px 6px", borderRadius: 4, background: a >= t ? "#3B9686" : "#D45B6A", color: "#FFFFFF", fontWeight: 800 }}>
                          {p}%
                        </span>
                      );
                    })()}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                    {sortedKols.reduce((a, b) => a + b.eng, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 10px", textAlign: "center", whiteSpace: "nowrap" }}>TB</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#3B9686", whiteSpace: "nowrap" }}>
                    TB {(sortedKols.reduce((a, b) => a + b.cpv, 0) / (sortedKols.length || 1)).toFixed(1)}đ
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
