import React, { useState, useMemo } from "react";

/* =========================================================================
   PROJECT 1: [MSG] BỘT NGỌT — HALF YEAR REPORT FY26
   ========================================================================= */
const MSG_PROJECT = {
  key: "MSG",
  name: "[MSG] Bột Ngọt — Half Year Report FY26",
  badge: "25 KOLs • Ngân sách 720M • Hoàn thành",
  timeline: "W4 June 26 – W1 Aug 26 (6 tuần)",
  objective: "Trigger product usage & Deliver Key Message (Cooking & Family moments)",
  summary: {
    totalViewsStr: "20.0M",
    organicViewsStr: "8.83M",
    targetViewsStr: "8.15M",
    lyViewsStr: "7.49M",
    diffTargetViews: "+8.3% vs KPI",
    diffLYViews: "+17.9% YoY",
    
    cpvStr: "42.01đ",
    targetCPVStr: "65.00đ",
    lyCPVStr: "52.00đ",
    diffTargetCPV: "-35.4% Tiết kiệm",
    diffLYCPV: "-19.2% vs LY",

    budgetStr: "720.2M",
    targetBudgetStr: "144.7M",
    lyBudgetStr: "501.7M",
    diffTargetBudget: "498%",
    diffLYBudget: "144%",

    engStr: "325.0K",
    organicEngStr: "244.0K",
    targetEngStr: "263.6K",
    lyEngStr: "340.5K",
    diffTargetEng: "-7.5%",
    diffLYEng: "-28.4% YoY",

    avgWatchTime: "> 6.0s (100% video)",
    vtr: "3.78%",
    focCount: "20/25 KOLs",
    reupShare: "1.20M Views (14.5%)"
  },
  metricsConfig: {
    views: {
      title: "Tổng Lượt Xem (Total Views)",
      target: 8.15, targetStr: "8.15M",
      ly: 7.49, lyStr: "7.49M",
      actual: 8.83, actualStr: "8.83M Org (20M Total)",
      diffTarget: "+8.3% KPI (+680K)", diffLY: "+17.9% YoY (+1.34M)",
      color: "var(--ok)", bgColor: "var(--ok-bg)",
      status: "VƯỢT KPI",
      desc: "Organic View đạt 8.83M (+8.3% KPI, +17.9% YoY). Tổng view toàn chiến dịch đạt 20.0M view."
    },
    cpv: {
      title: "Chi Phí / View 6 Giây (CPV 6s)",
      target: 65, targetStr: "65.0đ",
      ly: 52, lyStr: "52.0đ",
      actual: 42.01, actualStr: "42.01đ",
      diffTarget: "-35.4% (-23đ)", diffLY: "-19.2% (-10đ)",
      color: "var(--accent)", bgColor: "var(--accent-bg)",
      status: "TỐI ƯU XUẤT SẮC",
      desc: "CPV giảm sâu ~40%, hệ thống TikTok auto-spend tối ưu ngân sách thay vì chia cứng."
    },
    budget: {
      title: "Tổng Ngân Sách (Budget inc. AF & Media)",
      target: 144.72, targetStr: "144.7M",
      ly: 501.72, lyStr: "501.7M",
      actual: 720.18, actualStr: "720.2M",
      diffTarget: "498%", diffLY: "144%",
      color: "var(--blue)", bgColor: "var(--blue-bg)",
      status: "QUY MÔ MỞ RỘNG",
      desc: "Thực chi 500.4M booking + gói đẩy media ads linh hoạt."
    },
    engagement: {
      title: "Tương Tác Tự Nhiên (Organic Engagement)",
      target: 263.6, targetStr: "263.6K",
      ly: 340.5, lyStr: "340.5K",
      actual: 244.0, actualStr: "244.0K (325K Total)",
      diffTarget: "-7.5%", diffLY: "-28.4% YoY",
      color: "var(--danger)", bgColor: "var(--danger-bg)",
      status: "SAVES/SHARES TĂNG CAO",
      desc: "Reactions/Comments giảm do trùng World Cup 2026, nhưng Shares (+52%) và Saves (+21%) tăng mạnh."
    }
  },
  hypotheses: [
    {
      id: "MSG-H1",
      area: "Lựa chọn Creator",
      hypothesis: "Giữ lại Retained KOLs từ FY25 sẽ duy trì hoặc tăng performance nhờ kinh nghiệm và fan quen thuộc.",
      lyResult: "Performance cao, view tự nhiên tốt, độ tin cậy từ người xem cao (FY25 baseline).",
      fy26Result: "Đúng với nhóm Cooking (Ăn Gì Thương Ơi, Min Cookie, Khánh Linh, Bon đây nè). Bị giảm ở Emmer Sweet (-12.4%) & Trang Tấm (-31.0%).",
      verdictLabel: "Đúng một phần",
      statusType: "warning", badgeBg: "var(--warn-bg)", badgeColor: "var(--warn)",
      learning: "Giữ KOL quen là đúng, nhưng không được can thiệp gượng ép timeline của họ."
    },
    {
      id: "MSG-H2",
      area: "Định hướng 6s Hook",
      hypothesis: "Đặt sản phẩm trong 6 giây đầu (First 6s Hook) sẽ đảm bảo Avg. View Time vượt benchmark 6s.",
      lyResult: "Avg. View Time trung bình 20.8s, để KOL tự do đặt vị trí sản phẩm trong clip.",
      fy26Result: "100% video đều vượt mốc 6s+ Avg. View Time theo đúng định hướng brief ban đầu.",
      verdictLabel: "Đạt giả thuyết",
      statusType: "success", badgeBg: "var(--ok-bg)", badgeColor: "var(--ok)",
      learning: "Hook 6s đầu rất hiệu quả để giữ chân người xem và truyền tải nhận diện sớm."
    },
    {
      id: "MSG-H3",
      area: "Cấu trúc Timeline",
      hypothesis: "Ép timeline xuất hiện sản phẩm trong 30–40s đầu của video nấu ăn để tăng tỷ lệ nhận diện.",
      lyResult: "KOL tự phát triển câu chuyện và món ăn theo mạch tự nhiên.",
      fy26Result: "Phản tác dụng: Emmer Sweet giảm 12.4% view / 34.2% eng, Trang Tấm giảm 31.0% view / 31.1% eng dù cùng làm menu Mì.",
      verdictLabel: "Phản tác dụng",
      statusType: "danger", badgeBg: "var(--danger-bg)", badgeColor: "var(--danger)",
      learning: "Phá vỡ flow tự nhiên khiến video mang tính quảng cáo lộ liễu, người xem lướt qua sớm."
    },
    {
      id: "MSG-H4",
      area: "Phân phối Đa Kênh",
      hypothesis: "Reup 20/25 video từ TikTok sang Facebook sẽ bù đắp lượng view bị trôi do trùng World Cup 2026.",
      lyResult: "Chủ yếu phân phối đơn kênh trên TikTok (7.49M views).",
      fy26Result: "Kéo thêm 1.2M views, giúp tổng view đạt 8.83M Org / 20M Total bất chấp World Cup tìm kiếm tăng 1,550%.",
      verdictLabel: "Thành công lớn",
      statusType: "success", badgeBg: "var(--ok-bg)", badgeColor: "var(--ok)",
      learning: "Reup đa nền tảng là giải pháp then chốt để bảo hiểm KPI khi gặp sự kiện cạnh tranh traffic lớn."
    }
  ],
  kols: [
    { id: "M1", kol: "Min Cookie", type: "Mid-tier", followers: "794.7K", dish: "Bánh mì nướng xốt phô mai", cost: 28000000, targetViews: 500000, organicViews: 520000, reupViews: 85000, totalViews: 605000, targetEng: 4600, actualEng: 24200, cpv: 35.2, avgTime: 7.8, focAds: "Có (FOC)", mediaSpend: 0, rating: "Xuất sắc", ratingStatus: "excellent", note: "View vượt 121% KPI, tương tác cao." },
    { id: "M2", kol: "Bon đây nè", type: "Macro", followers: "1.6M", dish: "Lẩu gà ớt hiểm", cost: 34000000, targetViews: 800000, organicViews: 820000, reupViews: 95000, totalViews: 915000, targetEng: 13000, actualEng: 34000, cpv: 40.1, avgTime: 7.5, focAds: "Có (FOC)", mediaSpend: 0, rating: "Xuất sắc", ratingStatus: "excellent", note: "Đạt 6/6 hypothesis, KOL duy nhất nấu món Lẩu, Avg Time cao thứ 2." },
    { id: "M3", kol: "Ăn gì Thương ơi", type: "Mid-tier", followers: "522K", dish: "Mì trộn xốt chua ngọt", cost: 15400000, targetViews: 400000, organicViews: 860000, reupViews: 120000, totalViews: 980000, targetEng: 9700, actualEng: 36500, cpv: 38.5, avgTime: 8.4, focAds: "Có (FOC)", mediaSpend: 0, rating: "Xuất sắc", ratingStatus: "excellent", note: "View vượt 245% KPI, diễn xuất tự nhiên." },
    { id: "M4", kol: "Khánh Linh", type: "Macro", followers: "1.1M", dish: "Salad cá hồi sốt mè", cost: 15000000, targetViews: 400000, organicViews: 430000, reupViews: 60000, totalViews: 490000, targetEng: 1500, actualEng: 19800, cpv: 39.0, avgTime: 7.1, focAds: "Có (FOC)", mediaSpend: 0, rating: "Xuất sắc", ratingStatus: "excellent", note: "Góc quay đẹp mắt, không cần sửa demo." },
    { id: "M5", kol: "taydayroi", type: "Micro", followers: "105.4K", dish: "Cơm chiên xốt đặc biệt", cost: 15000000, targetViews: 50000, organicViews: 65000, reupViews: 15000, totalViews: 80000, targetEng: 5400, actualEng: 4200, cpv: 41.0, avgTime: 37.8, focAds: "Có", mediaSpend: 0, rating: "Avg Time Top 1", ratingStatus: "excellent", note: "Thời lượng xem trung bình cao nhất toàn chiến dịch (37.8s)." },
    { id: "M6", kol: "Babykopo Home", type: "Macro", followers: "6.7M", dish: "Bữa cơm gia đình cuối tuần", cost: 35000000, targetViews: 500000, organicViews: 890000, reupViews: 110000, totalViews: 1000000, targetEng: 37300, actualEng: 42000, cpv: 41.0, avgTime: 7.2, focAds: "Có", mediaSpend: 5000000, rating: "Đạt KPI tốt", ratingStatus: "good", note: "Đạt 1M view toàn chiến dịch (+200% KPI)." },
    { id: "M7", kol: "Chú Đàn", type: "Micro", followers: "368.5K", dish: "Món xào gia đình", cost: 35000000, targetViews: 200000, organicViews: 225000, reupViews: 30000, totalViews: 255000, targetEng: 31000, actualEng: 32500, cpv: 41.5, avgTime: 6.8, focAds: "Có", mediaSpend: 0, rating: "Đạt KPI", ratingStatus: "good", note: "Nội dung mộc mạc, hoàn thành chỉ tiêu." },
    { id: "M8", kol: "Thi Thi Miền Tây", type: "Mid-tier", followers: "730.4K", dish: "Lẩu mắm miền Tây", cost: 15000000, targetViews: 400000, organicViews: 420000, reupViews: 50000, totalViews: 470000, targetEng: 15000, actualEng: 16200, cpv: 40.2, avgTime: 6.7, focAds: "Có", mediaSpend: 0, rating: "Đạt KPI", ratingStatus: "good", note: "Chất giọng miền Tây gần gũi, view đạt 117%." },
    { id: "M9", kol: "let Nhân cook", type: "Mid-tier", followers: "516.6K", dish: "Thịt rim xốt đậm đà", cost: 30000000, targetViews: 300000, organicViews: 340000, reupViews: 40000, totalViews: 380000, targetEng: 3000, actualEng: 8500, cpv: 41.8, avgTime: 6.9, focAds: "Có", mediaSpend: 0, rating: "Đạt KPI", ratingStatus: "good", note: "Góc quay sáng tạo, hoàn thành KPI." },
    { id: "M10", kol: "Sườn Sóc Homie", type: "Mid-tier", followers: "555K", dish: "Sườn nướng xốt mật ong", cost: 35000000, targetViews: 300000, organicViews: 330000, reupViews: 35000, totalViews: 365000, targetEng: 3000, actualEng: 9200, cpv: 42.0, avgTime: 6.6, focAds: "Không", mediaSpend: 0, rating: "Đạt KPI", ratingStatus: "good", note: "Nội dung gia đình vui nhộn, đạt 121% KPI." },
    { id: "M11", kol: "Châu Kiều My", type: "Mid-tier", followers: "565.1K", dish: "Gỏi cuốn tôm thịt", cost: 8000000, targetViews: 400000, organicViews: 450000, reupViews: 45000, totalViews: 495000, targetEng: 20000, actualEng: 22400, cpv: 39.5, avgTime: 7.1, focAds: "Có", mediaSpend: 0, rating: "Đạt KPI tốt", ratingStatus: "good", note: "Chi phí tối ưu, tỷ lệ view/cost rất cao." },
    { id: "M12", kol: "Quân Cooking", type: "Micro", followers: "147.6K", dish: "Canh chua cá lóc", cost: 8000000, targetViews: 200000, organicViews: 235000, reupViews: 25000, totalViews: 260000, targetEng: 1500, actualEng: 5800, cpv: 39.0, avgTime: 6.8, focAds: "Có", mediaSpend: 0, rating: "Đạt KPI", ratingStatus: "good", note: "Món ăn truyền thống, tương tác bình luận tốt." },
    { id: "M13", kol: "My Huyền", type: "Mid-tier", followers: "511.2K", dish: "Cơm chiên xốt thập cẩm", cost: 15000000, targetViews: 400000, organicViews: 440000, reupViews: 40000, totalViews: 480000, targetEng: 330, actualEng: 7200, cpv: 40.5, avgTime: 6.5, focAds: "Có", mediaSpend: 0, rating: "Đạt KPI", ratingStatus: "good", note: "Nội dung sinh hoạt hàng ngày mộc mạc." },
    { id: "M14", kol: "Nấu Ăn Dễ Lắm", type: "Micro", followers: "407.1K", dish: "Trứng cuộn xốt 3 phút", cost: 5000000, targetViews: 200000, organicViews: 245000, reupViews: 28000, totalViews: 273000, targetEng: 1000, actualEng: 8900, cpv: 37.8, avgTime: 7.0, focAds: "Có (FOC)", mediaSpend: 0, rating: "Đạt KPI tốt", ratingStatus: "good", note: "Chi phí thấp (5M), hiệu quả cao (+136% KPI)." },
    { id: "M15", kol: "Hảo Thích Vào Bếp", type: "Micro", followers: "207.6K", dish: "Sườn ram mặn ngọt", cost: 10000000, targetViews: 200000, organicViews: 230000, reupViews: 25000, totalViews: 255000, targetEng: 150, actualEng: 6400, cpv: 39.2, avgTime: 7.3, focAds: "Có (FOC)", mediaSpend: 0, rating: "Đạt KPI tốt", ratingStatus: "good", note: "Góc quay đẹp mắt, màu sắc bắt mắt." },
    { id: "M16", kol: "Bếp Nga Nè", type: "Nano", followers: "47.8K", dish: "Đậu hũ xốt chua cay", cost: 5000000, targetViews: 50000, organicViews: 95000, reupViews: 15000, totalViews: 110000, targetEng: 132, actualEng: 2100, cpv: 38.9, avgTime: 7.0, focAds: "Có (FOC)", mediaSpend: 0, rating: "Đạt KPI tốt", ratingStatus: "good", note: "Nano KOL chi phí rẻ, view vượt 220% KPI." },
    { id: "M17", kol: "Mai Hà thích nấu ăn", type: "Nano", followers: "78.4K", dish: "Bento cơm hộp xinh xắn", cost: 15000000, targetViews: 50000, organicViews: 94000, reupViews: 12000, totalViews: 106000, targetEng: 4900, actualEng: 5200, cpv: 41.0, avgTime: 6.8, focAds: "Có", mediaSpend: 0, rating: "Đạt KPI", ratingStatus: "good", note: "Hình ảnh dễ thương, hoàn thành chỉ tiêu." },
    { id: "M18", kol: "Cơm nhà Bông", type: "Micro", followers: "223.2K", dish: "Cơm gia đình ấm cúng", cost: 5000000, targetViews: 200000, organicViews: 220000, reupViews: 20000, totalViews: 240000, targetEng: 300, actualEng: 4800, cpv: 39.5, avgTime: 6.5, focAds: "Có", mediaSpend: 0, rating: "Đạt KPI", ratingStatus: "good", note: "Hoàn thành KPI đúng kế hoạch." },
    { id: "M19", kol: "Nhi say Hi", type: "Micro", followers: "282.7K", dish: "Món ngon sinh viên", cost: 15000000, targetViews: 200000, organicViews: 210000, reupViews: 22000, totalViews: 232000, targetEng: 150, actualEng: 3900, cpv: 42.0, avgTime: 6.4, focAds: "Có", mediaSpend: 0, rating: "Đạt KPI", ratingStatus: "good", note: "Đạt 116% KPI view." },
    { id: "M20", kol: "Út Tình", type: "Micro", followers: "242.8K", dish: "Bánh xèo giòn rụm", cost: 15000000, targetViews: 200000, organicViews: 215000, reupViews: 20000, totalViews: 235000, targetEng: 3900, actualEng: 4600, cpv: 41.8, avgTime: 6.5, focAds: "Không", mediaSpend: 0, rating: "Đạt KPI", ratingStatus: "good", note: "Âm thanh giòn rụm thu hút xem hết." },
    { id: "M21", kol: "Bùi Khánh Hà", type: "Micro", followers: "180K", dish: "Bữa cơm gia đình", cost: 30000000, targetViews: 200000, organicViews: 185000, reupViews: 15000, totalViews: 200000, targetEng: 50, actualEng: 1800, cpv: 49.5, avgTime: 6.0, focAds: "Không", mediaSpend: 4200000, rating: "Cần tối ưu script", ratingStatus: "warning", note: "Script thương mại quá cứng, diễn xuất gượng." },
    { id: "M22", kol: "Gia đình Sầu Rất Ngầu", type: "Micro", followers: "178.7K", dish: "Món ngon cho bé & mẹ", cost: 15000000, targetViews: 200000, organicViews: 190000, reupViews: 18000, totalViews: 208000, targetEng: 31000, actualEng: 12800, cpv: 51.0, avgTime: 6.0, focAds: "Có", mediaSpend: 3500000, rating: "Cần tối ưu script", ratingStatus: "warning", note: "Voice-off chèn sản phẩm bị gượng, view time sát 6s." },
    { id: "M23", kol: "Mẹ Bảo Bối", type: "Micro", followers: "217.1K", dish: "Cơm nắm xốt mayonnaise", cost: 15000000, targetViews: 200000, organicViews: 192000, reupViews: 16000, totalViews: 208000, targetEng: 110, actualEng: 2200, cpv: 50.2, avgTime: 6.0, focAds: "Không", mediaSpend: 2800000, rating: "Cần tối ưu script", ratingStatus: "warning", note: "Thời lượng xem sát mốc 6s, thoại cần mềm mại hơn." },
    { id: "M24", kol: "Emmer Sweet", type: "Mid-tier", followers: "784.7K", dish: "Mì xào hải sản", cost: 44000000, targetViews: 1000000, organicViews: 631000, reupViews: 75000, totalViews: 706000, targetEng: 18200, actualEng: 23000, cpv: 46.2, avgTime: 6.2, focAds: "Không", mediaSpend: 8600000, rating: "Bị sụt giảm", ratingStatus: "declined", note: "View -12.4%, Eng -34.2%. Ép đổi timeline 30-40s gây đứt mạch." },
    { id: "M25", kol: "Trang Tấm", type: "Mid-tier", followers: "696.4K", dish: "Mì udon xào xốt", cost: 38000000, targetViews: 600000, organicViews: 662000, reupViews: 80000, totalViews: 742000, targetEng: 48400, actualEng: 36200, cpv: 48.0, avgTime: 6.1, focAds: "Có", mediaSpend: 6800000, rating: "Bị sụt giảm", ratingStatus: "declined", note: "View -31.0%, Eng -31.1%. Can thiệp timeline 30-40s làm hỏng flow." }
  ]
};

