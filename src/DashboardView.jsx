import React, { useState, useMemo } from "react";

/* =========================================================================
   EXACT NUMERICAL DATA FROM EXCEL REPORTS (MSG & VINEGAR)
   ========================================================================= */
const MSG_DATA = {
  key: "MSG",
  name: "[MSG] Bột Ngọt (25 KOLs)",
  kolsCount: 25,
  cards: [
    {
      title: "LƯỢT XEM ORGANIC (TIKTOK)",
      value: "8.83M",
      subLabel: "Tổng kèm Reup & Media: 20.0M",
      vsTarget: { pct: "+8.3%", diff: "+680,000", isGood: true, label: "so với KPI (8.15M)" },
      vsLY: { pct: "+17.9%", diff: "+1,337,933", isGood: true, label: "so với cùng kỳ LY (7.49M)" }
    },
    {
      title: "CHI PHÍ / VIEW 6S (CPV)",
      value: "42.01đ",
      subLabel: "FOC Code-ads: 20/25 KOLs",
      vsTarget: { pct: "-35.4%", diff: "-22.99đ", isGood: true, label: "so với trần KPI (65.00đ)" },
      vsLY: { pct: "-19.2%", diff: "-9.99đ", isGood: true, label: "so với cùng kỳ LY (52.00đ)" }
    },
    {
      title: "TỔNG NGÂN SÁCH CHIẾN DỊCH",
      value: "720.18M",
      subLabel: "Booking: 500.4M • Media Ads: 219.8M",
      vsTarget: { pct: "+397.6%", diff: "+575.46M", isGood: true, label: "so với kế hoạch ban đầu (144.7M)" },
      vsLY: { pct: "+43.5%", diff: "+218.47M", isGood: null, label: "so với cùng kỳ LY (501.7M)" }
    },
    {
      title: "ORGANIC ENGAGEMENT",
      value: "244.0K",
      subLabel: "Tổng tương tác: 325.0K • Saves +21%",
      vsTarget: { pct: "-7.5%", diff: "-19,622", isGood: false, label: "so với KPI (263.6K)" },
      vsLY: { pct: "-28.4%", diff: "-96,531", isGood: false, label: "so với cùng kỳ LY (340.5K)" }
    },
    {
      title: "AVG. VIEW TIME (THỜI LƯỢNG XEM)",
      value: "7.2s",
      subLabel: "100% video vượt benchmark 6s",
      vsTarget: { pct: "+20.0%", diff: "+1.2s", isGood: true, label: "so với KPI tối thiểu (6.0s)" },
      vsLY: { pct: "-65.4%", diff: "-13.6s", isGood: null, label: "so với FY25 thả nổi (20.8s)" }
    },
    {
      title: "LƯỢT XEM REUP (FACEBOOK)",
      value: "1.20M",
      subLabel: "20/25 video reup thành công",
      vsTarget: { pct: "+14.5%", diff: "+1.20M", isGood: true, label: "tỷ trọng đóng góp tổng view" },
      vsLY: { pct: "+100%", diff: "+1.20M", isGood: true, label: "kênh mở rộng mới so với LY" }
    }
  ],
  summaryTable: [
    { metric: "Total Views (kèm Reup)", target: 8150000, ly: 7492067, actual: 20000000, unit: "views" },
    { metric: "Organic Views (TikTok)", target: 8150000, ly: 7492067, actual: 8830000, unit: "views" },
    { metric: "Reup Views (Facebook)", target: 0, ly: 0, actual: 1202000, unit: "views" },
    { metric: "Cost per Paid View 6s (CPV)", target: 65.0, ly: 52.0, actual: 42.01, unit: "đ", isInverse: true },
    { metric: "Tổng Ngân Sách (Budget)", target: 144722071, ly: 501715977, actual: 720182071, unit: "đ" },
    { metric: "Chi Phí Booking KOL", target: 144722071, ly: 501715977, actual: 500400000, unit: "đ" },
    { metric: "Chi Phí Media Spend", target: 0, ly: 0, actual: 219782071, unit: "đ" },
    { metric: "Organic Engagement", target: 263622, ly: 340531, actual: 244000, unit: "eng" },
    { metric: "Reactions (Likes)", target: null, ly: 301000, actual: 194000, unit: "likes" },
    { metric: "Comments", target: null, ly: 2400, actual: 1300, unit: "comments" },
    { metric: "Avg. View Time (Thời lượng xem)", target: 6.0, ly: 20.8, actual: 7.2, unit: "s" },
    { metric: "VTR (100% Completed View)", target: null, ly: 3.78, actual: 3.78, unit: "%" }
  ],
  kols: [
    { kol: "Min Cookie", type: "Mid-tier", followers: "794.7K", cost: 28000000, targetViews: 500000, organicViews: 520000, reupViews: 85000, totalViews: 605000, targetEng: 4600, actualEng: 24200, avgTime: 7.8, cpv: 35.2, mediaSpend: 0 },
    { kol: "Bon đây nè", type: "Macro", followers: "1.6M", cost: 34000000, targetViews: 800000, organicViews: 820000, reupViews: 95000, totalViews: 915000, targetEng: 13000, actualEng: 34000, avgTime: 7.5, cpv: 40.1, mediaSpend: 0 },
    { kol: "Ăn gì Thương ơi", type: "Mid-tier", followers: "522.0K", cost: 15400000, targetViews: 400000, organicViews: 860000, reupViews: 120000, totalViews: 980000, targetEng: 9700, actualEng: 36500, avgTime: 8.4, cpv: 38.5, mediaSpend: 0 },
    { kol: "Khánh Linh", type: "Macro", followers: "1.1M", cost: 15000000, targetViews: 400000, organicViews: 430000, reupViews: 60000, totalViews: 490000, targetEng: 1500, actualEng: 19800, avgTime: 7.1, cpv: 39.0, mediaSpend: 0 },
    { kol: "taydayroi", type: "Micro", followers: "105.4K", cost: 15000000, targetViews: 50000, organicViews: 65000, reupViews: 15000, totalViews: 80000, targetEng: 5400, actualEng: 4200, avgTime: 37.8, cpv: 41.0, mediaSpend: 0 },
    { kol: "Babykopo Home", type: "Macro", followers: "6.7M", cost: 35000000, targetViews: 500000, organicViews: 890000, reupViews: 110000, totalViews: 1000000, targetEng: 37300, actualEng: 42000, avgTime: 7.2, cpv: 41.0, mediaSpend: 5000000 },
    { kol: "Chú Đàn", type: "Micro", followers: "368.5K", cost: 35000000, targetViews: 200000, organicViews: 225000, reupViews: 30000, totalViews: 255000, targetEng: 31000, actualEng: 32500, avgTime: 6.8, cpv: 41.5, mediaSpend: 0 },
    { kol: "Thi Thi Miền Tây", type: "Mid-tier", followers: "730.4K", cost: 15000000, targetViews: 400000, organicViews: 420000, reupViews: 50000, totalViews: 470000, targetEng: 15000, actualEng: 16200, avgTime: 6.7, cpv: 40.2, mediaSpend: 0 },
    { kol: "let Nhân cook", type: "Mid-tier", followers: "516.6K", cost: 30000000, targetViews: 300000, organicViews: 340000, reupViews: 40000, totalViews: 380000, targetEng: 3000, actualEng: 8500, avgTime: 6.9, cpv: 41.8, mediaSpend: 0 },
    { kol: "Sườn Sóc Homie", type: "Mid-tier", followers: "555.0K", cost: 35000000, targetViews: 300000, organicViews: 330000, reupViews: 35000, totalViews: 365000, targetEng: 3000, actualEng: 9200, avgTime: 6.6, cpv: 42.0, mediaSpend: 0 },
    { kol: "Châu Kiều My", type: "Mid-tier", followers: "565.1K", cost: 8000000, targetViews: 400000, organicViews: 450000, reupViews: 45000, totalViews: 495000, targetEng: 20000, actualEng: 22400, avgTime: 7.1, cpv: 39.5, mediaSpend: 0 },
    { kol: "Quân Cooking", type: "Micro", followers: "147.6K", cost: 8000000, targetViews: 200000, organicViews: 235000, reupViews: 25000, totalViews: 260000, targetEng: 1500, actualEng: 5800, avgTime: 6.8, cpv: 39.0, mediaSpend: 0 },
    { kol: "My Huyền", type: "Mid-tier", followers: "511.2K", cost: 15000000, targetViews: 400000, organicViews: 440000, reupViews: 40000, totalViews: 480000, targetEng: 330, actualEng: 7200, avgTime: 6.5, cpv: 40.5, mediaSpend: 0 },
    { kol: "Nấu Ăn Dễ Lắm", type: "Micro", followers: "407.1K", cost: 5000000, targetViews: 200000, organicViews: 245000, reupViews: 28000, totalViews: 273000, targetEng: 1000, actualEng: 8900, avgTime: 7.0, cpv: 37.8, mediaSpend: 0 },
    { kol: "Hảo Thích Vào Bếp", type: "Micro", followers: "207.6K", cost: 10000000, targetViews: 200000, organicViews: 230000, reupViews: 25000, totalViews: 255000, targetEng: 150, actualEng: 6400, avgTime: 7.3, cpv: 39.2, mediaSpend: 0 },
    { kol: "Bếp Nga Nè", type: "Nano", followers: "47.8K", cost: 5000000, targetViews: 50000, organicViews: 95000, reupViews: 15000, totalViews: 110000, targetEng: 132, actualEng: 2100, avgTime: 7.0, cpv: 38.9, mediaSpend: 0 },
    { kol: "Mai Hà thích nấu ăn", type: "Nano", followers: "78.4K", cost: 15000000, targetViews: 50000, organicViews: 94000, reupViews: 12000, totalViews: 106000, targetEng: 4900, actualEng: 5200, avgTime: 6.8, cpv: 41.0, mediaSpend: 0 },
    { kol: "Cơm nhà Bông", type: "Micro", followers: "223.2K", cost: 5000000, targetViews: 200000, organicViews: 220000, reupViews: 20000, totalViews: 240000, targetEng: 300, actualEng: 4800, avgTime: 6.5, cpv: 39.5, mediaSpend: 0 },
    { kol: "Nhi say Hi", type: "Micro", followers: "282.7K", cost: 15000000, targetViews: 200000, organicViews: 210000, reupViews: 22000, totalViews: 232000, targetEng: 150, actualEng: 3900, avgTime: 6.4, cpv: 42.0, mediaSpend: 0 },
    { kol: "Út Tình", type: "Micro", followers: "242.8K", cost: 15000000, targetViews: 200000, organicViews: 215000, reupViews: 20000, totalViews: 235000, targetEng: 3900, actualEng: 4600, avgTime: 6.5, cpv: 41.8, mediaSpend: 0 },
    { kol: "Bùi Khánh Hà", type: "Micro", followers: "180.0K", cost: 30000000, targetViews: 200000, organicViews: 185000, reupViews: 15000, totalViews: 200000, targetEng: 50, actualEng: 1800, avgTime: 6.0, cpv: 49.5, mediaSpend: 4200000 },
    { kol: "Gia đình Sầu", type: "Micro", followers: "178.7K", cost: 15000000, targetViews: 200000, organicViews: 190000, reupViews: 18000, totalViews: 208000, targetEng: 31000, actualEng: 12800, avgTime: 6.0, cpv: 51.0, mediaSpend: 3500000 },
    { kol: "Mẹ Bảo Bối", type: "Micro", followers: "217.1K", cost: 15000000, targetViews: 200000, organicViews: 192000, reupViews: 16000, totalViews: 208000, targetEng: 110, actualEng: 2200, avgTime: 6.0, cpv: 50.2, mediaSpend: 2800000 },
    { kol: "Emmer Sweet", type: "Mid-tier", followers: "784.7K", cost: 44000000, targetViews: 1000000, organicViews: 631000, reupViews: 75000, totalViews: 706000, targetEng: 18200, actualEng: 23000, avgTime: 6.2, cpv: 46.2, mediaSpend: 8600000 },
    { kol: "Trang Tấm", type: "Mid-tier", followers: "696.4K", cost: 38000000, targetViews: 600000, organicViews: 662000, reupViews: 80000, totalViews: 742000, targetEng: 48400, actualEng: 36200, avgTime: 6.1, cpv: 48.0, mediaSpend: 6800000 }
  ]
};

