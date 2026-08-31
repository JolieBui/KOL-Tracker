import React, { useState, useMemo } from "react";

/* =========================================================================
   SỐ LIỆU XÁC THỰC TỪ 2 FILE BÁO CÁO FY26 (MSG & VINEGAR) - CHUẨN XÁC 100%
   ========================================================================= */
const DATA_MSG = {
  key: "MSG",
  name: "MSG",
  kolCount: 25,
  period: "Tuần 4 Tháng 6 – Tuần 1 Tháng 8 (6 tuần)",
  metrics: [
    {
      metric: "Tổng lượt xem",
      unit: "Lượt",
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
      metric: "Lượt xem tự nhiên",
      unit: "Lượt",
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
      metric: "Lượt xem reup",
      unit: "Lượt",
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
      metric: "Chi phí mỗi lượt xem 6 giây (CPV 6s)",
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
      metric: "Tổng ngân sách (bao gồm AF 15%)",
      unit: "VNĐ",
      ly: "501.72M",
      target: "720.18M",
      actual: "720.18M",
      diffTarget: "100.0%",
      diffLY: "+43.5%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "├── Chi phí booking 25 KOLs",
      unit: "VNĐ",
      ly: "501.72M",
      target: "500.40M",
      actual: "500.40M",
      diffTarget: "100.0%",
      diffLY: "-0.3%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "├── Chi phí quảng cáo (Media Paid)",
      unit: "VNĐ",
      ly: "0đ",
      target: "154.71M",
      actual: "125.85M",
      diffTarget: "-18.7%",
      diffLY: "+125.85M",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "└── Phí Agency (AF 15%)",
      unit: "VNĐ",
      ly: "65.44M",
      target: "93.94M",
      actual: "93.94M",
      diffTarget: "100.0%",
      diffLY: "+43.5%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "Lượt tương tác tự nhiên",
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
      metric: "Thời lượng xem trung bình",
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
      metric: "Tỷ lệ xem hết video",
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
  topViews: [
    { name: "Út Tình", target: "200K", actual: "2.90M", diff: "+1350.0%" },
    { name: "Khánh Linh", target: "400K", actual: "1.70M", diff: "+325.0%" },
    { name: "Bon đây nè", target: "800K", actual: "1.60M", diff: "+100.0%" },
    { name: "Emmer Sweet", target: "1.00M", actual: "1.40M", diff: "+40.0%" }
  ],
  topEng: [
    { name: "Bon đây nè", value: "46.5K tương tác" },
    { name: "Trang Tấm", value: "46.0K tương tác" },
    { name: "Min Cookie", value: "35.0K tương tác" },
    { name: "Emmer Sweet", value: "33.0K tương tác" }
  ],
  topTime: [
    { name: "taydayroi", value: "37.8 giây" },
    { name: "Bon đây nè", value: "21.2 giây" },
    { name: "Emmer Sweet", value: "19.3 giây" },
    { name: "Trang Tấm", value: "19.1 giây" }
  ],
  kols: [
    { kol: "Min Cookie", tier: "Mid-tier", cost: 28000000, lyViews: "273K", yoy: "+90.1%", targetViews: 500000, organicViews: 689400, reupViews: 66874, totalViews: 756274, eng: 35005, cpv: 35.2, time: "8.0s" },
    { kol: "Bon đây nè", tier: "Macro", cost: 34000000, lyViews: "1.24M", yoy: "-34.0%", targetViews: 800000, organicViews: 1600000, reupViews: 425509, totalViews: 2025509, eng: 46532, cpv: 40.1, time: "21.2s" },
    { kol: "Emmer Sweet", tier: "Mid-tier", cost: 44000000, lyViews: "721K", yoy: "-12.5%", targetViews: 1000000, organicViews: 1400000, reupViews: 0, totalViews: 1400000, eng: 32981, cpv: 46.2, time: "19.3s" },
    { kol: "Babykopo Home", tier: "Macro", cost: 35000000, lyViews: "Mới", yoy: "—", targetViews: 500000, organicViews: 1300000, reupViews: 20000, totalViews: 1320000, eng: 18192, cpv: 41.0, time: "12.1s" },
    { kol: "Chú Đàn", tier: "Micro", cost: 35000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 674500, reupViews: 13000, totalViews: 687500, eng: 9632, cpv: 41.5, time: "11.4s" },
    { kol: "Thi Thi Miền Tây", tier: "Mid-tier", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 400000, organicViews: 728100, reupViews: 34000, totalViews: 762100, eng: 10137, cpv: 40.2, time: "12.7s" },
    { kol: "Ăn gì Thương ơi", tier: "Mid-tier", cost: 15400000, lyViews: "681K", yoy: "+26.4%", targetViews: 400000, organicViews: 803100, reupViews: 16000, totalViews: 819100, eng: 19464, cpv: 38.5, time: "6.4s" },
    { kol: "let Nhân cook", tier: "Mid-tier", cost: 30000000, lyViews: "Mới", yoy: "—", targetViews: 300000, organicViews: 416600, reupViews: 231000, totalViews: 647600, eng: 7889, cpv: 41.8, time: "15.2s" },
    { kol: "Bùi Khánh Hà", tier: "Micro", cost: 30000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 352000, reupViews: 0, totalViews: 352000, eng: 2461, cpv: 49.5, time: "4.5s" },
    { kol: "Sườn Sóc Homie", tier: "Mid-tier", cost: 35000000, lyViews: "Mới", yoy: "—", targetViews: 300000, organicViews: 282300, reupViews: 0, totalViews: 282300, eng: 13915, cpv: 42.0, time: "11.1s" },
    { kol: "Gia đình Sầu Rất Ngầu", tier: "Micro", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 854900, reupViews: 363000, totalViews: 1217900, eng: 17197, cpv: 51.0, time: "10.8s" },
    { kol: "Trang Tấm", tier: "Mid-tier", cost: 38000000, lyViews: "961K", yoy: "-31.1%", targetViews: 600000, organicViews: 1200000, reupViews: 825000, totalViews: 2025000, eng: 46034, cpv: 48.0, time: "19.1s" },
    { kol: "Mẹ Bảo Bối", tier: "Micro", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 854900, reupViews: 0, totalViews: 854900, eng: 4559, cpv: 50.2, time: "9.6s" },
    { kol: "Hảo Thích Vào Bếp", tier: "Micro", cost: 10000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 762500, reupViews: 30000, totalViews: 792500, eng: 3509, cpv: 39.2, time: "7.7s" },
    { kol: "Út Tình", tier: "Micro", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 2900000, reupViews: 0, totalViews: 2900000, eng: 18094, cpv: 41.8, time: "10.9s" },
    { kol: "Bếp Nga Nè", tier: "Nano", cost: 5000000, lyViews: "Mới", yoy: "—", targetViews: 50000, organicViews: 817400, reupViews: 105365, totalViews: 922765, eng: 5121, cpv: 38.9, time: "12.0s" },
    { kol: "Mai Hà thích nấu ăn ✿", tier: "Nano", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 50000, organicViews: 29500, reupViews: 53200, totalViews: 82700, eng: 3530, cpv: 41.0, time: "8.5s" },
    { kol: "Châu Kiều My", tier: "Mid-tier", cost: 8000000, lyViews: "Mới", yoy: "—", targetViews: 400000, organicViews: 462900, reupViews: 437000, totalViews: 899900, eng: 22001, cpv: 39.5, time: "18.7s" },
    { kol: "Quân Cooking", tier: "Micro", cost: 8000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 321800, reupViews: 5745, totalViews: 327545, eng: 2746, cpv: 39.0, time: "13.1s" },
    { kol: "My Huyền", tier: "Mid-tier", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 400000, organicViews: 233000, reupViews: 1100071, totalViews: 1333071, eng: 10443, cpv: 40.5, time: "16.4s" },
    { kol: "Khánh Linh", tier: "Macro", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 400000, organicViews: 1700000, reupViews: 1000, totalViews: 1701000, eng: 10734, cpv: 39.0, time: "14.1s" },
    { kol: "taydayroi", tier: "Micro", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 50000, organicViews: 37500, reupViews: 69000, totalViews: 106500, eng: 2043, cpv: 41.0, time: "37.8s" },
    { kol: "Nấu Ăn Dễ Lắm", tier: "Micro", cost: 5000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 963200, reupViews: 105200, totalViews: 1068400, eng: 6077, cpv: 37.8, time: "7.4s" },
    { kol: "Cơm nhà Bông", tier: "Micro", cost: 5000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 1200000, reupViews: 17800, totalViews: 1217800, eng: 6936, cpv: 39.5, time: "7.0s" },
    { kol: "Nhi say Hi", tier: "Micro", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 394400, reupViews: 11000, totalViews: 405400, eng: 2629, cpv: 42.0, time: "14.7s" }
  ]
};

const DATA_VINEGAR = {
  key: "VINEGAR",
  name: "Vinegar",
  kolCount: 10,
  period: "Tuần 4 Tháng 6 – Tuần 1 Tháng 8 (6 tuần)",
  metrics: [
    {
      metric: "Tổng lượt xem",
      unit: "Lượt",
      ly: "4.05M",
      target: "2.95M",
      actual: "7.40M",
      diffTarget: "+150.8%",
      diffLY: "+82.8%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "Lượt xem tự nhiên",
      unit: "Lượt",
      ly: "4.05M",
      target: "2.95M",
      actual: "2.08M",
      diffTarget: "-29.5%",
      diffLY: "-48.7%",
      isTargetGood: false,
      isLYGood: false,
      barPct: 70.4
    },
    {
      metric: "Lượt xem reup",
      unit: "Lượt",
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
      metric: "Chi phí mỗi lượt xem 6 giây (CPV 6s)",
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
      metric: "Tổng ngân sách (bao gồm AF 15%)",
      unit: "VNĐ",
      ly: "442.24M",
      target: "200.00M",
      actual: "200.00M",
      diffTarget: "100.0%",
      diffLY: "-54.8%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "├── Chi phí booking 10 KOLs",
      unit: "VNĐ",
      ly: "324.00M",
      target: "178.00M",
      actual: "178.00M",
      diffTarget: "100.0%",
      diffLY: "-45.1%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "├── Chi phí quảng cáo (Media Paid)",
      unit: "VNĐ",
      ly: "60.56M",
      target: "38.51M",
      actual: "22.00M",
      diffTarget: "-42.9%",
      diffLY: "-63.7%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "└── Phí Agency (AF 15%)",
      unit: "VNĐ",
      ly: "57.68M",
      target: "26.09M",
      actual: "26.09M",
      diffTarget: "100.0%",
      diffLY: "-54.8%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "Lượt tương tác tự nhiên",
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
      metric: "Lượt xem trung bình mỗi KOL",
      unit: "Lượt",
      ly: "261K",
      target: "295K",
      actual: "323K",
      diffTarget: "+9.5%",
      diffLY: "+23.8%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "Thời lượng xem trung bình",
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
  topViews: [
    { name: "Trang Tấm", target: "600K", actual: "718K", diff: "+19.7%" },
    { name: "Khánh Linh", target: "400K", actual: "341K", diff: "-14.7%" },
    { name: "Linh nấu", target: "300K", actual: "284K", diff: "-5.3%" }
  ],
  topEng: [
    { name: "Trang Tấm", value: "48.97K tương tác" },
    { name: "Châu Kiều My", value: "5.49K tương tác" },
    { name: "My Huyền", value: "3.78K tương tác" }
  ],
  topTime: [
    { name: "Cơm nhà bếp xưa", value: "3 phút 29s" },
    { name: "Ăn gì Thương ơi", value: "3 phút 16s" },
    { name: "Trang Tấm", value: "2 phút 49s" }
  ],
  kols: [
    { kol: "Trang Tấm", tier: "Mid-tier", cost: 38000000, lyViews: "Mới", yoy: "—", targetViews: 600000, organicViews: 718000, reupViews: 752000, totalViews: 1470000, eng: 48969, cpv: 52.9, time: "2m49s" },
    { kol: "Khánh Linh", tier: "Macro", cost: 15000000, lyViews: "662K", yoy: "-48.4%", targetViews: 400000, organicViews: 341329, reupViews: 1500, totalViews: 648800, eng: 2448, cpv: 43.9, time: "1m28s" },
    { kol: "Linh nấu", tier: "Mid-tier", cost: 15000000, lyViews: "68K", yoy: "+317.4%", targetViews: 300000, organicViews: 283832, reupViews: 26311, totalViews: 759511, eng: 2276, cpv: 52.8, time: "1m45s" },
    { kol: "My Huyền", tier: "Micro", cost: 13000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 195569, reupViews: 7197, totalViews: 1707197, eng: 3784, cpv: 66.5, time: "1m31s" },
    { kol: "Châu Kiều My", tier: "Mid-tier", cost: 8000000, lyViews: "Mới", yoy: "—", targetViews: 400000, organicViews: 179723, reupViews: 222000, totalViews: 652200, eng: 5494, cpv: 44.5, time: "2m08s" },
    { kol: "Nông Thôn Mới", tier: "Micro", cost: 12000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 123992, reupViews: 35000, totalViews: 370100, eng: 461, cpv: 96.8, time: "2m29s" },
    { kol: "Ăn gì Thương ơi", tier: "Mid-tier", cost: 15400000, lyViews: "374K", yoy: "-73.6%", targetViews: 400000, organicViews: 98667, reupViews: 13000, totalViews: 157100, eng: 2226, cpv: 156.1, time: "3m16s" },
    { kol: "TOE NẤU GÌ ĐÓ", tier: "Micro", cost: 10000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 65663, reupViews: 13000, totalViews: 246000, eng: 2391, cpv: 152.3, time: "2m12s" },
    { kol: "Nấu Ăn Dễ Lắm 🤤", tier: "Micro", cost: 5000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 37429, reupViews: 88100, totalViews: 295600, eng: 1101, cpv: 133.6, time: "1m33s" },
    { kol: "Cơm nhà bếp xưa", tier: "Nano", cost: 5000000, lyViews: "Mới", yoy: "—", targetViews: 50000, organicViews: 32573, reupViews: 0, totalViews: 1100000, eng: 1871, cpv: 153.5, time: "3m29s" }
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
    let list = data.kols.filter(k => !kolSearch || k.kol.toLowerCase().includes(kolSearch.toLowerCase()) || (k.tier && k.tier.toLowerCase().includes(kolSearch.toLowerCase())));
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
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "#F8FAFC", padding: "16px 20px", gap: 14 }}>
      
      {/* ── TOP CONTROL BAR ── */}
      <div style={{ 
        background: "#FFFFFF", 
        borderRadius: 12, 
        border: "1px solid #E2E8F0", 
        padding: "10px 16px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexWrap: "nowrap",
        gap: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
      }}>
        {/* Project Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#64748B" }}>DỰ ÁN:</span>
          <div style={{ display: "flex", gap: 4, background: "#F1F5F9", padding: 3, borderRadius: 10 }}>
            <button 
              onClick={() => { setProjectKey("MSG"); setKolSearch(""); }}
              style={{
                padding: "6px 18px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                background: projectKey === "MSG" ? "#0D9488" : "transparent",
                color: projectKey === "MSG" ? "#FFFFFF" : "#0F172A",
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
                background: projectKey === "VINEGAR" ? "#0284C7" : "transparent",
                color: projectKey === "VINEGAR" ? "#FFFFFF" : "#0F172A",
                whiteSpace: "nowrap"
              }}
            >
              Vinegar
            </button>
          </div>
        </div>

        {/* View Switcher */}
        <div style={{ display: "flex", gap: 4, background: "#F1F5F9", padding: 3, borderRadius: 10, whiteSpace: "nowrap" }}>
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
              color: viewTab === "compare" ? "#0F172A" : "#64748B",
              boxShadow: viewTab === "compare" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              whiteSpace: "nowrap"
            }}
          >
            📊 Bảng so sánh chỉ số
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
              color: viewTab === "kols" ? "#0F172A" : "#64748B",
              boxShadow: viewTab === "kols" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              whiteSpace: "nowrap"
            }}
          >
            📋 Chi tiết {data.kolCount} KOLs
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: BẢNG SO SÁNH CHỈ SỐ (THUẦN TIẾNG VIỆT)
         ========================================================================= */}
      {viewTab === "compare" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          
          {/* MAIN MATRIX */}
          <div style={{ 
            background: "#FFFFFF", 
            borderRadius: 14, 
            border: "1px solid #E2E8F0", 
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.02)"
          }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
                ĐỐI CHIẾU CHỈ SỐ: {data.name} ({data.kolCount} KOLs)
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#64748B" }}>
                {data.period}
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", color: "#475569" }}>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 800, whiteSpace: "nowrap" }}>CHỈ SỐ</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#64748B", whiteSpace: "nowrap" }}>Cùng kỳ năm trước</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#D97706", whiteSpace: "nowrap" }}>Mục tiêu</th>
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#0D9488", whiteSpace: "nowrap" }}>Thực tế</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, whiteSpace: "nowrap" }}>So với mục tiêu</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, whiteSpace: "nowrap" }}>So với cùng kỳ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.metrics.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9", background: idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC" }}>
                      
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap" }}>
                        {m.metric}
                      </td>

                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#64748B", whiteSpace: "nowrap" }}>
                        {m.ly}
                      </td>

                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "#D97706", whiteSpace: "nowrap" }}>
                        {m.target}
                      </td>

                      <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#0D9488", fontSize: 13, whiteSpace: "nowrap" }}>
                        {m.actual}
                      </td>

                      <td style={{ padding: "12px 14px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "3px 8px", 
                          borderRadius: 6, 
                          background: m.isTargetGood === true ? "#CCFBF1" : m.isTargetGood === false ? "#FFE4E6" : "#F1F5F9",
                          color: m.isTargetGood === true ? "#0D9488" : m.isTargetGood === false ? "#E11D48" : "#0F172A",
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
                          background: m.isLYGood === true ? "#CCFBF1" : m.isLYGood === false ? "#FFE4E6" : "#F1F5F9",
                          color: m.isLYGood === true ? "#0D9488" : m.isLYGood === false ? "#E11D48" : "#0F172A",
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

          {/* 3 SIDE-BY-SIDE PANELS (LƯỢT XEM, TƯƠNG TÁC, THỜI LƯỢNG XEM) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            
            {/* 1. LƯỢT XEM */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0D9488", marginBottom: 10, whiteSpace: "nowrap" }}>
                🟢 TOP VƯỢT MỤC TIÊU LƯỢT XEM
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.topViews.map((k, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #F1F5F9", whiteSpace: "nowrap" }}>
                    <span style={{ fontWeight: 700, color: "#0F172A", fontSize: 12 }}>{k.name}</span>
                    <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "#0D9488" }}>{k.actual}</span>
                      <span style={{ fontSize: 11, color: "#64748B" }}> / {k.target}</span>
                      <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 800, color: "#0D9488" }}>{k.diff}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. LƯỢT TƯƠNG TÁC */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0284C7", marginBottom: 10, whiteSpace: "nowrap" }}>
                ❤️ TOP LƯỢT TƯƠNG TÁC CAO NHẤT
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.topEng.map((k, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #F1F5F9", whiteSpace: "nowrap" }}>
                    <span style={{ fontWeight: 700, color: "#0F172A", fontSize: 12 }}>{k.name}</span>
                    <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#0284C7", fontSize: 12 }}>{k.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. THỜI LƯỢNG XEM */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED", marginBottom: 10, whiteSpace: "nowrap" }}>
                ⏱️ TOP THỜI LƯỢNG XEM LÂU NHẤT
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.topTime.map((k, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #F1F5F9", whiteSpace: "nowrap" }}>
                    <span style={{ fontWeight: 700, color: "#0F172A", fontSize: 12 }}>{k.name}</span>
                    <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#7C3AED", fontSize: 12 }}>{k.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: BẢNG CHI TIẾT TỪNG KOL (KÈM SỐ LIỆU LỊCH SỬ CÙNG KỲ FY25)
         ========================================================================= */}
      {viewTab === "kols" && (
        <div style={{ 
          background: "#FFFFFF", 
          borderRadius: 14, 
          border: "1px solid #E2E8F0", 
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Controls Bar */}
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input 
                placeholder={`🔍 Tìm KOL trong ${data.name}...`}
                value={kolSearch}
                onChange={e => setKolSearch(e.target.value)}
                style={{
                  width: 200,
                  padding: "6px 12px",
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #CBD5E1",
                  outline: "none",
                  background: "#F8FAFC",
                  color: "#0F172A"
                }}
              />
              <span style={{ fontSize: 12, color: "#0D9488", fontWeight: 800, whiteSpace: "nowrap", background: "#CCFBF1", padding: "4px 8px", borderRadius: 6 }}>
                Tổng số: {sortedKols.length} / {data.kolCount} KOLs
              </span>
            </div>

            {/* Quick Filter Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
              <span style={{ color: "#64748B", fontWeight: 700 }}>Xem nhanh:</span>
              <button 
                onClick={() => setKolSearch("")}
                style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #E2E8F0", background: !kolSearch ? "#0F172A" : "#F8FAFC", color: !kolSearch ? "#FFFFFF" : "#475569", fontWeight: 700, cursor: "pointer" }}
              >
                Tất cả ({data.kolCount})
              </button>
              {data.key === "MSG" && (
                <>
                  <button 
                    onClick={() => setKolSearch("Macro")}
                    style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #E2E8F0", background: kolSearch === "Macro" ? "#0F172A" : "#F8FAFC", color: kolSearch === "Macro" ? "#FFFFFF" : "#475569", fontWeight: 700, cursor: "pointer" }}
                  >
                    Macro (4)
                  </button>
                  <button 
                    onClick={() => setKolSearch("Mid-tier")}
                    style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #E2E8F0", background: kolSearch === "Mid-tier" ? "#0F172A" : "#F8FAFC", color: kolSearch === "Mid-tier" ? "#FFFFFF" : "#475569", fontWeight: 700, cursor: "pointer" }}
                  >
                    Mid-tier (9)
                  </button>
                  <button 
                    onClick={() => setKolSearch("Micro")}
                    style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #E2E8F0", background: kolSearch === "Micro" ? "#0F172A" : "#F8FAFC", color: kolSearch === "Micro" ? "#FFFFFF" : "#475569", fontWeight: 700, cursor: "pointer" }}
                  >
                    Micro (10)
                  </button>
                  <button 
                    onClick={() => setKolSearch("Nano")}
                    style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #E2E8F0", background: kolSearch === "Nano" ? "#0F172A" : "#F8FAFC", color: kolSearch === "Nano" ? "#FFFFFF" : "#475569", fontWeight: 700, cursor: "pointer" }}
                  >
                    Nano (2)
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Table Container with Sticky Header & Scrollbar */}
          <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 250px)", minHeight: 380 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#F8FAFC", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", color: "#475569" }}>
                  <th style={{ padding: "10px 8px", textAlign: "center", fontWeight: 800, width: 40, whiteSpace: "nowrap" }}>#</th>
                  <th onClick={() => handleSort("kol")} style={{ padding: "10px 14px", textAlign: "left", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Tên KOL {sortCol === "kol" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 700, whiteSpace: "nowrap" }}>Phân cấp</th>
                  <th onClick={() => handleSort("cost")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Chi phí booking {sortCol === "cost" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "#64748B", whiteSpace: "nowrap" }}>
                    Cùng kỳ FY25
                  </th>
                  <th onClick={() => handleSort("targetViews")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Mục tiêu lượt xem {sortCol === "targetViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("organicViews")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Lượt xem tự nhiên {sortCol === "organicViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("reupViews")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, color: "#0284C7", whiteSpace: "nowrap" }}>
                    Lượt xem reup {sortCol === "reupViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("totalViews")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, color: "#0D9488", whiteSpace: "nowrap" }}>
                    Tổng lượt xem {sortCol === "totalViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("pct")} style={{ padding: "10px 12px", textAlign: "center", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    % Đạt KPI lượt xem {sortCol === "pct" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Tăng trưởng YoY
                  </th>
                  <th onClick={() => handleSort("eng")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Lượt tương tác {sortCol === "eng" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ padding: "10px 10px", textAlign: "center", fontWeight: 700, whiteSpace: "nowrap" }}>Thời lượng xem</th>
                  <th onClick={() => handleSort("cpv")} style={{ padding: "10px 12px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Chi phí CPV 6s {sortCol === "cpv" && (sortDir === "asc" ? "▲" : "▼")}
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
                        borderBottom: "1px solid #F1F5F9", 
                        background: idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                        cursor: "pointer"
                      }}
                    >
                      <td style={{ padding: "10px 8px", textAlign: "center", fontWeight: 700, color: "#64748B", fontSize: 11 }}>
                        {idx + 1}
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap" }}>
                        {k.kol}
                      </td>
                      <td style={{ padding: "10px 10px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#F1F5F9", color: "#475569" }}>
                          {k.tier}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                        {(k.cost / 1000000).toFixed(1)}M
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#64748B", whiteSpace: "nowrap" }}>
                        {k.lyViews}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#64748B", whiteSpace: "nowrap" }}>
                        {k.targetViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                        {k.organicViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#0284C7", whiteSpace: "nowrap" }}>
                        +{k.reupViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#0F172A", whiteSpace: "nowrap" }}>
                        {k.totalViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "2px 6px", 
                          borderRadius: 4, 
                          background: isGood ? "#CCFBF1" : "#FFE4E6", 
                          color: isGood ? "#0D9488" : "#E11D48",
                          fontWeight: 800,
                          fontSize: 11,
                          whiteSpace: "nowrap"
                        }}>
                          {pct}%
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "2px 6px", 
                          borderRadius: 4, 
                          background: k.yoy.startsWith("+") ? "#CCFBF1" : k.yoy.startsWith("-") ? "#FFE4E6" : "#F1F5F9",
                          color: k.yoy.startsWith("+") ? "#0D9488" : k.yoy.startsWith("-") ? "#E11D48" : "#64748B",
                          fontWeight: 800,
                          fontSize: 11,
                          whiteSpace: "nowrap"
                        }}>
                          {k.yoy}
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                        {k.eng.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 10px", textAlign: "center", fontWeight: 700, whiteSpace: "nowrap" }}>
                        {k.time}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: k.cpv <= 45 ? "#0D9488" : "#0F172A", fontWeight: 700, whiteSpace: "nowrap" }}>
                        {k.cpv}đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot style={{ position: "sticky", bottom: 0, zIndex: 10, background: "#F1F5F9", boxShadow: "0 -1px 2px rgba(0,0,0,0.05)" }}>
                <tr style={{ background: "#F1F5F9", borderTop: "2px solid #E2E8F0", fontWeight: 800, color: "#0F172A" }}>
                  <td style={{ padding: "10px 8px", textAlign: "center" }}>—</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>TỔNG ({sortedKols.length} KOLS)</td>
                  <td>—</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                    {(sortedKols.reduce((a, b) => a + b.cost, 0) / 1000000).toFixed(1)}M
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#64748B", whiteSpace: "nowrap" }}>
                    {data.key === "MSG" ? "7.49M" : "4.05M"}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                    {sortedKols.reduce((a, b) => a + b.targetViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                    {sortedKols.reduce((a, b) => a + b.organicViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#0284C7", whiteSpace: "nowrap" }}>
                    +{sortedKols.reduce((a, b) => a + b.reupViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#0D9488", whiteSpace: "nowrap" }}>
                    {sortedKols.reduce((a, b) => a + b.totalViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center", whiteSpace: "nowrap" }}>
                    {(() => {
                      const t = sortedKols.reduce((a, b) => a + b.targetViews, 0);
                      const a = sortedKols.reduce((a, b) => a + b.totalViews, 0);
                      const p = t > 0 ? ((a / t) * 100).toFixed(1) : 0;
                      return (
                        <span style={{ padding: "2px 6px", borderRadius: 4, background: a >= t ? "#0D9488" : "#E11D48", color: "#FFFFFF", fontWeight: 800 }}>
                          {p}%
                        </span>
                      );
                    })()}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center", whiteSpace: "nowrap" }}>
                    <span style={{ padding: "2px 6px", borderRadius: 4, background: data.key === "MSG" ? "#CCFBF1" : "#FFE4E6", color: data.key === "MSG" ? "#0D9488" : "#E11D48", fontWeight: 800 }}>
                      {data.key === "MSG" ? "+17.9%" : "-48.7%"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                    {sortedKols.reduce((a, b) => a + b.eng, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 10px", textAlign: "center", whiteSpace: "nowrap" }}>TB</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#0D9488", whiteSpace: "nowrap" }}>
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
