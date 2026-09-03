import React, { useState, useMemo } from "react";

/* =========================================================================
   SỐ LIỆU XÁC THỰC TỪ 2 FILE BÁO CÁO FY26 (MSG & VINEGAR) - CHUẨN XÁC 100%
   ========================================================================= */
export const DATA_MSG = {
  key: "MSG",
  name: "MSG",
  kolCount: 25,
  period: "24/06 – 01/08 (Tuần 4 Tháng 6 – Tuần 1 Tháng 8)",
  highlights: [
    {
      icon: "🚀",
      value: "+8.6%",
      valueColor: "#15803D",
      label: "Organic View vs Target",
      sub: "8.85M vs 8.15M KPI (+18.1% vs LY)"
    },
    {
      icon: "⚡",
      value: "42.01đ",
      valueColor: "#15803D",
      label: "Tối ưu CPV 6s (-35.4%)",
      sub: "Mục tiêu 65đ | LY 52đ"
    },
    {
      icon: "💰",
      value: "720.18M",
      valueColor: "#15803D",
      label: "Ngân sách (incl AF)",
      sub: "Giải ngân 100% mục tiêu"
    },
    {
      icon: "👥",
      value: "25 KOLs",
      valueColor: "#0284C7",
      label: "Quy mô chiến dịch",
      sub: "24/06 – 01/08 (6 tuần)"
    }
  ],
  metrics: [
    {
      metric: "Tổng ngân sách (Budget include AF)",
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
      metric: "Lượt xem tự nhiên (Organic View)",
      unit: "Lượt",
      ly: "7.49M",
      target: "8.15M",
      actual: "8.85M",
      diffTarget: "+8.6%",
      diffLY: "+18.1%",
      isTargetGood: true,
      isLYGood: true,
      barPct: 100
    },
    {
      metric: "Chi phí mỗi lượt xem 6 giây (Cost per paid view 6s)",
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
      metric: "Lượt tương tác tự nhiên (Organic Engagement)",
      unit: "Lượt",
      ly: "340.5K",
      target: "253.6K",
      actual: "244.7K",
      diffTarget: "-3.5%",
      diffLY: "-28.1%",
      isTargetGood: false,
      isLYGood: false,
      barPct: 96.5
    },
    {
      metric: "Thời lượng xem trung bình (Avg View Time)",
      unit: "Giây",
      ly: "20.8s",
      target: "—",
      actual: "—",
      diffTarget: "—",
      diffLY: "—",
      isTargetGood: null,
      isLYGood: null,
      barPct: 100
    },
    {
      metric: "Tỷ lệ xem hết video (VTR 100%)",
      unit: "%",
      ly: "3.78%",
      target: "—",
      actual: "—",
      diffTarget: "—",
      diffLY: "—",
      isTargetGood: null,
      isLYGood: null,
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
    { kol: "Min Cookie", tier: "Mid-tier", cost: 28000000, lyViews: "273K", yoy: "+90.1%", targetViews: 500000, organicViews: 689400, reupViews: 66874, totalViews: 756274, eng: 35005, er: "7.04%", cpv: 35.2, time: "8.0s" },
    { kol: "Bon đây nè", tier: "Macro", cost: 34000000, lyViews: "1.24M", yoy: "-34.0%", targetViews: 800000, organicViews: 1600000, reupViews: 425509, totalViews: 2025509, eng: 46532, er: "3.08%", cpv: 40.1, time: "21.2s" },
    { kol: "Emmer Sweet", tier: "Mid-tier", cost: 44000000, lyViews: "721K", yoy: "-12.5%", targetViews: 1000000, organicViews: 1400000, reupViews: 0, totalViews: 1400000, eng: 32981, er: "3.66%", cpv: 46.2, time: "19.3s" },
    { kol: "Babykopo Home", tier: "Macro", cost: 35000000, lyViews: "Mới", yoy: "—", targetViews: 500000, organicViews: 1300000, reupViews: 20000, totalViews: 1320000, eng: 18192, er: "1.73%", cpv: 41.0, time: "12.1s" },
    { kol: "Chú Đàn", tier: "Micro", cost: 35000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 674500, reupViews: 13000, totalViews: 687500, eng: 9632, er: "2.92%", cpv: 41.5, time: "11.4s" },
    { kol: "Thi Thi Miền Tây", tier: "Mid-tier", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 400000, organicViews: 728100, reupViews: 34000, totalViews: 762100, eng: 10137, er: "1.22%", cpv: 40.2, time: "12.7s" },
    { kol: "Ăn gì Thương ơi", tier: "Mid-tier", cost: 15400000, lyViews: "681K", yoy: "+26.4%", targetViews: 400000, organicViews: 803100, reupViews: 16000, totalViews: 819100, eng: 19464, er: "6.52%", cpv: 38.5, time: "6.4s" },
    { kol: "let Nhân cook", tier: "Mid-tier", cost: 30000000, lyViews: "Mới", yoy: "—", targetViews: 300000, organicViews: 416600, reupViews: 231000, totalViews: 647600, eng: 7889, er: "1.80%", cpv: 41.8, time: "15.2s" },
    { kol: "Bùi Khánh Hà", tier: "Micro", cost: 30000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 352000, reupViews: 0, totalViews: 352000, eng: 2461, er: "1.44%", cpv: 49.5, time: "4.5s" },
    { kol: "Sườn Sóc Homie", tier: "Mid-tier", cost: 35000000, lyViews: "Mới", yoy: "—", targetViews: 300000, organicViews: 282300, reupViews: 0, totalViews: 282300, eng: 13915, er: "4.93%", cpv: 42.0, time: "11.1s" },
    { kol: "Gia đình Sầu Rất Ngầu", tier: "Micro", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 854900, reupViews: 363000, totalViews: 1217900, eng: 17197, er: "1.87%", cpv: 51.0, time: "10.8s" },
    { kol: "Trang Tấm", tier: "Mid-tier", cost: 38000000, lyViews: "961K", yoy: "-31.1%", targetViews: 600000, organicViews: 1200000, reupViews: 825000, totalViews: 2025000, eng: 46034, er: "2.55%", cpv: 48.0, time: "19.1s" },
    { kol: "Mẹ Bảo Bối", tier: "Micro", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 854900, reupViews: 0, totalViews: 854900, eng: 4559, er: "0.98%", cpv: 50.2, time: "9.6s" },
    { kol: "Hảo Thích Vào Bếp", tier: "Micro", cost: 10000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 762500, reupViews: 30000, totalViews: 792500, eng: 3509, er: "0.73%", cpv: 39.2, time: "7.7s" },
    { kol: "Út Tình", tier: "Micro", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 2900000, reupViews: 0, totalViews: 2900000, eng: 18094, er: "0.73%", cpv: 41.8, time: "10.9s" },
    { kol: "Bếp Nga Nè", tier: "Nano", cost: 5000000, lyViews: "Mới", yoy: "—", targetViews: 50000, organicViews: 817400, reupViews: 105365, totalViews: 922765, eng: 5121, er: "0.91%", cpv: 38.9, time: "12.0s" },
    { kol: "Mai Hà thích nấu ăn ✿", tier: "Nano", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 50000, organicViews: 29500, reupViews: 53200, totalViews: 82700, eng: 3530, er: "4.27%", cpv: 41.0, time: "8.5s" },
    { kol: "Châu Kiều My", tier: "Mid-tier", cost: 8000000, lyViews: "Mới", yoy: "—", targetViews: 400000, organicViews: 462900, reupViews: 437000, totalViews: 899900, eng: 22001, er: "2.44%", cpv: 39.5, time: "18.7s" },
    { kol: "Quân Cooking", tier: "Micro", cost: 8000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 321800, reupViews: 5745, totalViews: 327545, eng: 2746, er: "1.18%", cpv: 39.0, time: "13.1s" },
    { kol: "My Huyền", tier: "Mid-tier", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 400000, organicViews: 233000, reupViews: 1100071, totalViews: 1333071, eng: 10443, er: "0.78%", cpv: 40.5, time: "16.4s" },
    { kol: "Khánh Linh", tier: "Macro", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 400000, organicViews: 1700000, reupViews: 1000, totalViews: 1701000, eng: 10734, er: "1.32%", cpv: 39.0, time: "14.1s" },
    { kol: "taydayroi", tier: "Micro", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 50000, organicViews: 37500, reupViews: 69000, totalViews: 106500, eng: 2043, er: "1.92%", cpv: 41.0, time: "37.8s" },
    { kol: "Nấu Ăn Dễ Lắm", tier: "Micro", cost: 5000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 963200, reupViews: 105200, totalViews: 1068400, eng: 6077, er: "1.13%", cpv: 37.8, time: "7.4s" },
    { kol: "Cơm nhà Bông", tier: "Micro", cost: 5000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 1200000, reupViews: 17800, totalViews: 1217800, eng: 6936, er: "2.85%", cpv: 39.5, time: "7.0s" },
    { kol: "Nhi say Hi", tier: "Micro", cost: 15000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 394400, reupViews: 11000, totalViews: 405400, eng: 2629, er: "0.42%", cpv: 42.0, time: "14.7s" }
  ]
};

export const DATA_VINEGAR = {
  key: "VINEGAR",
  name: "Vinegar",
  kolCount: 10,
  period: "10/07 – 25/07 (Tuần 2 – Tuần 4 Tháng 7)",
  highlights: [
    {
      icon: "💰",
      value: "200.00M",
      valueColor: "#15803D",
      label: "Ngân sách (incl AF)",
      sub: "Tiết kiệm -54.8% vs 442M LY"
    },
    {
      icon: "⚡",
      value: "45.00đ",
      valueColor: "#15803D",
      label: "Tối ưu CPV 6s (-47.1%)",
      sub: "Mục tiêu 85đ | LY 75đ"
    },
    {
      icon: "🎯",
      value: "70.4%",
      valueColor: "#D97706",
      label: "Organic View / Target",
      sub: "2.08M vs 2.95M mục tiêu"
    },
    {
      icon: "👥",
      value: "10 KOLs",
      valueColor: "#0284C7",
      label: "Quy mô chiến dịch",
      sub: "10/07 – 25/07 (3 tuần)"
    }
  ],
  metrics: [
    {
      metric: "Tổng ngân sách (Budget include AF)",
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
      metric: "Lượt xem tự nhiên (Organic View)",
      unit: "Lượt",
      ly: "4.05M",
      target: "2.95M",
      actual: "2.08M",
      diffTarget: "-29.6%",
      diffLY: "-48.7%",
      isTargetGood: false,
      isLYGood: false,
      barPct: 70.4
    },
    {
      metric: "Chi phí mỗi lượt xem 6 giây (Cost per paid view 6s)",
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
      metric: "Lượt tương tác tự nhiên (Organic Engagement)",
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
      metric: "Thời lượng xem trung bình (Avg View Time)",
      unit: "Giây",
      ly: "13.0s",
      target: "—",
      actual: "11.56s",
      diffTarget: "—",
      diffLY: "-11.1%",
      isTargetGood: null,
      isLYGood: false,
      barPct: 88.9
    },
    {
      metric: "Tỷ lệ xem hết video (VTR 100%)",
      unit: "%",
      ly: "2.27%",
      target: "—",
      actual: "1.39%",
      diffTarget: "—",
      diffLY: "-39.0%",
      isTargetGood: null,
      isLYGood: false,
      barPct: 61.0
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
    { kol: "Ăn gì Thương ơi", tier: "Mid-tier", cost: 15400000, lyViews: "374K", yoy: "-73.6%", targetViews: 400000, organicViews: 98667, reupViews: 13000, totalViews: 157100, eng: 2226, er: "2.26%", cpv: 156.1, time: "3m16s" },
    { kol: "TOE NẤU GÌ ĐÓ", tier: "Micro", cost: 10000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 65663, reupViews: 13000, totalViews: 246000, eng: 2391, er: "3.64%", cpv: 152.3, time: "2m12s" },
    { kol: "Linh nấu", tier: "Mid-tier", cost: 15000000, lyViews: "68K", yoy: "+317.4%", targetViews: 300000, organicViews: 283832, reupViews: 26311, totalViews: 759511, eng: 2276, er: "0.80%", cpv: 52.8, time: "1m45s" },
    { kol: "Nông Thôn Mới", tier: "Micro", cost: 12000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 123992, reupViews: 35000, totalViews: 370100, eng: 461, er: "0.37%", cpv: 96.8, time: "2m29s" },
    { kol: "Khánh Linh", tier: "Macro", cost: 15000000, lyViews: "662K", yoy: "-48.4%", targetViews: 400000, organicViews: 341329, reupViews: 1500, totalViews: 648800, eng: 2448, er: "0.72%", cpv: 43.9, time: "1m28s" },
    { kol: "My Huyền", tier: "Micro", cost: 13000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 195569, reupViews: 7197, totalViews: 1707197, eng: 3784, er: "1.93%", cpv: 66.5, time: "1m31s" },
    { kol: "Châu Kiều My", tier: "Mid-tier", cost: 8000000, lyViews: "Mới", yoy: "—", targetViews: 400000, organicViews: 179723, reupViews: 222000, totalViews: 652200, eng: 5494, er: "3.06%", cpv: 44.5, time: "2m08s" },
    { kol: "Cơm nhà bếp xưa", tier: "Nano", cost: 5000000, lyViews: "Mới", yoy: "—", targetViews: 50000, organicViews: 32573, reupViews: 0, totalViews: 1100000, eng: 1871, er: "5.74%", cpv: 153.5, time: "3m29s" },
    { kol: "Trang Tấm", tier: "Mid-tier", cost: 38000000, lyViews: "Mới", yoy: "—", targetViews: 600000, organicViews: 718000, reupViews: 752000, totalViews: 1470000, eng: 48969, er: "6.82%", cpv: 52.9, time: "2m49s" },
    { kol: "Nấu Ăn Dễ Lắm 🤤", tier: "Micro", cost: 5000000, lyViews: "Mới", yoy: "—", targetViews: 200000, organicViews: 37429, reupViews: 88100, totalViews: 295600, eng: 1101, er: "2.94%", cpv: 133.6, time: "1m33s" }
  ]
};

export default function DashboardView({ 
  onOpen = () => {}, 
  onOpenProfile = () => {}, 
  onOpenTable = () => {}, 
  onOpenKanban = () => {} 
}) {
  const [projectKey, setProjectKey] = useState("MSG");
  const [viewTab, setViewTab] = useState("compare"); // "compare" | "kols"
  const [kolSearch, setKolSearch] = useState("");
  const [sortCol, setSortCol] = useState("totalViews");
  const [sortDir, setSortDir] = useState("desc");
  const [hoveredKol, setHoveredKol] = useState(null);
  const [hoveredMetricIdx, setHoveredMetricIdx] = useState(null);
  const [hoveredKolTableIdx, setHoveredKolTableIdx] = useState(null);
  const [activeDetailKol, setActiveDetailKol] = useState(null);

  const data = projectKey === "MSG" ? DATA_MSG : DATA_VINEGAR;

  // Appearance count across 3 top panels
  const appearanceMap = useMemo(() => {
    const map = {};
    [...data.topViews, ...data.topEng, ...data.topTime].forEach(item => {
      map[item.name] = (map[item.name] || 0) + 1;
    });
    return map;
  }, [data]);

  const KOL_PALETTES = {
    "Bon đây nè": { bg: "#EFF6FF", border: "#3B82F6", text: "#1D4ED8", dot: "#2563EB", badgeBg: "#DBEAFE" },
    "Emmer Sweet": { bg: "#FAF5FF", border: "#A855F7", text: "#6B21A8", dot: "#9333EA", badgeBg: "#F3E8FF" },
    "Trang Tấm": { bg: "#F0FDF4", border: "#16A34A", text: "#15803D", dot: "#16A34A", badgeBg: "#DCFCE7" },
    "Út Tình": { bg: "#FFF7ED", border: "#F97316", text: "#C2410C", dot: "#EA580C", badgeBg: "#FFEDD5" },
    "Khánh Linh": { bg: "#F0FDF4", border: "#16A34A", text: "#15803D", dot: "#16A34A", badgeBg: "#DCFCE7" },
    "Min Cookie": { bg: "#FFF1F2", border: "#F43F5E", text: "#BE123C", dot: "#E11D48", badgeBg: "#FFE4E6" },
    "taydayroi": { bg: "#EEF2FF", border: "#6366F1", text: "#3730A3", dot: "#4F46E5", badgeBg: "#E0E7FF" },
    "Linh nấu": { bg: "#FEFCE8", border: "#EAB308", text: "#854D0E", dot: "#CA8A04", badgeBg: "#FEF08A" },
    "Châu Kiều My": { bg: "#FDF2F8", border: "#EC4899", text: "#9D174D", dot: "#DB2777", badgeBg: "#FCE7F3" },
    "My Huyền": { bg: "#F0FDF4", border: "#16A34A", text: "#15803D", dot: "#16A34A", badgeBg: "#DCFCE7" },
    "Cơm nhà bếp xưa": { bg: "#F5F3FF", border: "#8B5CF6", text: "#5B21B6", dot: "#7C3AED", badgeBg: "#EDE9FE" },
    "Ăn gì Thương ơi": { bg: "#FFFBEB", border: "#F59E0B", text: "#B45309", dot: "#D97706", badgeBg: "#FEF3C7" },
  };

  const getColor = (name) => {
    return KOL_PALETTES[name] || { bg: "#F8FAFC", border: "#CBD5E1", text: "#0F172A", dot: "#64748B", badgeBg: "#F1F5F9" };
  };

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
      if (sortCol === "er") {
        vA = parseFloat(a.er) || 0;
        vB = parseFloat(b.er) || 0;
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
                background: projectKey === "MSG" ? "#15803D" : "transparent",
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
            📋 Danh sách KOLs
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
                ĐỐI CHIẾU CHỈ SỐ: {data.name}
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
                    <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#15803D", whiteSpace: "nowrap" }}>Thực tế</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, whiteSpace: "nowrap" }}>So với mục tiêu</th>
                    <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 800, whiteSpace: "nowrap" }}>So với cùng kỳ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.metrics.map((m, idx) => {
                    const isHovered = hoveredMetricIdx === idx;
                    return (
                      <tr 
                        key={idx} 
                        onMouseEnter={() => setHoveredMetricIdx(idx)}
                        onMouseLeave={() => setHoveredMetricIdx(null)}
                        style={{ 
                          borderBottom: "1px solid #F1F5F9", 
                          background: isHovered 
                            ? "#F0FDF4" 
                            : idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                          boxShadow: isHovered ? "inset 3px 0 0 #15803D" : "none",
                          transition: "all 0.15s ease",
                          cursor: "default"
                        }}
                      >
                        
                        <td style={{ 
                          padding: "12px 16px", 
                          paddingLeft: m.level === 1 ? 32 : m.level === 2 ? 48 : 16,
                          fontWeight: m.level === 0 ? 800 : m.level === 1 ? 700 : m.level === 2 ? 600 : 700, 
                          color: isHovered 
                            ? "#15803D" 
                            : (m.level === 2 ? "#475569" : m.level === 1 ? "#334155" : "#0F172A"), 
                          whiteSpace: "nowrap",
                          transition: "color 0.15s ease"
                        }}>
                          {m.level === 1 && (
                            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: isHovered ? "#15803D" : "#94A3B8", marginRight: 8, verticalAlign: "middle", transition: "background 0.15s ease" }} />
                          )}
                          {m.level === 2 && (
                            <span style={{ color: isHovered ? "#15803D" : "#94A3B8", marginRight: 8, fontSize: 13, fontWeight: 700, transition: "color 0.15s ease" }}>↳</span>
                          )}
                          {m.metric}
                        </td>

                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#64748B", whiteSpace: "nowrap" }}>
                          {m.ly}
                        </td>

                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "#D97706", whiteSpace: "nowrap" }}>
                          {m.target}
                        </td>

                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#15803D", fontSize: 13, whiteSpace: "nowrap" }}>
                          {m.actual}
                        </td>

                        <td style={{ padding: "12px 14px", textAlign: "center", whiteSpace: "nowrap" }}>
                          <span style={{ 
                            display: "inline-block",
                            padding: "3px 8px", 
                            borderRadius: 6, 
                            background: m.isTargetGood === true ? "#DCFCE7" : m.isTargetGood === false ? "#FFE4E6" : "#F1F5F9",
                            color: m.isTargetGood === true ? "#15803D" : m.isTargetGood === false ? "#E11D48" : "#0F172A",
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
                            background: m.isLYGood === true ? "#DCFCE7" : m.isLYGood === false ? "#FFE4E6" : "#F1F5F9",
                            color: m.isLYGood === true ? "#15803D" : m.isLYGood === false ? "#E11D48" : "#0F172A",
                            fontWeight: 800,
                            fontSize: 11,
                            whiteSpace: "nowrap"
                          }}>
                            {m.diffLY}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* NOTE / HIGHLIGHTS SO VỚI CÙNG KỲ NĂM TRƯỚC - TINH GỌN KEY METRICS */}
          {data.highlights && data.highlights.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${data.highlights.length}, 1fr)`, gap: 10 }}>
              {data.highlights.map((h, i) => (
                <div 
                  key={i} 
                  style={{ 
                    background: "#FFFFFF", 
                    borderRadius: 10, 
                    padding: "10px 14px", 
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                  }}
                >
                  <span style={{ fontSize: 20 }}>{h.icon}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: h.valueColor, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.1 }}>
                      {h.value}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#0F172A", marginTop: 2 }}>
                      {h.label}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748B" }}>
                      {h.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3 SIDE-BY-SIDE PANELS (LƯỢT XEM, TƯƠNG TÁC, THỜI LƯỢNG XEM) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            
            {/* 1. LƯỢT XEM */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#15803D", marginBottom: 10, whiteSpace: "nowrap" }}>
                🟢 TOP TARGET VIEWS ACHIEVEMENT
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.topViews.map((k, i) => {
                  const c = getColor(k.name);
                  const count = appearanceMap[k.name] || 1;
                  const isHovered = hoveredKol === k.name;

                  return (
                    <div 
                      key={i} 
                      onClick={() => {
                        const found = data.kols.find(item => item.kol === k.name);
                        if (found) setActiveDetailKol(found);
                      }}
                      onMouseEnter={() => setHoveredKol(k.name)}
                      onMouseLeave={() => setHoveredKol(null)}
                      title={`Nhấp để xem chi tiết thông số của ${k.name}`}
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        padding: "8px 12px", 
                        background: isHovered ? c.bg : "#F8FAFC", 
                        borderRadius: 8, 
                        border: isHovered ? `1.5px solid ${c.border}` : "1px solid #F1F5F9", 
                        boxShadow: isHovered ? `0 2px 8px ${c.border}33` : "none",
                        transition: "all 0.15s ease",
                        cursor: "pointer",
                        whiteSpace: "nowrap" 
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
                        <span style={{ fontWeight: 800, color: isHovered ? c.text : "#0F172A", fontSize: 12 }}>{k.name}</span>
                        {count > 1 && (
                          <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 5px", borderRadius: 4, background: c.badgeBg, color: c.text }}>
                            {count} bảng
                          </span>
                        )}
                      </div>
                      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "#15803D" }}>{k.actual}</span>
                        <span style={{ fontSize: 11, color: "#64748B" }}> / {k.target}</span>
                        <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 800, color: "#15803D" }}>{k.diff}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. LƯỢT TƯƠNG TÁC */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0284C7", marginBottom: 10, whiteSpace: "nowrap" }}>
                ❤️ TOP ENGAGEMENT (TƯƠNG TÁC)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.topEng.map((k, i) => {
                  const c = getColor(k.name);
                  const count = appearanceMap[k.name] || 1;
                  const isHovered = hoveredKol === k.name;

                  return (
                    <div 
                      key={i} 
                      onClick={() => {
                        const found = data.kols.find(item => item.kol === k.name);
                        if (found) setActiveDetailKol(found);
                      }}
                      onMouseEnter={() => setHoveredKol(k.name)}
                      onMouseLeave={() => setHoveredKol(null)}
                      title={`Nhấp để xem chi tiết thông số của ${k.name}`}
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        padding: "8px 12px", 
                        background: isHovered ? c.bg : "#F8FAFC", 
                        borderRadius: 8, 
                        border: isHovered ? `1.5px solid ${c.border}` : "1px solid #F1F5F9", 
                        boxShadow: isHovered ? `0 2px 8px ${c.border}33` : "none",
                        transition: "all 0.15s ease",
                        cursor: "pointer",
                        whiteSpace: "nowrap" 
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
                        <span style={{ fontWeight: 800, color: isHovered ? c.text : "#0F172A", fontSize: 12 }}>{k.name}</span>
                        {count > 1 && (
                          <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 5px", borderRadius: 4, background: c.badgeBg, color: c.text }}>
                            {count} bảng
                          </span>
                        )}
                      </div>
                      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#0284C7", fontSize: 12 }}>{k.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. THỜI LƯỢNG XEM */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED", marginBottom: 10, whiteSpace: "nowrap" }}>
                ⏱️ TOP AVG WATCH TIME (THỜI LƯỢNG)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.topTime.map((k, i) => {
                  const c = getColor(k.name);
                  const count = appearanceMap[k.name] || 1;
                  const isHovered = hoveredKol === k.name;

                  return (
                    <div 
                      key={i} 
                      onClick={() => {
                        const found = data.kols.find(item => item.kol === k.name);
                        if (found) setActiveDetailKol(found);
                      }}
                      onMouseEnter={() => setHoveredKol(k.name)}
                      onMouseLeave={() => setHoveredKol(null)}
                      title={`Nhấp để xem chi tiết thông số của ${k.name}`}
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center", 
                        padding: "8px 12px", 
                        background: isHovered ? c.bg : "#F8FAFC", 
                        borderRadius: 8, 
                        border: isHovered ? `1.5px solid ${c.border}` : "1px solid #F1F5F9", 
                        boxShadow: isHovered ? `0 2px 8px ${c.border}33` : "none",
                        transition: "all 0.15s ease",
                        cursor: "pointer",
                        whiteSpace: "nowrap" 
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
                        <span style={{ fontWeight: 800, color: isHovered ? c.text : "#0F172A", fontSize: 12 }}>{k.name}</span>
                        {count > 1 && (
                          <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 5px", borderRadius: 4, background: c.badgeBg, color: c.text }}>
                            {count} bảng
                          </span>
                        )}
                      </div>
                      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#7C3AED", fontSize: 12 }}>{k.value}</span>
                      </div>
                    </div>
                  );
                })}
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
              {kolSearch && (
                <span style={{ fontSize: 11, color: "#15803D", fontWeight: 700, whiteSpace: "nowrap", background: "#DCFCE7", padding: "4px 8px", borderRadius: 6 }}>
                  Tìm thấy: {sortedKols.length}
                </span>
              )}
            </div>

            {/* Quick Filter Buttons (Dynamic for both MSG & Vinegar) */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, flexWrap: "wrap" }}>
              <span style={{ color: "#64748B", fontWeight: 700 }}>Lọc phân cấp:</span>
              <button 
                onClick={() => setKolSearch("")}
                style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: !kolSearch ? "#0F172A" : "#F8FAFC", color: !kolSearch ? "#FFFFFF" : "#475569", fontWeight: 700, cursor: "pointer" }}
              >
                Tất cả
              </button>
              {["Macro", "Mid-tier", "Micro", "Nano"].map(tier => {
                const hasTier = data.kols.some(k => k.tier.toLowerCase() === tier.toLowerCase());
                if (!hasTier) return null;
                const isActive = kolSearch.toLowerCase() === tier.toLowerCase();

                return (
                  <button 
                    key={tier}
                    onClick={() => setKolSearch(tier)}
                    style={{ 
                      padding: "4px 10px", 
                      borderRadius: 6, 
                      border: "1px solid #E2E8F0", 
                      background: isActive ? "#0F172A" : "#F8FAFC", 
                      color: isActive ? "#FFFFFF" : "#475569", 
                      fontWeight: 700, 
                      cursor: "pointer" 
                    }}
                  >
                    {tier}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Container with Sticky Header & No Horizontal Scroll */}
          <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 250px)", minHeight: 380, width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, tableLayout: "auto" }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#F8FAFC", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0", color: "#475569" }}>
                  <th style={{ padding: "8px 4px", textAlign: "center", fontWeight: 800, width: 28, whiteSpace: "nowrap" }}>#</th>
                  <th onClick={() => handleSort("kol")} style={{ padding: "8px 8px", textAlign: "left", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    KOL Name {sortCol === "kol" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ padding: "8px 4px", textAlign: "center", fontWeight: 700, whiteSpace: "nowrap" }}>Tier</th>
                  <th onClick={() => handleSort("cost")} style={{ padding: "8px 6px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Booking Cost {sortCol === "cost" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ padding: "8px 6px", textAlign: "right", fontWeight: 800, color: "#64748B", whiteSpace: "nowrap" }}>
                    FY25 (LY)
                  </th>
                  <th onClick={() => handleSort("targetViews")} style={{ padding: "8px 6px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Target Views {sortCol === "targetViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("organicViews")} style={{ padding: "8px 6px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Organic Views {sortCol === "organicViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("reupViews")} style={{ padding: "8px 6px", textAlign: "right", cursor: "pointer", fontWeight: 800, color: "#0284C7", whiteSpace: "nowrap" }}>
                    Reup Views {sortCol === "reupViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("totalViews")} style={{ padding: "8px 6px", textAlign: "right", cursor: "pointer", fontWeight: 800, color: "#15803D", whiteSpace: "nowrap" }}>
                    Total Views {sortCol === "totalViews" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ padding: "8px 4px", textAlign: "center", fontWeight: 800, whiteSpace: "nowrap" }}>
                    % Target (Organic)
                  </th>
                  <th onClick={() => handleSort("pct")} style={{ padding: "8px 4px", textAlign: "center", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    % Target (Total) {sortCol === "pct" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ padding: "8px 4px", textAlign: "center", fontWeight: 800, whiteSpace: "nowrap" }}>
                    YoY Views
                  </th>
                  <th onClick={() => handleSort("eng")} style={{ padding: "8px 6px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    Engagement {sortCol === "eng" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("er")} style={{ padding: "8px 4px", textAlign: "center", cursor: "pointer", fontWeight: 800, color: "#15803D", whiteSpace: "nowrap" }}>
                    % ER {sortCol === "er" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                  <th style={{ padding: "8px 4px", textAlign: "center", fontWeight: 700, whiteSpace: "nowrap" }}>Avg Watch Time</th>
                  <th onClick={() => handleSort("cpv")} style={{ padding: "8px 6px", textAlign: "right", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>
                    CPV 6s {sortCol === "cpv" && (sortDir === "asc" ? "▲" : "▼")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedKols.map((k, idx) => {
                  const orgPct = ((k.organicViews / k.targetViews) * 100).toFixed(1);
                  const totPct = ((k.totalViews / k.targetViews) * 100).toFixed(1);
                  const isOrgGood = k.organicViews >= k.targetViews;
                  const isTotGood = k.totalViews >= k.targetViews;
                  const isHovered = hoveredKolTableIdx === idx;

                  return (
                    <tr 
                      key={idx} 
                      onClick={() => setActiveDetailKol(k)}
                      onMouseEnter={() => setHoveredKolTableIdx(idx)}
                      onMouseLeave={() => setHoveredKolTableIdx(null)}
                      style={{ 
                        borderBottom: "1px solid #F1F5F9", 
                        background: isHovered 
                          ? "#F0FDF4" 
                          : idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                        boxShadow: isHovered ? "inset 3px 0 0 #15803D" : "none",
                        transition: "all 0.15s ease",
                        cursor: "pointer"
                      }}
                    >
                      <td style={{ padding: "7px 4px", textAlign: "center", fontWeight: 700, color: "#64748B", fontSize: 10 }}>
                        {idx + 1}
                      </td>
                      <td style={{ padding: "7px 8px", fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap" }}>
                        {k.kol}
                      </td>
                      <td style={{ padding: "7px 4px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: 9.5, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: "#F1F5F9", color: "#475569" }}>
                          {k.tier}
                        </span>
                      </td>
                      <td style={{ padding: "7px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                        {(k.cost / 1000000).toFixed(1)}M
                      </td>
                      <td style={{ padding: "7px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#64748B", whiteSpace: "nowrap" }}>
                        {k.lyViews}
                      </td>
                      <td style={{ padding: "7px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#64748B", whiteSpace: "nowrap" }}>
                        {k.targetViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "7px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                        {k.organicViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "7px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#0284C7", whiteSpace: "nowrap" }}>
                        +{k.reupViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "7px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800, color: "#0F172A", whiteSpace: "nowrap" }}>
                        {k.totalViews.toLocaleString()}
                      </td>
                      <td style={{ padding: "7px 4px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "2px 5px", 
                          borderRadius: 4, 
                          background: isOrgGood ? "#DCFCE7" : "#FFE4E6", 
                          color: isOrgGood ? "#15803D" : "#E11D48",
                          fontWeight: 800,
                          fontSize: 10,
                          whiteSpace: "nowrap"
                        }}>
                          {orgPct}%
                        </span>
                      </td>
                      <td style={{ padding: "7px 4px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "2px 5px", 
                          borderRadius: 4, 
                          background: isTotGood ? "#DCFCE7" : "#FFE4E6", 
                          color: isTotGood ? "#15803D" : "#E11D48",
                          fontWeight: 800,
                          fontSize: 10,
                          whiteSpace: "nowrap"
                        }}>
                          {totPct}%
                        </span>
                      </td>
                      <td style={{ padding: "7px 4px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "2px 5px", 
                          borderRadius: 4, 
                          background: k.yoy.startsWith("+") ? "#DCFCE7" : k.yoy.startsWith("-") ? "#FFE4E6" : "#F1F5F9",
                          color: k.yoy.startsWith("+") ? "#15803D" : k.yoy.startsWith("-") ? "#E11D48" : "#64748B",
                          fontWeight: 800,
                          fontSize: 10,
                          whiteSpace: "nowrap"
                        }}>
                          {k.yoy}
                        </span>
                      </td>
                      <td style={{ padding: "7px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                        {k.eng.toLocaleString()}
                      </td>
                      <td style={{ padding: "7px 4px", textAlign: "center", whiteSpace: "nowrap" }}>
                        <span style={{ 
                          display: "inline-block",
                          padding: "2px 6px", 
                          borderRadius: 4, 
                          background: parseFloat(k.er) >= 2.0 ? "#DCFCE7" : "#F1F5F9", 
                          color: parseFloat(k.er) >= 2.0 ? "#15803D" : "#475569",
                          fontWeight: 800,
                          fontSize: 10.5,
                          fontFamily: "'IBM Plex Mono', monospace",
                          whiteSpace: "nowrap"
                        }}>
                          {k.er || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "7px 4px", textAlign: "center", fontWeight: 700, whiteSpace: "nowrap" }}>
                        {k.time}
                      </td>
                      <td style={{ padding: "7px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: k.cpv <= 45 ? "#15803D" : "#0F172A", fontWeight: 700, whiteSpace: "nowrap" }}>
                        {k.cpv}đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot style={{ position: "sticky", bottom: 0, zIndex: 10, background: "#F1F5F9", boxShadow: "0 -1px 2px rgba(0,0,0,0.05)" }}>
                <tr style={{ background: "#F1F5F9", borderTop: "2px solid #E2E8F0", fontWeight: 800, color: "#0F172A" }}>
                  <td style={{ padding: "8px 4px", textAlign: "center" }}>—</td>
                  <td style={{ padding: "8px 8px", whiteSpace: "nowrap" }}>TỔNG CỘNG</td>
                  <td>—</td>
                  <td style={{ padding: "8px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                    {(sortedKols.reduce((a, b) => a + b.cost, 0) / 1000000).toFixed(1)}M
                  </td>
                  <td style={{ padding: "8px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#64748B", whiteSpace: "nowrap" }}>
                    {data.key === "MSG" ? "7.49M" : "4.05M"}
                  </td>
                  <td style={{ padding: "8px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                    {sortedKols.reduce((a, b) => a + b.targetViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "8px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                    {sortedKols.reduce((a, b) => a + b.organicViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "8px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#0284C7", whiteSpace: "nowrap" }}>
                    +{sortedKols.reduce((a, b) => a + b.reupViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "8px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#15803D", whiteSpace: "nowrap" }}>
                    {sortedKols.reduce((a, b) => a + b.totalViews, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "8px 4px", textAlign: "center", whiteSpace: "nowrap" }}>
                    {(() => {
                      const t = sortedKols.reduce((a, b) => a + b.targetViews, 0);
                      const org = sortedKols.reduce((a, b) => a + b.organicViews, 0);
                      const p = t > 0 ? ((org / t) * 100).toFixed(1) : 0;
                      return (
                        <span style={{ padding: "2px 5px", borderRadius: 4, background: org >= t ? "#15803D" : "#E11D48", color: "#FFFFFF", fontWeight: 800, fontSize: 10 }}>
                          {p}%
                        </span>
                      );
                    })()}
                  </td>
                  <td style={{ padding: "8px 4px", textAlign: "center", whiteSpace: "nowrap" }}>
                    {(() => {
                      const t = sortedKols.reduce((a, b) => a + b.targetViews, 0);
                      const tot = sortedKols.reduce((a, b) => a + b.totalViews, 0);
                      const p = t > 0 ? ((tot / t) * 100).toFixed(1) : 0;
                      return (
                        <span style={{ padding: "2px 5px", borderRadius: 4, background: tot >= t ? "#15803D" : "#E11D48", color: "#FFFFFF", fontWeight: 800, fontSize: 10 }}>
                          {p}%
                        </span>
                      );
                    })()}
                  </td>
                  <td style={{ padding: "8px 4px", textAlign: "center", whiteSpace: "nowrap" }}>
                    <span style={{ padding: "2px 5px", borderRadius: 4, background: data.key === "MSG" ? "#DCFCE7" : "#FFE4E6", color: data.key === "MSG" ? "#15803D" : "#E11D48", fontWeight: 800, fontSize: 10 }}>
                      {data.key === "MSG" ? "+17.9%" : "-48.7%"}
                    </span>
                  </td>
                  <td style={{ padding: "8px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap" }}>
                    {sortedKols.reduce((a, b) => a + b.eng, 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "8px 4px", textAlign: "center", whiteSpace: "nowrap" }}>
                    <span style={{ padding: "2px 6px", borderRadius: 4, background: "#DCFCE7", color: "#15803D", fontWeight: 800, fontSize: 10.5, fontFamily: "'IBM Plex Mono', monospace" }}>
                      {(sortedKols.reduce((a, b) => a + (parseFloat(b.er) || 0), 0) / (sortedKols.length || 1)).toFixed(2)}%
                    </span>
                  </td>
                  <td style={{ padding: "8px 4px", textAlign: "center", whiteSpace: "nowrap" }}>TB</td>
                  <td style={{ padding: "8px 6px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "#15803D", whiteSpace: "nowrap" }}>
                    {(sortedKols.reduce((a, b) => a + b.cpv, 0) / (sortedKols.length || 1)).toFixed(1)}đ
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          KOL DETAIL MODAL (CHI TIẾT THÔNG SỐ TỪNG BẠN KOL)
         ========================================================================= */}
      {activeDetailKol && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16
          }}
          onClick={() => setActiveDetailKol(null)}
        >
          <div 
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              maxWidth: 520,
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              border: "1px solid #E2E8F0"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: "16px 20px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: getColor(activeDetailKol.kol).dot, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>
                  {activeDetailKol.kol.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#0F172A" }}>{activeDetailKol.kol}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#E2E8F0", color: "#475569" }}>
                      {activeDetailKol.tier}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: projectKey === "MSG" ? "#DCFCE7" : "#E0F2FE", color: projectKey === "MSG" ? "#15803D" : "#0284C7" }}>
                      {projectKey}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setActiveDetailKol(null)}
                style={{ background: "#F1F5F9", border: "none", width: 30, height: 30, borderRadius: "50%", fontSize: 14, color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            {/* Body: Grid of Key Metrics */}
            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              
              {/* Row 1: Cost & % Target (Organic vs Total) */}
              {(() => {
                const orgPct = activeDetailKol.targetViews > 0 ? ((activeDetailKol.organicViews / activeDetailKol.targetViews) * 100).toFixed(1) : 0;
                const totPct = activeDetailKol.targetViews > 0 ? ((activeDetailKol.totalViews / activeDetailKol.targetViews) * 100).toFixed(1) : 0;
                const isOrgGood = activeDetailKol.organicViews >= activeDetailKol.targetViews;
                const isTotGood = activeDetailKol.totalViews >= activeDetailKol.targetViews;

                return (
                  <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: 8 }}>
                    <div style={{ background: "#F8FAFC", padding: "10px 12px", borderRadius: 10, border: "1px solid #F1F5F9" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#64748B" }}>💰 Booking Cost</div>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: "#0F172A", marginTop: 3, fontFamily: "'IBM Plex Mono', monospace" }}>
                        {(activeDetailKol.cost / 1000000).toFixed(1)}M VNĐ
                      </div>
                    </div>

                    <div style={{ background: isOrgGood ? "#F0FDF4" : "#FFF1F2", padding: "10px 12px", borderRadius: 10, border: isOrgGood ? "1px solid #BBF7D0" : "1px solid #FECDD3" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: isOrgGood ? "#16A34A" : "#E11D48" }}>🎯 % Target (Organic)</div>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: isOrgGood ? "#15803D" : "#BE123C", marginTop: 3 }}>
                        {orgPct}%
                      </div>
                    </div>

                    <div style={{ background: isTotGood ? "#F0FDF4" : "#FFF1F2", padding: "10px 12px", borderRadius: 10, border: isTotGood ? "1px solid #BBF7D0" : "1px solid #FECDD3" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: isTotGood ? "#16A34A" : "#E11D48" }}>🚀 % Target (Total)</div>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: isTotGood ? "#15803D" : "#BE123C", marginTop: 3 }}>
                        {totPct}%
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Row 2: View Breakdown */}
              <div style={{ background: "#F8FAFC", padding: "12px 14px", borderRadius: 10, border: "1px solid #F1F5F9" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 8 }}>📊 VIEWS BREAKDOWN</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#64748B" }}>Target Views (KPI)</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginTop: 2 }}>{activeDetailKol.targetViews.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#0F172A" }}>Organic Views (TikTok)</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginTop: 2 }}>{activeDetailKol.organicViews.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "#0284C7" }}>Reup Views (Facebook)</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0284C7", marginTop: 2 }}>+{activeDetailKol.reupViews.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#0F172A" }}>Total Views (All Channels):</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#15803D", fontFamily: "'IBM Plex Mono', monospace" }}>{activeDetailKol.totalViews.toLocaleString()} views</span>
                </div>
              </div>

              {/* Row 3: Engagement, % ER, Watch time, CPV 6s */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                <div style={{ background: "#F8FAFC", padding: "10px 8px", borderRadius: 10, border: "1px solid #F1F5F9", textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#64748B" }}>❤️ Engagement</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0284C7", marginTop: 2 }}>{activeDetailKol.eng.toLocaleString()}</div>
                </div>
                <div style={{ background: "#F0FDF4", padding: "10px 8px", borderRadius: 10, border: "1px solid #BBF7D0", textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#16A34A" }}>📊 % ER</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "#15803D", marginTop: 2 }}>{activeDetailKol.er || "—"}</div>
                </div>
                <div style={{ background: "#F8FAFC", padding: "10px 8px", borderRadius: 10, border: "1px solid #F1F5F9", textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#64748B" }}>⏱️ Watch Time</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "#7C3AED", marginTop: 2 }}>{activeDetailKol.time}</div>
                </div>
                <div style={{ background: "#F8FAFC", padding: "10px 8px", borderRadius: 10, border: "1px solid #F1F5F9", textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#64748B" }}>⚡ CPV 6s</div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: activeDetailKol.cpv <= 45 ? "#15803D" : "#0F172A", marginTop: 2 }}>{activeDetailKol.cpv}đ</div>
                </div>
              </div>

              {/* Row 4: Historical Comparison FY25 */}
              <div style={{ background: "#F8FAFC", padding: "12px 14px", borderRadius: 10, border: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#64748B" }}>📈 FY25 BENCHMARK</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", marginTop: 2 }}>
                    {activeDetailKol.lyViews === "Mới" ? "✨ New KOL (First Campaign)" : `FY25 Actual: ${activeDetailKol.lyViews} views`}
                  </div>
                </div>
                {activeDetailKol.yoy !== "—" && (
                  <span style={{ padding: "4px 8px", borderRadius: 6, background: activeDetailKol.yoy.startsWith("+") ? "#DCFCE7" : "#FFE4E6", color: activeDetailKol.yoy.startsWith("+") ? "#15803D" : "#E11D48", fontWeight: 800, fontSize: 12 }}>
                    {activeDetailKol.yoy} YoY
                  </span>
                )}
              </div>

            </div>

            {/* Footer with Cross-Tab Interconnected Quick Actions */}
            <div style={{ padding: "12px 20px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button 
                  onClick={() => {
                    setViewTab("kols");
                    setKolSearch(activeDetailKol.kol);
                    setActiveDetailKol(null);
                  }}
                  title="Xem và lọc bạn KOL này trong danh sách Dashboard"
                  style={{ padding: "6px 10px", borderRadius: 6, background: "#FFFFFF", color: "#0F172A", fontWeight: 700, border: "1px solid #CBD5E1", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
                >
                  📋 Xem trên Danh Sách
                </button>
                <button 
                  onClick={() => {
                    onOpenProfile(activeDetailKol.kol);
                    setActiveDetailKol(null);
                  }}
                  title="Chuyển sang tab Hồ Sơ KOL"
                  style={{ padding: "6px 10px", borderRadius: 6, background: "#FFFFFF", color: "#15803D", fontWeight: 700, border: "1px solid #BBF7D0", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
                >
                  👤 Hồ Sơ KOL
                </button>
                <button 
                  onClick={() => {
                    onOpenTable(activeDetailKol.kol);
                    setActiveDetailKol(null);
                  }}
                  title="Chuyển sang tab Bảng Master"
                  style={{ padding: "6px 10px", borderRadius: 6, background: "#FFFFFF", color: "#0284C7", fontWeight: 700, border: "1px solid #BAE6FD", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
                >
                  📊 Tab Bảng
                </button>
                <button 
                  onClick={() => {
                    onOpenKanban(activeDetailKol.kol);
                    setActiveDetailKol(null);
                  }}
                  title="Chuyển sang tab Kanban"
                  style={{ padding: "6px 10px", borderRadius: 6, background: "#FFFFFF", color: "#7C3AED", fontWeight: 700, border: "1px solid #DDD6FE", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
                >
                  📌 Kanban
                </button>
              </div>

              <button 
                onClick={() => setActiveDetailKol(null)}
                style={{ padding: "7px 16px", borderRadius: 8, background: "#0F172A", color: "#FFFFFF", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 12 }}
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