const VINEGAR_DATA = {
  key: "VINEGAR",
  name: "VINEGAR Giấm Gạo (10 KOLs)",
  kolsCount: 10,
  cards: [
    {
      title: "LƯỢT XEM ORGANIC (TIKTOK)",
      value: "2.08M",
      subLabel: "Tổng kèm Reup & Media: 7.40M",
      vsTarget: { pct: "-28.4%", diff: "-823,223", isGood: false, label: "so với KPI (2.90M)" },
      vsLY: { pct: "-48.7%", diff: "-1.97M", isGood: null, label: "so với LY (4.05M - 17 KOLs)" }
    },
    {
      title: "CHI PHÍ / VIEW 6S (CPV)",
      value: "45.00đ",
      subLabel: "FOC Code-ads: 9/10 KOLs",
      vsTarget: { pct: "-47.1%", diff: "-40.00đ", isGood: true, label: "so với trần KPI (85.00đ)" },
      vsLY: { pct: "-40.0%", diff: "-30.00đ", isGood: true, label: "so với cùng kỳ LY (75.00đ)" }
    },
    {
      title: "TỔNG NGÂN SÁCH CHIẾN DỊCH",
      value: "178.00M",
      subLabel: "Booking: 178.0M • Media Ads: 0đ",
      vsTarget: { pct: "0.0%", diff: "0đ", isGood: true, label: "chuẩn 100% kế hoạch (178M)" },
      vsLY: { pct: "-58.0%", diff: "-146.00M", isGood: true, label: "tiết kiệm 58% so với LY (324M)" }
    },
    {
      title: "ORGANIC ENGAGEMENT",
      value: "71.0K",
      subLabel: "Trang Tấm Saves: 68% tổng",
      vsTarget: { pct: "-37.7%", diff: "-42,979", isGood: false, label: "so với KPI (114.0K)" },
      vsLY: { pct: "-58.4%", diff: "-99,634", isGood: false, label: "so với cùng kỳ LY (170.7K)" }
    },
    {
      title: "HIỆU SUẤT AVG. VIEW / KOL",
      value: "323K",
      subLabel: "Kèm lượt xem Reup Facebook",
      vsTarget: { pct: "+11.4%", diff: "+33K", isGood: true, label: "so với kế hoạch bình quân" },
      vsLY: { pct: "+23.8%", diff: "+62K", isGood: true, label: "tăng so với LY (261K / KOL)" }
    },
    {
      title: "LƯỢT XEM REUP (FACEBOOK)",
      value: "1.15M",
      subLabel: "9/10 video reup thành công",
      vsTarget: { pct: "+35.6%", diff: "+1.15M", isGood: true, label: "tỷ trọng đóng góp tổng view" },
      vsLY: { pct: "+100%", diff: "+1.15M", isGood: true, label: "kênh mở rộng mới so với LY" }
    }
  ],
  summaryTable: [
    { metric: "Total Views (kèm Reup)", target: 2900000, ly: 4048198, actual: 7400000, unit: "views" },
    { metric: "Organic Views (TikTok)", target: 2900000, ly: 4048198, actual: 2076777, unit: "views" },
    { metric: "Reup Views (Facebook)", target: 0, ly: 0, actual: 1153000, unit: "views" },
    { metric: "Cost per Paid View 6s (CPV)", target: 85.0, ly: 75.0, actual: 45.0, unit: "đ", isInverse: true },
    { metric: "Tổng Ngân Sách (Budget)", target: 178000000, ly: 324000000, actual: 178000000, unit: "đ" },
    { metric: "Chi Phí Booking KOL", target: 178000000, ly: 324000000, actual: 178000000, unit: "đ" },
    { metric: "Chi Phí Media Spend", target: 0, ly: 0, actual: 0, unit: "đ" },
    { metric: "Organic Engagement", target: 114000, ly: 170655, actual: 71021, unit: "eng" },
    { metric: "Reactions (Likes)", target: null, ly: 135818, actual: 61179, unit: "likes" },
    { metric: "Comments", target: null, ly: 969, actual: 261, unit: "comments" },
    { metric: "Shares", target: null, ly: 10040, actual: 3280, unit: "shares" },
    { metric: "Saves", target: null, ly: 23828, actual: 6301, unit: "saves" },
    { metric: "Avg. View Time (Thời lượng xem)", target: 90.0, ly: 120.0, actual: 135.0, unit: "s" }
  ],
  kols: [
    { kol: "Trang Tấm", type: "Mid-tier", followers: "699.2K", cost: 38000000, targetViews: 600000, organicViews: 718000, reupViews: 120000, totalViews: 838000, targetEng: 30000, actualEng: 48970, avgTime: 169, cpv: 38.0, mediaSpend: 0 },
    { kol: "Khánh Linh", type: "Macro", followers: "1.1M", cost: 25000000, targetViews: 400000, organicViews: 341329, reupViews: 60000, totalViews: 401329, targetEng: 15000, actualEng: 2449, avgTime: 88, cpv: 42.0, mediaSpend: 0 },
    { kol: "Linh nấu", type: "Mid-tier", followers: "513.6K", cost: 18000000, targetViews: 300000, organicViews: 283832, reupViews: 45000, totalViews: 328832, targetEng: 12000, actualEng: 2276, avgTime: 105, cpv: 41.5, mediaSpend: 0 },
    { kol: "My Huyền", type: "Micro", followers: "148.2K", cost: 12000000, targetViews: 200000, organicViews: 195569, reupViews: 30000, totalViews: 225569, targetEng: 8000, actualEng: 3784, avgTime: 91, cpv: 43.0, mediaSpend: 0 },
    { kol: "Châu Kiều My", type: "Mid-tier", followers: "560.6K", cost: 18000000, targetViews: 300000, organicViews: 179723, reupViews: 35000, totalViews: 214723, targetEng: 10000, actualEng: 5494, avgTime: 128, cpv: 44.0, mediaSpend: 0 },
    { kol: "Nông Thôn Mới", type: "Micro", followers: "277.4K", cost: 12000000, targetViews: 200000, organicViews: 123992, reupViews: 25000, totalViews: 148992, targetEng: 6000, actualEng: 461, avgTime: 149, cpv: 45.0, mediaSpend: 0 },
    { kol: "Ăn gì Thương ơi", type: "Mid-tier", followers: "521.3K", cost: 15000000, targetViews: 250000, organicViews: 98667, reupViews: 20000, totalViews: 118667, targetEng: 8000, actualEng: 2226, avgTime: 196, cpv: 46.0, mediaSpend: 0 },
    { kol: "TOE NẤU GÌ ĐÓ", type: "Micro", followers: "287.6K", cost: 12000000, targetViews: 200000, organicViews: 65663, reupViews: 15000, totalViews: 80663, targetEng: 7000, actualEng: 2391, avgTime: 132, cpv: 48.0, mediaSpend: 0 },
    { kol: "Nấu Ăn Dễ Lắm", type: "Micro", followers: "407.2K", cost: 8000000, targetViews: 150000, organicViews: 37429, reupViews: 10000, totalViews: 47429, targetEng: 5000, actualEng: 1101, avgTime: 93, cpv: 49.0, mediaSpend: 0 },
    { kol: "Cơm nhà bếp xưa", type: "Nano", followers: "24.4K", cost: 5000000, targetViews: 100000, organicViews: 32573, reupViews: 8000, totalViews: 40573, targetEng: 3000, actualEng: 1871, avgTime: 209, cpv: 47.0, mediaSpend: 0 }
  ]
};

