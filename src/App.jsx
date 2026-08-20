import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import * as XLSX from "xlsx";

/* ---------------- Design tokens (injected via <style>) ---------------- */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

    /* ── DESIGN TOKENS: Serene Lavender & Linen Minimalism ── */
    .kt-root {
      --ink:        #231F34; /* Deep charcoal lavender */
      --ink-mid:    #544D76; /* Dusky violet */
      --ink-soft:   #8B84B2; /* Muted lavender grey */
      --ink-faint:  #CDC9DC; /* Soft grey wash */
      --paper:      #F5F3FA; /* Pearled cream/lilac linen background */
      --card:       #FFFFFF; /* Pure white cards */
      --rule:       #E4E1EE; /* Delicate border rule */
      --line:       #E4E1EE;
      --accent:     #8A7BFF; /* Serene Lavender Lilac */
      --accent-dim: #CDCAFF; /* Soft Lavender purple */
      --accent-bg:  #F4F2FF; /* Serene light lilac wash */
      
      --ok:         #34A885; /* Soft mint green */
      --ok-bg:      #EEF8F5; /* Thin mint wash */
      --warn:       #D97706; /* Soft apricot amber */
      --warn-bg:    #FFFBEB; /* Thin amber wash */
      --danger:     #E15252; /* Soft pastel red */
      --danger-bg:  #FFF5F5; /* Thin red wash */
      --blue:       #4F83E1; /* Soft periwinkle blue */
      --blue-bg:    #F0F4FF; /* Thin blue wash */

      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      color: var(--ink);
      background-color: var(--paper);

      /* Subtly textured background grain */
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.015'/%3E%3C/svg%3E");
      background-size: 180px 180px;

      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    .kt-root input, .kt-root select, .kt-root button, .kt-root textarea {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .kt-serif  { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; letter-spacing: -0.02em; }
    .kt-mono   { font-family: 'IBM Plex Mono', monospace; }
    .kt-caps   { text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.72em; font-weight: 700; }

    /* ── SCROLLBAR ── */
    .kt-scrollbar::-webkit-scrollbar       { height: 6px; width: 6px; }
    .kt-scrollbar::-webkit-scrollbar-thumb { background: var(--ink-faint); border-radius: 4px; }
    .kt-scrollbar::-webkit-scrollbar-track { background: transparent; }

    /* ── CARDS: Soft rounded corners, clean border, no heavy outline ── */
    .kt-card {
      background: var(--card);
      border: 1px solid var(--rule);
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(72, 67, 92, 0.015);
    }
    .kt-card-neutral {
      background: var(--card);
      border: 1px solid var(--rule);
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(72, 67, 92, 0.015);
    }
    .kt-glass {
      background: var(--card);
      border: 1px solid var(--rule);
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(72, 67, 92, 0.015);
    }

    /* ── KANBAN TICKET ── */
    .kt-ticket {
      position: relative;
      background: var(--card);
      border: 1px solid var(--rule);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(72, 67, 92, 0.01);
      transition: all 0.2s ease;
    }
    .kt-ticket:hover {
      border-color: var(--accent-dim);
      box-shadow: 0 6px 16px rgba(138, 123, 255, 0.06);
    }
    .kt-ticket .kt-perf {
      position: relative;
      border-top: 1px dashed var(--rule);
      margin: 0 14px;
    }
    .kt-ticket .kt-perf::before, .kt-ticket .kt-perf::after {
      content: '';
      position: absolute;
      top: -7px;
      width: 14px; height: 14px;
      border-radius: 50%;
      background: var(--paper);
      border: 1px solid var(--rule);
    }
    .kt-ticket .kt-perf::before { left: -21px; }
    .kt-ticket .kt-perf::after  { right: -21px; }

    /* ── STAMP ── */
    .kt-stamp {
      display: inline-block;
      transform: rotate(-3deg);
      border: 1.5px solid var(--ok);
      color: var(--ok);
      font-family: 'IBM Plex Mono', monospace;
      font-weight: 600;
      letter-spacing: 0.08em;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 10px;
      text-transform: uppercase;
      background: var(--ok-bg);
    }

    /* ── TOOLTIP ── */
    .kt-tooltip-wrapper { position: relative; display: inline-block; cursor: help; }
    .kt-tooltip {
      visibility: hidden; width: 240px;
      background: var(--ink); color: #fff;
      text-align: left; border-radius: 8px;
      padding: 10px 12px; position: absolute;
      z-index: 1000; bottom: 125%; left: 50%;
      transform: translateX(-50%);
      opacity: 0; transition: opacity 0.15s ease;
      font-size: 11px; line-height: 1.5; font-weight: 400;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--ink-mid); pointer-events: none;
      white-space: normal; text-transform: none; letter-spacing: normal;
    }
    .kt-tooltip::after {
      content: ""; position: absolute; top: 100%; left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: var(--ink);
    }
    .kt-tooltip-wrapper:hover .kt-tooltip { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(-4px); }

    /* ── BUTTONS ── */
    .kt-btn {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700; border-radius: 12px;
      padding: 8px 16px; font-size: 12px;
      cursor: pointer; border: 1px solid transparent;
      transition: all 0.2s ease;
      display: inline-flex; align-items: center; gap: 6px;
      white-space: nowrap; letter-spacing: -0.01em;
    }
    .kt-btn-primary {
      background: var(--accent); color: #fff;
      border-color: var(--accent);
    }
    .kt-btn-primary:hover {
      background: #7362E3; border-color: #7362E3;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(138, 123, 255, 0.25);
    }
    .kt-btn-ghost {
      background: transparent; color: var(--ink);
      border-color: var(--rule);
    }
    .kt-btn-ghost:hover { background: var(--accent-bg); border-color: var(--accent-dim); }
    .kt-btn-ghost.active {
      background: var(--accent); color: #fff; border-color: var(--accent);
    }
    .kt-btn-danger { background: var(--danger-bg); color: var(--danger); border-color: var(--danger-bg); }
    .kt-btn-danger:hover { background: #FCDEDE; }

    /* ── FORM ELEMENTS ── */
    .kt-input, .kt-select, .kt-textarea {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--card);
      border: 1px solid var(--rule);
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 13px;
      color: var(--ink);
      width: 100%;
      outline: none;
      transition: all 0.2s;
    }
    .kt-input:focus, .kt-select:focus, .kt-textarea:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-bg);
      background: var(--card);
    }
    .kt-label {
      font-size: 10px; font-weight: 700; color: var(--ink-soft);
      text-transform: uppercase; letter-spacing: 0.08em;
      margin-bottom: 4px; display: block;
    }
    .kt-badge {
      font-size: 10px; font-weight: 700;
      padding: 3px 8px; border-radius: 6px;
      white-space: nowrap; display: inline-block;
      letter-spacing: 0.02em;
    }

    /* ── KANBAN & INTERACTIVE TRANSITIONS ── */
    .kt-kanban-col {
      min-width: 280px; max-width: 280px;
      display: flex; flex-direction: column;
      max-height: calc(100vh - 280px);
    }

    /* ── OVERLAY & MODAL ── */
    .kt-overlay {
      position: fixed; inset: 0;
      background: rgba(35, 31, 52, 0.4);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
      animation: kt-fade-in 0.25s ease;
    }
    @keyframes kt-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .kt-modal {
      background: var(--card);
      border-radius: 20px;
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 50px rgba(26, 22, 37, 0.05);
      border: 1px solid var(--rule);
      animation: kt-modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes kt-modal-pop {
      from { transform: scale(0.95); opacity: 0; }
      to   { transform: scale(1); opacity: 1; }
    }

    /* Table styling */
    .kt-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13px; }
    .kt-table th {
      background: var(--paper);
      border-bottom: 1px solid var(--rule);
      padding: 12px 14px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      color: var(--ink-soft);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      white-space: nowrap;
    }
    .kt-table-sticky th {
      position: sticky;
      top: 0;
      z-index: 10;
      background: var(--paper);
      border-bottom: 1px solid var(--rule) !important;
    }
    .kt-table-sticky th:first-child {
      border-top-left-radius: 12px;
    }
    .kt-table-sticky th:last-child {
      border-top-right-radius: 12px;
    }
    .kt-table-sticky-modal th {
      position: sticky;
      top: 0;
      z-index: 10;
      background: var(--paper);
      box-shadow: inset 0 -1px 0 var(--rule);
    }
    .kt-table td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--rule);
      vertical-align: middle;
      line-height: 1.45;
    }
    .kt-table tr:last-child td { border-bottom: none; }
    .kt-table tr:hover td { background: var(--accent-bg); }
    .kt-table a { color: var(--accent); text-decoration: none; word-break: break-all; }
    .kt-table a:hover { text-decoration: underline; }

    /* Kanban Card */
    .kt-kanban-card {
      background: var(--card);
      border: 1px solid var(--rule);
      border-radius: 12px;
      padding: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(72, 67, 92, 0.01);
    }
    .kt-kanban-card:hover {
      box-shadow: 0 6px 20px rgba(138, 123, 255, 0.08);
      border-color: var(--accent-dim);
      transform: translateY(-2px);
    }

    @media (prefers-reduced-motion: reduce) {
      .kt-anim { animation: none; }
      .kt-kanban-card:hover { transform: none; }
    }
  `}</style>
);
/* ---------------- Domain constants ---------------- */
const CAMPAIGNS = [
  { key: "AM", label: "Campaign A", color: "#FFAFA3" },
  { key: "AX", label: "Campaign B", color: "#A2C2E8" },
  { key: "Vinegar", label: "Campaign C", color: "#A8C3A0" },
  { key: "MSG", label: "Campaign D", color: "#FFD175" },
  { key: "Blendy", label: "Campaign E", color: "#C7B1E6" },
];
const CAMPAIGN_COLOR = Object.fromEntries(CAMPAIGNS.map(c => [c.key, c.color]));
const CAMPAIGN_LABELS = Object.fromEntries(CAMPAIGNS.map(c => [c.key, c.label]));

const normalizeCampaignKey = (sheetName) => {
  if (!sheetName) return "";
  const name = sheetName.toString().toLowerCase().trim();
  if (name.includes("mayo") || name === "am" || name.includes("campaign a") || name.includes("campaign_a")) return "AM";
  if (name.includes("xốt") || name === "ax" || name.includes("campaign b") || name.includes("campaign_b")) return "AX";
  if (name.includes("giấm") || name.includes("vinegar") || name === "giấm_fy25" || name.includes("campaign c") || name.includes("campaign_c")) return "Vinegar";
  if (name.includes("msg") || name.includes("bột ngọt") || name.includes("mì chính") || name.includes("campaign d") || name.includes("campaign_d")) return "MSG";
  if (name.includes("blendy") || name.includes("campaign e") || name.includes("campaign_e")) return "Blendy";
  return sheetName;
};

const resolveCampaignKey = (row) => {
  if (!row) return "";
  if (row.campaign) return normalizeCampaignKey(row.campaign);
  if (row.__sheet__) return normalizeCampaignKey(row.__sheet__);
  return "";
};

const STATUS_STAGES = [
  { key: "waiting_food",   label: "Chờ duyệt món ăn",   color: "#E28B65", soft: "#FAF0EB" },
  { key: "waiting_script", label: "Chờ duyệt script",   color: "#B284A3", soft: "#FAF0F6" },
  { key: "doing_demo",     label: "Đang làm demo",       color: "#5E9BE2", soft: "#EBF3FC" },
  { key: "waiting_demo",   label: "Chờ duyệt demo",      color: "#E28B65", soft: "#FAF0EB" },
  { key: "revised_demo",   label: "Demo đã chỉnh sửa",   color: "#B284A3", soft: "#FAF0F6" },
  { key: "confirmed_demo", label: "Demo đã duyệt",       color: "#47B39C", soft: "#EBF8F5" },
  { key: "aired",          label: "Đã lên sóng",         color: "#8A7BFF", soft: "#F4F2FF" },
];
const STATUS_MAP = Object.fromEntries(STATUS_STAGES.map(s => [s.key, s]));
// reverse: label → key  (also accept key directly)
const STATUS_LABEL_TO_KEY = Object.fromEntries([
  ...STATUS_STAGES.map(s => [s.label.toLowerCase(), s.key]),
  ...STATUS_STAGES.map(s => [s.key.toLowerCase(), s.key]),
  // common aliases for aired (đã lên sóng)
  ["aired", "aired"],
  ["đã lên sóng", "aired"],
  ["da len song", "aired"],
  ["lên sóng", "aired"],
  ["len song", "aired"],
  ["air", "aired"],
  ["đã đăng", "aired"],
  ["da dang", "aired"],
  ["đã air", "aired"],
  ["da air", "aired"],
  ["done", "aired"],
  ["hoàn thành", "aired"],
  ["hoan thanh", "aired"],
  // common aliases for waiting_script (chờ duyệt script)
  ["chờ duyệt script", "waiting_script"],
  ["cho duyet script", "waiting_script"],
  ["waiting script", "waiting_script"],
  ["script", "waiting_script"],
  ["duyệt script", "waiting_script"],
  ["duyet script", "waiting_script"],
  // common aliases for doing_demo (đang làm demo)
  ["đang làm demo", "doing_demo"],
  ["dang lam demo", "doing_demo"],
  ["doing demo", "doing_demo"],
  ["làm demo", "doing_demo"],
  ["lam demo", "doing_demo"],
  ["quay clip", "doing_demo"],
  ["quay video", "doing_demo"],
  ["làm clip", "doing_demo"],
  // common aliases for waiting_demo (chờ duyệt demo)
  ["chờ duyệt demo", "waiting_demo"],
  ["cho duyet demo", "waiting_demo"],
  ["waiting demo", "waiting_demo"],
  ["duyệt demo", "waiting_demo"],
  ["duyet demo", "waiting_demo"],
  ["feedback demo", "waiting_demo"],
  // common aliases for revised_demo (demo đã chỉnh sửa)
  ["demo đã chỉnh sửa", "revised_demo"],
  ["demo da chinh sua", "revised_demo"],
  ["revised demo", "revised_demo"],
  ["sửa demo", "revised_demo"],
  ["sua demo", "revised_demo"],
  // common aliases for confirmed_demo (demo đã duyệt)
  ["demo đã duyệt", "confirmed_demo"],
  ["demo da duyet", "confirmed_demo"],
  ["confirmed demo", "confirmed_demo"],
  ["demo ok", "confirmed_demo"],
  ["duyệt demo ok", "confirmed_demo"],
  // common aliases for waiting_food (chờ duyệt món ăn)
  ["chờ duyệt món ăn", "waiting_food"],
  ["cho duyet mon an", "waiting_food"],
  ["waiting food", "waiting_food"],
  ["món ăn", "waiting_food"],
  ["mon an", "waiting_food"],
  ["duyệt món", "waiting_food"],
  ["duyet mon", "waiting_food"],
]);

// ── Column auto-mapping: raw header (lowercase) → internal field key
// ORDER MATTERS: more specific fields must come before generic ones
const COL_ALIASES = {
  // Skip columns — will never be auto-mapped
  // __sheet__ and __no__ are internal, handled separately in applyMapping
  kol:           ["kol", "tên kol", "ten kol", "name", "influencer", "kol/koc", "koc"],
  follower:      ["follower", "followers", "số follower", "so follower"],
  type:          ["type", "loại", "loai", "tier"],
  location:      ["location", "địa điểm", "dia diem", "khu vực", "khu vuc"],
  group:         ["group", "nhóm", "nhom", "target", "camp."],
  addonFee:      ["addonFee", "addon fee", "add-on fee", "add-on", "deliverable", "deliverables", "addonfee", "addon", "brand reup"],
  cost:          ["cost", "chi phí", "chi phi", "giá", "gia", "ext. cost", "ext cost", "budget"],
  status:        ["status", "trạng thái", "trang thai", "tiến độ", "tien do", "tình trạng", "tinh trang"],
  statusKey:     ["statusKey", "status key", "status_key"],
  monAn:         ["monản", "món ăn", "mon an", "food", "dish", "thực đơn", "thuc don"],
  ngayGuiScript: ["ngay gui script", "ngày gửi script", "script link"],
  ngayGuiDemo:   ["ngay gui demo", "ngày gửi demo", "ngày gửi 1st demo", "ngay gui 1st demo", "demo link"],
  ngayAir:       ["ngay air", "ngày air", "air date", "ngày lên sóng", "date aired", "date air", "est. start date", "est start date"],
  airedLink:     ["airedLink", "aired link", "link aired", "aired tiktok", "link vdo", "link video", "video link", "link_vdo", "vdo link"],
  airedFb:       ["airedFb", "aired fb", "fb/ig", "reup", "social", "facebook", "instagram", "reup link"],
  giftSent:      ["giftSent", "gift", "quà tặng", "qua tang", "gift sent", "gửi sản phẩm"],
  link:          ["link tiktok", "tiktok link", "tiktok url", "profile link", "url", "link", "link"],
  campaign:      ["campaign", "chiến dịch", "chien dich"],
  id:            ["id"],
  estView:       ["estview", "est view", "est. view", "views kpi", "kpi view", "est. views", "est views", "kpi views"],
  estEng:        ["esteng", "est engagement", "est. engagement", "est eng", "est. eng", "estimated engagement"],
  views:         ["views", "view", "video views", "video view", "lượt xem", "luot xem", "view actual", "actual views"],
  likes:         ["likes", "like", "lượt thích", "luot thich", "paid likes"],
  comments:      ["comments", "comment", "bình luận", "binh luan", "paid comments"],
  saves:         ["saves", "save", "lượt lưu", "luot luu"],
  shares:        ["shares", "share", "chia sẻ", "chia se", "paid shares"],
  adSpend:       ["adspend", "ad spend", "chi phí ads", "chi phi ads", "ads spend", "spend"],
  conversions:   ["conversions", "conversion", "chuyển đổi", "chuyen doi", "results", "orders"],
  addToCart:     ["addtocart", "adds to cart", "add to cart", "thêm giỏ hàng", "them gio hang", "adds to cart (shop)"],
  revenue:       ["revenue", "gross revenue", "gross revenue (shop)", "revenue", "gmv", "doanh thu", "sales"],
};

const INTERNAL_FIELDS = Object.keys(COL_ALIASES);

const autoMapColumns = (rawHeaders) => {
  const mapping = {}; // rawHeader → internalField | ""
  rawHeaders.forEach(h => {
    const hl = h.toLowerCase().trim();
    let matched = "";

    // PASS 1 — exact match (highest priority)
    for (const [field, aliases] of Object.entries(COL_ALIASES)) {
      if (aliases.some(a => a.toLowerCase() === hl)) {
        matched = field;
        break;
      }
    }

    // PASS 2 — substring: alias is contained IN header (e.g. "Ngày gửi Script")
    if (!matched) {
      for (const [field, aliases] of Object.entries(COL_ALIASES)) {
        if (aliases.some(a => a.length > 3 && hl.includes(a.toLowerCase()))) {
          matched = field;
          break;
        }
      }
    }

    // PASS 3 — header is contained IN alias (shorter headers like "KOL", "Link")
    if (!matched) {
      for (const [field, aliases] of Object.entries(COL_ALIASES)) {
        if (aliases.some(a => a.length > 2 && a.toLowerCase().includes(hl) && hl.length > 2)) {
          matched = field;
          break;
        }
      }
    }

    mapping[h] = matched;
  });
  return mapping;
};

const TYPES = ["Nano", "Micro", "Mid-tier", "Macro", "Mega"];


const fmtVND = (n) => {
  if (!n && n !== 0) return "—";
  return new Intl.NumberFormat("vi-VN").format(Math.round(Number(n))) + "đ";
};


const emptyKOL = () => ({
  id: "new-" + Date.now(),
  campaign: "AM",
  kol: "",
  link: "",
  follower: "",
  type: "Mid-tier",
  location: "",
  group: "",
  cost: 0,
  addonFee: "",
  statusKey: "waiting_food",
  monAn: "",
  ngayGuiScript: "",
  ngayGuiDemo: "",
  ngayAir: "",
  airedLink: "",
  airedFb: "",
  giftSent: "",
  estView: 0,
  estEng: 0,
  views: 0,
  likes: 0,
  comments: 0,
  saves: 0,
  shares: 0,
  adSpend: 0,
  conversions: 0,
  addToCart: 0,
  revenue: 0,
  updatedAt: new Date().toISOString().slice(0, 10),
});

const SEED_DATA = [
  {"id":"AM-1","campaign":"AM","kol":"Demo KOL A","link":"https://www.tiktok.com","follower":"100K","type":"Micro","location":"Urban","group":"Female without kid","cost":5000000,"addonFee":"- Code ads","statusKey":"waiting_food","monAn":"Salad rau củ","ngayGuiScript":"","ngayGuiDemo":"","ngayAir":"","airedLink":"","airedFb":"","giftSent":""},
  {"id":"AX-2","campaign":"AX","kol":"Demo KOL A","link":"https://www.tiktok.com","follower":"100K","type":"Micro","location":"Urban","group":"Female without kid","cost":8000000,"addonFee":"- Link showcase","statusKey":"doing_demo","monAn":"Mì xào","ngayGuiScript":"","ngayGuiDemo":"","ngayAir":"","airedLink":"","airedFb":"","giftSent":""},
  {"id":"AX-1","campaign":"AX","kol":"Demo KOL B","link":"https://www.tiktok.com","follower":"500K","type":"Mid-tier","location":"Urban","group":"Female without kid","cost":15000000,"addonFee":"- Link showcase","statusKey":"aired","monAn":"Cơm nắm rong biển","ngayGuiScript":"","ngayGuiDemo":"","ngayAir":"15/8","airedLink":"https://www.tiktok.com","airedFb":"","giftSent":""}
];

/* ================================================================
   IMPORT WIZARD MODAL
================================================================ */
const FIELD_LABELS = {
  id: "ID", campaign: "Campaign", kol: "Tên KOL", link: "Link TikTok",
  follower: "Followers", type: "Type", location: "Địa điểm", group: "Nhóm",
  cost: "Chi phí", addonFee: "Add-on", statusKey: "Status Key",
  status: "Status (label)", monAn: "Món ăn", ngayGuiScript: "Ngày gửi Script",
  ngayGuiDemo: "Ngày gửi Demo", ngayAir: "Ngày Air",
  airedLink: "Link Aired", airedFb: "Reup FB/IG", giftSent: "Quà tặng",
  estView: "KPI Views (Dự kiến)",
  estEng: "KPI Engagement",
  views: "Views (Thực tế)",
  likes: "Likes",
  comments: "Comments",
  saves: "Saves",
  shares: "Shares",
  adSpend: "Chi phí Ads (VNĐ)",
  conversions: "Đơn hàng (Conversions)",
  addToCart: "Thêm giỏ hàng (ATC)",
  revenue: "Doanh thu / GMV (VNĐ)",
};

const applyMapping = (rawRows, mapping) => {
  return rawRows.map((row, idx) => {
    const out = emptyKOL();
    const sheetName = row.__sheet__ || "";
    const rowNo    = row.__no__    || (idx + 1);
    if (sheetName) {
      out.campaign = normalizeCampaignKey(sheetName);
      out.id = `${out.campaign}-${rowNo}`;
      out.__sheet__ = sheetName;
    } else {
      out.id = `import-${Date.now()}-${idx}`;
    }

    for (const [rawCol, field] of Object.entries(mapping)) {
      if (!field || rawCol.startsWith("__") || !(rawCol in row)) continue;
      const raw = row[rawCol];
      // Convert Excel serial date numbers to string
      let val = "";
      if (typeof raw === "number" && raw > 40000 && raw < 60000) {
        const date = XLSX.SSF.parse_date_code(raw);
        val = `${date.d}/${date.m}/${date.y}`;
      } else {
        val = raw == null ? "" : String(raw).trim();
      }

      const numericFields = ["cost", "estView", "estEng", "views", "likes", "comments", "saves", "shares", "adSpend", "conversions", "addToCart", "revenue"];
      if (numericFields.includes(field)) {
        out[field] = parseFloat(val.replace(/[^0-9.-]/g, "")) || 0;
      } else if (field === "status") {
        out.statusKey = STATUS_LABEL_TO_KEY[val.toLowerCase().trim()] || "waiting_food";
      } else if (field === "statusKey") {
        out.statusKey = STATUS_LABEL_TO_KEY[val.toLowerCase().trim()] || val || "waiting_food";
      } else {
        out[field] = val;
      }
    }

    // Auto-infer status to "aired" (Đã lên sóng) if they have a post link or air date, but status is empty/waiting_food
    if (!out.statusKey || out.statusKey === "waiting_food") {
      const hasAiredLink = out.airedLink && /^https?:\/\//i.test(out.airedLink);
      const hasAiredDate = out.ngayAir && out.ngayAir.trim() !== "" && out.ngayAir.trim() !== "—";
      if (hasAiredLink || hasAiredDate) {
        out.statusKey = "aired";
      }
    }

    return out;
  });
};

const ImportWizard = ({ rawHeaders, rawRows, sheetInfo, fileName, onConfirm, onClose, campaignLabels }) => {
  const visibleHeaders = rawHeaders.filter(h => !h.startsWith("__"));
  const [mapping, setMapping] = useState(() => autoMapColumns(visibleHeaders));
  const previewRows = rawRows.slice(0, 3);
  const unmapped = visibleHeaders.filter(h => !mapping[h]);
  const preview = applyMapping(previewRows, mapping);
  const totalRows = rawRows.length;

  return (
    <div className="kt-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="kt-modal kt-anim" style={{ maxWidth: 860, borderRadius: 2 }}>
        {/* Header */}
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Import Wizard
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>"{fileName}" · {totalRows} KOLs · {visibleHeaders.length} cột</div>
            {sheetInfo && (
              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                {sheetInfo.map(s => (
                  <span key={s.name} className="kt-badge" style={{ background: CAMPAIGN_COLOR[s.name] ? CAMPAIGN_COLOR[s.name] + "22" : "var(--paper)", color: CAMPAIGN_COLOR[s.name] || "var(--ink-soft)", border: `1px solid ${CAMPAIGN_COLOR[s.name] || "var(--line)"}` }}>
                    {s.name}: {s.count} KOLs
                  </span>
                ))}
              </div>
            )}
          </div>
          <button className="kt-btn kt-btn-ghost" onClick={onClose} style={{ padding: "6px 10px" }}>✕</button>
        </div>

        <div style={{ padding: "18px 22px" }}>
          {/* Column mapping table */}
          <div style={{ marginBottom: 18 }}>
            <div className="kt-label" style={{ marginBottom: 10 }}>Mapping cột — kiểm tra và chỉnh nếu cần</div>
            {unmapped.length > 0 && (
              <div style={{ background: "var(--warn-bg)", border: "1px solid var(--accent-dim)", borderRadius: 2, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "var(--warn)" }}>
                Chưa nhận diện được: <strong>{unmapped.join(", ")}</strong> — chọn field tương ứng bên dưới
              </div>
            )}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px 10px", textAlign: "left", background: "var(--paper)", borderBottom: "2px solid var(--line)", fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase" }}>Cột trong file</th>
                    <th style={{ padding: "8px 10px", textAlign: "left", background: "var(--paper)", borderBottom: "2px solid var(--line)", fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase" }}>Giá trị mẫu</th>
                    <th style={{ padding: "8px 10px", textAlign: "left", background: "var(--paper)", borderBottom: "2px solid var(--line)", fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase" }}>Map sang field</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleHeaders.map(h => {
                    const sample = rawRows.slice(0, 2).map(r => r[h]).filter(Boolean).join(" / ") || "—";
                    const mapped = mapping[h];
                    return (
                      <tr key={h}>
                        <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--line)", fontWeight: 600, color: "var(--ink)" }}>{h}</td>
                        <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--line)", color: "var(--ink-soft)", fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sample}</td>
                        <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--line)" }}>
                          <select className="kt-select" style={{ width: "auto", minWidth: 160 }}
                            value={mapped}
                            onChange={e => setMapping(m => ({ ...m, [h]: e.target.value }))}>
                            <option value="">— bỏ qua —</option>
                            {INTERNAL_FIELDS.map(f => (
                              <option key={f} value={f}>{FIELD_LABELS[f] || f}</option>
                            ))}
                          </select>
                          {mapped && <span style={{ marginLeft: 6, fontSize: 11, color: "var(--green)" }}>✓</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preview rows */}
          <div>
            <div className="kt-label" style={{ marginBottom: 8 }}>Preview {previewRows.length} dòng đầu sau khi map</div>
            <div style={{ overflowX: "auto", background: "var(--paper)", borderRadius: 2, padding: 12 }}>
              {preview.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap", fontSize: 12 }}>
                  <span style={{ fontWeight: 700, minWidth: 60 }}>{r.kol || `Row ${i+1}`}</span>
                  <span style={{ color: CAMPAIGN_COLOR[r.campaign] || "var(--ink-soft)" }}>{campaignLabels[r.campaign] || r.campaign}</span>
                  <span className="kt-mono">{r.follower || "?"}</span>
                  <StatusBadge statusKey={r.statusKey} />
                  <span className="kt-mono" style={{ color: "var(--accent)" }}>{fmtVND(r.cost)}</span>
                  {r.monAn && <span style={{ color: "var(--ink-soft)" }}>{r.monAn.slice(0, 40)}{r.monAn.length > 40 ? "…" : ""}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid var(--line)", display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>Sẽ import <strong>{rawRows.length}</strong> KOLs và thay thế toàn bộ dữ liệu hiện tại</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="kt-btn kt-btn-ghost" onClick={onClose}>Huỷ</button>
            <button className="kt-btn kt-btn-primary"
              onClick={() => onConfirm(applyMapping(rawRows, mapping))}>
              Xác nhận import {rawRows.length} KOLs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   STATUS BADGE
================================================================ */
const StatusBadge = ({ statusKey }) => {
  const s = STATUS_MAP[statusKey] || { label: statusKey, color: "#888", soft: "#eee" };
  return (
    <span className="kt-badge" style={{ background: s.soft, color: s.color }}>
      {s.label}
    </span>
  );
};

/* ================================================================
   CAMPAIGN BADGE
================================================================ */
const CampaignDot = ({ campaign, labels }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    fontSize: 12, fontWeight: 600, color: CAMPAIGN_COLOR[campaign] || "#888"
  }}>
    <span style={{
      width: 8, height: 8, borderRadius: "50%",
      background: CAMPAIGN_COLOR[campaign] || "#888", display: "inline-block"
    }} />
    {(labels && labels[campaign]) || CAMPAIGN_LABELS[campaign] || campaign}
  </span>
);

/* ================================================================
   DETAIL MODAL
================================================================ */
const DetailModal = ({ kol, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState({ ...kol });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const Field = ({ label, field, type = "text", options }) => (
    <div style={{ marginBottom: 14 }}>
      <label className="kt-label">{label}</label>
      {type === "select" ? (
        <select className="kt-select" value={form[field] || ""} onChange={e => set(field, e.target.value)}>
          <option value="">—</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea className="kt-textarea" rows={3} value={form[field] || ""}
          onChange={e => set(field, e.target.value)} style={{ resize: "vertical" }} />
      ) : type === "number" ? (
        <input className="kt-input" type="number" value={form[field] || ""}
          onChange={e => set(field, Number(e.target.value))} />
      ) : (
        <input className="kt-input" type={type} value={form[field] || ""}
          onChange={e => set(field, e.target.value)} />
      )}
    </div>
  );

  return (
    <div className="kt-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="kt-modal kt-anim">
        {/* Header */}
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em" }}>KOL Detail</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)" }}>{form.kol || "New KOL"}</div>
          </div>
          <CampaignDot campaign={form.campaign} />
          <button className="kt-btn kt-btn-ghost" onClick={onClose} style={{ padding: "6px 10px" }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "18px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <div>
            <Field label="Campaign" field="campaign" type="select" options={CAMPAIGNS.map(c => c.key)} />
            <Field label="Tên KOL" field="kol" />
            <Field label="Link TikTok" field="link" />
            <Field label="Followers" field="follower" />
            <Field label="Loại" field="type" type="select" options={["", ...TYPES]} />
            <Field label="Địa điểm" field="location" />
            <Field label="Nhóm" field="group" />
          </div>
          <div>
            <Field label="Chi phí (VNĐ)" field="cost" type="number" />
            <Field label="Add-on / Deliverable" field="addonFee" type="textarea" />
            <Field label="Trạng thái" field="statusKey" type="select"
              options={STATUS_STAGES.map(s => s.key)} />
            <Field label="Món ăn" field="monAn" type="textarea" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Ngày gửi script" field="ngayGuiScript" />
            <Field label="Ngày gửi demo" field="ngayGuiDemo" />
            <Field label="Ngày air" field="ngayAir" />
            <Field label="Link aired (TikTok)" field="airedLink" />
            <Field label="Link reup (FB/IG/YT)" field="airedFb" type="textarea" />
            <Field label="Quà tặng" field="giftSent" />
          </div>

          {/* Performance & Sales Metrics Section */}
          <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--line)", paddingTop: 16, marginTop: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px 0", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
              📊 Hiệu quả & Đo lường (Performance & Sales)
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
              <Field label="KPI Views (Dự kiến)" field="estView" type="number" />
              <Field label="KPI Engagement" field="estEng" type="number" />
              <Field label="Actual Views (Thực tế)" field="views" type="number" />

              <Field label="Lượt Thích (Likes)" field="likes" type="number" />
              <Field label="Bình luận (Comments)" field="comments" type="number" />
              <Field label="Lượt Lưu (Saves)" field="saves" type="number" />

              <Field label="Lượt Chia sẻ (Shares)" field="shares" type="number" />
              <Field label="Chi phí chạy Ads (VNĐ)" field="adSpend" type="number" />
              <Field label="Lượt chuyển đổi (Orders)" field="conversions" type="number" />

              <Field label="Thêm giỏ hàng (ATC)" field="addToCart" type="number" />
              <Field label="Doanh thu / GMV (VNĐ)" field="revenue" type="number" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid var(--line)", display: "flex", gap: 8, justifyContent: "space-between" }}>
          <button className="kt-btn kt-btn-danger" onClick={() => { if (window.confirm("Xoá KOL này?")) { onDelete(kol.id); onClose(); } }}>
            🗑 Xoá
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="kt-btn kt-btn-ghost" onClick={onClose}>Huỷ</button>
            <button className="kt-btn kt-btn-primary" onClick={() => { onSave(form); onClose(); }}>💾 Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   SUMMARY STATS BAR
================================================================ */
const StatsBar = ({ rows, currentStatus = "all", onCardClick }) => {
  const total = rows.reduce((s, r) => s + (Number(r.cost) || 0), 0);
  const aired = rows.filter(r => r.statusKey === "aired").length;
  const inProgress = rows.filter(r => r.statusKey !== "aired").length;

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {[
        { label: "Tổng KOL", value: rows.length, color: "var(--ink)", key: "all" },
        { label: "Đã lên sóng", value: aired, color: "var(--green)", key: "aired" },
        { label: "Đang xử lý", value: inProgress, color: "var(--amber)", key: "in_progress" },
        { label: "Tổng chi phí", value: fmtVND(total), color: "var(--accent)", key: "cost" },
      ].map(({ label, value, color, key }) => {
        const isClickable = key !== "cost";
        const isActive = isClickable && currentStatus === key;
        return (
          <div 
            key={label}
            onClick={() => isClickable && onCardClick && onCardClick(key)}
            className={isClickable ? "kt-stats-card-hover" : ""}
            style={{
              background: "var(--card)", 
              border: `1px solid ${isActive ? "var(--blue)" : "var(--line)"}`,
              borderRadius: 10, 
              padding: "10px 16px", 
              flex: "1 1 160px", 
              minWidth: 160,
              boxSizing: "border-box",
              boxShadow: isActive ? "0 4px 12px rgba(42,104,140,0.08)" : "none",
              position: "relative",
              transform: isActive ? "translateY(-1px)" : "none"
            }}
          >
            <div style={{ 
              fontSize: 11, 
              color: "var(--ink-soft)", 
              fontWeight: 600, 
              textTransform: "uppercase", 
              letterSpacing: "0.04em", 
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <span>{label}</span>
              {isClickable && (
                <span style={{ fontSize: 9, color: isActive ? "var(--blue)" : "var(--ink-soft)", fontWeight: 700 }}>
                  {isActive ? "Đang lọc ●" : "Lọc ↗"}
                </span>
              )}
            </div>
            <div className="kt-display" style={{ fontSize: 20, color, marginTop: 2 }}>{value}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ================================================================
   TABLE VIEW
================================================================ */
const TableView = ({ rows, onOpen, campaignLabels }) => {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      let va, vb;
      if (sortKey === "cost" || sortKey === "adSpend" || sortKey === "revenue" || sortKey === "conversions" || sortKey === "views") {
        va = Number(a[sortKey]) || 0;
        vb = Number(b[sortKey]) || 0;
      } else if (sortKey === "follower") {
        va = parseFollowers(a.follower);
        vb = parseFollowers(b.follower);
      } else {
        va = (a[sortKey] || "").toLowerCase();
        vb = (b[sortKey] || "").toLowerCase();
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortKey, sortDir]);

  const SortTh = ({ label, field, style: thStyle }) => {
    const active = sortKey === field;
    const icon = !active ? "↕" : sortDir === "asc" ? "▲" : "▼";
    return (
      <th
        onClick={() => handleSort(field)}
        title={`Sắp xếp theo ${label}`}
        style={{
          cursor: "pointer",
          userSelect: "none",
          whiteSpace: "nowrap",
          background: active ? "#EEDAD6" : undefined,
          color: active ? "var(--accent)" : undefined,
          ...thStyle,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          {label}
          <span style={{ fontSize: 9, opacity: active ? 1 : 0.4, letterSpacing: 0 }}>{icon}</span>
        </span>
      </th>
    );
  };

  return (
    <div className="kt-scrollbar" style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
      <table className="kt-table kt-table-sticky">
        <thead>
          <tr>
            <SortTh label="ID" field="id" />
            <SortTh label="KOL" field="kol" />
            <SortTh label="Campaign" field="campaign" />
            <SortTh label="Type" field="type" />
            <SortTh label="Followers" field="follower" />
            <SortTh label="Chi phí" field="cost" />
            <SortTh label="Status" field="statusKey" />
            <SortTh label="Ngày air" field="ngayAir" />
            <th>Script</th>
            <th>Demo</th>
            <th>Aired</th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map(r => (
            <tr key={r.id} onClick={() => onOpen(r)} style={{ cursor: "pointer" }}>
              <td><span className="kt-mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>{r.id}</span></td>
              <td title={r.kol} style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <div style={{ fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis" }}>{r.kol}</div>
                {r.link && <a href={r.link} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ fontSize: 11, color: "var(--ink-soft)" }}>TikTok ↗</a>}
              </td>
              <td><CampaignDot campaign={r.campaign} labels={campaignLabels} /></td>
              <td>{r.type && <span className="kt-badge" style={{ background: "var(--paper-bg)", color: "var(--ink-soft)", border: "1px solid var(--line)" }}>{r.type}</span>}</td>
              <td><span className="kt-mono" style={{ fontSize: 12 }}>{r.follower || "—"}</span></td>
              <td><span className="kt-mono" style={{ fontSize: 12, color: "var(--ink)" }}>{fmtVND(r.cost)}</span></td>
              <td><StatusBadge statusKey={r.statusKey} /></td>
              <td title={r.ngayAir} style={{ fontSize: 12, color: "var(--ink-soft)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.ngayAir && r.ngayAir.startsWith("http") ? (
                  <a href={r.ngayAir} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>Link ↗</a>
                ) : (r.ngayAir || "—")}
              </td>
              <td title={r.ngayGuiScript} style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.ngayGuiScript && r.ngayGuiScript.startsWith("http") ? (
                  <a href={r.ngayGuiScript} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>Script ↗</a>
                ) : <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{r.ngayGuiScript || "—"}</span>}
              </td>
              <td title={r.ngayGuiDemo} style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.ngayGuiDemo && r.ngayGuiDemo.startsWith("http") ? (
                  <a href={r.ngayGuiDemo} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>Demo ↗</a>
                ) : <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{r.ngayGuiDemo || "—"}</span>}
              </td>
              <td>{(() => {
                const link = r.airedLink ? r.airedLink.toString().trim() : "";
                if (!link || ["air", "aired", "—", "-"].includes(link.toLowerCase())) return "—";
                const href = /^https?:\/\//i.test(link) ? link : (link.includes(".") && !link.includes(" ") ? "https://" + link : "");
                if (!href) return "—";
                return (
                  <a href={href} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                    <span className="kt-stamp">AIRED</span>
                  </a>
                );
              })()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--ink-soft)" }}>
          Không có KOL nào phù hợp với bộ lọc.
        </div>
      )}
    </div>
  );
};


const KanbanColumn = ({ stage, cards, onOpen, onUpdateStatus, campaignLabels }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const id = e.dataTransfer.getData("text/plain");
    if (id) {
      onUpdateStatus(id, stage.key);
    }
  };

  return (
    <div 
      className="kt-kanban-col"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        background: isOver ? "var(--accent-bg)" : "transparent",
        borderRadius: 12,
        padding: "4px 8px 12px 8px",
        transition: "all 0.2s ease",
        transform: isOver ? "scale(1.01)" : "scale(1)",
        border: isOver ? "1px dashed var(--accent)" : "1px solid transparent",
        minWidth: 260,
        maxWidth: 260,
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}
    >
      {/* Column header */}
      <div style={{
        padding: "10px 12px",
        borderRadius: 10,
        background: stage.soft,
        marginBottom: 10,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: stage.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {stage.label}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: stage.color }}>{cards.length}</div>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", flex: 1, padding: "2px 0" }} className="kt-scrollbar">
        {cards.map(r => (
          <div 
            key={r.id} 
            className="kt-kanban-card kt-anim" 
            onClick={() => onOpen(r)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", r.id);
              e.dataTransfer.effectAllowed = "move";
            }}
            style={{ cursor: "grab" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
               <CampaignDot campaign={r.campaign} labels={campaignLabels} />
              <span className="kt-mono" style={{ fontSize: 10, color: "var(--ink-soft)" }}>{r.id}</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)", marginBottom: 4, lineHeight: 1.3 }}>{r.kol}</div>
            {r.type && <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 4 }}>{r.type} · {r.follower || "?"}</div>}
            {r.monAn && <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 6, paddingTop: 6, borderTop: "1px dashed var(--line)", lineHeight: 1.4, maxHeight: 56, overflow: "hidden" }}>
              🍽 {r.monAn.split("\n")[0]}
            </div>}
            <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="kt-mono" style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>{fmtVND(r.cost)}</span>
              {r.ngayAir && (
                /^https?:\/\//.test(r.ngayAir) ? (
                  <a href={r.ngayAir} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    style={{ fontSize: 10, color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>
                    Link ↗
                  </a>
                ) : (
                  <span style={{ fontSize: 10, color: "var(--ink-soft)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 100 }} title={r.ngayAir}>
                    {r.ngayAir}
                  </span>
                )
              )}
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--ink-soft)", fontSize: 12 }}>—</div>
        )}
      </div>
    </div>
  );
};

const KanbanView = ({ rows, onOpen, onUpdateStatus, campaignLabels }) => (
  <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: 16, alignItems: "stretch", flex: 1, height: "100%" }}
    className="kt-scrollbar">
    {STATUS_STAGES.map(stage => {
      const cards = rows.filter(r => r.statusKey === stage.key);
      return (
        <KanbanColumn 
          key={stage.key}
          stage={stage}
          cards={cards}
          onOpen={onOpen}
          onUpdateStatus={onUpdateStatus}
          campaignLabels={campaignLabels}
        />
      );
    })}
  </div>
);

/* ================================================================
   CALENDAR VIEW
================================================================ */
const CalendarView = ({ rows, onOpen, onUpdateRow, campaignLabels }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 15)); // August 2026 by default
  const [draggedOverDay, setDraggedOverDay] = useState(null); // String identifier of day cell 'YYYY-MM-DD'

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };
  const handleToday = () => {
    setCurrentMonth(new Date(2026, 7, 15));
  };

  // Helper date parsing
  const parseDateStr = (str) => {
    if (!str) return null;
    const s = str.toString().trim();
    if (!s || s.startsWith("http")) return null;
    const match = s.match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?$/);
    if (match) {
      const day = parseInt(match[1], 10);
      const m = parseInt(match[2], 10) - 1;
      const y = match[3] ? (match[3].length === 2 ? 2000 + parseInt(match[3], 10) : parseInt(match[3], 10)) : 2026;
      return { day, month: m, year: y };
    }
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      return { day: d.getDate(), month: d.getMonth(), year: d.getFullYear() };
    }
    return null;
  };

  // Month grid calculations (Monday-start indexing: 0 = Mon, 6 = Sun)
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevTotalDays = new Date(year, month, 0).getDate();

  const cells = [];
  // Padding previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    cells.push({
      day: prevTotalDays - i,
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false
    });
  }
  // Current month
  for (let i = 1; i <= totalDays; i++) {
    cells.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true
    });
  }
  // Padding next month
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({
      day: i,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false
    });
  }

  // Filter KOLs scheduled vs unscheduled
  const scheduledMap = {};
  const unscheduled = [];

  rows.forEach(r => {
    const dt = parseDateStr(r.ngayAir);
    if (dt) {
      const key = `${dt.year}-${dt.month}-${dt.day}`;
      if (!scheduledMap[key]) scheduledMap[key] = [];
      scheduledMap[key].push(r);
    } else {
      unscheduled.push(r);
    }
  });

  const handleDrop = (e, cell) => {
    e.preventDefault();
    setDraggedOverDay(null);
    const id = e.dataTransfer.getData("text/plain");
    if (id) {
      // Format as DD/MM
      const dateStr = `${cell.day}/${cell.month + 1}`;
      onUpdateRow(id, { ngayAir: dateStr });
    }
  };

  const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0, padding: 12 }}>
      {/* Left panel: Calendar Grid */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--card)", borderRadius: 12, border: "1px solid var(--line)", padding: 14 }}>
        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "var(--ink)", width: 140 }}>
              Tháng {month + 1}, {year}
            </h2>
            <button className="kt-btn kt-btn-ghost" onClick={handleToday} style={{ fontSize: 11, padding: "4px 8px" }}>Hôm nay</button>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="kt-btn kt-btn-ghost" onClick={handlePrevMonth} style={{ padding: "4px 10px", fontSize: 13 }}>◀</button>
            <button className="kt-btn kt-btn-ghost" onClick={handleNextMonth} style={{ padding: "4px 10px", fontSize: 13 }}>▶</button>
          </div>
        </div>

        {/* Calendar Week Header */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4, textAlign: "center" }}>
          {weekdays.map(d => (
            <div key={d} style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-soft)", padding: "4px 0", textTransform: "uppercase" }}>{d}</div>
          ))}
        </div>

        {/* Month grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "repeat(6, 1fr)", gap: 6, flex: 1 }}>
          {cells.map((cell, idx) => {
            const cellKey = `${cell.year}-${cell.month}-${cell.day}`;
            const kols = scheduledMap[cellKey] || [];
            const isToday = cell.day === 15 && cell.month === 7 && cell.year === 2026; // Highlight static Today
            const isDragOver = draggedOverDay === cellKey;

            return (
              <div
                key={idx}
                onDragOver={(e) => { e.preventDefault(); if (draggedOverDay !== cellKey) setDraggedOverDay(cellKey); }}
                onDragLeave={() => setDraggedOverDay(null)}
                onDrop={(e) => handleDrop(e, cell)}
                style={{
                  background: isDragOver ? "var(--accent-bg)" : (cell.isCurrentMonth ? "var(--paper)" : "#FAF9F5"),
                  border: isDragOver ? "1px dashed var(--accent)" : `1px solid ${isToday ? "var(--blue)" : "var(--line)"}`,
                  borderRadius: 8,
                  padding: 4,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 50,
                  overflow: "hidden",
                  transition: "all 0.15s ease",
                  transform: isDragOver ? "scale(1.02)" : "none",
                  boxShadow: isToday ? "0 0 0 2px var(--blue-soft)" : "none"
                }}
              >
                {/* Day number */}
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: cell.isCurrentMonth ? (isToday ? "var(--blue)" : "var(--ink)") : "var(--ink-soft)",
                  alignSelf: "flex-end",
                  opacity: cell.isCurrentMonth ? 1 : 0.45,
                  marginBottom: 2
                }}>
                  {cell.day}
                </div>

                {/* KOL Badges in this day */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, overflowY: "auto" }} className="kt-scrollbar">
                  {kols.map(r => (
                    <div
                      key={r.id}
                      onClick={() => onOpen(r)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", r.id);
                      }}
                      style={{
                        background: "var(--card)",
                        borderLeft: `3px solid ${CAMPAIGN_COLOR[r.campaign] || "var(--green)"}`,
                        borderRadius: 4,
                        padding: "2px 4px",
                        fontSize: 9,
                        fontWeight: 600,
                        color: "var(--ink)",
                        cursor: "grab",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                      }}
                      title={`${r.kol} (${campaignLabels[r.campaign] || r.campaign}) - ${r.monAn || "Chưa có món ăn"}`}
                    >
                      {r.kol}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel: Unscheduled KOLs Sidebar */}
      <div style={{ width: 220, display: "flex", flexDirection: "column", background: "var(--card)", borderRadius: 12, border: "1px solid var(--line)", padding: 14 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, margin: "0 0 10px 0", color: "var(--ink)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>📅 Chưa lên lịch</span>
          <span className="kt-badge" style={{ background: "var(--accent-bg)", color: "var(--accent)", fontSize: 10 }}>{unscheduled.length}</span>
        </h3>
        <div style={{ fontSize: 10, color: "var(--ink-soft)", marginBottom: 12, lineHeight: 1.4 }}>
          Kéo thả KOL vào lịch tháng bên cạnh để sắp xếp ngày lên sóng (Air date).
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }} className="kt-scrollbar">
          {unscheduled.map(r => (
            <div
              key={r.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", r.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onClick={() => onOpen(r)}
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                background: "var(--paper)",
                border: "1px solid var(--line)",
                cursor: "grab",
                transition: "all 0.15s ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.01)"
              }}
              className="kt-kanban-card"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <CampaignDot campaign={r.campaign} labels={campaignLabels} />
                <span className="kt-mono" style={{ fontSize: 8, color: "var(--ink-soft)" }}>{r.id}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 11, color: "var(--ink)" }}>{r.kol}</div>
              <div style={{ fontSize: 9, color: "var(--ink-soft)", marginTop: 2 }}>{r.type || "Chưa phân loại"}</div>
            </div>
          ))}
          {unscheduled.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ink-soft)", fontSize: 11 }}>
              🎉 Tất cả KOL đã được lên lịch!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


/* ================================================================
   INSIGHTS & SUMMARY VIEW
================================================================ */
const parseFollowers = (str) => {
  if (!str) return 0;
  const s = str.toString().trim().toLowerCase();
  if (s.endsWith("m")) return parseFloat(s) * 1000000;
  if (s.endsWith("k")) return parseFloat(s) * 1000;
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};




// (Insights components removed)

/* ================================================================
   KOL PROFILE VIEW & DETAIL MODAL
================================================================ */
const COST_BUCKETS = [
  { key: "under10", label: "Dưới 10tr", test: c => c < 10000000 },
  { key: "10to20",  label: "10 – 20tr", test: c => c >= 10000000 && c < 20000000 },
  { key: "20to50",  label: "20 – 50tr", test: c => c >= 20000000 && c < 50000000 },
  { key: "over50",  label: "Trên 50tr", test: c => c >= 50000000 },
];
const VIEWS_BUCKETS = [
  { key: "under10k",  label: "Dưới 10K",     test: v => v < 10000 },
  { key: "10to50k",   label: "10K – 50K",    test: v => v >= 10000 && v < 50000 },
  { key: "50to200k",  label: "50K – 200K",   test: v => v >= 50000 && v < 200000 },
  { key: "over200k",  label: "Trên 200K",    test: v => v >= 200000 },
];

const ProfileView = ({ rows, onOpenProfile, campaignLabels }) => {
  const [search, setSearch] = useState("");
  const [filterCampaign, setFilterCampaign] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterPhase, setFilterPhase] = useState("all");
  const [filterCost, setFilterCost] = useState("all");
  const [filterViews, setFilterViews] = useState("all");

  const uniqueKols = useMemo(() => {
    const map = {};
    rows.forEach(r => {
      if (!r.kol || !r.kol.trim()) return;
      const name = r.kol.trim();
      const key = name.toLowerCase();

      let phase1 = false;
      let phase2 = false;
      const airDate = r.ngayAir ? r.ngayAir.toString().toLowerCase() : "";
      
      if (airDate.includes("july") || airDate.includes("aug") || airDate.includes("/7") || airDate.includes("/07") || airDate.includes("/8") || airDate.includes("/08")) {
        phase1 = true;
      }
      if (airDate.includes("dec") || airDate.includes("jan") || airDate.includes("/12") || airDate.includes("/1") || airDate.includes("/01")) {
        phase2 = true;
      }

      if (!map[key]) {
        map[key] = {
          kol: name,
          follower: r.follower || "",
          type: r.type || "",
          location: r.location || "",
          group: r.group || "",
          link: r.link || "",
          campaigns: new Set(),
          totalCost: 0,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          totalSaves: 0,
          totalShares: 0,
          totalConversions: 0,
          totalRevenue: 0,
          phases: new Set(),
          campaignDetails: []
        };
      }

      const entry = map[key];
      const campaignKey = resolveCampaignKey(r);
      if (campaignKey) {
        entry.campaigns.add(campaignKey);
      }
      entry.totalCost += Number(r.cost) || 0;
      entry.totalViews += Number(r.views) || 0;
      entry.totalLikes += Number(r.likes) || 0;
      entry.totalComments += Number(r.comments) || 0;
      entry.totalSaves += Number(r.saves) || 0;
      entry.totalShares += Number(r.shares) || 0;
      entry.totalConversions += Number(r.conversions) || 0;
      entry.totalRevenue += Number(r.revenue) || 0;

      if (phase1) entry.phases.add("Phase 1");
      if (phase2) entry.phases.add("Phase 2");

      entry.campaignDetails.push(r);

      if (!entry.follower && r.follower) entry.follower = r.follower;
      if (!entry.type && r.type) entry.type = r.type;
      if (!entry.location && r.location) entry.location = r.location;
      if (!entry.group && r.group) entry.group = r.group;
      if (!entry.link && r.link) entry.link = r.link;
    });

    return Object.values(map).sort((a, b) => a.kol.localeCompare(b.kol, "vi"));
  }, [rows]);

  const uniqueLocations = useMemo(() => {
    const set = new Set();
    uniqueKols.forEach(k => { if (k.location && k.location.trim()) set.add(k.location.trim()); });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "vi"));
  }, [uniqueKols]);

  const filteredKols = useMemo(() => {
    const q = search.trim().toLowerCase();
    return uniqueKols.filter(k => {
      if (q && !k.kol.toLowerCase().includes(q)) return false;
      if (filterCampaign !== "all" && !k.campaigns.has(filterCampaign)) return false;
      if (filterTier !== "all" && k.type !== filterTier) return false;
      if (filterLocation !== "all" && k.location !== filterLocation) return false;
      if (filterPhase !== "all" && !k.phases.has(filterPhase)) return false;
      if (filterCost !== "all") {
        const bucket = COST_BUCKETS.find(b => b.key === filterCost);
        if (bucket && !bucket.test(k.totalCost)) return false;
      }
      if (filterViews !== "all") {
        const bucket = VIEWS_BUCKETS.find(b => b.key === filterViews);
        if (bucket && !bucket.test(k.totalViews)) return false;
      }
      return true;
    });
  }, [uniqueKols, search, filterCampaign, filterTier, filterLocation, filterPhase, filterCost, filterViews]);

  const hasActiveFilters = !!search.trim() || filterCampaign !== "all" || filterTier !== "all" ||
    filterLocation !== "all" || filterPhase !== "all" || filterCost !== "all" || filterViews !== "all";

  const clearFilters = () => {
    setSearch(""); setFilterCampaign("all"); setFilterTier("all");
    setFilterLocation("all"); setFilterPhase("all"); setFilterCost("all"); setFilterViews("all");
  };

  const summary = useMemo(() => ({
    count: filteredKols.length,
    totalCost: filteredKols.reduce((s, k) => s + k.totalCost, 0),
    totalViews: filteredKols.reduce((s, k) => s + k.totalViews, 0),
    totalConversions: filteredKols.reduce((s, k) => s + k.totalConversions, 0),
  }), [filteredKols]);

  return (
    <div className="kt-scrollbar" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      {/* ── Dashboard summary (reacts live to filters below) ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        {[
          { label: "Hồ sơ KOL", value: summary.count, color: "var(--ink)" },
          { label: "Tổng chi phí", value: fmtVND(summary.totalCost), color: "var(--accent)" },
          { label: "Tổng Views", value: summary.totalViews.toLocaleString(), color: "var(--blue)" },
          { label: "Tổng đơn hàng", value: summary.totalConversions.toLocaleString(), color: "var(--ok)" },
        ].map(s => (
          <div key={s.label} className="kt-card" style={{ padding: "10px 16px", flex: "1 1 160px", minWidth: 160, boxSizing: "border-box" }}>
            <div style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
              {s.label}
            </div>
            <div className="kt-display" style={{ fontSize: 20, color: s.color, marginTop: 2 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Filter bar: mỗi field lọc theo đúng 1 chiều dữ liệu, không chồng chéo với ô tìm tên ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="kt-input"
          placeholder="🔍 Tìm tên KOL..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <select className="kt-select" value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)} style={{ width: 160 }}>
          <option value="all">📁 Tất cả Dự án</option>
          {CAMPAIGNS.map(c => <option key={c.key} value={c.key}>{campaignLabels[c.key] || c.label}</option>)}
        </select>
        <select className="kt-select" value={filterTier} onChange={e => setFilterTier(e.target.value)} style={{ width: 140 }}>
          <option value="all">👥 Tất cả Tier</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="kt-select" value={filterLocation} onChange={e => setFilterLocation(e.target.value)} style={{ width: 150 }}>
          <option value="all">📍 Tất cả Địa điểm</option>
          {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="kt-select" value={filterPhase} onChange={e => setFilterPhase(e.target.value)} style={{ width: 170 }}>
          <option value="all">🗓 Tất cả Thời điểm</option>
          <option value="Phase 1">Phase 1 (T7–T8)</option>
          <option value="Phase 2">Phase 2 (T12–T1)</option>
        </select>
        <select className="kt-select" value={filterCost} onChange={e => setFilterCost(e.target.value)} style={{ width: 150 }}>
          <option value="all">💰 Tất cả Chi phí</option>
          {COST_BUCKETS.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
        </select>
        <select className="kt-select" value={filterViews} onChange={e => setFilterViews(e.target.value)} style={{ width: 150 }}>
          <option value="all">👁 Tất cả Views</option>
          {VIEWS_BUCKETS.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
        </select>
        {hasActiveFilters && (
          <button className="kt-btn kt-btn-ghost" onClick={clearFilters} style={{ padding: "8px 14px" }}>
            ✕ Xoá lọc
          </button>
        )}
        <span style={{ fontSize: 13, color: "var(--ink-soft)", marginLeft: "auto" }}>
          Đang hiển thị: <strong>{filteredKols.length}</strong> / {uniqueKols.length} hồ sơ KOL
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 16 }}>
        {filteredKols.map(k => {
          const campaignsArr = Array.from(k.campaigns);
          const phasesArr = Array.from(k.phases);
          return (
            <div key={k.kol} className="kt-card kt-anim" style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12, border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", margin: 0 }}>{k.kol}</h3>
                  {k.link && (
                    <a href={k.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none" }}>
                      TikTok Profile ↗
                    </a>
                  )}
                </div>
                {k.type && (
                  <span className="kt-badge" style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-dim)" }}>
                    {k.type}
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", fontSize: 12, color: "var(--ink-soft)" }}>
                <div>👥 Followers: <strong style={{ color: "var(--ink)" }}>{k.follower || "—"}</strong></div>
                <div>📍 Địa điểm: <strong style={{ color: "var(--ink)" }}>{k.location || "—"}</strong></div>
                <div>🏷 Nhóm: <strong style={{ color: "var(--ink)" }}>{k.group || "—"}</strong></div>
                <div>📁 Dự án hợp tác: <strong style={{ color: "var(--ink)" }}>{campaignsArr.length} dự án</strong></div>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", fontSize: 11 }}>
                <span style={{ fontWeight: 600 }}>Thời điểm hợp tác:</span>
                {phasesArr.length > 0 ? (
                  phasesArr.map(p => (
                    <span key={p} className="kt-badge" style={{ background: p === "Phase 1" ? "#FFAFA322" : "#A2C2E822", color: p === "Phase 1" ? "#D4826A" : "#4F83E1", border: `1px solid ${p === "Phase 1" ? "#FFAFA355" : "#4F83E155"}`, fontSize: 10 }}>
                      {p === "Phase 1" ? "Phase 1 (T7-T8)" : "Phase 2 (T12-T1)"}
                    </span>
                  ))
                ) : (
                  <span style={{ color: "var(--ink-soft)" }}>Chưa rõ Phase</span>
                )}
              </div>

              {campaignsArr.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, borderTop: "1px dashed var(--line)", paddingTop: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 11, color: "var(--ink-soft)" }}>
                    Dự án: {campaignsArr.map(c => campaignLabels[c] || CAMPAIGN_LABELS[c] || c).join(" · ")}
                  </span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {campaignsArr.map(c => (
                      <CampaignDot key={c} campaign={c} labels={campaignLabels} />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, borderTop: "1px dashed var(--line)", paddingTop: 10, fontSize: 11, textAlign: "center" }}>
                <div>
                  <div style={{ color: "var(--ink-soft)" }}>Chi phí</div>
                  <strong style={{ color: "var(--accent)" }}>{fmtVND(k.totalCost)}</strong>
                </div>
                <div>
                  <div style={{ color: "var(--ink-soft)" }}>Views</div>
                  <strong style={{ color: "var(--ink)" }}>{k.totalViews ? k.totalViews.toLocaleString() : "—"}</strong>
                </div>
                <div>
                  <div style={{ color: "var(--ink-soft)" }}>Đơn hàng</div>
                  <strong style={{ color: "var(--ok)" }}>{k.totalConversions ? k.totalConversions.toLocaleString() : "—"}</strong>
                </div>
              </div>

              <button 
                className="kt-btn kt-btn-ghost" 
                onClick={() => onOpenProfile(k)} 
                style={{ width: "100%", justifyContent: "center", padding: "6px", marginTop: 4 }}
              >
                🔎 Xem chiến dịch chi tiết
              </button>
            </div>
          );
        })}
        {filteredKols.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 0", color: "var(--ink-soft)" }}>
            Không tìm thấy hồ sơ KOL nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileDetailModal = ({ kol, onClose, campaignLabels, onSaveProfile }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    kol: kol.kol || "", follower: kol.follower || "", type: kol.type || "",
    location: kol.location || "", group: kol.group || "", link: kol.link || "",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSaveClick = () => {
    if (!form.kol.trim()) {
      window.alert("Tên KOL không được để trống.");
      return;
    }
    onSaveProfile(kol.kol, {
      kol: form.kol.trim(), follower: form.follower.trim(), type: form.type,
      location: form.location.trim(), group: form.group.trim(), link: form.link.trim(),
    });
    onClose();
  };

  return (
    <div className="kt-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="kt-modal kt-anim" style={{ maxWidth: 860, borderRadius: 2 }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {editing ? "CHỈNH SỬA HỒ SƠ KOL" : "HỒ SƠ CHI TIẾT KOL"}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)" }}>{editing ? form.kol || "—" : kol.kol}</div>
          </div>
          {!editing && (
            <button className="kt-btn kt-btn-ghost" onClick={() => setEditing(true)} style={{ padding: "6px 14px" }}>
              ✏️ Chỉnh sửa hồ sơ
            </button>
          )}
          <button className="kt-btn kt-btn-ghost" onClick={onClose} style={{ padding: "6px 10px" }}>✕</button>
        </div>

        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
          {editing ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0 16px", background: "var(--paper)", padding: "16px 16px 2px", borderRadius: 10 }}>
              <div style={{ marginBottom: 14 }}>
                <label className="kt-label">Tên KOL</label>
                <input className="kt-input" value={form.kol} onChange={e => set("kol", e.target.value)} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="kt-label">Followers</label>
                <input className="kt-input" value={form.follower} onChange={e => set("follower", e.target.value)} placeholder="VD: 100K" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="kt-label">Phân hạng Tier</label>
                <select className="kt-select" value={form.type} onChange={e => set("type", e.target.value)}>
                  <option value="">—</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="kt-label">Khu vực</label>
                <input className="kt-input" value={form.location} onChange={e => set("location", e.target.value)} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="kt-label">Nhóm</label>
                <input className="kt-input" value={form.group} onChange={e => set("group", e.target.value)} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="kt-label">Link TikTok</label>
                <input className="kt-input" value={form.link} onChange={e => set("link", e.target.value)} />
              </div>
              <div style={{ gridColumn: "1 / -1", fontSize: 11, color: "var(--ink-soft)", marginTop: -8, marginBottom: 14 }}>
                ⚠️ Thay đổi sẽ áp dụng cho tất cả {kol.campaignDetails.length} dòng chiến dịch của KOL này.
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, background: "var(--paper)", padding: "12px 16px", borderRadius: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 2 }}>Followers</div>
                <strong style={{ fontSize: 14, color: "var(--ink)" }}>{kol.follower || "—"}</strong>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 2 }}>Phân hạng Tier</div>
                <strong style={{ fontSize: 14, color: "var(--ink)" }}>{kol.type || "—"}</strong>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 2 }}>Khu vực</div>
                <strong style={{ fontSize: 14, color: "var(--ink)" }}>{kol.location || "—"}</strong>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 2 }}>TikTok Profile</div>
                {kol.link ? (
                  <a href={kol.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                    TikTok Link ↗
                  </a>
                ) : (
                  <strong style={{ fontSize: 13, color: "var(--ink-soft)" }}>—</strong>
                )}
              </div>
            </div>
          )}


          <div>
            <div className="kt-label" style={{ marginBottom: 8, fontSize: 12 }}>Lịch sử Chiến dịch & Hiệu suất chi tiết</div>
            <div style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: 10 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase" }}>Chiến dịch</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase" }}>Món ăn</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase" }}>Ngân sách</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase" }}>Trạng thái</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase" }}>Views thực tế</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase" }}>Đơn hàng</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase" }}>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {kol.campaignDetails.map((c, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>
                        <CampaignDot campaign={c.campaign} labels={campaignLabels} />
                      </td>
                      <td style={{ padding: "10px 12px", color: "var(--ink-soft)" }}>{c.monAn || "—"}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--accent)" }}>{fmtVND(c.cost)}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <StatusBadge statusKey={c.statusKey} />
                      </td>
                      <td style={{ padding: "10px 12px" }}>{c.views ? c.views.toLocaleString() : "—"}</td>
                      <td style={{ padding: "10px 12px" }}>{c.conversions ? c.conversions.toLocaleString() : "—"}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--ok)" }}>{fmtVND(c.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          {editing ? (
            <>
              <button className="kt-btn kt-btn-ghost" onClick={() => setEditing(false)}>Huỷ</button>
              <button className="kt-btn kt-btn-primary" onClick={handleSaveClick}>💾 Lưu hồ sơ</button>
            </>
          ) : (
            <button className="kt-btn kt-btn-ghost" onClick={onClose}>Đóng hồ sơ</button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   MAIN APP
================================================================ */
const LS_KEY = "kol_tracking_v5";

export default function App() {
  const [data, rawSetData] = useState(() => {
    try {
      const s = localStorage.getItem(LS_KEY);
      const parsed = s ? JSON.parse(s) : SEED_DATA;
      // One-time cleanup: strip auto-generated fake performance data
      // Detect: revenue === conversions * 165000 AND addToCart === conversions * 5
      const cleaned = parsed.map(r => {
        const conv = Number(r.conversions) || 0;
        const rev = Number(r.revenue) || 0;
        const atc = Number(r.addToCart) || 0;
        const isFakeRevenue = conv > 0 && rev === conv * 165000;
        const isFakeATC = conv > 0 && atc === conv * 5;
        if (isFakeRevenue && isFakeATC) {
          return {
            ...r,
            adSpend: 0, conversions: 0, addToCart: 0, revenue: 0,
            views: 0, likes: 0, comments: 0, saves: 0, shares: 0,
            estView: r.estView || 0, estEng: r.estEng || 0,
          };
        }
        return r;
      });
      return cleaned;
    } catch {
      return SEED_DATA;
    }
  });
    const [campaignLabels, setCampaignLabels] = useState(() => {
    try {
      const s = localStorage.getItem("kol_campaign_labels");
      if (s) return JSON.parse(s);
    } catch {}
    return {
      AM: "Campaign A",
      AX: "Campaign B",
      Vinegar: "Campaign C",
      MSG: "Campaign D",
      Blendy: "Campaign E"
    };
  });

const [view, setView] = useState("table");
  const [selectedProfile, setSelectedProfile] = useState(null); // "table" | "kanban"
  const [search, setSearch] = useState("");
  const [filterCampaign, setFilterCampaign] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState(null); // { msg, ok }
  const importRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [data]);






  const [wizardData, setWizardData] = useState(null); // { rawHeaders, rawRows, fileName }

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  const setData = useCallback((nextVal) => {
    rawSetData(prev => {
      const resolved = typeof nextVal === 'function' ? nextVal(prev) : nextVal;
      if (JSON.stringify(prev) !== JSON.stringify(resolved)) {
        setHistory(h => [...h, prev].slice(-50));
        setRedoHistory([]);
      }
      return resolved;
    });
  }, []);

  const handleUndo = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) {
        showToast("⚠️ Không có hành động nào trước đó để Undo!");
        return h;
      }
      const prev = h[h.length - 1];
      rawSetData(current => {
        setRedoHistory(r => [...r, current]);
        return prev;
      });
      showToast("↩️ Đã Hoàn tác (Undo)");
      return h.slice(0, -1);
    });
  }, []);

  const handleRedo = useCallback(() => {
    setRedoHistory(r => {
      if (r.length === 0) {
        showToast("⚠️ Không có hành động nào để Redo!");
        return r;
      }
      const next = r[r.length - 1];
      rawSetData(current => {
        setHistory(h => [...h, current]);
        return next;
      });
      showToast("↪️ Đã Làm lại (Redo)");
      return r.slice(0, -1);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable;
      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Parse Excel or JSON → open wizard
  const handleImport = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isExcel = /\.(xlsx|xls)$/i.test(file.name);
    const isCsv = /\.csv$/i.test(file.name);
    const isJson = /\.json$/i.test(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        let rawHeaders = [];
        let rawRows = [];

        if (isExcel || isCsv) {
          const readData = ev.target.result;
          const wb = isCsv
            ? XLSX.read(readData, { type: "string" })
            : XLSX.read(readData, { type: "array" });

          // Helper to identify KOL name column values robustly (KOL, KOC, Creator, Tên Kênh, Account, etc)
          const isKolHeaderValue = (val) => {
            if (val == null) return false;
            const kl = val.toString().toLowerCase().trim();
            const kolAliases = [
              "kol", "tên kol", "ten kol", "name", "influencer", "kol/koc", "koc", "creator", "kol name",
              "account", "tài khoản", "tai khoan", "channel", "user", "username", "kênh", "kenh", "tên kênh", "ten kenh"
            ];
            
            // Pass 1: Exact alias match
            if (kolAliases.includes(kl)) return true;

            // Pass 2: Primary contains match
            if (kl.includes("kol") || kl.includes("koc") || kl.includes("influencer") || kl.includes("creator") || kl.includes("account") || kl.includes("username")) return true;

            // Pass 3: Secondary contains match (excluding non-kol columns like món ăn, chi phí)
            const isExclude = kl.includes("món") || kl.includes("food") || kl.includes("nhóm") || kl.includes("chi phí") || kl.includes("link") || kl.includes("giá") || kl.includes("cost") || kl.includes("tiến độ");
            if ((kl.includes("tên") || kl.includes("ten") || kl.includes("name") || kl.includes("kênh") || kl.includes("kenh")) && !isExclude) return true;

            return false;
          };

          // Read ALL sheets and combine dynamically
          const allSheets = wb.SheetNames
            .map(shName => {
              const ws = wb.Sheets[shName];
              
              // 1. Convert to 2D array to search for the header row index (up to first 25 rows)
              const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
              
              let headerIdx = 0;
              for (let r = 0; r < Math.min(aoa.length, 25); r++) {
                const row = aoa[r];
                if (Array.isArray(row)) {
                  const hasKolColumn = row.some(isKolHeaderValue);
                  if (hasKolColumn) {
                    headerIdx = r;
                    break;
                  }
                }
              }

              // 2. Parse sheet JSON starting from the detected header row
              const json = XLSX.utils.sheet_to_json(ws, { range: headerIdx, defval: "" });
              
              // 3. Skip rows where KOL name column is empty
              const real = json.filter(r => {
                const keys = Object.keys(r);
                const matchedKey = keys.find(isKolHeaderValue);
                const val = matchedKey ? r[matchedKey] : null;
                return val && String(val).trim();
              });

              return { name: shName, rows: real };
            })
            .filter(s => s.rows.length > 0);

          if (!allSheets.length) {
            const sheetsInfo = wb.SheetNames.slice(0, 3).map(name => {
              const ws = wb.Sheets[name];
              const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
              // Grab the first non-empty row to see what headers or title text exists
              const firstNonEmpty = aoa.find(row => Array.isArray(row) && row.some(cell => cell != null && cell.toString().trim() !== "")) || [];
              const rowStr = firstNonEmpty.length ? firstNonEmpty.slice(0, 5).map(c => String(c).trim()).join(", ") : "empty";
              return `[${name}: ${rowStr.substring(0, 80)}]`;
            }).join(" ");
            throw new Error("Không tìm thấy cột KOL. Chi tiết file: " + sheetsInfo);
          }

          // Stamp each row with sheet name + row index
          const combined = [];
          allSheets.forEach(sh => {
            sh.rows.forEach((row, i) => {
              combined.push({ ...row, __sheet__: sh.name, __no__: row["No."] || (i + 1) });
            });
          });

          // Union of all headers (excluding internals), deduplicated
          const headerSet = new Set();
          combined.forEach(r => Object.keys(r).forEach(k => {
            if (!k.startsWith("__") && k !== "No.") headerSet.add(k);
          }));
          rawHeaders = [...headerSet];
          rawRows = combined;

          const sheetInfo = allSheets.map(s => ({ name: s.name, count: s.rows.length }));
          setWizardData({ rawHeaders, rawRows, fileName: file.name, sheetInfo });

        } else if (isJson) {
          const parsed = JSON.parse(ev.target.result);
          const rows = Array.isArray(parsed) ? parsed : [parsed];
          rawRows = rows;
          const headerSet = new Set();
          rows.forEach(r => Object.keys(r).forEach(k => {
            if (!k.startsWith("__") && k !== "No.") headerSet.add(k);
          }));
          rawHeaders = [...headerSet];
          setWizardData({ rawHeaders, rawRows, fileName: file.name, sheetInfo: [{ name: "JSON", count: rows.length }] });
        } else {
          throw new Error("Chỉ hỗ trợ file .xlsx, .xls, .csv hoặc .json");
        }
      } catch (err) {
        console.error(err);
        showToast("❌ Lỗi: " + err.message, false);
      } finally {
        e.target.value = "";
      }
    };

    if (isCsv) {
      reader.readAsText(file, "UTF-8");
    } else if (isJson) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const handleDownloadTemplate = () => {
    const headers = [
      "id", "campaign", "kol", "link", "follower", "type", "location", "group",
      "cost", "addonFee", "statusKey", "mon an", "ngay gui script",
      "ngay gui demo", "ngay air", "airedLink", "airedFb", "giftSent"
    ];
    const example = [
      "AM-1", "AM", "Tên KOL", "https://tiktok.com/@...", "100K", "Micro",
      "Urban", "Female without kid", "10000000", "- Code ads",
      "waiting_script", "Salad cá ngừ", "", "", "ASAP", "", "", ""
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "KOL Tracker");
    XLSX.writeFile(wb, "kol_tracker_template.xlsx");
  };

  // Export/backup the current live data (everything shown on screen right now)
  // as a downloadable .xlsx file. Purely additive — does not touch localStorage,
  // does not alter any existing data or feature.
  const handleExportData = () => {
    const fieldKeys = Object.keys(FIELD_LABELS).filter(k => k !== "status");
    const headers = fieldKeys.map(k => FIELD_LABELS[k] || k);
    const rows = data.map(row => fieldKeys.map(k => row[k] ?? ""));
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "KOL Tracker");

    // Second sheet: campaign label mapping, so the backup is fully self-contained
    const labelRows = Object.entries(campaignLabels || {});
    if (labelRows.length) {
      const wsLabels = XLSX.utils.aoa_to_sheet([["campaign_key", "campaign_label"], ...labelRows]);
      XLSX.utils.book_append_sheet(wb, wsLabels, "Campaign Labels");
    }

    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
    XLSX.writeFile(wb, `kol_tracker_backup_${stamp}.xlsx`);
  };

  const statsRows = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(r => {
      if (filterCampaign !== "all" && r.campaign !== filterCampaign) return false;
      if (filterType !== "all" && r.type !== filterType) return false;
      if (q && !r.kol.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q) && !(r.monAn || "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, filterCampaign, filterType, search]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(r => {
      if (filterCampaign !== "all" && r.campaign !== filterCampaign) return false;
      if (filterStatus !== "all") {
        if (filterStatus === "in_progress") {
          if (r.statusKey === "aired") return false;
        } else {
          if (r.statusKey !== filterStatus) return false;
        }
      }
      if (filterType !== "all" && r.type !== filterType) return false;
      if (q && !r.kol.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q) && !(r.monAn || "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [data, filterCampaign, filterStatus, filterType, search]);

  const handleSave = (updated) => {
    setData(d => d.map(r => r.id === updated.id ? updated : r));
  };
  const handleDelete = (id) => {
    setData(d => d.filter(r => r.id !== id));
  };
  const handleAdd = (newRow) => {
    setData(d => [...d, newRow]);
  };
  // Editing a KOL "profile" (Hồ sơ KOL) means editing shared fields — name, follower,
  // tier, location, group, TikTok link — that are duplicated across every campaign
  // row for that KOL. We match rows by the original (pre-edit) name and apply the
  // new values to all of them, so table/kanban/profile views all stay consistent.
  const handleUpdateProfile = (originalName, updates) => {
    const key = (originalName || "").trim().toLowerCase();
    setData(d => d.map(r => {
      if ((r.kol || "").trim().toLowerCase() !== key) return r;
      return { ...r, ...updates };
    }));
    showToast("✅ Đã cập nhật hồ sơ KOL");
  };
  const handleReset = () => {
    const clearAll = window.confirm(
      "Bạn muốn thực hiện thao tác nào?\n\n" +
      "- Bấm 'OK' để XÓA SẠCH toàn bộ dữ liệu hiện tại (về 0 KOLs).\n" +
      "- Bấm 'Cancel' để KHÔI PHỤC lại 66 dòng dữ liệu mẫu ban đầu."
    );
    if (clearAll) {
      setData([]);
      const defLabels = { AM: "Campaign A", AX: "Campaign B", Vinegar: "Campaign C", MSG: "Campaign D", Blendy: "Campaign E" };
      setCampaignLabels(defLabels);
      localStorage.setItem("kol_campaign_labels", JSON.stringify(defLabels));
    } else {
      if (window.confirm("Bạn có chắc chắn muốn khôi phục lại 66 dòng dữ liệu mẫu ban đầu? Mọi chỉnh sửa hiện tại sẽ bị mất.")) {
        setData(SEED_DATA);
        const defLabels = { AM: "Campaign A", AX: "Campaign B", Vinegar: "Campaign C", MSG: "Campaign D", Blendy: "Campaign E" };
        setCampaignLabels(defLabels);
        localStorage.setItem("kol_campaign_labels", JSON.stringify(defLabels));
      }
    }
  };

  return (
    <div className="kt-root">
      <GlobalStyle />

      {/* ── HEADER ── */}
      <div style={{
        background: "var(--card)",
        borderBottom: "1px solid var(--line)",
        padding: "16px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        flexShrink: 0,
        zIndex: 10,
        boxShadow: "0 4px 20px rgba(72, 67, 92, 0.015)"
      }}>
        {/* Top Row: Brand Title + View Toggles + Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          {/* Group 1: Logo/Brand & View Toggles (Left aligned together) */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            {/* Logo & Brand Name */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, var(--accent) 0%, #6858E0 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(138, 123, 255, 0.2)",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h1 style={{ 
                fontSize: 22, 
                color: "var(--ink)", 
                margin: 0, 
                fontWeight: 800, 
                letterSpacing: "-0.03em",
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}>
                KOL <span style={{ color: "var(--accent)" }}>Tracking</span>
              </h1>
            </div>
            
            {/* View Toggle (Bảng, Kanban, Lịch) */}
            <div style={{ display: "flex", gap: 4, background: "var(--paper)", padding: 4, borderRadius: 24 }}>
              <button className={`kt-btn ${view === "table" ? "kt-btn-primary" : "kt-btn-ghost"}`}
                style={{ padding: "6px 16px", fontSize: 12, borderRadius: 20 }}
                onClick={() => setView("table")}>Bảng</button>
              <button className={`kt-btn ${view === "kanban" ? "kt-btn-primary" : "kt-btn-ghost"}`}
                style={{ padding: "6px 16px", fontSize: 12, borderRadius: 20 }}
                onClick={() => setView("kanban")}>Kanban</button>
              <button className={`kt-btn ${view === "calendar" ? "kt-btn-primary" : "kt-btn-ghost"}`}
                style={{ padding: "6px 16px", fontSize: 12, borderRadius: 20 }}
                onClick={() => setView("calendar")}>Lịch</button>
              <button className={`kt-btn ${view === "profile" ? "kt-btn-primary" : "kt-btn-ghost"}`}
                style={{ padding: "6px 16px", fontSize: 12, borderRadius: 20 }}
                onClick={() => setView("profile")}>Hồ sơ KOL</button>
            </div>
          </div>

          {/* Quick Actions (Add, Import, Undo/Redo) */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {/* Template / Import hidden file loader */}
            <input ref={importRef} type="file" multiple accept=".xlsx,.xls,.json,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              style={{ display: "none" }} onChange={handleImport} />
            
            <button className="kt-btn kt-btn-ghost" onClick={handleDownloadTemplate}
              title="Tải file Excel mẫu đúng định dạng" style={{ padding: "8px 14px" }}>
              📄 Mẫu
            </button>
            <button className="kt-btn kt-btn-ghost" onClick={() => importRef.current?.click()}
              title="Import file Excel (.xlsx) hoặc JSON" style={{ padding: "8px 14px" }}>
              📥 Nhập
            </button>
            <button className="kt-btn kt-btn-ghost" onClick={handleExportData}
              title="Tải toàn bộ dữ liệu hiện tại trên web về máy (.xlsx)" style={{ padding: "8px 14px" }}>
              💾 Lưu về máy
            </button>

            {/* Undo / Redo */}
            <div style={{ display: "flex", gap: 2, border: "1px solid var(--line)", borderRadius: 24, overflow: "hidden", padding: 2, background: "var(--card)" }}>
              <button 
                className="kt-btn kt-btn-ghost" 
                onClick={handleUndo} 
                disabled={history.length === 0}
                title="Hoàn tác (Ctrl+Z)" 
                style={{ padding: "6px 12px", border: "none", borderRadius: 20, opacity: history.length === 0 ? 0.35 : 1, cursor: history.length === 0 ? "not-allowed" : "pointer" }}
              >
                ↩️
              </button>
              <button 
                className="kt-btn kt-btn-ghost" 
                onClick={handleRedo} 
                disabled={redoHistory.length === 0}
                title="Làm lại (Ctrl+Y)" 
                style={{ padding: "6px 12px", border: "none", borderRadius: 20, opacity: redoHistory.length === 0 ? 0.35 : 1, cursor: redoHistory.length === 0 ? "not-allowed" : "pointer" }}
              >
                ↪️
              </button>
            </div>

            {/* Reset */}
            <button className="kt-btn kt-btn-ghost" onClick={handleReset} title="Khôi phục gốc" style={{ padding: "8px 14px" }}>Reset</button>

            {/* Main Add Button */}
            <button className="kt-btn kt-btn-primary" onClick={() => setShowNew(true)}>+ Thêm KOL</button>
          </div>
        </div>

        {/* Bottom Row: Filters (hidden on Hồ sơ KOL — ProfileView has its own) */}
        {view !== "profile" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", borderTop: "1px dashed var(--line)", paddingTop: 12 }}>
            {/* Search */}
            <input className="kt-input" placeholder="🔍 Tìm tên KOL, món ăn…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: 240 }} />

            {/* Campaign filter */}
            <select className="kt-select" value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)}
              style={{ width: 180 }}>
              <option value="all">📁 Tất cả Chiến dịch</option>
              {CAMPAIGNS.map(c => <option key={c.key} value={c.key}>{campaignLabels[c.key] || c.label}</option>)}
            </select>

             {/* Status filter */}
            <select className="kt-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ width: 210 }}>
              <option value="all">⚡ Tất cả Trạng thái</option>
              <option value="in_progress">⚙️ Đang xử lý (Chưa lên sóng)</option>
              {STATUS_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>

            {/* Type filter */}
            <select className="kt-select" value={filterType} onChange={e => setFilterType(e.target.value)}
              style={{ width: 150 }}>
              <option value="all">👥 Tất cả Tiers</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}

        {/* Stats Row (Only visible for table, kanban) */}
        {(view === "table" || view === "kanban") && (
          <StatsBar 
            rows={statsRows} 
            currentStatus={filterStatus}
            onCardClick={statusKey => setFilterStatus(statusKey)}
          />
        )}
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0, position: "relative", zIndex: 1 }}>
        {/* Main Content Card Container */}
        <div style={{ 
          background: "var(--card)", 
          borderRadius: 24, 
          border: "1px solid var(--line)", 
          overflow: "hidden", 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          minHeight: 0,
          boxShadow: "0 8px 30px rgba(72, 67, 92, 0.015)"
        }}>
          {view === "table" && <TableView rows={filtered} onOpen={r => setSelected(r)} campaignLabels={campaignLabels} />}
          {view === "kanban" && (
            <KanbanView 
              rows={filtered} 
              onOpen={r => setSelected(r)} 
              onUpdateStatus={(id, newStatus) => {
                setData(prev => prev.map(item => item.id === id ? { ...item, statusKey: newStatus } : item));
                showToast(`Đã chuyển trạng thái sang: ${STATUS_MAP[newStatus]?.label || newStatus}`);
              }}
              campaignLabels={campaignLabels}
            />
          )}
          {view === "calendar" && (
            <CalendarView 
              rows={filtered} 
              onOpen={r => setSelected(r)}
              onUpdateRow={(id, updatedFields) => {
                setData(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
                showToast(`Đã xếp lịch lên sóng cho KOL!`);
              }}
              campaignLabels={campaignLabels}
            />
          )}
          {view === "profile" && (
            <ProfileView 
              rows={data} 
              onOpenProfile={k => setSelectedProfile(k)} 
              campaignLabels={campaignLabels} 
            />
          )}
        </div>
      </div>

      {/* ── DETAIL MODAL ── */}
      {selected && (
        <DetailModal
          kol={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {/* ── NEW KOL MODAL ── */}
      {showNew && (
        <DetailModal
          kol={emptyKOL()}
          onClose={() => setShowNew(false)}
          onSave={(row) => { handleAdd(row); setShowNew(false); }}
          onDelete={() => setShowNew(false)}
        />
      )}

      {/* ── IMPORT WIZARD ── */}
      {wizardData && (
        <ImportWizard
          {...wizardData}
          onClose={() => setWizardData(null)}
          campaignLabels={campaignLabels}
          onConfirm={(importedRows) => {
            let mergedCount = 0;
            let addedCount = 0;
            
            const cleanName = (str) => {
              if (!str) return "";
              return str.toString().toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "d")
                .replace(/[^a-z0-9]/g, "");
            };

            const CUSTOM_INITIALS = {
              "bbkbh": ["babykopo home", "baby kopo home"],
              "bbk": ["babykopo home", "baby kopo home"],
              "agt": ["ăn gì thương ơi", "an gi thuong oi"],
              "agto": ["ăn gì thương ơi", "an gi thuong oi"],
              "ttmt": ["thi thi miền tây", "thi thi mien tay"],
              "mc": ["min cookie", "mincookie"],
              "pha": ["pít ham ăn", "pit ham an"],
              "ln": ["linh nấu", "linh nau"]
            };

            const getInitials = (name) => {
              if (!name) return "";
              const n = name.toString().toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              const words = n.split(/\s+/).filter(Boolean);
              return words.map(w => w[0]).join("");
            };

            const isMatch = (importedName, kolName) => {
              if (!importedName || !kolName) return false;
              const impClean = cleanName(importedName);
              const kolClean = cleanName(kolName);

              // 1. Direct match or substring
              if (impClean === kolClean || kolClean.includes(impClean) || impClean.includes(kolClean)) return true;

              // 2. Custom initials match
              if (CUSTOM_INITIALS[impClean]) {
                if (CUSTOM_INITIALS[impClean].some(alias => kolClean.includes(alias))) return true;
              }

              // 3. Dynamic initials match
              const kolInitials = getInitials(kolName);
              if (impClean === kolInitials) return true;

              return false;
            };

                        // Collect dynamic campaign labels from imported rows
            const newLabels = { ...campaignLabels };
            let hasNewLabel = false;
            importedRows.forEach(imp => {
              if (imp.campaign && imp.__sheet__) {
                const sheetClean = imp.__sheet__.trim();
                // Skip generic sheet index labels
                const isGeneric = /^(sheet\s*\d+|trang\s*\d+|table|data|kho|database)/i.test(sheetClean);
                if (sheetClean && !isGeneric && newLabels[imp.campaign] !== sheetClean) {
                  newLabels[imp.campaign] = sheetClean;
                  hasNewLabel = true;
                }
              }
            });
            if (hasNewLabel) {
              setCampaignLabels(newLabels);
              localStorage.setItem("kol_campaign_labels", JSON.stringify(newLabels));
            }

            const updatedData = [...data];
            
            importedRows.forEach(imp => {
              const impCampaign = resolveCampaignKey(imp);
              const matchIdx = updatedData.findIndex(existing => {
                if (imp.id && existing.id === imp.id) return true;
                if (!isMatch(imp.kol, existing.kol)) return false;
                const existingCampaign = resolveCampaignKey(existing);
                if (!impCampaign || !existingCampaign) return false;
                return existingCampaign === impCampaign;
              });
              if (matchIdx !== -1) {
                const existing = updatedData[matchIdx];
                const merged = { ...existing };
                
                const fieldsToMerge = [
                  "link", "follower", "type", "location", "group", "cost", "addonFee", 
                  "statusKey", "monAn", "ngayGuiScript", "ngayGuiDemo", "ngayAir", 
                  "airedLink", "airedFb", "giftSent",
                  "estView", "estEng", "views", "likes", "comments", "saves", "shares",
                  "adSpend", "conversions", "addToCart", "revenue"
                ];

                fieldsToMerge.forEach(field => {
                  if (imp[field] !== undefined && imp[field] !== "" && imp[field] !== 0) {
                    merged[field] = imp[field];
                  }
                });

                updatedData[matchIdx] = merged;
                mergedCount++;
              } else {
                updatedData.push(imp);
                addedCount++;
              }
            });

            setData(updatedData);
            setWizardData(null);
            showToast(`✅ Đã nhập thành công! Gộp thông tin: ${mergedCount} KOLs, Thêm mới: ${addedCount} KOLs`, true);
          }}
        />
      )}
      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: toast.ok ? "#001C44" : "#991b1b",
          color: "#fff", padding: "12px 22px", borderRadius: 10,
          fontSize: 13, fontWeight: 600, zIndex: 999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          animation: "kt-fade-in 0.2s ease",
          whiteSpace: "nowrap",
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── PROFILE DETAIL MODAL ── */}
      {selectedProfile && (
        <ProfileDetailModal
          kol={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          campaignLabels={campaignLabels}
          onSaveProfile={handleUpdateProfile}
        />
      )}

      {/* ── FOOTER ── */}
      <div style={{
        background: "var(--card)",
        borderTop: "1px solid var(--line)",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
        zIndex: 10,
        fontSize: 12,
        color: "var(--ink-soft)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span>© 2026 TCV x Brand. All rights reserved.</span>
          <span style={{ color: "var(--line)" }}>|</span>
          <span>Dữ liệu chiến dịch: <strong>FY26</strong></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span>Trạng thái hệ thống: <span style={{ color: "var(--ok)", fontWeight: 700 }}>● Online</span></span>
          <span style={{ color: "var(--line)" }}>|</span>
          <span>Hệ thống quản lý KOL Tracking</span>
        </div>
      </div>
    </div>
  );
}