/* =========================================================================
   PROJECT 2: VINEGAR (GIẤM GẠO) — HALF YEAR REPORT FY26
   ========================================================================= */
const VINEGAR_PROJECT = {
  key: "VINEGAR",
  name: "VINEGAR (Giấm Gạo) — Half Year Report FY26",
  badge: "10 KOLs • Ngân sách 178M • Hoàn thành",
  timeline: "W4 June 26 – W1 Aug 26 (6 tuần)",
  objective: "Kích hoạt món Gỏi/Nộm & Lẩu Bò Nhúng Giấm — Tối ưu chi phí",
  summary: {
    totalViewsStr: "7.40M",
    organicViewsStr: "2.08M",
    targetViewsStr: "2.90M",
    lyViewsStr: "4.05M",
    diffTargetViews: "71.6% KPI Org (3.23M k/reup)",
    diffLYViews: "-48.7% YoY (Ngân sách giảm 58%)",
    
    cpvStr: "45.00đ",
    targetCPVStr: "85.00đ",
    lyCPVStr: "75.00đ",
    diffTargetCPV: "-47.1% Tiết kiệm",
    diffLYCPV: "-40.0% vs LY",

    budgetStr: "178.0M",
    targetBudgetStr: "178.0M",
    lyBudgetStr: "324.0M",
    diffTargetBudget: "100%",
    diffLYBudget: "54.9% (Tiết kiệm 58%)",

    engStr: "100.0K",
    organicEngStr: "71.0K",
    targetEngStr: "114.0K",
    lyEngStr: "170.6K",
    diffTargetEng: "62.3%",
    diffLYEng: "-58.4% YoY",

    avgWatchTime: "TB 2m15s / clip",
    vtr: "3.50%",
    focCount: "9/10 KOLs",
    reupShare: "1.15M Views (35.6%)"
  },
  metricsConfig: {
    views: {
      title: "Tổng Lượt Xem (Total Views)",
      target: 2.90, targetStr: "2.90M",
      ly: 4.05, lyStr: "4.05M (17 KOLs)",
      actual: 2.08, actualStr: "2.08M Org (7.4M Total)",
      diffTarget: "71.6% KPI Org", diffLY: "TB View/KOL tăng (323K vs 261K LY)",
      color: "var(--ok)", bgColor: "var(--ok-bg)",
      status: "HIỆU SUẤT TRUNG BÌNH TĂNG",
      desc: "Ngân sách giảm 58% và số lượng KOL giảm từ 17 xuống 10, nhưng Avg View/KOL tăng từ 261K lên 323K (+24%)."
    },
    cpv: {
      title: "Chi Phí / View 6 Giây (CPV 6s)",
      target: 85, targetStr: "85.0đ",
      ly: 75, lyStr: "75.0đ",
      actual: 45.0, actualStr: "45.00đ",
      diffTarget: "-47.1% Tiết kiệm", diffLY: "-40.0% vs LY",
      color: "var(--accent)", bgColor: "var(--accent-bg)",
      status: "VƯỢT XUẤT SẮC",
      desc: "CPV giảm mạnh còn 45đ (vượt xa trần Target 85đ và LY 75đ) nhờ TikTok algorithmic spend."
    },
    budget: {
      title: "Tổng Ngân Sách (Budget)",
      target: 178.0, targetStr: "178.0M",
      ly: 324.0, lyStr: "324.0M",
      actual: 178.0, actualStr: "178.0M",
      diffTarget: "100%", diffLY: "-58.0% Tinh gọn",
      color: "var(--blue)", bgColor: "var(--blue-bg)",
      status: "NGÂN SÁCH TINH GỌN",
      desc: "Chạy chiến dịch tinh gọn với 10 KOLs chất lượng cao."
    },
    engagement: {
      title: "Tương Tác Tự Nhiên (Organic Engagement)",
      target: 114.0, targetStr: "114.0K",
      ly: 170.6, lyStr: "170.6K",
      actual: 71.0, actualStr: "71.0K (100K Total)",
      diffTarget: "62.3%", diffLY: "-58.4% YoY",
      color: "var(--warn)", bgColor: "var(--warn-bg)",
      status: "SAVES BÒ NHÚNG GIẤM ĐỘT BIẾN",
      desc: "Trang Tấm với món Bò Nhúng Giấm đóng góp tới 68% tổng lượt Lưu (Saves) toàn chiến dịch."
    }
  },
  hypotheses: [
    {
      id: "VIN-H1",
      area: "Menu & Dish Strategy",
      hypothesis: "Món Bò Nhúng Giấm (Vinegar Hotpot) kích thích người xem nấu ăn và lưu video nhiều hơn món Nộm/Gỏi.",
      lyResult: "Tập trung phần lớn vào các món Nộm/Gỏi miền Bắc (Saves rải rác).",
      fy26Result: "Đạt thành công vang dội: Trang Tấm (Bò nhúng giấm) đạt 718K view, 44.5K like và chiếm 68% tổng lượt Saves toàn chiến dịch.",
      verdictLabel: "Đạt xuất sắc",
      statusType: "success", badgeBg: "var(--ok-bg)", badgeColor: "var(--ok)",
      learning: "Mở rộng menu đưa Bò Nhúng Giấm thành món Hero Dish cho các chiến dịch tới."
    },
    {
      id: "VIN-H2",
      area: "Hiệu quả Chi phí Paid",
      hypothesis: "Dồn ngân sách media pool thay vì chia cố định từng KOL giúp hạ CPV xuống dưới 85đ.",
      lyResult: "CPV 75.0đ ở FY25.",
      fy26Result: "CPV thực tế giảm sâu còn 45.0đ (giảm 47% vs Target 85đ, giảm 40% vs LY 75đ).",
      verdictLabel: "Vượt mục tiêu",
      statusType: "success", badgeBg: "var(--ok-bg)", badgeColor: "var(--ok)",
      learning: "Tiếp tục áp dụng cơ chế ngân sách gộp (Media Pool) để thuật toán TikTok tự dồn tiền cho video viral."
    },
    {
      id: "VIN-H3",
      area: "Đa Kênh & FOC Reup",
      hypothesis: "Hầu hết KOLs đồng ý FOC Reup và cấp mã Code Ads miễn phí.",
      lyResult: "Chủ yếu phân phối đơn kênh trên TikTok.",
      fy26Result: "9/10 KOLs hỗ trợ FOC Reup Facebook & Code Ads, kéo Avg View/KOL lên 323K (vượt mức 261K của FY25).",
      verdictLabel: "Thành công lớn",
      statusType: "success", badgeBg: "var(--ok-bg)", badgeColor: "var(--ok)",
      learning: "Duy trì đàm phán quyền lợi FOC Reup để gia tăng độ phủ thương hiệu không tốn thêm chi phí."
    },
    {
      id: "VIN-H4",
      area: "Tỷ lệ Chuyển đổi Nấu ăn",
      hypothesis: "Người xem video Nộm/Gỏi sẽ có động lực nấu thử ngay tại nhà.",
      lyResult: "Comments và Shares ở mức trung bình.",
      fy26Result: "Comments và Shares giảm ~70% so với FY25 — người xem thích xem clip nhưng chưa có động lực vào bếp làm món nộm.",
      verdictLabel: "Cần cải thiện",
      statusType: "warning", badgeBg: "var(--warn-bg)", badgeColor: "var(--warn)",
      learning: "Cần công thức đơn giản hóa hơn và CTA thúc đẩy người xem hành động nấu ngay."
    }
  ],
  kols: [
    { id: "V1", kol: "Trang Tấm", type: "Mid-tier", followers: "699.2K", dish: "Nộm bò cà pháo & Lẩu bò nhúng giấm", cost: 38000000, targetViews: 600000, organicViews: 718000, reupViews: 120000, totalViews: 838000, targetEng: 30000, actualEng: 48970, cpv: 38.0, avgTime: 169, focAds: "Có (FOC)", mediaSpend: 0, rating: "MVP Chiến Dịch", ratingStatus: "excellent", note: "Đạt mọi hypothesis: 718K view, 44.5K like, đóng góp 68% tổng lượt Saves." },
    { id: "V2", kol: "Khánh Linh", type: "Macro", followers: "1.1M", dish: "Mì lạnh HQ + Gỏi bò ngò giấm", cost: 25000000, targetViews: 400000, organicViews: 341329, reupViews: 60000, totalViews: 401329, targetEng: 15000, actualEng: 2449, cpv: 42.0, avgTime: 88, focAds: "Có (FOC)", mediaSpend: 0, rating: "Đạt KPI", ratingStatus: "good", note: "Góc quay thẩm mỹ cao, thực đơn sáng tạo kết hợp mì lạnh." },
    { id: "V3", kol: "Linh nấu", type: "Mid-tier", followers: "513.6K", dish: "Nộm hoa chuối đậu hũ", cost: 18000000, targetViews: 300000, organicViews: 283832, reupViews: 45000, totalViews: 328832, targetEng: 12000, actualEng: 2276, cpv: 41.5, avgTime: 105, focAds: "Có", mediaSpend: 0, rating: "Đạt KPI tốt", ratingStatus: "good", note: "Món ăn thanh đạm healthy, hoàn thành chỉ tiêu view." },
    { id: "V4", kol: "My Huyền", type: "Micro", followers: "148.2K", dish: "Bún bắp bò nhúng giấm + tỏi ngâm", cost: 12000000, targetViews: 200000, organicViews: 195569, reupViews: 30000, totalViews: 225569, targetEng: 8000, actualEng: 3784, cpv: 43.0, avgTime: 91, focAds: "Có", mediaSpend: 0, rating: "Đạt KPI tốt", ratingStatus: "good", note: "Lẩu bắp bò nhúng giấm thu hút lượng saves tốt (647 saves)." },
    { id: "V5", kol: "Châu Kiều My", type: "Mid-tier", followers: "560.6K", dish: "Gỏi bò ngũ sắc kiểu mới", cost: 18000000, targetViews: 300000, organicViews: 179723, reupViews: 35000, totalViews: 214723, targetEng: 10000, actualEng: 5494, cpv: 44.0, avgTime: 128, focAds: "Có", mediaSpend: 0, rating: "Đạt KPI", ratingStatus: "good", note: "Màu sắc gỏi ngũ sắc đẹp mắt, tương tác like cao (4.5K like)." },
    { id: "V6", kol: "Nông Thôn Mới", type: "Micro", followers: "277.4K", dish: "Nộm bò cà pháo", cost: 12000000, targetViews: 200000, organicViews: 123992, reupViews: 25000, totalViews: 148992, targetEng: 6000, actualEng: 461, cpv: 45.0, avgTime: 149, focAds: "Có", mediaSpend: 0, rating: "Đạt KPI", ratingStatus: "good", note: "Bối cảnh thôn quê yên bình, thời lượng xem dài (2p29s)." },
    { id: "V7", kol: "Ăn gì Thương ơi", type: "Mid-tier", followers: "521.3K", dish: "Bún mọc sườn chua", cost: 15000000, targetViews: 250000, organicViews: 98667, reupViews: 20000, totalViews: 118667, targetEng: 8000, actualEng: 2226, cpv: 46.0, avgTime: 196, focAds: "Có (FOC)", mediaSpend: 0, rating: "Cần tối ưu món", ratingStatus: "warning", note: "Món bún mọc sườn chua view thấp hơn dự kiến, thời lượng clip dài (3p16s)." },
    { id: "V8", kol: "TOE NẤU GÌ ĐÓ", type: "Micro", followers: "287.6K", dish: "Nộm rau muống tôm đồng", cost: 12000000, targetViews: 200000, organicViews: 65663, reupViews: 15000, totalViews: 80663, targetEng: 7000, actualEng: 2391, cpv: 48.0, avgTime: 132, focAds: "Có", mediaSpend: 0, rating: "Cần tối ưu menu", ratingStatus: "warning", note: "Món nộm rau muống kén người xem, saves đạt 464." },
    { id: "V9", kol: "Nấu Ăn Dễ Lắm", type: "Micro", followers: "407.2K", dish: "Gỏi mực xoài chua cay", cost: 8000000, targetViews: 150000, organicViews: 37429, reupViews: 10000, totalViews: 47429, targetEng: 5000, actualEng: 1101, cpv: 49.0, avgTime: 93, focAds: "Có", mediaSpend: 0, rating: "Cần tối ưu menu", ratingStatus: "warning", note: "Món gỏi mực xoài kén tương tác, cần đổi thực đơn hấp dẫn hơn." },
    { id: "V10", kol: "Cơm nhà bếp xưa", type: "Nano", followers: "24.4K", dish: "Nộm gà xé phay", cost: 5000000, targetViews: 100000, organicViews: 32573, reupViews: 8000, totalViews: 40573, targetEng: 3000, actualEng: 1871, cpv: 47.0, avgTime: 209, focAds: "Có (FOC)", mediaSpend: 0, rating: "Đạt Nano KPI", ratingStatus: "good", note: "Nano KOL chi phí thấp, thời lượng xem dài (3p29s)." }
  ]
};

