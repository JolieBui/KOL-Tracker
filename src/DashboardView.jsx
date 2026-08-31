import React, { useState, useMemo } from "react";

/* =========================================================================
   EXACT AUDITED DATA FROM FY26 HALF YEAR REPORTS
   ========================================================================= */
const MSG_DATA = {
  key: "MSG",
  name: "MSG",
  kolCount: 25,
  period: "W4 June 26 – W1 Aug 26 (6 tuần)",
  metrics: [
    {
      name: "1. Tổng Lượt Xem (Total Views)",
      unit: "Views",
      ly: 7492067, lyStr: "7.49M",
      target: 8150000, targetStr: "8.15M",
      actual: 20000000, actualStr: "20.00M",
      diffTargetPct: "+145.4%", diffTargetAbs: "+11.85M", targetGood: true,
      diffLYPct: "+166.9%", diffLYAbs: "+12.51M", lyGood: true,
      progressPct: 100,
      note: "Organic đạt 8.83M (+8.3% KPI), Reup FB góp 1.20M, Media góp 9.97M"
    },
    {
      name: "2. Lượt Xem Tự Nhiên (Organic TikTok)",
      unit: "Views",
      ly: 7492067, lyStr: "7.49M",
      target: 8150000, targetStr: "8.15M",
      actual: 8830000, actualStr: "8.83M",
      diffTargetPct: "+8.3%", diffTargetAbs: "+680K", targetGood: true,
      diffLYPct: "+17.9%", diffLYAbs: "+1.34M", lyGood: true,
      progressPct: 108.3,
      note: "Vượt chỉ tiêu tự nhiên bất chấp ảnh hưởng mùa World Cup"
    },
    {
      name: "3. Chi Phí / View 6s (CPV)",
      unit: "VNĐ/view",
      ly: 52.0, lyStr: "52.0đ",
      target: 65.0, targetStr: "65.0đ",
      actual: 42.01, actualStr: "42.01đ",
      diffTargetPct: "-35.4%", diffTargetAbs: "-22.99đ", targetGood: true, // Lower is better
      diffLYPct: "-19.2%", diffLYAbs: "-9.99đ", lyGood: true,
      progressPct: 64.6, // 42/65
      note: "Tiết kiệm 35.4% nhờ thuật toán TikTok auto-optimize ngân sách"
    },
    {
      name: "4. Tổng Ngân Sách Thực Chi",
      unit: "VNĐ",
      ly: 501715977, lyStr: "501.7M",
      target: 144722071, targetStr: "144.7M",
      actual: 720182071, actualStr: "720.18M",
      diffTargetPct: "+397.6%", diffTargetAbs: "+575.46M", targetGood: null,
      diffLYPct: "+43.5%", diffLYAbs: "+218.47M", lyGood: null,
      progressPct: 100,
      note: "Booking: 500.4M (25 KOLs) • Media Spend: 219.78M"
    },
    {
      name: "5. Tương Tác Tự Nhiên (Engagement)",
      unit: "Lượt",
      ly: 340531, lyStr: "340.5K",
      target: 263622, targetStr: "263.6K",
      actual: 244000, actualStr: "244.0K",
      diffTargetPct: "-7.5%", diffTargetAbs: "-19.6K", targetGood: false,
      diffLYPct: "-28.4%", diffLYAbs: "-96.5K", lyGood: false,
      progressPct: 92.5,
      note: "Reactions/Comments giảm nhưng Shares (+52%) và Saves (+21%) tăng mạnh"
    },
    {
      name: "6. Thời Lượng Xem TB (Avg. View Time)",
      unit: "Giây",
      ly: 20.8, lyStr: "20.8s",
      target: 6.0, targetStr: "6.0s",
      actual: 7.2, actualStr: "7.2s",
      diffTargetPct: "+20.0%", diffTargetAbs: "+1.2s", targetGood: true,
      diffLYPct: "-65.4%", diffLYAbs: "-13.6s", lyGood: null,
      progressPct: 120,
      note: "100% video đều vượt benchmark 6s nhờ quy tắc Hook 6s đầu"
    }
  ],
  topKols: [
    { name: "Ăn gì Thương ơi", tier: "Mid-tier", target: "400K", actual: "860K", pct: "+115.0%", diff: "+460K" },
    { name: "Min Cookie", tier: "Mid-tier", target: "500K", actual: "520K", pct: "+4.0%", diff: "+20K" },
    { name: "Bon đây nè", tier: "Macro", target: "800K", actual: "820K", pct: "+2.5%", diff: "+20K" },
    { name: "Khánh Linh", tier: "Macro", target: "400K", actual: "430K", pct: "+7.5%", diff: "+30K" }
  ],
  lowKols: [
    { name: "Emmer Sweet", tier: "Mid-tier", target: "1.0M", actual: "631K", pct: "-36.9%", diff: "-369K", reason: "Bị giảm do ép timeline 30-40s" },
    { name: "Trang Tấm", tier: "Mid-tier", target: "600K", actual: "662K", pct: "+10.3%", diff: "+62K", reason: "Tương tác giảm -31% vs FY25" }
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

const VINEGAR_DATA = {
  key: "VINEGAR",
  name: "Vinegar",
  kolCount: 10,
  period: "W4 June 26 – W1 Aug 26 (6 tuần)",
  metrics: [
    {
      name: "1. Tổng Lượt Xem (Total Views)",
      unit: "Views",
      ly: 4048198, lyStr: "4.05M",
      target: 2900000, targetStr: "2.90M",
      actual: 7400000, actualStr: "7.40M",
      diffTargetPct: "+155.2%", diffTargetAbs: "+4.50M", targetGood: true,
      diffLYPct: "+82.8%", diffLYAbs: "+3.35M", lyGood: true,
      progressPct: 100,
      note: "Organic đạt 2.08M, Reup FB đạt 1.15M, Media Ads hỗ trợ"
    },
    {
      name: "2. Lượt Xem Tự Nhiên (Organic TikTok)",
      unit: "Views",
      ly: 4048198, lyStr: "4.05M",
      target: 2900000, targetStr: "2.90M",
      actual: 2076777, actualStr: "2.08M",
      diffTargetPct: "-28.4%", diffTargetAbs: "-823K", targetGood: false,
      diffLYPct: "-48.7%", diffLYAbs: "-1.97M", lyGood: false,
      progressPct: 71.6,
      note: "Do ngân sách giảm 58% và giảm từ 17 KOLs xuống 10 KOLs"
    },
    {
      name: "3. Chi Phí / View 6s (CPV)",
      unit: "VNĐ/view",
      ly: 75.0, lyStr: "75.0đ",
      target: 85.0, targetStr: "85.0đ",
      actual: 45.0, actualStr: "45.00đ",
      diffTargetPct: "-47.1%", diffTargetAbs: "-40.00đ", targetGood: true,
      diffLYPct: "-40.0%", diffLYAbs: "-30.00đ", lyGood: true,
      progressPct: 52.9,
      note: "CPV giảm sâu xuất sắc nhờ gom ngân sách chung cho TikTok tự tối ưu"
    },
    {
      name: "4. Tổng Ngân Sách Thực Chi",
      unit: "VNĐ",
      ly: 324000000, lyStr: "324.0M",
      target: 178000000, targetStr: "178.0M",
      actual: 178000000, actualStr: "178.00M",
      diffTargetPct: "0.0%", diffTargetAbs: "0đ", targetGood: true,
      diffLYPct: "-58.0%", diffLYAbs: "-146.0M", lyGood: true,
      progressPct: 100,
      note: "Tiết kiệm 58% ngân sách so với FY25, chỉ chạy 10 KOLs chất lượng"
    },
    {
      name: "5. Tương Tác Tự Nhiên (Engagement)",
      unit: "Lượt",
      ly: 170655, lyStr: "170.7K",
      target: 114000, targetStr: "114.0K",
      actual: 71021, actualStr: "71.0K",
      diffTargetPct: "-37.7%", diffTargetAbs: "-43.0K", targetGood: false,
      diffLYPct: "-58.4%", diffLYAbs: "-99.6K", lyGood: false,
      progressPct: 62.3,
      note: "Trang Tấm với món Bò Nhúng Giấm chiếm 68% tổng lượt Lưu (Saves)"
    },
    {
      name: "6. Hiệu Suất TB / KOL (Avg. View / KOL)",
      unit: "Views/KOL",
      ly: 261000, lyStr: "261K",
      target: 290000, targetStr: "290K",
      actual: 323000, actualStr: "323K",
      diffTargetPct: "+11.4%", diffTargetAbs: "+33K", targetGood: true,
      diffLYPct: "+23.8%", diffLYAbs: "+62K", lyGood: true,
      progressPct: 111.4,
      note: "Hiệu suất trung bình mỗi KOL tăng 24% so với năm trước"
    }
  ],
  topKols: [
    { name: "Trang Tấm", tier: "Mid-tier", target: "600K", actual: "718K", pct: "+19.7%", diff: "+118K", dish: "Bò nhúng giấm (68% Saves)" },
    { name: "Khánh Linh", tier: "Macro", target: "400K", actual: "341K", pct: "-14.7%", diff: "-59K", dish: "Mì lạnh HQ + Gỏi bò" },
    { name: "Linh nấu", tier: "Mid-tier", target: "300K", actual: "284K", pct: "-5.3%", diff: "-16K", dish: "Nộm hoa chuối" }
  ],
  lowKols: [
    { name: "Nấu Ăn Dễ Lắm", tier: "Micro", target: "150K", actual: "37K", pct: "-75.3%", diff: "-113K", reason: "Món gỏi mực xoài kén người xem" },
    { name: "TOE NẤU GÌ ĐÓ", tier: "Micro", target: "200K", actual: "66K", pct: "-67.0%", diff: "-134K", reason: "Món nộm rau muống ít tương tác" }
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

  const data = projectKey === "MSG" ? MSG_DATA : VINEGAR_DATA;

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
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "#F8FAFC", padding: "20px 24px", gap: 18 }}>
      
      {/* ── TOP EXECUTIVE CONTROL BAR ── */}
      <div style={{ 
        background: "#FFFFFF", 
        borderRadius: 14, 
        border: "1px solid #E2E8F0", 
        padding: "12px 20px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexWrap: "wrap", 
        gap: 12,
        boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
      }}>
        {/* Project Selector Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>DỰ ÁN:</span>
          <div style={{ display: "flex", gap: 6, background: "#F1F5F9", padding: 4, borderRadius: 12 }}>
            <button 
              onClick={() => { setProjectKey("MSG"); setKolSearch(""); }}
              style={{
                padding: "8px 20px",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                background: projectKey === "MSG" ? "#0F766E" : "transparent",
                color: projectKey === "MSG" ? "#FFFFFF" : "#334155",
                boxShadow: projectKey === "MSG" ? "0 2px 6px rgba(15, 118, 110, 0.25)" : "none",
                transition: "all 0.15s"
              }}
            >
              MSG
            </button>
            <button 
              onClick={() => { setProjectKey("VINEGAR"); setKolSearch(""); }}
              style={{
                padding: "8px 20px",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                background: projectKey === "VINEGAR" ? "#0369A1" : "transparent",
                color: projectKey === "VINEGAR" ? "#FFFFFF" : "#334155",
                boxShadow: projectKey === "VINEGAR" ? "0 2px 6px rgba(3, 105, 161, 0.25)" : "none",
                transition: "all 0.15s"
              }}
            >
              Vinegar
            </button>
          </div>
        </div>

        {/* View Switcher */}
        <div style={{ display: "flex", gap: 6, background: "#F1F5F9", padding: 4, borderRadius: 12 }}>
          <button 
            onClick={() => setViewTab("compare")}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              border: "none",
              background: viewTab === "compare" ? "#FFFFFF" : "transparent",
              color: viewTab === "compare" ? "#0F172A" : "#64748B",
              boxShadow: viewTab === "compare" ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
            }}
          >
            📊 Bảng So Sánh Chỉ Số (Executive Compare)
          </button>
          <button 
            onClick={() => setViewTab("kols")}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              border: "none",
              background: viewTab === "kols" ? "#FFFFFF" : "transparent",
              color: viewTab === "kols" ? "#0F172A" : "#64748B",
              boxShadow: viewTab === "kols" ? "0 1px 4px rgba(0,0,0,0.08)" : "none"
            }}
          >
            📋 Chi Tiết Từng KOL ({data.kolCount})
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: UNIFIED EXECUTIVE COMPARISON TABLE (CỰC KỲ DỄ ĐỌC & SO SÁNH)
         ========================================================================= */}
      {viewTab === "compare" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          
          {/* MAIN COMPARISON MATRIX */}
          <div style={{ 
            background: "#FFFFFF", 
            borderRadius: 16, 
            border: "1px solid #E2E8F0", 
            overflow: "hidden", 
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)" 
          }}>
            <div style={{ padding: "16px 22px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
                  BẢNG ĐỐI CHIẾU CHỈ SỐ: {data.name.toUpperCase()}
                </h3>
                <span style={{ fontSize: 12, color: "#64748B" }}>Thời gian: {data.period} • Quy mô: {data.kolCount} KOLs</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0F766E", background: "#CCFBF1", padding: "4px 10px", borderRadius: 8 }}>
                ● Dữ liệu Báo Cáo FY26
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", color: "#475569", textAlign: "left" }}>
                    <th style={{ padding: "14px 20px", fontWeight: 800 }}>CHỈ SỐ ĐO LƯỜNG</th>
                    <th style={{ padding: "14px 16px", textAlign: "right", fontWeight: 800, color: "#64748B" }}>CÙNG KỲ (LY FY25)</th>
                    <th style={{ padding: "14px 16px", textAlign: "right", fontWeight: 800, color: "#D97706" }}>KẾ HOẠCH (TARGET)</th>
                    <th style={{ padding: "14px 16px", textAlign: "right", fontWeight: 800, color: "#0F766E" }}>THỰC TẾ (ACTUAL FY26)</th>
                    <th style={{ padding: "14px 16px", textAlign: "center", fontWeight: 800 }}>SO VỚI KPI</th>
                    <th style={{ padding: "14px 16px", textAlign: "center", fontWeight: 800 }}>SO VỚI CÙNG KỲ (YoY)</th>
                    <th style={{ padding: "14px 20px", width: 220, fontWeight: 800 }}>TIẾN ĐỘ / TỶ LỆ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.metrics.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9", background: idx % 2 === 0 ? "#FFFFFF" : "#FAFBFD" }}>
                      
                      {/* Metric Name */}
                      <td style={{ padding: "16px 20px", fontWeight: 700, color: "#0F172A" }}>
                        <div style={{ fontSize: 14 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, marginTop: 2 }}>{m.note}</div>
                      </td>

                      {/* LY */}
                      <td style={{ padding: "16px 16px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, color: "#64748B", fontSize: 14 }}>
                        {m.lyStr}
                      </td>

                      {/* Target */}
                      <td style={{ padding: "16px 16px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "#B45309", fontSize: 14 }}>
                        {m.targetStr}
                      </td>

                      {/* Actual */}
                      <td style={{ padding: "16px 16px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#0F766E", fontSize: 15 }}>
                        {m.actualStr}
                      </td>

                      {/* Diff vs Target */}
                      <td style={{ padding: "16px 16px", textAlign: "center" }}>
                        <div style={{ 
                          display: "inline-flex", 
                          alignItems: "center", 
                          gap: 4, 
                          padding: "4px 10px", 
                          borderRadius: 8, 
                          background: m.targetGood === true ? "#DCFCE7" : m.targetGood === false ? "#FEE2E2" : "#F1F5F9",
                          color: m.targetGood === true ? "#15803D" : m.targetGood === false ? "#B91C1C" : "#475569",
                          fontWeight: 800,
                          fontSize: 12
                        }}>
                          {m.targetGood === true ? "▲" : m.targetGood === false ? "▼" : "●"} {m.diffTargetPct}
                          <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.85 }}>({m.diffTargetAbs})</span>
                        </div>
                      </td>

                      {/* Diff vs LY */}
                      <td style={{ padding: "16px 16px", textAlign: "center" }}>
                        <div style={{ 
                          display: "inline-flex", 
                          alignItems: "center", 
                          gap: 4, 
                          padding: "4px 10px", 
                          borderRadius: 8, 
                          background: m.lyGood === true ? "#DCFCE7" : m.lyGood === false ? "#FEE2E2" : "#F1F5F9",
                          color: m.lyGood === true ? "#15803D" : m.lyGood === false ? "#B91C1C" : "#475569",
                          fontWeight: 800,
                          fontSize: 12
                        }}>
                          {m.lyGood === true ? "▲" : m.lyGood === false ? "▼" : "●"} {m.diffLYPct}
                          <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.85 }}>({m.diffLYAbs})</span>
                        </div>
                      </td>

                      {/* Visual Bar Comparison */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 10, background: "#E2E8F0", borderRadius: 6, overflow: "hidden" }}>
                            <div style={{ 
                              width: `${Math.min(100, m.progressPct)}%`, 
                              height: "100%", 
                              background: m.targetGood === false ? "#EF4444" : "#0D9488", 
                              borderRadius: 6 
                            }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#475569", fontFamily: "'IBM Plex Mono', monospace", width: 40, textAlign: "right" }}>
                            {m.progressPct.toFixed(0)}%
                          </span>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TWO SIDE-BY-SIDE PANELS: TOP PERFORMERS vs ACTION NEEDED */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16 }}>
            
            {/* TOP PERFORMERS */}
            <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#15803D", letterSpacing: "0.03em" }}>
                  🌟 TOP KOL HIỆU SUẤT CAO NHẤT (VƯỢT KPI)
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#15803D", background: "#DCFCE7", padding: "3px 8px", borderRadius: 6 }}>
                  Vượt trội
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.topKols.map((k, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" }}>
                    <div>
                      <div style={{ fontWeight: 800, color: "#0F172A", fontSize: 13 }}>{k.name} <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>({k.tier})</span></div>
                      {k.dish && <div style={{ fontSize: 11, color: "#0D9488", fontWeight: 600 }}>🍲 {k.dish}</div>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#0F766E", fontSize: 14 }}>{k.actual} <span style={{ fontSize: 11, color: "#94A3B8" }}>/ {k.target}</span></div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#15803D" }}>▲ {k.pct} ({k.diff})</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION / DECLINE */}
            <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#B91C1C", letterSpacing: "0.03em" }}>
                  ⚠️ KOL CẦN ĐIỀU CHỈNH / TỐI ƯU MENU
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#B91C1C", background: "#FEE2E2", padding: "3px 8px", borderRadius: 6 }}>
                  Cần lưu ý
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.lowKols.map((k, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" }}>
                    <div>
                      <div style={{ fontWeight: 800, color: "#0F172A", fontSize: 13 }}>{k.name} <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>({k.tier})</span></div>
                      <div style={{ fontSize: 11, color: "#B91C1C", fontWeight: 600 }}>{k.reason}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#0F172A", fontSize: 14 }}>{k.actual} <span style={{ fontSize: 11, color: "#94A3B8" }}>/ {k.target}</span></div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#B91C1C" }}>▼ {k.pct} ({k.diff})</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          SECTION 2: FULL SPREADSHEET TABLE OF ALL KOLS (DỄ XẾP HẠNG & TÌM KIẾM)
         ========================================================================= */}
      {viewTab === "kols" && (
        <div style={{ 
          background: "#FFFFFF", 
          borderRadius: 16, 
          border: "1px solid #E2E8F0", 
          overflow: "hidden", 
          boxShadow: "0 2px 10px rgba(0,0,0,0.02)" 
        }}>
          {/* Header controls */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <input 
              placeholder={`🔍 Tìm kiếm KOL trong ${data.name}...`}
              value={kolSearch}
              onChange={e => setKolSearch(e.target.value)}
              style={{
                width: 280,
                padding: "8px 14px",
                fontSize: 13,
                borderRadius: 10,
                border: "1px solid #CBD5E1",
                outline: "none",
                background: "#F8FAFC"
              }}
            />
            <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>
              Hiển thị <strong>{sortedKols.length}</strong> / {data.kolCount} KOLs (Bấm tiêu đề cột để Sắp Xếp)
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", color: "#475569" }}>
                  <th onClick={() => handleSort("kol")} style={{ padding: "12px 18px", textAlign: "left", cursor: "pointer", fontWeight: 800 }}>
                    Tên KOL {sortCol === "kol" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ padding: "12px 12px", textAlign: "center", fontWeight: 700 }}>Tier</th>
                  <th onClick={() => handleSort("cost")} style={{ padding: "12px 14px", textAlign: "right", cursor: "pointer", fontWeight: 800 }}>
                    Cost (VNĐ) {sortCol === "cost" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("targetViews")} style={{ padding: "12px 14px", textAlign: "right", cursor: "pointer", fontWeight: 800 }}>
                    Target View {sortCol === "targetViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("organicViews")} style={{ padding: "12px 14px", textAlign: "right", cursor: "pointer", fontWeight: 800 }}>
                    Organic View {sortCol === "organicViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("reupViews")} style={{ padding: "12px 14px", textAlign: "right", cursor: "pointer", fontWeight: 800, color: "#0284C7" }}>
                    FB Reup {sortCol === "reupViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("totalViews")} style={{ padding: "12px 14px", textAlign: "right", cursor: "pointer", fontWeight: 800, color: "#0F766E" }}>
                    Total View {sortCol === "totalViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("pct")} style={{ padding: "12px 14px", textAlign: "center", cursor: "pointer", fontWeight: 800 }}>
                    % Đạt Target {sortCol === "pct" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("eng")} style={{ padding: "12px 14px", textAlign: "right", cursor: "pointer", fontWeight: 800 }}>
                    Tương Tác {sortCol === "eng" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ padding: "12px 14px", textAlign: "center", fontWeight: 700 }}>Avg Time</th>
                  <th onClick={() => handleSort("cpv")} style={{ padding: "12px 14px", textAlign: "right", cursor: "pointer", fontWeight: 800 }}>
                    CPV 6s {sortCol === "cpv" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedKols.map((k, idx) => {
                  const diff = k.totalViews - k.targetViews;
                  const pct = ((k.totalViews / k.targetViews) * 100).toFixed(1);
                  const isGood = diff >= 0;

                  return (
                    <tr 
                      key={idx} 
                      onClick={() => onOpen(k)}
                      style={{ 
                        borderBottom: "1px solid #F1F5F9", 
                        background: idx % 2 === 0 ? "#FFFFFF" : "#FAFBFD",
                        cursor: "pointer"
                      }}
                    >
                      <td style={{ padding: "14px 18px", fontWeight: 800, color: "#0F172A" }}>
                        {k.kol}
                      </td>
                      <td style={{ padding: "14px 12px", textAlign: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "#F1F5F9", color: "#475569" }}>
                          {k.tier}
                        </span>
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                        {k.cost.toLocaleString()}đ
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#64748B" }}>
                        {k.targetViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                        {k.organicViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#0284C7", fontWeight: 600 }}>
                        +{k.reupViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#0F172A", fontSize: 14 }}>
                        {k.totalViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "center" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "3px 8px", 
                          borderRadius: 6, 
                          background: isGood ? "#DCFCE7" : "#FEE2E2", 
                          color: isGood ? "#15803D" : "#B91C1C",
                          fontWeight: 800,
                          fontSize: 12
                        }}>
                          {isGood ? "▲" : "▼"} {pct}%
                        </span>
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                        {k.eng.toLocaleString()}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "center", fontWeight: 700, color: "#334155" }}>
                        {k.time}
                      </td>
                      <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: k.cpv <= 45 ? "#15803D" : "#0F172A", fontWeight: 700 }}>
                        {k.cpv}đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: "#F1F5F9", borderTop: "2px solid #CBD5E1", fontWeight: 800, color: "#0F172A" }}>
                  <td style={{ padding: "14px 18px" }}>TỔNG CỘNG ({sortedKols.length} KOLs)</td>
                  <td>—</td>
                  <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {sortedKols.reduce((a, b) => a + b.cost, 0).toLocaleString()}đ
                  </td>
                  <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {sortedKols.reduce((a, b) => a + b.targetViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {sortedKols.reduce((a, b) => a + b.organicViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#0284C7" }}>
                    +{sortedKols.reduce((a, b) => a + b.reupViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#0F766E", fontSize: 14 }}>
                    {sortedKols.reduce((a, b) => a + b.totalViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 14px", textAlign: "center" }}>
                    {(() => {
                      const t = sortedKols.reduce((a, b) => a + b.targetViews, 0);
                      const a = sortedKols.reduce((a, b) => a + b.totalViews, 0);
                      const p = t > 0 ? ((a / t) * 100).toFixed(1) : 0;
                      return (
                        <span style={{ padding: "4px 10px", borderRadius: 6, background: a >= t ? "#0F766E" : "#B91C1C", color: "#FFFFFF", fontWeight: 800 }}>
                          {a >= t ? "▲" : "▼"} {p}%
                        </span>
                      );
                    })()}
                  </td>
                  <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {sortedKols.reduce((a, b) => a + b.eng, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 14px", textAlign: "center" }}>TB 7.2s</td>
                  <td style={{ padding: "14px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#15803D" }}>
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