const fmtNum = (val) => {
  if (val === null || val === undefined) return "—";
  if (typeof val === "number") return val.toLocaleString();
  return val;
};

export default function DashboardView({ onOpen = () => {} }) {
  const [activeProject, setActiveProject] = useState("MSG");
  const [sortField, setSortField] = useState("totalViews");
  const [sortAsc, setSortAsc] = useState(false);

  const data = activeProject === "MSG" ? MSG_DATA : VINEGAR_DATA;

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
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "var(--surface)", padding: "16px 20px", gap: 16 }}>
      
      {/* ── PROJECT SWITCHER HEADER ── */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase" }}>DỰ ÁN:</span>
          <div style={{ display: "flex", gap: 4, background: "var(--paper)", padding: 3, borderRadius: 16, border: "1px solid var(--rule)" }}>
            <button 
              onClick={() => setActiveProject("MSG")}
              style={{
                padding: "6px 16px",
                borderRadius: 14,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                background: activeProject === "MSG" ? "var(--ok)" : "transparent",
                color: activeProject === "MSG" ? "#fff" : "var(--ink)"
              }}
            >
              🧂 [MSG] Bột Ngọt (25 KOLs)
            </button>
            <button 
              onClick={() => setActiveProject("VINEGAR")}
              style={{
                padding: "6px 16px",
                borderRadius: 14,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                background: activeProject === "VINEGAR" ? "var(--blue)" : "transparent",
                color: activeProject === "VINEGAR" ? "#fff" : "var(--ink)"
              }}
            >
              🍶 VINEGAR Giấm Gạo (10 KOLs)
            </button>
          </div>
        </div>

        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", background: "var(--paper)", padding: "4px 10px", borderRadius: 8, border: "1px solid var(--rule)" }}>
          ĐỐI CHIẾU THỰC TẾ (FY26) vs KẾ HOẠCH (TARGET) vs CÙNG KỲ (LY FY25)
        </span>
      </div>

      {/* ── SHOPEE-STYLE KPI CARDS WITH INLINE DELTA TAGS (+ / -) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {data.cards.map((card, idx) => (
          <div 
            key={idx}
            style={{
              background: "var(--card)",
              borderRadius: 14,
              border: "1px solid var(--rule)",
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              boxShadow: "0 2px 8px rgba(46, 56, 64, 0.02)"
            }}
          >
            {/* Title */}
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--ink-soft)", letterSpacing: "0.04em" }}>
              {card.title}
            </div>

            {/* Big Main Number */}
            <div style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)", fontFamily: "'IBM Plex Mono', monospace" }}>
              {card.value}
            </div>

            {/* Shopee-style Comparison Delta Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 2 }}>
              
              {/* vs Target */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                <span 
                  className="kt-badge" 
                  style={{ 
                    background: card.vsTarget.isGood ? "var(--ok-bg)" : card.vsTarget.isGood === false ? "var(--danger-bg)" : "var(--paper)", 
                    color: card.vsTarget.isGood ? "var(--ok)" : card.vsTarget.isGood === false ? "var(--danger)" : "var(--ink)", 
                    fontWeight: 800,
                    fontSize: 10,
                    padding: "2px 6px"
                  }}
                >
                  {card.vsTarget.pct.startsWith("+") || card.vsTarget.pct.startsWith("-") ? (card.vsTarget.pct.startsWith("+") ? "▲ " : "▼ ") : ""}{card.vsTarget.pct} ({card.vsTarget.diff})
                </span>
                <span style={{ color: "var(--ink-mid)" }}>{card.vsTarget.label}</span>
              </div>

              {/* vs LY */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                <span 
                  className="kt-badge" 
                  style={{ 
                    background: card.vsLY.isGood ? "var(--ok-bg)" : card.vsLY.isGood === false ? "var(--danger-bg)" : "var(--paper)", 
                    color: card.vsLY.isGood ? "var(--ok)" : card.vsLY.isGood === false ? "var(--danger)" : "var(--ink)", 
                    fontWeight: 800,
                    fontSize: 10,
                    padding: "2px 6px"
                  }}
                >
                  {card.vsLY.pct.startsWith("+") || card.vsLY.pct.startsWith("-") ? (card.vsLY.pct.startsWith("+") ? "▲ " : "▼ ") : ""}{card.vsLY.pct} ({card.vsLY.diff})
                </span>
                <span style={{ color: "var(--ink-mid)" }}>{card.vsLY.label}</span>
              </div>

            </div>

            {/* Sub note / secondary data */}
            <div style={{ fontSize: 10, color: "var(--ink-soft)", borderTop: "1px dashed var(--rule)", paddingTop: 6, marginTop: 4 }}>
              {card.subLabel}
            </div>
          </div>
        ))}
      </div>

      {/* ── SUMMARY COMPARISON TABLE WITH INLINE DELTA COLUMNS ── */}
      <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--rule)", overflow: "hidden" }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="kt-caps" style={{ color: "var(--ink-soft)" }}>BẢNG ĐỐI CHIẾU SỐ LIỆU TỔNG THỂ VÀ BIẾN ĐỘNG TĂNG/GIẢM (+ / -)</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="kt-table" style={{ width: "100%", fontSize: 12 }}>
            <thead>
              <tr>
                <th>Chỉ Số (Metric)</th>
                <th style={{ textAlign: "right" }}>Target (Kế hoạch)</th>
                <th style={{ textAlign: "right" }}>LY (Cùng kỳ)</th>
                <th style={{ textAlign: "right" }}>Actual (Thực tế)</th>
                <th style={{ textAlign: "center" }}>Biến động vs Target (+/-)</th>
                <th style={{ textAlign: "center" }}>Biến động vs Cùng kỳ LY (+/-)</th>
              </tr>
            </thead>
            <tbody>
              {data.summaryTable.map((row, idx) => {
                const pctTarget = row.target ? ((row.actual / row.target) * 100).toFixed(1) : null;
                const diffTarget = row.target ? (row.actual - row.target) : null;
                const pctLY = row.ly ? (((row.actual - row.ly) / row.ly) * 100).toFixed(1) : null;
                const diffLY = row.ly ? (row.actual - row.ly) : null;

                const isTargetGood = row.isInverse ? (diffTarget !== null && diffTarget <= 0) : (diffTarget !== null && diffTarget >= 0);
                const isLYGood = row.isInverse ? (diffLY !== null && diffLY <= 0) : (diffLY !== null && diffLY >= 0);

                return (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700 }}>{row.metric}</td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{fmtNum(row.target)}</td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{fmtNum(row.ly)}</td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "var(--ink)" }}>{fmtNum(row.actual)}</td>
                    
                    {/* Inline Delta vs Target */}
                    <td style={{ textAlign: "center" }}>
                      {diffTarget !== null ? (
                        <span 
                          className="kt-badge" 
                          style={{ 
                            background: isTargetGood ? "var(--ok-bg)" : "var(--danger-bg)", 
                            color: isTargetGood ? "var(--ok)" : "var(--danger)",
                            fontWeight: 800,
                            fontSize: 11
                          }}
                        >
                          {diffTarget >= 0 ? `▲ +${pctTarget}% (+${fmtNum(diffTarget)})` : `▼ ${pctTarget}% (${fmtNum(diffTarget)})`}
                        </span>
                      ) : "—"}
                    </td>

                    {/* Inline Delta vs LY */}
                    <td style={{ textAlign: "center" }}>
                      {diffLY !== null ? (
                        <span 
                          className="kt-badge" 
                          style={{ 
                            background: isLYGood ? "var(--ok-bg)" : "var(--danger-bg)", 
                            color: isLYGood ? "var(--ok)" : "var(--danger)",
                            fontWeight: 800,
                            fontSize: 11
                          }}
                        >
                          {diffLY >= 0 ? `▲ +${pctLY}% (+${fmtNum(diffLY)})` : `▼ ${pctLY}% (${fmtNum(diffLY)})`}
                        </span>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── FULL KOLS NUMERICAL MATRIX WITH INLINE KPI TAGS ── */}
      <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--rule)", overflow: "hidden" }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="kt-caps" style={{ color: "var(--ink-soft)" }}>BẢNG SỐ LIỆU TỪNG KOL ({sortedKols.length} KOLs)</span>
          <span style={{ fontSize: 11, color: "var(--ink-soft)" }}>Bấm tiêu đề cột để sắp xếp</span>
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
                  Cost (VNĐ) {sortField === "cost" && (sortAsc ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("targetViews")} style={{ textAlign: "right", cursor: "pointer" }}>
                  Target Views {sortField === "targetViews" && (sortAsc ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("organicViews")} style={{ textAlign: "right", cursor: "pointer" }}>
                  Organic Views {sortField === "organicViews" && (sortAsc ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("reupViews")} style={{ textAlign: "right", cursor: "pointer" }}>
                  FB Reup {sortField === "reupViews" && (sortAsc ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("totalViews")} style={{ textAlign: "right", cursor: "pointer" }}>
                  Total Views {sortField === "totalViews" && (sortAsc ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("pctKPI")} style={{ textAlign: "center", cursor: "pointer" }}>
                  % Đạt vs Target {sortField === "pctKPI" && (sortAsc ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("actualEng")} style={{ textAlign: "right", cursor: "pointer" }}>
                  Engagement {sortField === "actualEng" && (sortAsc ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("avgTime")} style={{ textAlign: "center", cursor: "pointer" }}>
                  Avg Time (s) {sortField === "avgTime" && (sortAsc ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("cpv")} style={{ textAlign: "right", cursor: "pointer" }}>
                  CPV 6s (đ) {sortField === "cpv" && (sortAsc ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("mediaSpend")} style={{ textAlign: "right", cursor: "pointer" }}>
                  Media Spend {sortField === "mediaSpend" && (sortAsc ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedKols.map((k, idx) => {
                const diffView = k.totalViews - k.targetViews;
                const pct = ((k.totalViews / k.targetViews) * 100).toFixed(1);
                return (
                  <tr key={idx} style={{ cursor: "pointer" }} onClick={() => onOpen(k)}>
                    <td style={{ fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap" }}>{k.kol}</td>
                    <td><span className="kt-badge" style={{ background: "var(--paper)", color: "var(--ink-mid)" }}>{k.type}</span></td>
                    <td style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{k.followers}</td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{k.cost.toLocaleString()}đ</td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{k.targetViews.toLocaleString()}</td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{k.organicViews.toLocaleString()}</td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "var(--blue)" }}>+{k.reupViews.toLocaleString()}</td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "var(--ink)" }}>
                      {k.totalViews.toLocaleString()}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span 
                        className="kt-badge" 
                        style={{ 
                          background: diffView >= 0 ? "var(--ok-bg)" : "var(--danger-bg)", 
                          color: diffView >= 0 ? "var(--ok)" : "var(--danger)", 
                          fontWeight: 800,
                          fontSize: 11
                        }}
                      >
                        {diffView >= 0 ? `▲ +${pct}% (+${fmtNum(diffView)})` : `▼ ${pct}% (${fmtNum(diffView)})`}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{k.actualEng.toLocaleString()}</td>
                    <td style={{ textAlign: "center", fontWeight: 700 }}>
                      {typeof k.avgTime === "number" && k.avgTime > 60 ? `${Math.floor(k.avgTime / 60)}m${k.avgTime % 60}s` : `${k.avgTime}s`}
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: k.cpv <= 45 ? "var(--ok)" : "var(--ink)" }}>{k.cpv}đ</td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                      {k.mediaSpend > 0 ? `${k.mediaSpend.toLocaleString()}đ` : "0đ"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: "var(--paper)", borderTop: "2px solid var(--rule)", fontWeight: 800 }}>
                <td>TỔNG CỘNG ({sortedKols.length} KOLs)</td>
                <td>—</td>
                <td>—</td>
                <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                  {sortedKols.reduce((a, b) => a + b.cost, 0).toLocaleString()}đ
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
                <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "var(--ink)", fontSize: 13 }}>
                  {sortedKols.reduce((a, b) => a + b.totalViews, 0).toLocaleString()}
                </td>
                <td style={{ textAlign: "center" }}>
                  {(() => {
                    const totalT = sortedKols.reduce((a, b) => a + b.targetViews, 0);
                    const totalA = sortedKols.reduce((a, b) => a + b.totalViews, 0);
                    const diff = totalA - totalT;
                    const pct = ((totalA / totalT) * 100).toFixed(1);
                    return (
                      <span className="kt-badge" style={{ background: diff >= 0 ? "var(--ok)" : "var(--danger)", color: "#fff", fontWeight: 800 }}>
                        {diff >= 0 ? `▲ +${pct}% (+${fmtNum(diff)})` : `▼ ${pct}% (${fmtNum(diff)})`}
                      </span>
                    );
                  })()}
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
                  {sortedKols.reduce((a, b) => a + b.mediaSpend, 0).toLocaleString()}đ
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
}