export default function DashboardView({ rows = [], onOpen = () => {}, campaignLabels = {} }) {
  // Main Project Switcher: "MSG" vs "VINEGAR"
  const [activeProjectKey, setActiveProjectKey] = useState("MSG");
  
  // Sub-tabs: "overview" | "kols" | "hypothesis"
  const [activeSubView, setActiveSubView] = useState("overview");

  // Filter & Search states
  const [searchKol, setSearchKol] = useState("");
  const [sortField, setSortField] = useState("totalViews");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedHypothesisFilter, setSelectedHypothesisFilter] = useState("all");

  // Get active project data
  const project = activeProjectKey === "MSG" ? MSG_PROJECT : VINEGAR_PROJECT;

  // Sorting & Filtering logic for active project's KOLs
  const displayKols = useMemo(() => {
    let list = project.kols.filter(item => {
      const matchSearch = !searchKol.trim() || item.kol.toLowerCase().includes(searchKol.toLowerCase()) || item.dish.toLowerCase().includes(searchKol.toLowerCase());
      return matchSearch;
    });

    list.sort((a, b) => {
      let vA = a[sortField];
      let vB = b[sortField];

      if (sortField === "pctAchieved") {
        vA = (a.totalViews / a.targetViews) * 100;
        vB = (b.totalViews / b.targetViews) * 100;
      }

      if (typeof vA === "string") return sortAsc ? vA.localeCompare(vB, "vi") : vB.localeCompare(vA, "vi");
      return sortAsc ? (vA - vB) : (vB - vA);
    });

    return list;
  }, [project, searchKol, sortField, sortAsc]);

  // Aggregate Totals for Summary Row
  const totals = useMemo(() => {
    const totalCost = displayKols.reduce((acc, k) => acc + (k.cost || 0), 0);
    const totalTargetViews = displayKols.reduce((acc, k) => acc + k.targetViews, 0);
    const totalOrganicViews = displayKols.reduce((acc, k) => acc + k.organicViews, 0);
    const totalReupViews = displayKols.reduce((acc, k) => acc + k.reupViews, 0);
    const totalCombinedViews = displayKols.reduce((acc, k) => acc + k.totalViews, 0);
    const totalActualEng = displayKols.reduce((acc, k) => acc + k.actualEng, 0);
    const avgCPV = displayKols.length ? (displayKols.reduce((acc, k) => acc + k.cpv, 0) / displayKols.length).toFixed(1) : 0;
    const avgTime = displayKols.length ? (displayKols.reduce((acc, k) => acc + k.avgTime, 0) / displayKols.length).toFixed(1) : 0;
    const totalMediaSpend = displayKols.reduce((acc, k) => acc + k.mediaSpend, 0);
    const pctAchieved = totalTargetViews > 0 ? ((totalCombinedViews / totalTargetViews) * 100).toFixed(1) : 0;

    return {
      totalCost,
      totalTargetViews,
      totalOrganicViews,
      totalReupViews,
      totalCombinedViews,
      totalActualEng,
      avgCPV,
      avgTime,
      totalMediaSpend,
      pctAchieved
    };
  }, [displayKols]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Top & Bottom performers for visual cards
  const topPerformers = useMemo(() => {
    return [...project.kols]
      .map(k => ({ ...k, pct: ((k.totalViews / k.targetViews) * 100).toFixed(1) }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);
  }, [project]);

  const bottomPerformers = useMemo(() => {
    return [...project.kols]
      .map(k => ({ ...k, pct: ((k.totalViews / k.targetViews) * 100).toFixed(1) }))
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 2);
  }, [project]);

  // Filter Hypotheses
  const displayHypotheses = useMemo(() => {
    if (selectedHypothesisFilter === "all") return project.hypotheses;
    if (selectedHypothesisFilter === "validated") return project.hypotheses.filter(h => h.statusType === "success");
    if (selectedHypothesisFilter === "rejected") return project.hypotheses.filter(h => h.statusType === "danger");
    if (selectedHypothesisFilter === "warning") return project.hypotheses.filter(h => h.statusType === "warning");
    return project.hypotheses;
  }, [project, selectedHypothesisFilter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: "var(--surface)", padding: "18px 20px", gap: 16 }}>
      
      {/* ── TOP 2-PROJECT TABS SWITCHER (TÁCH RIÊNG 2 DỰ ÁN) ── */}
      <div style={{ 
        background: "var(--card)", 
        borderRadius: 16, 
        border: "1px solid var(--rule)", 
        padding: "12px 18px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexWrap: "wrap", 
        gap: 12,
        boxShadow: "0 2px 10px rgba(46, 56, 64, 0.04)"
      }}>
        {/* Main 2-Project Tab Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            DỰ ÁN:
          </span>
          <div style={{ display: "flex", gap: 4, background: "var(--paper)", padding: 4, borderRadius: 20, border: "1px solid var(--rule)" }}>
            <button 
              onClick={() => { setActiveProjectKey("MSG"); setSearchKol(""); }}
              style={{
                padding: "6px 16px",
                borderRadius: 16,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                background: activeProjectKey === "MSG" ? "var(--ok)" : "transparent",
                color: activeProjectKey === "MSG" ? "#fff" : "var(--ink)",
                boxShadow: activeProjectKey === "MSG" ? "0 2px 8px rgba(59, 150, 134, 0.3)" : "none",
                transition: "all 0.2s"
              }}
            >
              🧂 [MSG] Bột Ngọt (25 KOLs)
            </button>
            <button 
              onClick={() => { setActiveProjectKey("VINEGAR"); setSearchKol(""); }}
              style={{
                padding: "6px 16px",
                borderRadius: 16,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                background: activeProjectKey === "VINEGAR" ? "var(--blue)" : "transparent",
                color: activeProjectKey === "VINEGAR" ? "#fff" : "var(--ink)",
                boxShadow: activeProjectKey === "VINEGAR" ? "0 2px 8px rgba(74, 136, 186, 0.3)" : "none",
                transition: "all 0.2s"
              }}
            >
              🍶 VINEGAR Giấm Gạo (10 KOLs)
            </button>
          </div>
        </div>

        {/* Sub-view Navigation Tabs */}
        <div style={{ display: "flex", gap: 4, background: "var(--paper)", padding: 3, borderRadius: 10, border: "1px solid var(--rule)" }}>
          <button 
            className={`kt-btn ${activeSubView === "overview" ? "kt-btn-primary" : "kt-btn-ghost"}`}
            style={{ padding: "5px 12px", fontSize: 11, borderRadius: 8 }}
            onClick={() => setActiveSubView("overview")}
          >
            📊 Biểu Đồ So Sánh
          </button>
          <button 
            className={`kt-btn ${activeSubView === "kols" ? "kt-btn-primary" : "kt-btn-ghost"}`}
            style={{ padding: "5px 12px", fontSize: 11, borderRadius: 8 }}
            onClick={() => setActiveSubView("kols")}
          >
            👥 Bảng {project.kols.length} KOLs
          </button>
          <button 
            className={`kt-btn ${activeSubView === "hypothesis" ? "kt-btn-primary" : "kt-btn-ghost"}`}
            style={{ padding: "5px 12px", fontSize: 11, borderRadius: 8 }}
            onClick={() => setActiveSubView("hypothesis")}
          >
            🎯 Giả Thuyết: LY vs FY26
          </button>
        </div>
      </div>

      {/* ── PROJECT HEADER BANNER ── */}
      <div style={{ 
        background: "var(--card)", 
        borderRadius: 14, 
        border: "1px solid var(--rule)", 
        padding: "14px 18px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span className="kt-badge" style={{ background: activeProjectKey === "MSG" ? "var(--ok-bg)" : "var(--blue-bg)", color: activeProjectKey === "MSG" ? "var(--ok)" : "var(--blue)", fontWeight: 800 }}>
              ● {project.badge}
            </span>
            <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{project.timeline}</span>
          </div>
          <h3 style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 800, color: "var(--ink)" }}>
            {project.name}
          </h3>
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-mid)" }}>
          🎯 <strong>Mục tiêu:</strong> {project.objective}
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: ULTRA-INTUITIVE VISUAL COMPARISON DASHBOARD
         ========================================================================= */}
      {activeSubView === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* 3 Core Visual Comparison Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
            
            {/* CARD 1: TOTAL VIEWS COMPARATOR */}
            <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--rule)", padding: "18px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <span className="kt-caps" style={{ color: "var(--ink-soft)" }}>1. TỔNG LƯỢT XEM (VIEWS)</span>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--ok)", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {project.summary.totalViewsStr}
                  </div>
                </div>
                <span className="kt-badge" style={{ background: "var(--ok-bg)", color: "var(--ok)", fontWeight: 800, fontSize: 11, padding: "4px 8px" }}>
                  {project.summary.diffTargetViews}
                </span>
              </div>

              {/* Horizontal Comparison Bars */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Actual FY26 */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
                    <span style={{ color: "var(--ok)" }}>Thực tế Organic (FY26)</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--ok)" }}>{project.summary.organicViewsStr}</span>
                  </div>
                  <div style={{ height: 16, background: "var(--surface)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", background: "var(--ok)", borderRadius: 8 }} />
                  </div>
                </div>

                {/* Target */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
                    <span style={{ color: "var(--accent)" }}>Mục tiêu (Target)</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{project.summary.targetViewsStr}</span>
                  </div>
                  <div style={{ height: 16, background: "var(--surface)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (parseFloat(project.summary.targetViewsStr) / parseFloat(project.summary.organicViewsStr || "1")) * 100)}%`, height: "100%", background: "var(--accent)", borderRadius: 8 }} />
                  </div>
                </div>

                {/* Last Year LY */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
                    <span style={{ color: "var(--ink-soft)" }}>Năm trước (LY FY25)</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{project.summary.lyViewsStr}</span>
                  </div>
                  <div style={{ height: 16, background: "var(--surface)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (parseFloat(project.summary.lyViewsStr) / Math.max(parseFloat(project.summary.organicViewsStr || "1"), parseFloat(project.summary.lyViewsStr))) * 100)}%`, height: "100%", background: "#CBD5E1", borderRadius: 8 }} />
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px dashed var(--rule)", display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span>🎯 <strong>YoY:</strong> {project.summary.diffLYViews}</span>
                <span>🌐 <strong>Reup:</strong> {project.summary.reupShare}</span>
              </div>
            </div>

            {/* CARD 2: COST PER VIEW (CPV 6S) */}
            <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--rule)", padding: "18px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <span className="kt-caps" style={{ color: "var(--ink-soft)" }}>2. CHI PHÍ / VIEW 6S (CPV)</span>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--ok)", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {project.summary.cpvStr}
                  </div>
                </div>
                <span className="kt-badge" style={{ background: "var(--ok-bg)", color: "var(--ok)", fontWeight: 800, fontSize: 11, padding: "4px 8px" }}>
                  {project.summary.diffTargetCPV}
                </span>
              </div>

              {/* Horizontal Comparison Bars */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Actual FY26 */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
                    <span style={{ color: "var(--ok)" }}>Thực tế FY26 (Tối ưu)</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--ok)" }}>{project.summary.cpvStr}</span>
                  </div>
                  <div style={{ height: 16, background: "var(--surface)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ width: `${(parseFloat(project.summary.cpvStr) / parseFloat(project.summary.targetCPVStr)) * 100}%`, height: "100%", background: "var(--ok)", borderRadius: 8 }} />
                  </div>
                </div>

                {/* Last Year LY */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
                    <span style={{ color: "var(--ink-soft)" }}>Năm trước (LY FY25)</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{project.summary.lyCPVStr}</span>
                  </div>
                  <div style={{ height: 16, background: "var(--surface)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ width: `${(parseFloat(project.summary.lyCPVStr) / parseFloat(project.summary.targetCPVStr)) * 100}%`, height: "100%", background: "#CBD5E1", borderRadius: 8 }} />
                  </div>
                </div>

                {/* Target */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
                    <span style={{ color: "var(--accent)" }}>Mục tiêu trần (Target Max)</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{project.summary.targetCPVStr}</span>
                  </div>
                  <div style={{ height: 16, background: "var(--surface)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", background: "var(--accent)", borderRadius: 8 }} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px dashed var(--rule)", fontSize: 11, color: "var(--ink-mid)" }}>
                ⚡ <strong>vs LY:</strong> {project.summary.diffLYCPV} • FOC Reup: {project.summary.focCount}
              </div>
            </div>

            {/* CARD 3: TOP & BOTTOM PERFORMERS */}
            <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--rule)", padding: "18px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span className="kt-caps" style={{ color: "var(--ink-soft)" }}>3. XẾP HẠNG KOL HIỆU QUẢ (% KPI)</span>
              </div>

              {/* Top Performers */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--ok)", marginBottom: 6 }}>🌟 TOP HIỆU QUẢ CAO</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {topPerformers.map(k => (
                    <div key={k.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
                      <span style={{ fontWeight: 600, color: "var(--ink)" }}>{k.kol}</span>
                      <span className="kt-badge" style={{ background: "var(--ok-bg)", color: "var(--ok)", fontWeight: 800 }}>
                        {k.pct}% ({k.dish})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Performers */}
              <div style={{ borderTop: "1px dashed var(--rule)", paddingTop: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--danger)", marginBottom: 6 }}>⚠️ CẦN TỐI ƯU MENU / SCRIPT</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {bottomPerformers.map(k => (
                    <div key={k.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
                      <span style={{ fontWeight: 600, color: "var(--ink)" }}>{k.kol}</span>
                      <span className="kt-badge" style={{ background: "var(--danger-bg)", color: "var(--danger)", fontWeight: 800 }}>
                        {k.pct}% ({k.dish})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Key Insights Strip */}
          <div style={{ background: "var(--card)", borderRadius: 16, border: "1px solid var(--rule)", padding: "16px 20px" }}>
            <span className="kt-caps" style={{ color: "var(--ink-soft)", display: "block", marginBottom: 10 }}>
              ĐÁNH GIÁ TRỌNG TÂM CHIẾN DỊCH {project.name.split("—")[0]}
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
              {project.hypotheses.map(h => (
                <div key={h.id} style={{ background: h.badgeBg, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--rule)" }}>
                  <div style={{ fontWeight: 800, color: h.badgeColor, fontSize: 12, marginBottom: 2 }}>{h.verdictLabel}: {h.area}</div>
                  <div style={{ fontSize: 11, color: "var(--ink)", fontWeight: 600 }}>{h.learning}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW 2: FULL KOL COMPARISON TABLE
         ========================================================================= */}
      {activeSubView === "kols" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          
          <div style={{ 
            background: "var(--card)", 
            borderRadius: 16, 
            border: "1px solid var(--rule)", 
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(46, 56, 64, 0.04)"
          }}>
            {/* Search & Header */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input 
                  className="kt-input" 
                  placeholder={`🔍 Lọc tên KOL hoặc món ăn trong ${project.name.split("—")[0]}...`}
                  value={searchKol}
                  onChange={e => setSearchKol(e.target.value)}
                  style={{ width: 260, padding: "5px 10px", fontSize: 12 }}
                />
              </div>

              <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                Hiển thị <strong>{displayKols.length}</strong> / {project.kols.length} KOLs (Bấm tiêu đề cột để sắp xếp)
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table className="kt-table" style={{ width: "100%", fontSize: 12 }}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("kol")} style={{ cursor: "pointer" }}>
                      Tên KOL {sortField === "kol" && (sortAsc ? "▲" : "▼")}
                    </th>
                    <th>Tier / Follower</th>
                    <th>Menu Món Ăn</th>
                    <th onClick={() => handleSort("cost")} style={{ textAlign: "right", cursor: "pointer" }}>
                      Cost {sortField === "cost" && (sortAsc ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("targetViews")} style={{ textAlign: "right", cursor: "pointer" }}>
                      Target View {sortField === "targetViews" && (sortAsc ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("organicViews")} style={{ textAlign: "right", cursor: "pointer" }}>
                      Organic View {sortField === "organicViews" && (sortAsc ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("totalViews")} style={{ textAlign: "right", cursor: "pointer" }}>
                      Total View {sortField === "totalViews" && (sortAsc ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("pctAchieved")} style={{ textAlign: "center", cursor: "pointer" }}>
                      % KPI {sortField === "pctAchieved" && (sortAsc ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("actualEng")} style={{ textAlign: "right", cursor: "pointer" }}>
                      Tương Tác {sortField === "actualEng" && (sortAsc ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("avgTime")} style={{ textAlign: "center", cursor: "pointer" }}>
                      Avg Time {sortField === "avgTime" && (sortAsc ? "▲" : "▼")}
                    </th>
                    <th onClick={() => handleSort("cpv")} style={{ textAlign: "right", cursor: "pointer" }}>
                      CPV 6s {sortField === "cpv" && (sortAsc ? "▲" : "▼")}
                    </th>
                    <th>Đánh Giá / Note</th>
                  </tr>
                </thead>
                <tbody>
                  {displayKols.map(k => {
                    const pct = ((k.totalViews / k.targetViews) * 100).toFixed(1);
                    return (
                      <tr key={k.id} style={{ cursor: "pointer" }} onClick={() => onOpen({ ...k, id: k.id })}>
                        <td style={{ fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap" }}>
                          {k.kol}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <span className="kt-badge" style={{ background: "var(--paper)", color: "var(--ink-mid)" }}>
                            {k.type} • {k.followers || "—"}
                          </span>
                        </td>
                        <td style={{ color: "var(--ink-mid)", maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={k.dish}>
                          {k.dish}
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                          {k.cost ? `${(k.cost / 1000000).toFixed(1)}M` : "—"}
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{k.targetViews.toLocaleString()}</td>
                        <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{k.organicViews.toLocaleString()}</td>
                        <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: k.totalViews >= k.targetViews ? "var(--ok)" : "var(--danger)" }}>
                          {k.totalViews.toLocaleString()}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className="kt-badge" style={{ 
                            background: pct >= 100 ? "var(--ok-bg)" : "var(--danger-bg)", 
                            color: pct >= 100 ? "var(--ok)" : "var(--danger)",
                            fontWeight: 700
                          }}>
                            {pct}%
                          </span>
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{k.actualEng.toLocaleString()}</td>
                        <td style={{ textAlign: "center", fontWeight: 700 }}>
                          {typeof k.avgTime === "number" && k.avgTime > 60 ? `${Math.floor(k.avgTime / 60)}m${k.avgTime % 60}s` : `${k.avgTime}s`}
                        </td>
                        <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: k.cpv <= 45 ? "var(--ok)" : "var(--ink)" }}>{k.cpv}đ</td>
                        <td style={{ fontSize: 11, color: "var(--ink-mid)", maxWidth: 260 }}>
                          <strong style={{ color: k.ratingStatus === "excellent" ? "var(--ok)" : k.ratingStatus === "declined" ? "var(--danger)" : "var(--ink)" }}>[{k.rating}]</strong> {k.note}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Aggregate Summary Footer Row */}
                <tfoot>
                  <tr style={{ background: "var(--paper)", borderTop: "2px solid var(--rule)", fontWeight: 800 }}>
                    <td style={{ color: "var(--ink)", fontWeight: 800 }}>TỔNG CỘNG ({displayKols.length} KOLs)</td>
                    <td>—</td>
                    <td>—</td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>
                      {totals.totalCost > 0 ? `${(totals.totalCost / 1000000).toFixed(1)}M` : "—"}
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{totals.totalTargetViews.toLocaleString()}</td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{totals.totalOrganicViews.toLocaleString()}</td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "var(--ok)", fontSize: 13 }}>{totals.totalCombinedViews.toLocaleString()}</td>
                    <td style={{ textAlign: "center" }}>
                      <span className="kt-badge" style={{ background: "var(--ok)", color: "#fff", fontWeight: 800 }}>
                        {totals.pctAchieved}%
                      </span>
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{totals.totalActualEng.toLocaleString()}</td>
                    <td style={{ textAlign: "center" }}>TB {totals.avgTime}s</td>
                    <td style={{ textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", color: "var(--ok)" }}>TB {totals.avgCPV}đ</td>
                    <td><span className="kt-badge" style={{ background: "var(--ok-bg)", color: "var(--ok)" }}>{project.summary.diffTargetViews}</span></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: HYPOTHESIS VS LY VS FY26 COMPARISON MATRIX
         ========================================================================= */}
      {activeSubView === "hypothesis" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 14 }}>
            {displayHypotheses.map(h => (
              <div 
                key={h.id}
                style={{
                  background: "var(--card)",
                  borderRadius: 14,
                  border: "1px solid var(--rule)",
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <span className="kt-badge" style={{ background: "var(--paper)", color: "var(--ink-soft)", border: "1px solid var(--rule)" }}>
                    {h.area}
                  </span>
                  <span className="kt-badge" style={{ background: h.badgeBg, color: h.badgeColor, fontWeight: 800 }}>
                    {h.verdictLabel}
                  </span>
                </div>

                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)", lineHeight: 1.4 }}>
                  {h.hypothesis}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: "var(--surface)", padding: 10, borderRadius: 10, border: "1px solid var(--rule)" }}>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 2 }}>LY (FY25)</div>
                    <div style={{ fontSize: 11, color: "var(--ink-mid)" }}>{h.lyResult}</div>
                  </div>
                  <div style={{ borderLeft: "1px dashed var(--rule)", paddingLeft: 8 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: h.badgeColor, textTransform: "uppercase", marginBottom: 2 }}>FY26 Actual</div>
                    <div style={{ fontSize: 11, color: "var(--ink)", fontWeight: 600 }}>{h.fy26Result}</div>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: "var(--ink-mid)", background: "var(--paper)", padding: "6px 10px", borderRadius: 6 }}>
                  💡 <strong>Bài học:</strong> {h.learning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
