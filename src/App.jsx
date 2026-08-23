import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import * as XLSX from "xlsx";

/* ---------------- Design tokens (injected via <style>) ---------------- */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Questrial&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

    /* ── DESIGN TOKENS: Pebble & Yam Theme ── */
    .kt-root {
      --ink:        #313841; /* High Tide - darkest text */
      --ink-mid:    #3A4750; /* Cadet Blue - secondary text */
      --ink-soft:   #5E6E7A; /* Muted cadet */
      --ink-faint:  #B0BEC5; /* Light cadet */
      --paper:      #EEEEEE; /* Pebble background */
      --card:       #FFFFFF; /* Card white */
      --rule:       #D8D8D8; /* Pebble border */
      --line:       #D8D8D8;
      --accent:     #EA9216; /* Yam orange */
      --accent-dim: #3A4750; /* Cadet Blue dim */
      --accent-bg:  #FDF0DC; /* Light Yam wash */
      
      --ok:         #10B981; /* Emerald Green */
      --ok-bg:      #ECFDF5;
      --warn:       #F59E0B; /* Amber Yellow */
      --warn-bg:    #FFFBEB;
      --danger:     #EF4444; /* Bright Red */
      --danger-bg:  #FEF2F2;
      --blue:       #3B82F6; /* Bright Blue */
      --blue-bg:    #EFF6FF;

      font-family: 'Questrial', sans-serif;
      font-size: 14px;
      color: var(--ink);
      background-color: var(--paper);

      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    .kt-root input, .kt-root select, .kt-root button, .kt-root textarea {
      font-family: 'Questrial', sans-serif;
    }
    .kt-serif  { font-family: 'Questrial', sans-serif; font-weight: 800; letter-spacing: -0.02em; }
    .kt-mono   { font-family: 'IBM Plex Mono', monospace; }
    .kt-caps   { text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.72em; font-weight: 700; }

    /* ── SCROLLBAR ── */
    .kt-scrollbar::-webkit-scrollbar       { height: 6px; width: 6px; }
    .kt-scrollbar::-webkit-scrollbar-thumb { background: var(--ink-faint); border-radius: 4px; }
    .kt-scrollbar::-webkit-scrollbar-track { background: transparent; }

    /* ── CARDS: Flat minimal borders, extremely light shadows ── */
    .kt-card {
      background: var(--card);
      border: 1px solid var(--rule);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
    }
    .kt-card-neutral {
      background: var(--card);
      border: 1px solid var(--rule);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
    }
    .kt-glass {
      background: var(--card);
      border: 1px solid var(--rule);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
    }

    /* ── KANBAN TICKET ── */
    .kt-ticket {
      position: relative;
      background: var(--card);
      border: 1px solid var(--rule);
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
      transition: all 0.2s ease;
    }
    .kt-ticket:hover {
      border-color: var(--accent);
      box-shadow: 0 6px 20px rgba(234, 146, 22, 0.15);
      transform: translateY(-1px);
    }
    .kt-ticket .kt-perf {
      position: relative;
      border-top: 1px solid var(--rule);
      margin: 0 14px;
    }


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
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
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
      font-family: 'Questrial', sans-serif;
      font-weight: 700; border-radius: 12px;
      padding: 8px 16px; font-size: 12px;
      cursor: pointer; border: 1px solid transparent;
      transition: all 0.2s ease;
      display: inline-flex; align-items: center; gap: 6px;
      white-space: nowrap; letter-spacing: -0.01em;
    }
    .kt-btn-primary {
      background: #EA9216;
      color: #fff;
      border: none;
    }
    .kt-btn-primary:hover {
      background: #D4820E;
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(234, 146, 22, 0.35);
    }
    .kt-btn-ghost {
      background: transparent; color: var(--ink);
      border-color: var(--rule);
    }
    .kt-btn-ghost:hover { background: var(--accent-bg); border-color: var(--accent); }
    .kt-btn-ghost.active {
      background: var(--accent); color: #fff; border-color: var(--accent);
    }
    .kt-btn-danger { background: var(--danger-bg); color: var(--danger); border-color: var(--danger-bg); }
    .kt-btn-danger:hover { background: #FCDEDE; }

    /* ── FORM ELEMENTS ── */
    .kt-input, .kt-select, .kt-textarea {
      font-family: 'Questrial', sans-serif;
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
      box-shadow: 0 0 0 3px rgba(234, 146, 22, 0.18);
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
      background: rgba(15, 23, 42, 0.3);
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
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
      border: 1px solid var(--rule);
      animation: kt-modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes kt-modal-pop {
      from { transform: scale(0.95); opacity: 0; }
      to   { transform: scale(1); opacity: 1; }
    }
    @keyframes kt-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
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
  { key: "AM", label: "AM", color: "#FFAFA3" },
  { key: "AX", label: "AX", color: "#A2C2E8" },
  { key: "Vinegar", label: "Vinegar", color: "#A8C3A0" },
  { key: "MSG", label: "MGS", color: "#FFD175" },
  { key: "Blendy", label: "Blendy", color: "#C7B1E6" },
];

const normalizeCampaignKey = (sheetName) => {
  if (!sheetName) return "";
  const name = sheetName.toString().toLowerCase().trim();
  if (name.startsWith("am_") || name.includes("mayo") || name === "am" || name.includes("campaign a") || name.includes("campaign_a")) return "AM";
  if (name.startsWith("ax_") || name.includes("xốt") || name === "ax" || name.includes("campaign b") || name.includes("campaign_b")) return "AX";
  if (name.startsWith("av_") || name.startsWith("vinegar") || name.startsWith("vinegear") || name.includes("giấm") || name.includes("vinegar") || name === "giấm_fy25" || name.includes("campaign c") || name.includes("campaign_c")) return "Vinegar";
  if (name.startsWith("msg_") || name.startsWith("mgs_") || name.includes("msg") || name.includes("mgs") || name === "mgs" || name.includes("bột ngọt") || name.includes("mì chính") || name.includes("campaign d") || name.includes("campaign_d")) return "MSG";
  if (name.startsWith("blendy_") || name.includes("blendy") || name.includes("campaign e") || name.includes("campaign_e")) return "Blendy";
  return sheetName;
};

const resolveCampaignKey = (row) => {
  if (!row) return "";
  if (row.campaign) return normalizeCampaignKey(row.campaign);
  if (row.__sheet__) return normalizeCampaignKey(row.__sheet__);
  return "";
};


const DEFAULT_STATUS_STAGES = [
  { key: "waiting_food",   label: "Chờ duyệt món ăn",   color: "#E28B65", soft: "#FAF0EB" },
  { key: "waiting_script", label: "Chờ duyệt script",   color: "#B284A3", soft: "#FAF0F6" },
  { key: "doing_demo",     label: "Đang làm demo",       color: "#5E9BE2", soft: "#EBF3FC" },
  { key: "waiting_demo",   label: "Chờ duyệt demo",      color: "#E28B65", soft: "#FAF0EB" },
  { key: "revised_demo",   label: "Demo đã chỉnh sửa",   color: "#B284A3", soft: "#FAF0F6" },
  { key: "confirmed_demo", label: "Demo đã duyệt",       color: "#47B39C", soft: "#EBF8F5" },
  { key: "aired",          label: "Đã lên sóng",         color: "#8A7BFF", soft: "#F4F2FF" },
];

const PREDEFINED_COLORS = ["#FFAFA3", "#A2C2E8", "#A8C3A0", "#FFD175", "#C7B1E6", "#F4A261", "#E76F51", "#2A9D8F", "#E9C46A", "#264653"];
const getCampaignColor = (key) => {
  if (!key) return "#888";
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PREDEFINED_COLORS[Math.abs(hash) % PREDEFINED_COLORS.length];
};


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
  // ═══════════════════════════════════════════════════════
  // VERIFIED from Internal planner (Code column) + Raw Ads
  // ═══════════════════════════════════════════════════════

  // Confirmed from AVN-SO_Aji mayo sheet (Code column)
  "agto":   ["ăn gì thương ơi", "an gi thuong oi", "ăn Gì Thương Ơi"],
  "agto2":  ["ăn gì thương ơi", "an gi thuong oi"],         // P2 slot
  "kl":     ["khánh linh", "khanh linh"],
  "kl2":    ["bếp nhà linh", "bep nha linh"],               // P2 slot maps to Bếp Nhà Linh
  "gbtna":  ["gái bắc thích nấu ăn", "gai bac thich nau an"],
  "gbtna2": ["gái bắc thích nấu ăn", "gai bac thich nau an"],
  "es":     ["emmer sweet"],
  "es2":    ["emmer sweet"],
  "mc":     ["minn cookie", "min cookie", "mincookie"],
  "hvqh":   ["hương vị quê hương 89", "huong vi que huong 89", "hương vị quê hương"],
  "ttmt":   ["thi thi miền tây", "thi thi mien tay", "thi thi miền tây"],
  "kmv":    ["khang miệt vườn", "khang miet vuon"],
  "ut":     ["út tình", "ut tinh"],

  // Confirmed from AVN-SO_Aji xốt sheet (Code column)
  "bkh":    ["babykopo home", "baby kopo home"],
  "nltt":   ["nguyễn lê thu thủy", "ng lê thu thủy", "nguyen le thu thuy"],
  "ci":     ["chou iu", "chouiu", "chou.iu"],              // Chou.iu in Aji xốt

  // Confirmed from AVN-SO_Bột ngọt (MSG) sheet (Code column)
  "bdn":    ["bon đây nè", "bon day ne"],
  "cl":     ["cờ ly", "co ly", "chou iu", "chouiu", "cou iu"], // CL = Cờ Ly in MSG, Chou.iu elsewhere
  "bnl":    ["bếp nhà linh", "bep nha linh"],

  // ═══════════════════════════════════════════════════════
  // VERIFIED from raw2026 sheet (Ad name column)
  // ═══════════════════════════════════════════════════════
  "cnbx":   ["cơm nhà bếp xưa", "com nha bep xua"],
  "mh":     ["my huyền", "my huyen"],
  "nadl":   ["nấu ăn dễ lắm", "nau an de lam", "nấu ăn dễ lắm 🤤"],
  "htvb":   ["hảo thích vào bếp", "hao thich vao bep"],
  "mbb":    ["mẹ bảo bối", "me bao boi"],
  "bnn":    ["bếp nga nè", "bep nga ne"],
  "ttam":   ["trang tấm", "trang tam"],
  "emsw":   ["emmer sweet"],
  "bemsw":  ["emmer sweet"],
  "gdsrn":  ["gia đình sầu rất ngầu", "gia dinh sau rat ngau"],
  "bbkbh":  ["babykopo home", "baby kopo home"],
  "bbkp":   ["babykopo home", "baby kopo home"],
  "cnb":    ["cơm nhà bông", "com nha bong"],
  "ntm":    ["nông thôn mới", "nong thon moi"],
  "cd":     ["chú đàn", "chu dan"],
  "ckm":    ["châu kiều my", "chau kieu my"],
  "mtn":    ["mạnh tây nguyên", "manh tay nguyen"],
  "pha":    ["pít ham ăn", "pit ham an", "phương hà", "phuong ha"],
  "tngd":   ["toe nấu gì đó", "toe nau gi do", "tngd", "toe nấu gì đó"],
  "ln":     ["linh nấu", "linh nau", "linh nấu🍜"],

  // ═══════════════════════════════════════════════════════
  // VERIFIED from rawdata sheet (Ad name column)
  // ═══════════════════════════════════════════════════════
  "lnc":    ["let nhân cook", "let nhan cook"],
  "cllm":   ["cờ ly làm mẹ", "co ly lam me"],
  "tv":     ["tiền võ", "tien vo"],
  "htvb":   ["hảo thích vào bếp", "hao thich vao bep"],
  "bdfml":  ["bích đức family", "bich duc family", "🌱 bích đức' family 🍎"],
  "bbkph":  ["babykopo home", "baby kopo home"],
  "hhvlog": ["huỳnh hải vlog", "huynh hai vlog"],
  "sammy":  ["sammy"],
  "ad":     ["an đen", "an den"],
  "hc":     ["hà cooking", "ha cooking"],
  "blm":    ["bin bun nè", "bin bun ne"],             // BLM in rawdata
  "bbn":    ["bin bun nè", "bin bun ne"],
  "gdmn":   ["gia đình milk nè", "gia dinh milk ne"],
  "tt":     ["thao ng - nấu ăn healthy", "thao ng nau an healthy"],
  "qqtnn":  ["quê nhà có mẹ", "que nha co me"],
  "cmd":    ["cá mập đói", "ca map doi"],
  "ml":     ["miu linh"],
  "toe":    ["toe nấu gì đó", "toe nau gi do"],
  "mhk":    ["mập hay kể", "map hay ke"],
  "cltd":   ["cờ ly làm mẹ", "co ly lam me"],

  // ═══════════════════════════════════════════════════════
  // TTS / Click campaign variants (from raw sheet)
  // ═══════════════════════════════════════════════════════
  "angithuongoi_tts":  ["ăn gì thương ơi", "an gi thuong oi"],
  "bondayne__tts":     ["bon đây nè", "bon day ne"],
  "minn cookie__tts":  ["minn cookie", "min cookie"],
  "ng-lê-thu-thủy_tts":["nguyễn lê thu thủy", "ng lê thu thủy"],
  "minncookie_tts":    ["minn cookie", "min cookie"],

  // ═══════════════════════════════════════════════════════
  // Logical abbreviations for KOLs without explicit codes
  // ═══════════════════════════════════════════════════════
  "bnm":    ["bếp nhà mầm", "bep nha mam", "bếp nhà mâm"],
  "bnc":    ["bepnhacotam"],
  "cn28":   ["comnha28"],
  "gdmh":   ["gia đình mắt hí", "gia dinh mat hi"],
  "hxoy":   ["hằng xoy", "hang xoy"],
  "ktb":    ["kim thoa bùi", "kim thoa bui"],
  "ldhl":   ["lamdauhalong"],
  "mhna":   ["mai hà thích nấu ăn", "mai ha thich nau an", "mai hà thích nấu ăn ✿"],
  "mhtna":  ["mai hà thích nấu ăn", "mai ha thich nau an"],
  "nmqx":   ["na mít quýt xoài", "na mit quyt xoai"],
  "nbd":    ["nhà bún đây", "nha bun day"],
  "nsh":    ["nhi say hi"],
  "qnkm":   ["quê nhà có mẹ", "que nha co me"],
  "qc":     ["quán cooking", "quan cooking", "quân cooking"],
  "tanha":  ["thao ng nấu ăn healthy", "thao ng - nấu ăn healthy"],
  "hvqh89": ["hương vị quê hương 89", "huong vi que huong 89"],
  "motis":  ["mẹ otis", "me otis"],
  "bbn2":   ["bin bun nè", "bin bun ne"],
  "ckm":    ["châu kiều my", "chau kieu my"],
  "gdmilk": ["gia đình milk nè", "gia dinh milk ne"],
};

const getInitials = (name) => {
  if (!name) return "";
  const n = name.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
  const words = n.split(/[\s\-_]+/).filter(Boolean);
  return words.map(w => w[0]).join("");
};

const isKolMatch = (importedName, kolName) => {
  if (!importedName || !kolName) return false;
  
  const clean = (s) => {
    let t = cleanName(s);
    t = t.replace(/^(urban|rural|p1|p2|phase1|phase2|otherprovince)/g, "");
    t = t.replace(/(tts|click|view|conversion|sales|ads|group|urban|rural)$/g, "");
    return t;
  };
  
  const impClean = clean(importedName);
  const kolClean = clean(kolName);

  if (impClean === kolClean || kolClean.includes(impClean) || impClean.includes(kolClean)) return true;

  if (CUSTOM_INITIALS[impClean]) {
    if (CUSTOM_INITIALS[impClean].some(alias => clean(alias) === kolClean || kolClean.includes(clean(alias)) || clean(alias).includes(kolClean))) return true;
  }

  // Fallback: match by initials (with or without numbers)
  const kolInitials = getInitials(kolName);
  if (impClean === kolInitials) return true;
  
  const impCleanNoDigits = impClean.replace(/[0-9]/g, "");
  if (impCleanNoDigits && impCleanNoDigits === kolInitials) return true;

  return false;
};

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
  addonFee:      ["addonFee", "addon fee", "add-on fee", "add-on", "deliverable", "deliverables", "addonfee", "addon"],
  cost:          ["cost", "chi phí", "chi phi", "giá", "gia", "ext. cost", "ext cost", "budget"],
  status:        ["status", "trạng thái", "trang thai", "tiến độ", "tien do", "tình trạng", "tinh trang"],
  statusKey:     ["statusKey", "status key", "status_key"],
  monAn:         ["monản", "món ăn", "mon an", "food", "dish", "thực đơn", "thuc don"],
  ngayGuiScript: ["ngay gui script", "ngày gửi script", "script link"],
  ngayGuiDemo:   ["ngay gui demo", "ngày gửi demo", "ngày gửi 1st demo", "ngay gui 1st demo", "demo link"],
  ngayAir:       ["ngay air", "ngày air", "air date", "ngày lên sóng", "date aired", "date air", "est. start date", "est start date"],
  airedLink:     ["airedLink", "aired link", "link aired", "aired tiktok", "link vdo", "link video", "video link", "link_vdo", "vdo link"],
  airedFb:       ["airedFb", "aired fb", "fb/ig", "reup", "social", "facebook", "instagram"],
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
  reupViews:     ["reup view", "reup views"],
  reupEngagement:["reup eng", "reup engagement"],
  totalViewCombined: ["total view\n(tt + reup)", "total view (tt + reup)", "total view tt+reup"],
  totalEngCombined:  ["total eng.\n(tt + reup)", "total eng. (tt + reup)", "total eng tt+reup"],
  pctViewAchieved:      ["% view achieved"],
  pctEngAchieved:       ["% eng achieved (like, cmt, share)", "% eng achieved"],
  pctViewAchievedTotal: ["% view achieved (kèm reup)"],
  pctEngAchievedTotal:  ["% eng. achieved", "% eng achieved (kèm reup)"],
  paidAvgView:          ["paid avg. view", "paid avg view"],
  paidPctCompletedView: ["paid % completed view"],
  codeAds:              ["code ads"],
  reupLink:              ["reup link"],
  brandReup:             ["brand reup"],
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

const getAvatarColor = (name) => {
  if (!name) return "var(--accent)";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "#4F46E5", // Indigo
    "#0EA5E9", // Sky
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EC4899", // Pink
    "#8B5CF6", // Violet
    "#F43F5E", // Rose
    "#06B6D4", // Cyan
    "#84CC16", // Lime
    "#A855F7", // Purple
  ];
  const idx = Math.abs(hash) % colors.length;
  return colors[idx];
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
  // ── Social Outreach metrics (added for [AVNxTCV] Social Outreach Campaign file) ──
  reupViews: 0,
  reupEngagement: 0,
  totalViewCombined: 0,      // Total View (TikTok + Reup)
  totalEngCombined: 0,       // Total Engagement (TikTok + Reup)
  pctViewAchieved: null,     // % View Achieved (TikTok only, so sánh Est View)
  pctEngAchieved: null,      // % Eng Achieved (TikTok only)
  pctViewAchievedTotal: null,// % View achieved (kèm Reup)
  pctEngAchievedTotal: null, // % Eng. achieved (kèm Reup)
  paidAvgView: null,         // Paid Avg. View
  paidPctCompletedView: null,// Paid % Completed View
  codeAds: "",               // Code ads (Có/Không/mô tả)
  reupLink: "",              // Reup Link
  brandReup: "",             // Brand Reup
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
  reupViews: "Reup Views",
  reupEngagement: "Reup Engagement",
  totalViewCombined: "Tổng View (TikTok + Reup)",
  totalEngCombined: "Tổng Engagement (TikTok + Reup)",
  pctViewAchieved: "% View đạt KPI",
  pctEngAchieved: "% Engagement đạt KPI",
  pctViewAchievedTotal: "% View đạt KPI (kèm Reup)",
  pctEngAchievedTotal: "% Engagement đạt KPI (kèm Reup)",
  paidAvgView: "Paid Avg. View",
  paidPctCompletedView: "Paid % Completed View",
  codeAds: "Code Ads",
  reupLink: "Link Reup",
  brandReup: "Brand Reup",
};

const applyMapping = (rawRows, mapping, statusLabelToKey) => {
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

      const numericFields = ["cost", "estView", "estEng", "views", "likes", "comments", "saves", "shares", "adSpend", "conversions", "addToCart", "revenue",
        "reupViews", "reupEngagement", "totalViewCombined", "totalEngCombined", "pctViewAchieved", "pctEngAchieved",
        "pctViewAchievedTotal", "pctEngAchievedTotal", "paidAvgView", "paidPctCompletedView"];
      if (numericFields.includes(field)) {
        out[field] = parseFloat(val.replace(/[^0-9.-]/g, "")) || 0;
      } else if (field === "status") {
        out.statusKey = (statusLabelToKey[val.toLowerCase().trim()]) || "waiting_food";
      } else if (field === "statusKey") {
        out.statusKey = (statusLabelToKey[val.toLowerCase().trim()]) || val || "waiting_food";
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

const ImportWizard = ({ rawHeaders, rawRows, sheetInfo, fileName, onConfirm, onClose, campaignLabels, statusLabelToKey, statusMap }) => {
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
                  <span key={s.name} className="kt-badge" style={{ background: getCampaignColor(s.name) ? getCampaignColor(s.name) + "22" : "var(--paper)", color: getCampaignColor(s.name) || "var(--ink-soft)", border: `1px solid ${getCampaignColor(s.name) || "var(--line)"}` }}>
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
                  <span style={{ color: getCampaignColor(r.campaign) || "var(--ink-soft)" }}>{campaignLabels[r.campaign] || r.campaign}</span>
                  <span className="kt-mono">{r.follower || "?"}</span>
                  <StatusBadge statusKey={r.statusKey} statusMap={statusMap} />
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
   DUAL-FILE AUTO-MERGE (INTERNAL execution file + Social Outreach file)
   Kéo thả 2 file, tự nhận diện vai trò từng file theo cấu trúc cột,
   ghép theo Campaign (tên sheet) + Tên KOL, rồi merge không đè dữ liệu trống.
================================================================ */

// Helpers shared by the dual-file parser ---------------------------------
const excelCellToStr = (raw) => {
  if (raw === null || raw === undefined) return "";
  if (raw instanceof Date) {
    return `${raw.getDate()}/${raw.getMonth() + 1}`;
  }
  if (typeof raw === "number" && raw > 40000 && raw < 60000) {
    const d = XLSX.SSF.parse_date_code(raw);
    return `${d.d}/${d.m}`;
  }
  return String(raw).trim();
};
const excelCellToNum = (raw) => {
  if (raw === null || raw === undefined || raw === "") return undefined;
  const n = Number(raw);
  return isNaN(n) ? undefined : n;
};
const excelCellToCountNum = (raw) => {
  const n = excelCellToNum(raw);
  if (n === undefined) return undefined;
  if (!Number.isInteger(n)) {
    const str = n.toString();
    const parts = str.split('.');
    if (parts[1]) {
      if (parts[1].length === 3) {
        return Math.round(n * 1000);
      } else if (parts[1].length === 6) {
        return Math.round(n * 1000000);
      } else {
        return Math.round(n);
      }
    }
  }
  return n;
};
const excelCellToPercentNum = (raw) => {
  const n = excelCellToNum(raw);
  if (n === undefined) return undefined;
  // Excel stores percentage values as decimal ratios (e.g. 0.7093 = 70.93%, 8.5 = 850%, 43.22 = 4322%).
  // We must always multiply by 100 to get the raw percentage value.
  return n * 100;
};
const excelCellToBoolLabel = (raw) => {
  if (raw === null || raw === undefined || raw === "") return "";
  if (typeof raw === "boolean") return raw ? "Có" : "Không";
  return String(raw).trim();
};

// CRITICAL: in the Social Outreach file, "Aired Link" / "Reup Link" cells often
// display placeholder text like "Aired" or "IG\nYT" while the REAL URL is stored
// as a hidden hyperlink underneath. sheet_to_json only returns the display text,
// so we must read the raw cell's .l.Target to recover the actual link.
const getLinkOrText = (ws, r, c, fallbackVal) => {
  const addr = XLSX.utils.encode_cell({ r, c });
  const cell = ws[addr];
  const decodeEntities = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  if (cell && cell.l && cell.l.Target && /^https?:\/\//i.test(cell.l.Target)) return decodeEntities(cell.l.Target);
  const text = excelCellToStr(fallbackVal);
  if (/^https?:\/\//i.test(text)) return text;
  return text; // keep original text (e.g. Google Docs links already stored as plain text in INTERNAL file)
};

const findHeaderIdx = (header, ...candidates) => {
  const norm = (s) => (s || "").toString().toLowerCase().replace(/\s+/g, " ").trim();
  const cands = candidates.map(norm);
  for (let i = 0; i < header.length; i++) {
    const h = norm(header[i]);
    if (cands.includes(h)) return i;
  }
  // fallback: partial match
  for (let i = 0; i < header.length; i++) {
    const h = norm(header[i]);
    if (cands.some(c => c && h.includes(c))) return i;
  }
  return -1;
};

// Detect which of the two known file formats a workbook is ---------------
const detectFileRole = (wb, fileName) => {
  const fn = (fileName || "").toLowerCase().trim();
  
  // 1. Primary: Classify by explicit filename keywords
  if (fn.includes("social") || fn.includes("outreach") || fn.includes("báo cáo") || fn.includes("hiệu suất")) {
    return ["social"];
  }
  if (fn.includes("internal") || fn.includes("execution") || fn.includes("kế hoạch")) {
    return ["internal"];
  }
  if (fn.includes("media") || fn.includes("raw") || fn.includes("ads")) {
    return ["media"];
  }

  // 2. Secondary: Fallback to sheet headers if filename is generic
  const allHeaders = new Set();
  const allSheetNames = new Set(wb.SheetNames.map(n => n.toLowerCase().trim()));
  
  wb.SheetNames.forEach(name => {
    const ws = wb.Sheets[name];
    const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    if (!aoa.length) return;

    let headerIdx = 0;
    for (let r = 0; r < Math.min(aoa.length, 25); r++) {
      const row = aoa[r];
      if (Array.isArray(row)) {
        const hasKol = row.some(cell => cell && cell.toString().toLowerCase().includes("kol"));
        if (hasKol) {
          headerIdx = r;
          break;
        }
      }
    }

    if (aoa[headerIdx]) {
      aoa[headerIdx].forEach(h => allHeaders.add((h || "").toString().toLowerCase().trim()));
    }
  });
  
  const has = (s) => Array.from(allHeaders).some(h => h.includes(s));
  const looksInternal = has("status") && (has("group") || has("add-on fee") || has("deliverable"));
  const looksSocial = has("view") || has("reach") || has("impression") || has("timeline");
  const looksMedia = allSheetNames.has("raw") || allSheetNames.has("raw2026") || allSheetNames.has("rawdata") || has("6-second focused views") || has("video view rate");

  const roles = [];
  if (looksInternal) roles.push("internal");
  if (looksSocial) roles.push("social");
  if (looksMedia) roles.push("media");
  
  if (roles.length === 0) roles.push("unknown");
  return roles;
};

// Parse the [INTERNAL] Execution file → { campaignKey: Map(kolKeyLower -> fields) }
const parseInternalWorkbook = (wb, statusLabelToKey) => {
  const out = {};
  wb.SheetNames.forEach(sheetName => {
    const ws = wb.Sheets[sheetName];
    const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
    if (!aoa.length) return;

    let headerIdx = 0;
    for (let r = 0; r < Math.min(aoa.length, 25); r++) {
      const row = aoa[r];
      if (Array.isArray(row)) {
        const hasKol = row.some(cell => cell && cell.toString().toLowerCase().includes("kol"));
        if (hasKol) {
          headerIdx = r;
          break;
        }
      }
    }

    const header = aoa[headerIdx].map(h => (h || "").toString());
    const iKol = findHeaderIdx(header, "kol");
    const iCampaign = findHeaderIdx(header, "chiến dịch", "campaign", "dự án");
    const iLink = findHeaderIdx(header, "link");
    const iFollower = findHeaderIdx(header, "follower");
    const iType = findHeaderIdx(header, "type");
    const iLocation = findHeaderIdx(header, "location");
    const iGroup = findHeaderIdx(header, "group");
    const iCost = findHeaderIdx(header, "cost");
    const iAddon = findHeaderIdx(header, "add-on fee");
    const iStatus = findHeaderIdx(header, "status");
    const iMonAn = findHeaderIdx(header, "món ăn", "mon an");
    const iScript = findHeaderIdx(header, "ngày gửi script", "ngay gui script");
    const iDemo = findHeaderIdx(header, "ngày gửi 1st demo", "ngày gửi demo", "ngay gui 1st demo");
    const iAir = findHeaderIdx(header, "ngày air", "ngay air");
    const iAiredLink = findHeaderIdx(header, "aired link");
    const iAiredFb = findHeaderIdx(header, "aired fb");
    const iAdName = findHeaderIdx(header, "ad name", "ad_name", "adname", "tên ads");
    if (iKol < 0) return;
    
    // If we have a campaign column, we don't strictly require the sheet name to match a campaign
    const sheetCampaignKey = normalizeCampaignKey(sheetName);
    
    for (let r = headerIdx + 1; r < aoa.length; r++) {
      const row = aoa[r];
      if (!row) continue;
      
      const isEmpty = row.every(cell => cell === null || cell === undefined || cell.toString().trim() === "");
      if (isEmpty) break;
      
      const kolName = (row[iKol] || "").toString().trim();
      if (!kolName) continue;
      const kolNameLower = kolName.toLowerCase();
      if (kolNameLower === "total" || kolNameLower === "average" || kolNameLower === "kol/koc") continue;
      
      let rowCampaignRaw = iCampaign >= 0 ? excelCellToStr(row[iCampaign]) : sheetName;
      if (!rowCampaignRaw) rowCampaignRaw = sheetName;
      const campaignKey = normalizeCampaignKey(rowCampaignRaw);
      
      if (!out[campaignKey]) out[campaignKey] = new Map();
      const map = out[campaignKey];

      const noVal = row[0];
      const no = (noVal !== null && noVal !== "" && !isNaN(Number(noVal))) ? Number(noVal) : (r - headerIdx);
      const intAiredLink = iAiredLink >= 0 ? getLinkOrText(ws, r, iAiredLink, row[iAiredLink]) : "";
      const intNgayAir = excelCellToStr(row[iAir]);
      let intStatusKey = iStatus >= 0 ? (statusLabelToKey[(row[iStatus] || "").toString().toLowerCase().trim()] || "") : "";
      // Auto-infer "aired" if there is a real air date or aired link but status not yet set
      if (!intStatusKey || intStatusKey === "waiting_food") {
        const hasAiredLink = intAiredLink && /^https?:\/\//i.test(intAiredLink);
        const hasAiredDate = intNgayAir && intNgayAir.trim() !== "" && intNgayAir.trim() !== "—" && intNgayAir.trim().toLowerCase() !== "asap";
        if (hasAiredLink || hasAiredDate) intStatusKey = "aired";
      }
      map.set(kolName.toLowerCase(), {
        kol: kolName,
        no: Number(no),
        adName: iAdName >= 0 ? excelCellToStr(row[iAdName]) : "",
        link: excelCellToStr(row[iLink]),
        follower: excelCellToStr(row[iFollower]),
        type: excelCellToStr(row[iType]),
        location: excelCellToStr(row[iLocation]),
        group: excelCellToStr(row[iGroup]),
        cost: excelCellToCountNum(row[iCost]) || 0,
        addonFee: excelCellToStr(row[iAddon]),
        statusKey: intStatusKey,
        monAn: excelCellToStr(row[iMonAn]),
        ngayGuiScript: iScript >= 0 ? getLinkOrText(ws, r, iScript, row[iScript]) : "",
        ngayGuiDemo: iDemo >= 0 ? getLinkOrText(ws, r, iDemo, row[iDemo]) : "",
        ngayAir: intNgayAir,
        airedLink: intAiredLink,
        airedFb: excelCellToStr(row[iAiredFb]),
      });
    }
  });
  return out;
};

// Parse the [AVNxTCV] Social Outreach file → { campaignKey: Map(kolKeyLower -> fields) }
const parseSocialWorkbook = (wb, statusLabelToKey) => {
  const out = {};
  
  const isHeaderRow = (row) => {
    if (!Array.isArray(row)) return false;
    return row.some(cell => {
      if (!cell) return false;
      const s = cell.toString().toLowerCase().trim();
      return s === "kol" || s === "kol/koc" || s === "ad name" || s === "ad_name" || s === "creator" || s === "koc" || s === "ad group name" || s === "ad group" || s === "ad_group";
    });
  };

  wb.SheetNames.forEach(sheetName => {
    const ws = wb.Sheets[sheetName];
    const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
    if (!aoa.length) return;

    const sections = [];
    let currentSection = null;

    for (let r = 0; r < aoa.length; r++) {
      const row = aoa[r];
      if (isHeaderRow(row)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        const header = row.map(h => (h || "").toString());
        currentSection = {
          header,
          headerIdx: r,
          rows: []
        };
      } else if (currentSection) {
        const isEmpty = !row || row.every(cell => cell === null || cell === undefined || cell.toString().trim() === "");
        if (isEmpty) {
          sections.push(currentSection);
          currentSection = null;
        } else {
          const firstCell = (row[0] || "").toString().toLowerCase().trim();
          const secondCell = (row[1] || "").toString().toLowerCase().trim();
          if (firstCell.includes("tổng cộng") || firstCell.includes("average") || firstCell.includes("total") ||
              secondCell.includes("tổng cộng") || secondCell.includes("average") || secondCell.includes("total")) {
            continue;
          }
          currentSection.rows.push({ rIdx: r, row });
        }
      }
    }
    if (currentSection) sections.push(currentSection);

    sections.forEach(sec => {
      const header = sec.header;
      
      // Determine if this is a Plan/KPI Setup section instead of actual performance
      const isPlanSection = header.some(h => {
        const s = (h || "").toString().toLowerCase().trim();
        return s.includes("kpi") || s.includes("objective") || s.includes("buying method");
      });
      if (isPlanSection) return; // Skip Plan/Setup tables in Social Outreach sheets

      const iKol = findHeaderIdx(header, "kol", "ad name", "ad_name", "kol/koc", "creator", "ad group name", "ad group", "ad_group");
      const iCampaign = findHeaderIdx(header, "chiến dịch", "campaign name");
      
      const sheetCampaignKey = normalizeCampaignKey(sheetName);
      
      const iLink = findHeaderIdx(header, "link");
      const iType = findHeaderIdx(header, "type");
      const iEstView = findHeaderIdx(header, "est view");
      const iEstEng = findHeaderIdx(header, "est engagement", "est eng");
      const iFollower = findHeaderIdx(header, "follower");
      const iCost = findHeaderIdx(header, "cost", "budget");
      const iDateAired = findHeaderIdx(header, "date aired", "timeline");
      const iAiredLink = findHeaderIdx(header, "aired link", "airing link");
      const iReupLink = findHeaderIdx(header, "reup link");
      const iBrandReup = findHeaderIdx(header, "brand reup");
      const iView = findHeaderIdx(header, "video views", "views", "view", "sum của view");
      const iLike = findHeaderIdx(header, "like", "paid likes");
      const iComment = findHeaderIdx(header, "comment", "paid comments");
      const iShare = findHeaderIdx(header, "share", "paid shares");
      const iSave = findHeaderIdx(header, "save");
      const iImpressions = findHeaderIdx(header, "impressions", "impression");
      const iPctViewAch = findHeaderIdx(header, "% view achieved");
      const iPctEngAch = findHeaderIdx(header, "% eng achieved (like, cmt, share)", "% eng achieved");
      const iPaidAvgView = findHeaderIdx(header, "paid avg. view", "paid avg view");
      const iPaidPctCompleted = findHeaderIdx(header, "paid % completed view");
      const iCodeAds = findHeaderIdx(header, "code ads");
      const iReupView = findHeaderIdx(header, "reup view");
      const iReupEng = findHeaderIdx(header, "reup eng");
      const iTotalView = findHeaderIdx(header, "total view\n(tt + reup)", "total view (tt + reup)", "total view combined");
      const iTotalEng = findHeaderIdx(header, "total eng.\n(tt + reup)", "total eng. (tt + reup)");

      let iPctViewTotal = -1, iPctEngTotal = -1;
      header.forEach((h, idx) => {
        const hn = (h || "").toLowerCase().trim();
        if (hn === "% view achieved" && idx !== iPctViewAch) iPctViewTotal = idx;
        if ((hn === "% eng. achieved" || hn === "% eng achieved") && idx !== iPctEngAch) iPctEngTotal = idx;
      });

      if (iKol < 0) return;

      sec.rows.forEach(({ rIdx, row }) => {
        const kolName = (row[iKol] || "").toString().trim();
        if (!kolName) return;
        const kolNameLower = kolName.toLowerCase();
        if (kolNameLower === "total" || kolNameLower === "average" || kolNameLower === "kol/koc" || kolNameLower === "ad name") return;

        let rowCampaignRaw = iCampaign >= 0 ? excelCellToStr(row[iCampaign]) : sheetName;
        if (!rowCampaignRaw) rowCampaignRaw = sheetName;
        const campaignKey = normalizeCampaignKey(rowCampaignRaw);
        
        if (!out[campaignKey]) out[campaignKey] = new Map();
        const map = out[campaignKey];

        const key = kolNameLower;
        const existing = map.get(key) || {
          kol: kolName,
          no: rIdx - sec.headerIdx,
        };

        if (iLink >= 0 && row[iLink]) existing.link = excelCellToStr(row[iLink]);
        if (iType >= 0 && row[iType]) existing.type = excelCellToStr(row[iType]);
        if (iFollower >= 0 && row[iFollower]) existing.follower = excelCellToStr(row[iFollower]);
        if (iEstView >= 0 && row[iEstView]) existing.estView = excelCellToCountNum(row[iEstView]);
        if (iEstEng >= 0 && row[iEstEng]) existing.estEng = excelCellToCountNum(row[iEstEng]);
        
        if (iCost >= 0 && row[iCost]) {
          const costVal = excelCellToCountNum(row[iCost]);
          if (costVal > 0) {
            existing.cost = Math.max(existing.cost || 0, costVal);
          }
        }
        
        if (iDateAired >= 0 && row[iDateAired]) existing.ngayAir = excelCellToStr(row[iDateAired]);
        if (iAiredLink >= 0 && row[iAiredLink]) existing.airedLink = getLinkOrText(ws, rIdx, iAiredLink, row[iAiredLink]);
        if (iReupLink >= 0 && row[iReupLink]) existing.reupLink = getLinkOrText(ws, rIdx, iReupLink, row[iReupLink]);
        if (iBrandReup >= 0 && row[iBrandReup]) existing.brandReup = excelCellToStr(row[iBrandReup]);
        
        if (iView >= 0 && row[iView]) existing.views = (existing.views || 0) + excelCellToCountNum(row[iView]);
        if (iLike >= 0 && row[iLike]) existing.likes = (existing.likes || 0) + excelCellToCountNum(row[iLike]);
        if (iComment >= 0 && row[iComment]) existing.comments = (existing.comments || 0) + excelCellToCountNum(row[iComment]);
        if (iShare >= 0 && row[iShare]) existing.shares = (existing.shares || 0) + excelCellToCountNum(row[iShare]);
        if (iSave >= 0 && row[iSave]) existing.saves = (existing.saves || 0) + excelCellToCountNum(row[iSave]);
        if (iImpressions >= 0 && row[iImpressions]) existing.impressions = (existing.impressions || 0) + excelCellToCountNum(row[iImpressions]);
        
        if (iPctViewAch >= 0 && row[iPctViewAch]) existing.pctViewAchieved = excelCellToPercentNum(row[iPctViewAch]);
        if (iPctEngAch >= 0 && row[iPctEngAch]) existing.pctEngAchieved = excelCellToPercentNum(row[iPctEngAch]);
        if (iPctViewTotal >= 0 && row[iPctViewTotal]) existing.pctViewAchievedTotal = excelCellToPercentNum(row[iPctViewTotal]);
        if (iPctEngTotal >= 0 && row[iPctEngTotal]) existing.pctEngAchievedTotal = excelCellToPercentNum(row[iPctEngTotal]);
        if (iPaidAvgView >= 0 && row[iPaidAvgView]) existing.paidAvgView = excelCellToNum(row[iPaidAvgView]);
        if (iPaidPctCompleted >= 0 && row[iPaidPctCompleted]) existing.paidPctCompletedView = excelCellToPercentNum(row[iPaidPctCompleted]);
        if (iCodeAds >= 0 && row[iCodeAds]) existing.codeAds = excelCellToBoolLabel(row[iCodeAds]);
        if (iReupView >= 0 && row[iReupView]) existing.reupViews = (existing.reupViews || 0) + excelCellToCountNum(row[iReupView]);
        if (iReupEng >= 0 && row[iReupEng]) existing.reupEngagement = (existing.reupEngagement || 0) + excelCellToCountNum(row[iReupEng]);
        if (iTotalView >= 0 && row[iTotalView]) existing.totalViewCombined = (existing.totalViewCombined || 0) + excelCellToCountNum(row[iTotalView]);
        if (iTotalEng >= 0 && row[iTotalEng]) existing.totalEngCombined = (existing.totalEngCombined || 0) + excelCellToCountNum(row[iTotalEng]);

        map.set(key, existing);
      });
    });
  });
  return out;
};

// Parse the Media Plan / Raw Ads workbook -> { campaignKey: Map(kolKeyLower -> fields) }
const parseMediaWorkbook = (wb) => {
  const out = {};
  const rawSheets = ["raw", "raw2026", "rawdata"];
  
  wb.SheetNames.forEach(sheetName => {
    const sName = sheetName.trim();
    if (!rawSheets.includes(sName.toLowerCase())) return;
    
    const ws = wb.Sheets[sheetName];
    const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
    if (!aoa.length) return;

    let headerIdx = 0;
    for (let r = 0; r < Math.min(aoa.length, 25); r++) {
      const row = aoa[r];
      if (Array.isArray(row)) {
        const hasCampaignOrAd = row.some(cell => {
          if (!cell) return false;
          const str = cell.toString().toLowerCase();
          return str.includes("campaign") || str.includes("ad name") || str.includes("ad_name");
        });
        if (hasCampaignOrAd) {
          headerIdx = r;
          break;
        }
      }
    }
    
    const header = aoa[headerIdx].map(h => (h || "").toString());
    const iCampaign = findHeaderIdx(header, "campaign name", "campaign");
    const iAdName = findHeaderIdx(header, "ad name", "ad_name", "kol", "creator");
    const iSpend = findHeaderIdx(header, "spend", "cost", "adspend", "ad spend");
    const iImpressions = findHeaderIdx(header, "impressions", "impression");
    const iViews = findHeaderIdx(header, "video views", "video view", "views", "view");
    const iViews2s = findHeaderIdx(header, "2-second video views", "2-second video view", "2s views", "2s view");
    const iViews6s = findHeaderIdx(header, "6-second focused views", "6-second focused view", "6s-focused views", "6-second video views", "6-second video view", "6s views", "6s view");
    const iConversions = findHeaderIdx(header, "conversions", "conversion", "results");
    
    if (iAdName < 0) return;
    
    for (let r = headerIdx + 1; r < aoa.length; r++) {
      const row = aoa[r];
      if (!row) continue;
      
      const adName = (row[iAdName] || "").toString().trim();
      if (!adName) continue;
      
      let campaignRaw = iCampaign >= 0 ? (row[iCampaign] || "").toString() : "";
      if (!campaignRaw) {
        campaignRaw = sheetName;
      }
      const campaignKey = normalizeCampaignKey(campaignRaw);
      
      if (!out[campaignKey]) {
        out[campaignKey] = new Map();
      }
      
      const key = adName.toLowerCase();
      
      // Try to resolve full KOL name from ad code via CUSTOM_INITIALS
      let resolvedKol = adName;
      if (CUSTOM_INITIALS[key] && CUSTOM_INITIALS[key].length > 0) {
        // Use first alias as display name (it's the full Vietnamese name)
        resolvedKol = CUSTOM_INITIALS[key][0];
        // Capitalize first letter of each word
        resolvedKol = resolvedKol.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      
      const existing = out[campaignKey].get(key) || {
        kol: resolvedKol,
        adName: adName,       // preserve the short code
        adSpend: 0,
        impressions: 0,
        views: 0,
        views2s: 0,
        views6s: 0,
        conversions: 0
      };
      
      if (iSpend >= 0) existing.adSpend += excelCellToCountNum(row[iSpend]) || 0;
      if (iImpressions >= 0) existing.impressions += excelCellToCountNum(row[iImpressions]) || 0;
      if (iViews >= 0) existing.views += excelCellToCountNum(row[iViews]) || 0;
      if (iViews2s >= 0) existing.views2s += excelCellToCountNum(row[iViews2s]) || 0;
      if (iViews6s >= 0) existing.views6s += excelCellToCountNum(row[iViews6s]) || 0;
      if (iConversions >= 0) existing.conversions += excelCellToCountNum(row[iConversions]) || 0;
      
      out[campaignKey].set(key, existing);
    }
  });
  
  return out;
};

// Merge internal + social + media maps against existing app data ------------------
// Internal file wins for tracking/process fields; Social Outreach wins for
// performance numbers + aired link/date; Media raw performance wins for ad spend,
// impressions, 2s views, 6s views, and clicks.
const mergeDualFiles = (internalMap, socialMap, mediaMap, existingData) => {
  const campaignKeys = new Set([
    ...Object.keys(internalMap || {}), 
    ...Object.keys(socialMap || {}),
    ...Object.keys(mediaMap || {})
  ]);
  const toUpdate = [];
  const toAdd = [];
  const warnings = [];

  campaignKeys.forEach(campaignKey => {
    const intMap = (internalMap && internalMap[campaignKey]) || new Map();
    const socMap = (socialMap && socialMap[campaignKey]) || new Map();
    const medMap = (mediaMap && mediaMap[campaignKey]) || new Map();
    const allKolKeys = new Set([...intMap.keys(), ...socMap.keys(), ...medMap.keys()]);

    allKolKeys.forEach(kolKey => {
      const intRow = intMap.get(kolKey);
      
      let socRow = socMap.get(kolKey);
      if (!socRow) {
        for (const [sKey, sVal] of socMap.entries()) {
          if (isKolMatch(sKey, kolKey) || isKolMatch(kolKey, sKey)) {
            socRow = sVal;
            break;
          }
        }
      }
      
      let medRow = medMap.get(kolKey);
      if (!medRow) {
        for (const [mKey, mVal] of medMap.entries()) {
          if (isKolMatch(mKey, kolKey) || isKolMatch(kolKey, mKey)) {
            medRow = mVal;
            break;
          }
        }
      }

      const displayName = (intRow && intRow.kol) || (socRow && socRow.kol) || (medRow && medRow.kol) || kolKey;

      const hasBoth = (internalMap && Object.keys(internalMap).length > 0) && (socialMap && Object.keys(socialMap).length > 0);
      if (hasBoth) {
        if (!intRow) warnings.push(`[${campaignKey}] "${displayName}" — chỉ có trong file chỉ số/media (thiếu Status/Chi phí/Nhóm... từ file INTERNAL)`);
        if (!socRow && intRow) warnings.push(`[${campaignKey}] "${displayName}" — chỉ có trong file INTERNAL (chưa có chỉ số hiệu suất từ Social Outreach)`);
      }

      const merged = {};
      if (intRow) Object.assign(merged, intRow);
      if (socRow) {
        Object.assign(merged, {
          estView: socRow.estView, estEng: socRow.estEng,
          views: socRow.views, likes: socRow.likes, comments: socRow.comments, shares: socRow.shares, saves: socRow.saves,
          reupViews: socRow.reupViews, reupEngagement: socRow.reupEngagement,
          totalViewCombined: socRow.totalViewCombined, totalEngCombined: socRow.totalEngCombined,
          pctViewAchieved: socRow.pctViewAchieved, pctEngAchieved: socRow.pctEngAchieved,
          pctViewAchievedTotal: socRow.pctViewAchievedTotal, pctEngAchievedTotal: socRow.pctEngAchievedTotal,
          paidAvgView: socRow.paidAvgView, paidPctCompletedView: socRow.paidPctCompletedView,
          codeAds: socRow.codeAds, reupLink: socRow.reupLink, brandReup: socRow.brandReup,
          impressions: socRow.impressions,
          views6s: socRow.views6s,
        });
        if (socRow.airedLink && /^https?:\/\//i.test(socRow.airedLink)) merged.airedLink = socRow.airedLink;
        if (socRow.ngayAir) merged.ngayAir = socRow.ngayAir;
        if (!merged.kol) merged.kol = socRow.kol;
        if (!merged.follower) merged.follower = socRow.follower;
        if (!merged.type) merged.type = socRow.type;
        if (!merged.link) merged.link = socRow.link;
        if (!merged.cost) merged.cost = socRow.cost;
      }
      
      if (medRow) {
        if (medRow.adSpend > 0) merged.adSpend = medRow.adSpend;
        if (medRow.impressions > 0) merged.impressions = medRow.impressions;
        if (medRow.views2s > 0) merged.views2s = medRow.views2s;
        if (medRow.views6s > 0) merged.views6s = medRow.views6s;
        if (medRow.views > 0 && (!merged.views || merged.views === 0)) {
          merged.views = medRow.views;
        }
        if (!merged.kol) merged.kol = medRow.kol;
        // Carry over the raw ad code for reference
        if (medRow.adName && !merged.adName) merged.adName = medRow.adName;
      }
      
      merged.campaign = campaignKey;
      const seqNo = (intRow && intRow.no) ?? (socRow && socRow.no);
      delete merged.no; // transient field, not part of the row schema

      const existing = existingData.find(r =>
        resolveCampaignKey(r) === campaignKey && (
          (r.kol || "").trim().toLowerCase() === kolKey ||
          isKolMatch(r.kol, displayName)
        )
      );

      if (existing) {
        const changes = {};
        Object.entries(merged).forEach(([k, v]) => {
          if (v === undefined || v === null || v === "") return; // never blank out existing data
          changes[k] = v;
        });
        // Auto-infer "aired" status: if the record has an aired link or air date,
        // but the incoming status is empty or was previously waiting_food, upgrade it.
        const effectiveStatus = changes.statusKey || existing.statusKey;
        const hasAiredLink = (changes.airedLink || existing.airedLink) && /^https?:\/\//i.test(changes.airedLink || existing.airedLink);
        const hasAiredDate = (changes.ngayAir || existing.ngayAir) && (changes.ngayAir || existing.ngayAir).trim() !== "" && (changes.ngayAir || existing.ngayAir).trim() !== "—";
        if ((hasAiredLink || hasAiredDate) && (!effectiveStatus || effectiveStatus === "waiting_food")) {
          changes.statusKey = "aired";
        }
        toUpdate.push({ id: existing.id, kol: existing.kol, campaign: campaignKey, changes });
      } else {
        const newRow = { ...emptyKOL(), ...merged };
        newRow.id = `${campaignKey}-${seqNo || (toAdd.length + 1)}`;
        if (!newRow.statusKey) {
          newRow.statusKey = (newRow.airedLink || newRow.ngayAir) ? "aired" : "waiting_food";
        }
        toAdd.push(newRow);
      }
    });
  });

  return { toUpdate, toAdd, warnings };
};

const DualFileImportModal = ({ existingData, onConfirm, onClose, onImportSingle, statusLabelToKey, statusMap }) => {
  const [step, setStep] = useState("drop"); // drop | error | preview
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [internalFile, setInternalFile] = useState(null); // { name, wb }
  const [socialFile, setSocialFile] = useState(null); // { name, wb }
  const [result, setResult] = useState(null); // { toUpdate, toAdd, warnings }
  const fileRef = useRef(null);

  const processFiles = async (fileList, statusLabelToKey) => {
    const files = Array.from(fileList).filter(f => /\.(xlsx|xls|csv|json)$/i.test(f.name));
    if (files.length === 0) return;

    try {
      const parsed = await Promise.all(files.map(f => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const wb = XLSX.read(ev.target.result, { type: "array", cellDates: true });
            resolve({ name: f.name, wb });
          } catch (err) { reject(err); }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(f);
      })));

      let newInternal = internalFile;
      let newSocial = socialFile;

      if (parsed.length === 1 && !internalFile && !socialFile) {
        // Unified file upload
        newInternal = parsed[0];
        newSocial = parsed[0];
      } else {
        parsed.forEach(p => {
          const roles = detectFileRole(p.wb, p.name);
          if (roles.includes("internal")) {
            newInternal = p;
          } else if (roles.includes("social")) {
            newSocial = p;
          }
        });
      }

      setInternalFile(newInternal);
      setSocialFile(newSocial);
      setError("");
    } catch (err) {
      setError("Lỗi khi đọc file: " + err.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) processFiles(e.dataTransfer.files, statusLabelToKey);
  };

  const handleMergeAndProceed = () => {
    if (!internalFile && !socialFile) return;
    try {
      const internalMap = internalFile ? parseInternalWorkbook(internalFile.wb) : {};
      const socialMap = socialFile ? parseSocialWorkbook(socialFile.wb) : {};
      const merged = mergeDualFiles(internalMap, socialMap, null, existingData);

      const sheetLabels = {};
      [internalFile, socialFile].forEach(file => {
        if (file && file.wb) {
          file.wb.SheetNames.forEach(sheetName => {
            const key = normalizeCampaignKey(sheetName);
            if (CAMPAIGNS.find(c => c.key === key)) {
              sheetLabels[key] = key === "MSG" ? "MGS" : key;
            }
          });
        }
      });
      merged.sheetLabels = sheetLabels;

      setResult(merged);
      setStep("preview");
    } catch (err) {
      setError("Lỗi khi ghép nối dữ liệu: " + err.message);
      setStep("error");
    }
  };

  const perCampaignCounts = useMemo(() => {
    if (!result) return [];
    const map = {};
    result.toUpdate.forEach(u => { map[u.campaign] = map[u.campaign] || { update: 0, add: 0 }; map[u.campaign].update++; });
    result.toAdd.forEach(a => { map[a.campaign] = map[a.campaign] || { update: 0, add: 0 }; map[a.campaign].add++; });
    return Object.entries(map);
  }, [result]);

  return (
    <div className="kt-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="kt-modal kt-anim" style={{ maxWidth: 720 }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              CẬP NHẬT DỮ LIỆU
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)" }}>Ghép nối & Cập nhật Dữ liệu</div>
          </div>
          <button className="kt-btn kt-btn-ghost" onClick={onClose} style={{ padding: "6px 10px" }}>✕</button>
        </div>

        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
          {step === "drop" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Drag drop area */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? "var(--accent)" : "var(--line)"}`,
                  borderRadius: 12, padding: "30px 20px", textAlign: "center", cursor: "pointer",
                  background: dragOver ? "var(--accent-bg)" : "var(--paper)", transition: "all 0.15s"
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
                <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>Kéo thả file Excel vào đây (hoặc bấm để chọn)</div>
                <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4 }}>
                  Có thể kéo thả từng file hoặc cả 2 file cùng lúc
                </div>
                <input ref={fileRef} type="file" multiple accept=".xlsx,.xls,.csv,.json" style={{ display: "none" }}
                  onChange={e => e.target.files.length && processFiles(e.target.files, statusLabelToKey)} />
              </div>

              {/* Status slots */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {/* Slot 1: Internal File */}
                <div style={{
                  flex: "1 1 200px", borderRadius: 10, padding: 12,
                  border: `1px ${internalFile ? "solid var(--line)" : "dashed #CCD3DC"}`,
                  background: internalFile ? "var(--card)" : "#FAFAFB",
                  display: "flex", alignItems: "center", gap: 10
                }}>
                  <div style={{ fontSize: 20 }}>📈</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: "var(--ink-soft)", fontWeight: 700, textTransform: "uppercase" }}>File Kế hoạch (Execution/Internal)</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: internalFile ? "var(--ink)" : "var(--ink-soft)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {internalFile ? internalFile.name : "Chưa tải lên"}
                    </div>
                  </div>
                  {internalFile && (
                    <button className="kt-btn kt-btn-ghost" onClick={(e) => { e.stopPropagation(); setInternalFile(null); }} style={{ padding: "4px 8px", color: "var(--danger)" }}>✕</button>
                  )}
                </div>

                {/* Slot 2: Social File */}
                <div style={{
                  flex: "1 1 200px", borderRadius: 10, padding: 12,
                  border: `1px ${socialFile ? "solid var(--line)" : "dashed #CCD3DC"}`,
                  background: socialFile ? "var(--card)" : "#FAFAFB",
                  display: "flex", alignItems: "center", gap: 10
                }}>
                  <div style={{ fontSize: 20 }}>📊</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: "var(--ink-soft)", fontWeight: 700, textTransform: "uppercase" }}>File Báo cáo (Social Outreach)</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: socialFile ? "var(--ink)" : "var(--ink-soft)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {socialFile ? socialFile.name : "Chưa tải lên"}
                    </div>
                  </div>
                  {socialFile && (
                    <button className="kt-btn kt-btn-ghost" onClick={(e) => { e.stopPropagation(); setSocialFile(null); }} style={{ padding: "4px 8px", color: "var(--danger)" }}>✕</button>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
                <button
                  className="kt-btn kt-btn-primary"
                  disabled={!internalFile && !socialFile}
                  onClick={handleMergeAndProceed}
                  style={{
                    width: "100%", justifyContent: "center", padding: "12px", fontSize: 13,
                    opacity: (!internalFile && !socialFile) ? 0.5 : 1, cursor: (!internalFile && !socialFile) ? "not-allowed" : "pointer"
                  }}
                >
                  ⚡️ {internalFile && socialFile ? "Ghép nối & Kiểm tra dữ liệu" : "Cập nhật với 1 file"}
                </button>
              </div>
            </div>
          )}

          {step === "error" && (
            <div>
              <div style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "14px 16px", borderRadius: 10, fontSize: 13, whiteSpace: "pre-line", lineHeight: 1.6 }}>
                ⚠️ {error}
              </div>
              <button className="kt-btn kt-btn-ghost" style={{ marginTop: 12 }} onClick={() => { setStep("drop"); setError(""); }}>
                ← Thử lại
              </button>
            </div>
          )}

          {step === "preview" && result && (internalFile || socialFile) && (
            <>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {internalFile && (
                  <div style={{ flex: 1, minWidth: 200, background: "var(--paper)", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, color: "var(--ink-soft)", textTransform: "uppercase", fontWeight: 700 }}>File Kế hoạch (Chi tiết/Tiến độ)</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{internalFile.name}</div>
                  </div>
                )}
                {socialFile && (
                  <div style={{ flex: 1, minWidth: 200, background: "var(--paper)", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, color: "var(--ink-soft)", textTransform: "uppercase", fontWeight: 700 }}>File Báo cáo Hiệu suất (Chỉ số)</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{socialFile.name}</div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1, background: "var(--accent-bg)", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)" }}>{result.toUpdate.length}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>dòng sẽ cập nhật</div>
                </div>
                <div style={{ flex: 1, background: "#EBF8F5", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--ok)" }}>{result.toAdd.length}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>KOL mới sẽ thêm</div>
                </div>
              </div>

              {perCampaignCounts.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {perCampaignCounts.map(([ck, c]) => (
                    <span key={ck} className="kt-badge" style={{ background: `${getCampaignColor(ck) || "#888"}22`, color: getCampaignColor(ck) || "#888", border: `1px solid ${getCampaignColor(ck) || "#888"}55` }}>
                      {ck}: {c.update} cập nhật · {c.add} mới
                    </span>
                  ))}
                </div>
              )}

              {result.warnings.length > 0 && (
                <div>
                  <div className="kt-label" style={{ marginBottom: 6, fontSize: 12 }}>⚠️ Cần chú ý ({result.warnings.length})</div>
                  <div style={{ maxHeight: 160, overflowY: "auto", background: "var(--paper)", borderRadius: 10, padding: 12, fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.7 }}>
                    {result.warnings.map((w, i) => <div key={i}>• {w}</div>)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {step === "preview" && (
          <div style={{ padding: "14px 22px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button className="kt-btn kt-btn-ghost" onClick={() => { setStep("drop"); setResult(null); ; }}>← Chọn lại file</button>
            <button className="kt-btn kt-btn-primary" onClick={() => onConfirm(result)}>
              ✅ Xác nhận cập nhật {result.toUpdate.length + result.toAdd.length} dòng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================================================================
   STATUS BADGE
================================================================ */
const StatusBadge = ({ statusKey, statusMap }) => {
  const s = statusMap[statusKey] || { label: statusKey, color: "#888", soft: "#eee" };
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
    fontSize: 12, fontWeight: 600, color: getCampaignColor(campaign) || "#888"
  }}>
    <span style={{
      width: 8, height: 8, borderRadius: "50%",
      background: getCampaignColor(campaign) || "#888", display: "inline-block"
    }} />
    {(labels && labels[campaign])  || campaign}
  </span>
);


/* ================================================================
   STATUS SETTINGS MODAL
================================================================ */
const StatusSettingsModal = ({ statuses, onSave, onClose }) => {
  const [list, setList] = useState([...statuses]);

  const handleChange = (idx, field, val) => {
    const arr = [...list];
    arr[idx][field] = val;
    if (field === "color") arr[idx].soft = val + "22";
    setList(arr);
  };

  const handleAdd = () => {
    setList([...list, { key: "new_status_" + Date.now(), label: "New Status", color: "#888888", soft: "#eeeeee" }]);
  };

  const handleRemove = (idx) => {
    const arr = [...list];
    arr.splice(idx, 1);
    setList(arr);
  };

  return (
    <div className="kt-overlay" style={{ zIndex: 200 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="kt-modal kt-anim" style={{ width: 600, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Cài đặt Trạng thái (Statuses)</h3>
          <button className="kt-btn kt-btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: 10 }}>
          {list.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
              <input className="kt-input" style={{ flex: 1 }} value={s.label} onChange={e => handleChange(i, "label", e.target.value)} placeholder="Tên hiển thị" />
              <input className="kt-input" style={{ flex: 1 }} value={s.key} onChange={e => handleChange(i, "key", e.target.value)} placeholder="Mã nội bộ (key)" disabled={s.key.includes("new_status") ? false : true} title={s.key.includes("new_status") ? "" : "Không nên sửa mã nội bộ cũ để tránh mất liên kết dữ liệu"} />
              <input type="color" value={s.color} onChange={e => handleChange(i, "color", e.target.value)} style={{ width: 36, height: 36, padding: 0, border: "none", borderRadius: 4, cursor: "pointer" }} />
              <button className="kt-btn kt-btn-ghost" style={{ padding: "6px 10px", color: "var(--red)" }} onClick={() => handleRemove(i)}>✕</button>
            </div>
          ))}
          <button className="kt-btn kt-btn-ghost" onClick={handleAdd} style={{ marginTop: 10, width: "100%", border: "1px dashed var(--line)" }}>+ Thêm trạng thái mới</button>
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="kt-btn kt-btn-ghost" onClick={onClose}>Hủy</button>
          <button className="kt-btn kt-btn-primary" onClick={() => onSave(list)}>Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   DETAIL MODAL
================================================================ */
const DetailModal = ({ kol, onClose, onSave, onDelete, statusStages, dynamicCampaigns }) => {
  const [form, setForm] = useState({ ...kol });
  const [isNewCampaign, setIsNewCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCampaignChange = (val) => {
    if (val === "__new__") {
      setIsNewCampaign(true);
      set("campaign", newCampaign || "");
    } else {
      setIsNewCampaign(false);
      set("campaign", val);
    }
  };

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
    <div className="kt-overlay" style={{ zIndex: 110 }} onClick={e => e.target === e.currentTarget && onClose()}>
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
            <div style={{ marginBottom: 14 }}>
              <label className="kt-label">Campaign</label>
              <select
                className="kt-select"
                value={isNewCampaign ? "__new__" : (form.campaign || "")}
                onChange={e => handleCampaignChange(e.target.value)}
              >
                <option value="">—</option>
                {dynamicCampaigns.map(c => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
                <option value="__new__" style={{ fontWeight: "bold", color: "var(--accent)" }}>
                  ✍️ + Thêm dự án mới...
                </option>
              </select>
              {isNewCampaign && (
                <input
                  className="kt-input"
                  style={{ marginTop: 8 }}
                  placeholder="Nhập tên dự án mới..."
                  value={newCampaign}
                  onChange={e => {
                    const val = e.target.value;
                    setNewCampaign(val);
                    set("campaign", val);
                  }}
                />
              )}
            </div>
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
              options={statusStages.map(s => s.key)} />
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
            </div>
          </div>

          {/* Reup & Extended KPI (from Social Outreach file) */}
          <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--line)", paddingTop: 16, marginTop: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px 0", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
              🔁 Reup & KPI mở rộng (Social Outreach)
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
              <Field label="Reup Views" field="reupViews" type="number" />
              <Field label="Reup Engagement" field="reupEngagement" type="number" />
              <Field label="Tổng View (TikTok + Reup)" field="totalViewCombined" type="number" />

              <Field label="Tổng Engagement (TikTok + Reup)" field="totalEngCombined" type="number" />
              <Field label="% View đạt KPI" field="pctViewAchieved" type="number" />
              <Field label="% Eng đạt KPI" field="pctEngAchieved" type="number" />

              <Field label="% View đạt KPI (kèm Reup)" field="pctViewAchievedTotal" type="number" />
              <Field label="% Eng đạt KPI (kèm Reup)" field="pctEngAchievedTotal" type="number" />
              <Field label="Paid Avg. View" field="paidAvgView" type="number" />

              <Field label="Paid % Completed View" field="paidPctCompletedView" type="number" />
              <Field label="Code Ads" field="codeAds" />
              <Field label="Brand Reup" field="brandReup" />

              <Field label="Link Reup" field="reupLink" />
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
const TableView = ({ rows, onOpen, onSave, campaignLabels, statusMap, statusStages }) => {
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
              <td onClick={e => e.stopPropagation()} style={{ padding: "4px 6px" }}>
                <select
                  value={r.type || ""}
                  onChange={e => onSave && onSave(r.id, { type: e.target.value })}
                  onClick={e => e.stopPropagation()}
                  style={{
                    fontSize: 11, fontWeight: 600, border: "1px solid var(--line)",
                    borderRadius: 20, padding: "3px 8px", cursor: "pointer",
                    background: "var(--paper-bg)", color: "var(--ink-soft)",
                    appearance: "none", WebkitAppearance: "none", outline: "none"
                  }}
                >
                  <option value="">—</option>
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </td>
              <td><span className="kt-mono" style={{ fontSize: 12 }}>{r.follower || "—"}</span></td>
              <td><span className="kt-mono" style={{ fontSize: 12, color: "var(--ink)" }}>{fmtVND(r.cost)}</span></td>
              <td onClick={e => e.stopPropagation()} style={{ padding: "4px 6px" }}>
                <select
                  value={r.statusKey || ""}
                  onChange={e => onSave && onSave(r.id, { statusKey: e.target.value })}
                  onClick={e => e.stopPropagation()}
                  style={{
                    fontSize: 11, fontWeight: 600, border: "none", borderRadius: 20,
                    padding: "3px 8px", cursor: "pointer", appearance: "none",
                    WebkitAppearance: "none", outline: "none",
                    background: statusMap[r.statusKey]?.soft || "#eee",
                    color: statusMap[r.statusKey]?.color || "#888"
                  }}
                >
                  {statusStages.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </td>
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
        minWidth: 0,
        width: "100%",
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

const KanbanView = ({ rows, onOpen, onUpdateStatus, campaignLabels, statusStages, statusMap }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${statusStages.length}, minmax(0, 1fr))`, gap: 10, padding: 16, alignItems: "stretch", flex: 1, height: "100%", overflow: "hidden" }}>
    {statusStages.map(stage => {
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
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Default to current system date
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
    setCurrentMonth(new Date());
  };

  // Helper date parsing (supports Excel serial numbers, DD/MM strings, and standard dates)
  const parseDateStr = (str) => {
    if (!str) return null;
    const s = str.toString().trim();
    if (!s || s.startsWith("http")) return null;

    // Handle Excel serial date numbers (e.g. 46234 -> 2026-07-20)
    if (!isNaN(s) && Number(s) > 30000 && Number(s) < 60000) {
      const d = new Date(Math.round((Number(s) - 25569) * 86400 * 1000));
      if (!isNaN(d.getTime())) {
        return { day: d.getDate(), month: d.getMonth(), year: d.getFullYear() };
      }
    }

    // Match DD/MM or DD-MM or DD/MM/YYYY pattern in text
    const match = s.match(/(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?/);
    if (match) {
      const day = parseInt(match[1], 10);
      const m = parseInt(match[2], 10) - 1;
      const y = match[3] ? (match[3].length === 2 ? 2000 + parseInt(match[3], 10) : parseInt(match[3], 10)) : 2026;
      if (day >= 1 && day <= 31 && m >= 0 && m <= 11) {
        return { day, month: m, year: y };
      }
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
    const dt = parseDateStr(r.ngayAir) || parseDateStr(r.ngayGuiDemo) || parseDateStr(r.ngayGuiScript);
    const isAired = r.statusKey === "aired" || r.status === "Đã lên sóng" || (Number(r.views) > 0) || (r.airedLink && r.airedLink.toString().trim().length > 5);
    if (dt) {
      const key = `${dt.year}-${dt.month}-${dt.day}`;
      if (!scheduledMap[key]) scheduledMap[key] = [];
      scheduledMap[key].push(r);
    } else if (!isAired) {
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--card)", borderRadius: 12, border: "1px solid var(--line)", padding: 14, overflow: "hidden" }}>
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
            const todayObj = new Date();
            const isToday = cell.day === todayObj.getDate() && cell.month === todayObj.getMonth() && cell.year === todayObj.getFullYear();
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
                  minHeight: 30,
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
                        borderLeft: `3px solid ${getCampaignColor(r.campaign) || "var(--green)"}`,
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

const ProfileView = ({ rows, onOpenProfile, campaignLabels, dynamicCampaigns, statusStages, statusMap }) => {
  const [search, setSearch] = useState("");
  const [filterCampaign, setFilterCampaign] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [filterPhase, setFilterPhase] = useState("all");
  const [filterCost, setFilterCost] = useState("all");
  const [filterViews, setFilterViews] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  const uniqueKols = useMemo(() => {
    const map = {};
    rows.forEach(r => {
      if (!r.kol || !r.kol.trim()) return;
      const name = r.kol.trim();
      const key = name.toLowerCase();

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

      // Zeitlich phaseTags manually chosen
      (r.phaseTags || "").split(",").map(s => s.trim()).filter(Boolean).forEach(p => entry.phases.add(p));

      entry.campaignDetails.push(r);

      if (!entry.follower && r.follower) entry.follower = r.follower;
      if (!entry.type && r.type) entry.type = r.type;
      if (!entry.location && r.location) entry.location = r.location;
      if (!entry.group && r.group) entry.group = r.group;
      if (!entry.link && r.link) entry.link = r.link;
    });

    return Object.values(map).sort((a, b) => a.kol.localeCompare(b.kol, "vi"));
  }, [rows]);

  const topViewsKols = useMemo(() => {
    return [...uniqueKols]
      .filter(k => k.totalViews > 0)
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 5);
  }, [uniqueKols]);

  const topEngKols = useMemo(() => {
    return [...uniqueKols]
      .map(k => ({
        ...k,
        totalEng: (k.totalLikes || 0) + (k.totalComments || 0) + (k.totalShares || 0)
      }))
      .filter(k => k.totalEng > 0)
      .sort((a, b) => b.totalEng - a.totalEng)
      .slice(0, 5);
  }, [uniqueKols]);

  const topCostKols = useMemo(() => {
    return [...uniqueKols]
      .filter(k => k.totalCost > 0)
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 5);
  }, [uniqueKols]);


  const tierStats = useMemo(() => {
    const counts = {};
    uniqueKols.forEach(k => {
      if (k.type) counts[k.type] = (counts[k.type] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [uniqueKols]);

  const filteredKols = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = uniqueKols.filter(k => {
      if (q && !k.kol.toLowerCase().includes(q)) return false;
      if (filterCampaign !== "all" && !k.campaigns.has(filterCampaign)) return false;
      if (filterTier !== "all" && k.type !== filterTier) return false;
      if (filterPhase !== "all" && !k.phases.has(filterPhase)) return false;
      if (filterCost !== "all") {
        const bucket = COST_BUCKETS.find(b => b.key === filterCost);
        if (bucket && !bucket.test(k.totalCost)) return false;
      }
      if (filterViews !== "all") {
        const bucket = VIEWS_BUCKETS.find(b => b.key === filterViews);
        if (bucket && !bucket.test(k.totalViews)) return false;
      }
      if (filterStatus !== "all" && !k.campaignDetails.some(c => c.statusKey === filterStatus)) return false;
      return true;
    });

    // Apply sorting
    if (sortOrder === "costAsc") {
      result.sort((a, b) => a.totalCost - b.totalCost);
    } else if (sortOrder === "costDesc") {
      result.sort((a, b) => b.totalCost - a.totalCost);
    } else if (sortOrder === "viewAsc") {
      result.sort((a, b) => a.totalViews - b.totalViews);
    } else if (sortOrder === "viewDesc") {
      result.sort((a, b) => b.totalViews - a.totalViews);
    } // else "default" which is already sorted alphabetically by KOL name in uniqueKols

    return result;
  }, [uniqueKols, search, filterCampaign, filterTier, filterPhase, filterCost, filterViews, filterStatus, sortOrder]);

  const hasActiveFilters = !!search.trim() || filterCampaign !== "all" || filterTier !== "all" ||
    filterPhase !== "all" || filterCost !== "all" || filterViews !== "all" || filterStatus !== "all";

  const clearFilters = () => {
    setSearch(""); setFilterCampaign("all"); setFilterTier("all");
    setFilterPhase("all"); setFilterCost("all"); setFilterViews("all");
    setFilterStatus("all"); setSortOrder("default");
  };

  const summary = useMemo(() => ({
    count: filteredKols.length,
    totalCost: filteredKols.reduce((s, k) => s + k.totalCost, 0),
    totalViews: filteredKols.reduce((s, k) => s + k.totalViews, 0),
    totalEng: filteredKols.reduce((s, k) => s + ((k.totalLikes || 0) + (k.totalComments || 0) + (k.totalShares || 0)), 0),
  }), [filteredKols]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* ── PINNED: Dashboard summary + filter bar stay visible ── */}
      <div style={{ background: "var(--card)", padding: "20px 20px 16px", borderBottom: "1px solid var(--line)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Hồ sơ KOL", value: summary.count, color: "var(--ink)" },
            { label: "Tổng chi phí", value: fmtVND(summary.totalCost), color: "var(--accent)" },
            { label: "Tổng Views", value: summary.totalViews.toLocaleString(), color: "var(--blue)" },
            { label: "Tổng Tương tác", value: summary.totalEng.toLocaleString(), color: "var(--ok)" },
          ].map(s => (
            <div key={s.label} className="kt-card" style={{ padding: "10px 16px", flex: "1 1 160px", minWidth: 160, boxSizing: "border-box" }}>
              <div style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                {s.label}
              </div>
              <div className="kt-display" style={{ fontSize: 20, color: s.color, marginTop: 2 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="kt-scrollbar" style={{ display: "flex", gap: 8, flexWrap: "nowrap", alignItems: "center", overflowX: "auto", paddingBottom: 4 }}>
          <input
            className="kt-input"
            placeholder="🔍 Tìm tên KOL..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: "0 0 140px", width: 140 }}
          />
          <select className="kt-select" value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)} style={{ flex: "0 0 120px", width: 120 }}>
            <option value="all">Tất cả Dự án</option>
            {dynamicCampaigns.map(c => <option key={c.key} value={c.key}>{campaignLabels[c.key] || c.label}</option>)}
          </select>
          <select className="kt-select" value={filterTier} onChange={e => setFilterTier(e.target.value)} style={{ flex: "0 0 110px", width: 110 }}>
            <option value="all">Tất cả Tier</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select className="kt-select" value={filterPhase} onChange={e => setFilterPhase(e.target.value)} style={{ flex: "0 0 130px", width: 130 }}>
            <option value="all">Tất cả Thời điểm</option>
            <option value="Phase 1">Phase 1</option>
            <option value="Phase 2">Phase 2</option>
          </select>
          <select className="kt-select" value={filterCost} onChange={e => setFilterCost(e.target.value)} style={{ flex: "0 0 120px", width: 120 }}>
            <option value="all">Tất cả Chi phí</option>
            {COST_BUCKETS.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
          </select>
          <select className="kt-select" value={filterViews} onChange={e => setFilterViews(e.target.value)} style={{ flex: "0 0 120px", width: 120 }}>
            <option value="all">Tất cả Views</option>
            {VIEWS_BUCKETS.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
          </select>
          <select className="kt-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ flex: "0 0 130px", width: 130 }}>
            <option value="all">Tất cả Tiến độ</option>
            {statusStages.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <select className="kt-select" value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ flex: "0 0 150px", width: 150, background: "var(--surface)", border: "1px solid var(--line)" }}>
            <option value="default">Sắp xếp: Mặc định (A-Z)</option>
            <option value="costAsc">Chi phí: Thấp ➝ Cao</option>
            <option value="costDesc">Chi phí: Cao ➝ Thấp</option>
            <option value="viewAsc">Lượt xem: Thấp ➝ Cao</option>
            <option value="viewDesc">Lượt xem: Cao ➝ Thấp</option>
          </select>
          {hasActiveFilters && (
            <button className="kt-btn kt-btn-ghost" onClick={clearFilters} style={{ flex: "0 0 auto", padding: "8px 14px", whiteSpace: "nowrap" }}>
              ✕ Xoá lọc
            </button>
          )}
        </div>
      </div>

      {/* ── SPLIT BODY ── */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        
        {/* Left Column: KOL Cards Grid */}
        <div className="kt-scrollbar" style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
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

                  <div style={{ display: "flex", flexWrap: "wrap", columnGap: 16, rowGap: 4, fontSize: 12, color: "var(--ink-soft)" }}>
                    <span>Followers <strong style={{ color: "var(--ink)" }}>{k.follower || "—"}</strong></span>
                    <span>Nhóm <strong style={{ color: "var(--ink)" }}>{k.group || "—"}</strong></span>
                  </div>

                  {campaignsArr.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", borderTop: "1px dashed var(--line)", paddingTop: 10 }}>
                      {campaignsArr.map(c => (
                        <CampaignDot key={c} campaign={c} labels={campaignLabels} />
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", fontSize: 11 }}>
                    {phasesArr.length > 0 ? (
                      phasesArr.map(p => (
                        <span key={p} className="kt-badge" style={{ background: p === "Phase 1" ? "#FFAFA322" : "#A2C2E822", color: p === "Phase 1" ? "#D4826A" : "#4F83E1", border: `1px solid ${p === "Phase 1" ? "#FFAFA355" : "#4F83E155"}`, fontSize: 10 }}>
                          {p}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: "var(--ink-faint)" }}>Chưa chọn thời điểm hợp tác</span>
                    )}
                  </div>

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
                    style={{ width: "100%", justifyContent: "center", padding: "6px", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span>Chi tiết chiến dịch</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
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

        {/* Right Column: Leaderboard Sidebar */}
        <div className="kt-scrollbar" style={{ width: 340, minWidth: 340, borderLeft: "1px solid var(--line)", background: "var(--card)", padding: 20, display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}>
          
          {/* Section 1: Views Leaderboard */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#F59E0B" }}><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              BXH Lượt Xem (Views)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topViewsKols.map((k, idx) => {
                const maxVal = topViewsKols[0]?.totalViews || 1;
                const ratio = Math.min(100, Math.max(5, (k.totalViews / maxVal) * 100));
                const colors = ["#F59E0B", "#94A3B8", "#B45309", "var(--ink-soft)", "var(--ink-soft)"];
                const rankLabels = ["1st", "2nd", "3rd", "4th", "5th"];
                return (
                  <div key={k.kol} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: colors[idx], width: 22 }}>{rankLabels[idx]}</span>
                        <span onClick={() => onOpenProfile(k)} style={{ fontWeight: 600, color: "var(--ink)", cursor: "pointer", textDecoration: "underline" }} className="kt-hover-accent">
                          {k.kol}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: "var(--blue)", fontWeight: 700 }}>
                        {k.totalViews >= 1000000 ? `${(k.totalViews / 1000000).toFixed(1)}M` : k.totalViews.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ height: 4, background: "var(--line)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${ratio}%`, height: "100%", background: "var(--blue)", borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
              {topViewsKols.length === 0 && <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>Chưa có dữ liệu</span>}
            </div>
          </div>

          {/* Section 2: Engagement Leaderboard */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ok)" }}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
              BXH Tương Tác (Eng)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topEngKols.map((k, idx) => {
                const maxVal = topEngKols[0]?.totalEng || 1;
                const ratio = Math.min(100, Math.max(5, (k.totalEng / maxVal) * 100));
                const colors = ["#F59E0B", "#94A3B8", "#B45309", "var(--ink-soft)", "var(--ink-soft)"];
                const rankLabels = ["1st", "2nd", "3rd", "4th", "5th"];
                return (
                  <div key={k.kol} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: colors[idx], width: 22 }}>{rankLabels[idx]}</span>
                        <span onClick={() => onOpenProfile(k)} style={{ fontWeight: 600, color: "var(--ink)", cursor: "pointer", textDecoration: "underline" }} className="kt-hover-accent">
                          {k.kol}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: "var(--ok)", fontWeight: 700 }}>
                        {k.totalEng >= 1000000 ? `${(k.totalEng / 1000000).toFixed(1)}M` : k.totalEng.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ height: 4, background: "var(--line)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${ratio}%`, height: "100%", background: "var(--ok)", borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
              {topEngKols.length === 0 && <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>Chưa có dữ liệu</span>}
            </div>
          </div>

          {/* Section 3: Cost Leaderboard */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              BXH Ngân Sách Booking
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topCostKols.map((k, idx) => {
                const maxVal = topCostKols[0]?.totalCost || 1;
                const ratio = Math.min(100, Math.max(5, (k.totalCost / maxVal) * 100));
                const colors = ["#F59E0B", "#94A3B8", "#B45309", "var(--ink-soft)", "var(--ink-soft)"];
                const rankLabels = ["1st", "2nd", "3rd", "4th", "5th"];
                return (
                  <div key={k.kol} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: colors[idx], width: 22 }}>{rankLabels[idx]}</span>
                        <span onClick={() => onOpenProfile(k)} style={{ fontWeight: 600, color: "var(--ink)", cursor: "pointer", textDecoration: "underline" }} className="kt-hover-accent">
                          {k.kol}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>
                        {fmtVND(k.totalCost)}
                      </span>
                    </div>
                    <div style={{ height: 4, background: "var(--line)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${ratio}%`, height: "100%", background: "var(--accent)", borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
              {topCostKols.length === 0 && <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>Chưa có dữ liệu</span>}
            </div>
          </div>

          {/* Section 3: Tier Distribution */}
          <div style={{ borderTop: "1px dashed var(--line)", paddingTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              Phân Bổ Phân Hạng Tier
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tierStats.map(([tier, count]) => {
                const total = uniqueKols.length || 1;
                const ratio = (count / total) * 100;
                return (
                  <div key={tier} style={{ fontSize: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontWeight: 600, color: "var(--ink)" }}>{tier}</span>
                      <span style={{ color: "var(--ink-soft)" }}><strong>{count}</strong> KOLs ({Math.round(ratio)}%)</span>
                    </div>
                    <div style={{ height: 6, background: "var(--line)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${ratio}%`, height: "100%", background: "var(--accent)", borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

/* ================================================================
   MEDIA PERFORMANCE VIEW (ADS PERFORMANCE OVERVIEW PAGE)
================================================================ */
const MediaPerformanceView = ({ rows, onOpenProfile, campaignLabels, search = "", filterCampaign = "all" }) => {

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (filterCampaign !== "all" && resolveCampaignKey(r) !== filterCampaign) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const kolMatch = (r.kol || "").toLowerCase().includes(q);
        const campMatch = (r.campaign || "").toLowerCase().includes(q);
        if (!kolMatch && !campMatch) return false;
      }
      return true;
    });
  }, [rows, filterCampaign, search]);

  const summary = useMemo(() => {
    const totalSpend = filtered.reduce((s, r) => s + (Number(r.adSpend || r.spend) || 0), 0);
    const totalImpressions = filtered.reduce((s, r) => s + (Number(r.impressions) || 0), 0);
    const totalViews = filtered.reduce((s, r) => s + (Number(r.views) || 0), 0);
    const total2s = filtered.reduce((s, r) => s + (Number(r.views2s) || 0), 0);
    const total6s = filtered.reduce((s, r) => s + (Number(r.views6s || r.views) || 0), 0);
    const avgCp6s = total6s > 0 ? Math.round(totalSpend / total6s) : 0;
    const avgVr = totalImpressions > 0 ? ((total6s / totalImpressions) * 100).toFixed(2) + "%" : "—";
    return { totalSpend, totalImpressions, totalViews, total2s, total6s, avgCp6s, avgVr };
  }, [filtered]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Summary Header */}
      <div style={{ background: "var(--card)", padding: "20px 20px 16px", borderBottom: "1px solid var(--line)", flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
          HIỆU SUẤT MEDIA (ADS PERFORMANCE OVERVIEW)
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Spend Ads (Ngân sách QC)", value: fmtVND(summary.totalSpend), color: "var(--accent)" },
            { label: "Impression", value: summary.totalImpressions > 0 ? summary.totalImpressions.toLocaleString() : "—", color: "var(--ink)" },
            { label: "Total Views", value: summary.totalViews > 0 ? summary.totalViews.toLocaleString() : "—", color: "var(--blue)" },
            { label: "2s Views", value: summary.total2s > 0 ? summary.total2s.toLocaleString() : "—", color: "var(--ink-mid)" },
            { label: "6s-Focused Views", value: summary.total6s > 0 ? summary.total6s.toLocaleString() : "—", color: "var(--blue)" },
            { label: "CP 6s-Focused Views", value: summary.avgCp6s > 0 ? `${summary.avgCp6s} đ` : "—", color: "var(--ok)" },
            { label: "VR (View Rate)", value: summary.avgVr, color: "#6366F1" },
          ].map(s => (
            <div key={s.label} className="kt-card" style={{ padding: "10px 16px", flex: "1 1 140px", minWidth: 140, boxSizing: "border-box" }}>
              <div style={{ fontSize: 10, color: "var(--ink-soft)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                {s.label}
              </div>
              <div className="kt-display" style={{ fontSize: 18, color: s.color, marginTop: 4 }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
            Hiển thị: <strong>{filtered.length}</strong> kết quả
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div className="kt-card" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
          <div style={{ flex: 1, overflow: "auto" }} className="kt-scrollbar">
            <table className="kt-table kt-table-sticky" style={{ width: "100%", fontSize: 13 }}>
              <thead>
                <tr>
                  <th>Dự án</th>
                  <th>KOL / KOC</th>
                  <th style={{ whiteSpace: "nowrap" }}>Ad Name</th>
                  <th>Spend Ads</th>
                  <th>Impression</th>
                  <th>Total Views</th>
                  <th>2s Views</th>
                  <th>6s-Focused Views</th>
                  <th>CP 6s-Focused Views</th>
                  <th>VR</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const spend = Number(r.adSpend || r.spend) || 0;
                  const imp = Number(r.impressions) || 0;
                  const totalV = Number(r.views) || 0;
                  const v2s = Number(r.views2s) || 0;
                  const v6s = Number(r.views6s || r.views) || 0;
                  const cp6s = (v6s > 0 && spend > 0) ? Math.round(spend / v6s) : 0;
                  const vr = r.vr ? r.vr : (imp > 0 && v6s > 0 ? ((v6s / imp) * 100).toFixed(2) + "%" : "—");
                  return (
                    <tr key={r.id || i} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 600 }}>
                        <CampaignDot campaign={r.campaign} labels={campaignLabels} />
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--ink)", cursor: "pointer" }} onClick={() => onOpenProfile && onOpenProfile(r)}>
                        {r.kol}
                      </td>
                      <td style={{ padding: "12px 14px", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <span className="kt-mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>{r.adName || "—"}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--accent)" }}>{spend > 0 ? fmtVND(spend) : "—"}</td>
                      <td style={{ padding: "12px 14px" }}>{imp > 0 ? imp.toLocaleString() : "—"}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--blue)" }}>{totalV > 0 ? totalV.toLocaleString() : "—"}</td>
                      <td style={{ padding: "12px 14px" }}>{v2s > 0 ? v2s.toLocaleString() : "—"}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--blue)" }}>{v6s > 0 ? v6s.toLocaleString() : "—"}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--ok)" }}>{cp6s > 0 ? `${cp6s} đ` : "—"}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "#6366F1" }}>{vr}</td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center", padding: "40px", color: "var(--ink-soft)" }}>
                      Chưa có dữ liệu Hiệu suất Media nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileDetailModal = ({ kol, onClose, campaignLabels, onSaveProfile, onOpenRow, statusMap }) => {
  const [form, setForm] = useState({
    kol: kol.kol || "", follower: kol.follower || "", type: kol.type || "",
    group: kol.group || "", link: kol.link || "",
    phase: Array.from(kol.phases || []),
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const togglePhase = (p) => setForm(f => ({
    ...f, phase: f.phase.includes(p) ? f.phase.filter(x => x !== p) : [...f.phase, p]
  }));

  const [avatarUrl, setAvatarUrl] = useState(kol.avatarUrl || "");
  const [avatarLoading, setAvatarLoading] = useState(false);

  const fetchTikTokAvatar = async () => {
    const link = form.link || kol.link || "";
    if (!link) return;
    setAvatarLoading(true);
    try {
      const tiktokUrl = encodeURIComponent(link.trim());
      const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(`https://www.tiktok.com/oembed?url=${link.trim()}`)}` ;
      const res = await fetch(proxyUrl);
      const json = await res.json();
      const imgUrl = json.thumbnail_url;
      if (imgUrl) {
        setAvatarUrl(imgUrl);
      }
    } catch (e) {
      // fallback silently
    }
    setAvatarLoading(false);
  };

  const stats = useMemo(() => {
    const details = kol.campaignDetails || [];
    const cost = details.reduce((sum, c) => sum + (Number(c.cost) || 0), 0);
    const views = details.reduce((sum, c) => sum + (Number(c.views || c.views6s) || 0), 0);
    const likes = details.reduce((sum, c) => sum + (Number(c.likes) || 0), 0);
    const comments = details.reduce((sum, c) => sum + (Number(c.comments) || 0), 0);
    const shares = details.reduce((sum, c) => sum + (Number(c.shares) || 0), 0);
    const saves = details.reduce((sum, c) => sum + (Number(c.saves) || 0), 0);
    const totalEng = likes + comments + shares + saves;
    return { cost, views, totalEng };
  }, [kol.campaignDetails]);

  const handleSaveClick = () => {
    if (!form.kol.trim()) {
      window.alert("Tên KOL không được để trống.");
      return;
    }
    onSaveProfile(kol.kol, {
      kol: form.kol.trim(), follower: form.follower.trim(), type: form.type,
      group: form.group.trim(), link: form.link.trim(),
      phaseTags: form.phase.join(","),
      avatarUrl: avatarUrl,
    });
    onClose();
  };

  return (
    <div className="kt-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="kt-modal kt-anim" style={{ maxWidth: 980, width: "95%", borderRadius: 2 }}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              HỒ SƠ CHI TIẾT KOL (CHỈNH SỬA TRỰC TIẾP)
            </div>
          </div>
          <button className="kt-btn kt-btn-ghost" onClick={onClose} style={{ padding: "6px 10px" }}>✕</button>
        </div>

        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, alignItems: "stretch" }}>
            {/* Left Column: Basic Info Card (Editable In-Place) */}
            <div style={{ background: "var(--paper)", padding: 18, borderRadius: 12, border: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    onClick={fetchTikTokAvatar}
                    title="Bấm để lấy ảnh từ TikTok"
                    style={{
                      width: 52, height: 52, borderRadius: "50%", overflow: "hidden",
                      background: avatarUrl ? "transparent" : "linear-gradient(135deg, var(--accent) 0%, #6858E0 100%)",
                      color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20, fontWeight: 800, flexShrink: 0, cursor: "pointer",
                      border: "2px solid var(--line)", transition: "opacity 0.15s",
                      opacity: avatarLoading ? 0.5 : 1
                    }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={form.kol} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={() => setAvatarUrl("")} />
                    ) : avatarLoading ? (
                      <span style={{ fontSize: 18 }}>⏳</span>
                    ) : (
                      (form.kol || "K").charAt(0).toUpperCase()
                    )}
                  </div>
                  {/* Fetch button badge */}
                  <div
                    onClick={fetchTikTokAvatar}
                    title="Lấy ảnh từ TikTok"
                    style={{
                      position: "absolute", bottom: -2, right: -2,
                      width: 18, height: 18, borderRadius: "50%", cursor: "pointer",
                      background: "var(--accent)", color: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, border: "2px solid var(--card)"
                    }}
                  >
                    {avatarLoading ? "…" : "↺"}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <label className="kt-label" style={{ fontSize: 9, color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 2 }}>Tên KOL</label>
                  <input className="kt-input" value={form.kol} onChange={e => set("kol", e.target.value)} style={{ fontWeight: 700, fontSize: 13, padding: "4px 8px", width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ borderTop: "1px dashed var(--line)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                <div>
                  <label className="kt-label" style={{ fontSize: 9, color: "var(--ink-soft)", textTransform: "uppercase", marginBottom: 2 }}>Phân hạng Tier</label>
                  <select className="kt-select" value={form.type} onChange={e => set("type", e.target.value)} style={{ fontWeight: 600, fontSize: 12, padding: "4px 8px", width: "100%" }}>
                    <option value="">—</option>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ color: "var(--ink-soft)", fontSize: 12 }}>Followers:</span>
                  <input className="kt-input" value={form.follower} onChange={e => set("follower", e.target.value)} style={{ width: 120, textAlign: "right", padding: "3px 6px", fontSize: 12 }} />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ color: "var(--ink-soft)", fontSize: 12 }}>Nhóm:</span>
                  <input className="kt-input" value={form.group} onChange={e => set("group", e.target.value)} style={{ width: 120, textAlign: "right", padding: "3px 6px", fontSize: 12 }} />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ color: "var(--ink-soft)", fontSize: 12 }}>Link TikTok:</span>
                  <input className="kt-input" value={form.link} onChange={e => set("link", e.target.value)} style={{ width: 120, textAlign: "right", padding: "3px 6px", fontSize: 12 }} />
                </div>
              </div>

              <div style={{ borderTop: "1px dashed var(--line)", paddingTop: 10, marginTop: "auto" }}>
                <div style={{ fontSize: 10, color: "var(--ink-soft)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.02em" }}>Thời điểm hợp tác</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[
                    { key: "Phase 1", label: "Phase 1", color: "#D4826A", bg: "#FFAFA3" },
                    { key: "Phase 2", label: "Phase 2", color: "#4F83E1", bg: "#A2C2E8" },
                  ].map(p => {
                    const active = form.phase.includes(p.key);
                    return (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => togglePhase(p.key)}
                        className="kt-btn"
                        style={{
                          flex: 1, padding: "5px 4px", fontSize: 10, fontWeight: 600,
                          border: `1px solid ${active ? p.color : "var(--line)"}`,
                          background: active ? `${p.bg}22` : "var(--card)",
                          color: active ? p.color : "var(--ink-soft)",
                          justifyContent: "center"
                        }}
                      >
                        {active ? "✓ " : ""}{p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Performance Summary Dashboard (4 Core KOL Cards) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Hiệu suất tổng hợp</div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, flex: 1 }}>
                <div className="kt-card" style={{ padding: "14px", background: "var(--card)", border: "1px solid var(--line)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 600 }}>COST (NGÂN SÁCH)</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent)", marginTop: 6 }}>{fmtVND(stats.cost)}</div>
                </div>
                <div className="kt-card" style={{ padding: "14px", background: "var(--card)", border: "1px solid var(--line)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 600 }}>FOLLOWER</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)", marginTop: 6 }}>{form.follower || "—"}</div>
                </div>
                <div className="kt-card" style={{ padding: "14px", background: "var(--card)", border: "1px solid var(--line)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 600 }}>VIEW (LƯỢT XEM)</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--blue)", marginTop: 6 }}>{stats.views.toLocaleString()}</div>
                </div>
                <div className="kt-card" style={{ padding: "14px", background: "var(--card)", border: "1px solid var(--line)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 600 }}>TOTAL ENG. (LIKE, CMT, SHARE)</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--ok)", marginTop: 6 }}>{stats.totalEng ? stats.totalEng.toLocaleString() : "—"}</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="kt-label" style={{ marginBottom: 8, fontSize: 12 }}>CAMPAIGN HISTORY & DETAILED PERFORMANCE</div>
            <div style={{ border: "1px solid var(--line)", borderRadius: 10, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, tableLayout: "auto" }}>
                <thead>
                  <tr style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)" }}>
                    <th style={{ padding: "8px 4px", textAlign: "left", fontSize: 9, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", wordBreak: "break-word" }}>Campaign</th>
                    <th style={{ padding: "8px 4px", textAlign: "left", fontSize: 9, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", wordBreak: "break-word" }}>Dish</th>
                    <th style={{ padding: "8px 4px", textAlign: "right", fontSize: 9, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", wordBreak: "break-word" }}>Budget</th>
                    <th style={{ padding: "8px 4px", textAlign: "center", fontSize: 9, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", wordBreak: "break-word" }}>Status</th>
                    <th style={{ padding: "8px 4px", textAlign: "center", fontSize: 9, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", wordBreak: "break-word" }}>Est. View</th>
                    <th style={{ padding: "8px 4px", textAlign: "center", fontSize: 9, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", wordBreak: "break-word" }}>Est. Eng</th>
                    <th style={{ padding: "8px 4px", textAlign: "center", fontSize: 9, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", wordBreak: "break-word" }}>View</th>
                    <th style={{ padding: "8px 4px", textAlign: "center", fontSize: 9, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", wordBreak: "break-word" }}>Total Eng (L+C+S)</th>
                    <th style={{ padding: "8px 4px", textAlign: "center", fontSize: 9, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", wordBreak: "break-word" }}>% View Achieved</th>
                    <th style={{ padding: "8px 4px", textAlign: "center", fontSize: 9, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", wordBreak: "break-word" }}>% Eng Achieved</th>
                    <th style={{ padding: "8px 4px", textAlign: "center", fontSize: 9, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", wordBreak: "break-word" }}>Paid Avg. View</th>
                    <th style={{ padding: "8px 4px", textAlign: "center", fontSize: 9, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", wordBreak: "break-word" }}>Paid % Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {(kol.campaignDetails || []).map((c, i) => {
                    const totalEng = (Number(c.likes) || 0) + (Number(c.comments) || 0) + (Number(c.shares) || 0);
                    
                    const formatPercent = (v) => {
                      if (v === undefined || v === null || v === "") return "—";
                      const num = Number(v);
                      if (isNaN(num)) return "—";
                      return num.toFixed(1) + "%";
                    };

                    const viewAch = c.pctViewAchieved !== undefined && c.pctViewAchieved !== null && c.pctViewAchieved !== ""
                      ? formatPercent(c.pctViewAchieved)
                      : (c.estView > 0 && c.views > 0 ? ((c.views / c.estView) * 100).toFixed(1) + "%" : "—");

                    const engAch = c.pctEngAchieved !== undefined && c.pctEngAchieved !== null && c.pctEngAchieved !== ""
                      ? formatPercent(c.pctEngAchieved)
                      : (c.estEng > 0 && totalEng > 0 ? ((totalEng / c.estEng) * 100).toFixed(1) + "%" : "—");

                    return (
                      <tr key={i} style={{ borderBottom: "1px solid var(--line)", cursor: "pointer" }} onClick={() => { if(onOpenRow) onOpenRow(c); }} className="kt-tr-hover">
                        <td style={{ padding: "8px 4px", fontWeight: 600, whiteSpace: "nowrap", textAlign: "left" }}>
                          <CampaignDot campaign={c.campaign} labels={campaignLabels} />
                        </td>
                        <td title={c.monAn} style={{ padding: "8px 4px", color: "var(--ink-soft)", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left" }}>
                          {c.monAn || "—"}
                        </td>
                        <td style={{ padding: "8px 4px", fontWeight: 600, color: "var(--accent)", whiteSpace: "nowrap", textAlign: "right" }}>{fmtVND(c.cost)}</td>
                        <td style={{ padding: "8px 4px", whiteSpace: "nowrap", textAlign: "center" }}>
                          <StatusBadge statusKey={c.statusKey} statusMap={statusMap} />
                        </td>
                        <td style={{ padding: "8px 4px", whiteSpace: "nowrap", textAlign: "center" }}>{c.estView > 0 ? c.estView.toLocaleString() : "—"}</td>
                        <td style={{ padding: "8px 4px", whiteSpace: "nowrap", textAlign: "center" }}>{c.estEng > 0 ? c.estEng.toLocaleString() : "—"}</td>
                        <td style={{ padding: "8px 4px", whiteSpace: "nowrap", fontWeight: 600, color: "var(--blue)", textAlign: "center" }}>{c.views > 0 ? c.views.toLocaleString() : "—"}</td>
                        <td style={{ padding: "8px 4px", whiteSpace: "nowrap", fontWeight: 600, color: "var(--ok)", textAlign: "center" }}>{totalEng > 0 ? totalEng.toLocaleString() : "—"}</td>
                        <td style={{ padding: "8px 4px", whiteSpace: "nowrap", textAlign: "center" }}>{viewAch}</td>
                        <td style={{ padding: "8px 4px", whiteSpace: "nowrap", textAlign: "center" }}>{engAch}</td>
                        <td style={{ padding: "8px 4px", whiteSpace: "nowrap", textAlign: "center" }}>{c.paidAvgView > 0 ? c.paidAvgView.toLocaleString() : "—"}</td>
                        <td style={{ padding: "8px 4px", whiteSpace: "nowrap", textAlign: "center" }}>{formatPercent(c.paidPctCompletedView)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="kt-btn kt-btn-ghost" onClick={onClose}>Huỷ bỏ</button>
          <button className="kt-btn kt-btn-primary" onClick={handleSaveClick}>💾 Lưu hồ sơ</button>
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

      // Auto-migrate historical decimal ratios to raw percentage scale (runs once per client session)
      const migrationVersion = "v6_unconditional";
      const isMigrated = localStorage.getItem("kol_pct_migrated") === migrationVersion;
      
      let migrated = cleaned;
      if (!isMigrated) {
        migrated = cleaned.map(r => {
          const updateVal = (val) => {
            if (val === undefined || val === null || val === "") return val;
            const num = Number(val);
            if (isNaN(num)) return val;
            // Since historical values in DB were unmultiplied decimal ratios (e.g. 0.7093, 8.5),
            // we must scale them by 100 to align with the new raw percentage format.
            return num * 100;
          };

          return {
            ...r,
            pctViewAchieved: updateVal(r.pctViewAchieved),
            pctEngAchieved: updateVal(r.pctEngAchieved),
            pctViewAchievedTotal: updateVal(r.pctViewAchievedTotal),
            pctEngAchievedTotal: updateVal(r.pctEngAchievedTotal),
            paidPctCompletedView: updateVal(r.paidPctCompletedView)
          };
        });
        try {
          localStorage.setItem("kol_pct_migrated", migrationVersion);
          localStorage.setItem(LS_KEY, JSON.stringify(migrated));
        } catch (e) {
          console.error("Failed to write migrated data:", e);
        }
      }

      return migrated;
    } catch {
      return SEED_DATA;
    }
  });
    const [campaignLabels, setCampaignLabels] = useState(() => {
    try {
      const s = localStorage.getItem("kol_campaign_labels");
      return s ? JSON.parse(s) : {
        AM: "AM",
        AX: "AX",
        Vinegar: "Vinegar",
        MSG: "MGS",
        Blendy: "Blendy"
      };
    } catch {
      return {
        AM: "AM",
        AX: "AX",
        Vinegar: "Vinegar",
        MSG: "MGS",
        Blendy: "Blendy"
      };
    }
  });

  const [statusStages, setStatusStages] = useState(() => {
    try {
      const s = localStorage.getItem("kol_status_stages");
      return s ? JSON.parse(s) : DEFAULT_STATUS_STAGES;
    } catch {
      return DEFAULT_STATUS_STAGES;
    }
  });

  const statusMap = useMemo(() => Object.fromEntries(statusStages.map(s => [s.key, s])), [statusStages]);
  const statusLabelToKey = useMemo(() => {
    return Object.fromEntries([
      ...statusStages.map(s => [s.label.toLowerCase(), s.key]),
      ...statusStages.map(s => [s.key.toLowerCase(), s.key])
    ]);
  }, [statusStages]);
  
  const [showStatusSettings, setShowStatusSettings] = useState(false);

  const dynamicCampaigns = useMemo(() => {
    const uniqueKeys = Array.from(new Set([
      ...Object.keys(campaignLabels),
      ...data.map(d => d.campaign).filter(Boolean)
    ]));
    return uniqueKeys.map(key => ({
      key,
      label: campaignLabels[key] || key
    }));
  }, [data, campaignLabels]);


const [view, setView] = useState("table");
  const [selectedProfile, setSelectedProfile] = useState(null); // "table" | "kanban"
  const [search, setSearch] = useState("");
  const [filterCampaign, setFilterCampaign] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState(null); // { msg, ok }
  const [showShareModal, setShowShareModal] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get("share");
    if (shareId) {
      setLoadingShare(true);
      fetch(`https://dpaste.com/${shareId.trim()}.txt`)
        .then(res => {
          if (!res.ok) throw new Error("Không thể tải link chia sẻ.");
          return res.json();
        })
        .then(sharedData => {
          if (Array.isArray(sharedData)) {
            rawSetData(sharedData);
            showToast("📥 Đã đồng bộ dữ liệu trực tuyến thành công!");
          } else {
            showToast("⚠️ Dữ liệu chia sẻ không hợp lệ.", false);
          }
        })
        .catch(err => {
          showToast(`❌ Lỗi: ${err.message}`, false);
        })
        .finally(() => {
          setLoadingShare(false);
        });
    }
  }, []);






  const [wizardData, setWizardData] = useState(null); // { rawHeaders, rawRows, fileName }
  const [showDualImport, setShowDualImport] = useState(false);

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

  const importSingleFile = useCallback((file) => {
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

          const isKolHeaderValue = (val) => {
            if (val == null) return false;
            const kl = val.toString().toLowerCase().trim();
            const kolAliases = [
              "kol", "tên kol", "ten kol", "name", "influencer", "kol/koc", "koc", "creator", "kol name",
              "account", "tài khoản", "tai khoan", "channel", "user", "username", "kênh", "kenh", "tên kênh", "ten kenh"
            ];
            if (kolAliases.includes(kl)) return true;
            if (kl.includes("kol") || kl.includes("koc") || kl.includes("influencer") || kl.includes("creator") || kl.includes("account") || kl.includes("username")) return true;
            const isExclude = kl.includes("món") || kl.includes("food") || kl.includes("nhóm") || kl.includes("chi phí") || kl.includes("link") || kl.includes("giá") || kl.includes("cost") || kl.includes("tiến độ");
            if ((kl.includes("tên") || kl.includes("ten") || kl.includes("name") || kl.includes("kênh") || kl.includes("kenh")) && !isExclude) return true;
            return false;
          };

          const allSheets = wb.SheetNames
            .map(shName => {
              const ws = wb.Sheets[shName];
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
              const json = XLSX.utils.sheet_to_json(ws, { range: headerIdx, defval: "" });
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
              const firstNonEmpty = aoa.find(row => Array.isArray(row) && row.some(cell => cell != null && cell.toString().trim() !== "")) || [];
              const rowStr = firstNonEmpty.length ? firstNonEmpty.slice(0, 5).map(c => String(c).trim()).join(", ") : "empty";
              return `[${name}: ${rowStr.substring(0, 80)}]`;
            }).join(" ");
            throw new Error("Không tìm thấy cột KOL. Chi tiết file: " + sheetsInfo);
          }

          const combined = [];
          allSheets.forEach(sh => {
            sh.rows.forEach((row, i) => {
              combined.push({ ...row, __sheet__: sh.name, __no__: row["No."] || (i + 1) });
            });
          });

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
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'download_template', {
        'event_category': 'Engagement',
        'event_label': 'Download Template Files'
      });
    }

    const unifiedHeaders = [
      "Chiến dịch", "No.", "KOL", "Link", "Follower", "Type", "Location", "Group",
      "Ext. Cost", "Add-on Fee", "Status", "Món ăn",
      "Ngày gửi script", "Ngày gửi 1st demo", "Ngày Air", "Aired Link", "Aired Fb",
      "Est Air", "Est View", "Est Eng", "View", "Like", "Comment", "Share", "Save",
      "% View Đạt", "% T.Tác Đạt", "Avg. View", "% Xem hết",
      "Reup Views", "Reup Engagement"
    ];

    const unifiedData = [
      ["Campaign_A", 1, "KOL Name A", "https://tiktok.com/@kolname_a", "200K", "Mid-tier", "HCM", "Female without kid", 15000000, "- Code showcase", "Aired", "Món ăn A", "01/07", "05/07", "10/07", "https://tiktok.com/@kolname_a/video/123", "", "10/07", 500000, 10000, 480000, 8500, 320, 150, 200, 0.96, 0.855, 45000, 0.623, 0, 0],
      ["Campaign_A", 2, "KOL Name B", "https://tiktok.com/@kolname_b", "80K", "Micro", "HN", "Family", 8000000, "", "Confirmed demo", "Món ăn B", "12/07", "18/07", "ASAP", "", "", "25/07", 300000, 6000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ["Campaign_A", 3, "KOL Name C", "https://tiktok.com/@kolname_c", "1.2M", "Macro", "HCM", "Gen Z", 35000000, "Livestream 1h", "Waiting script", "Món ăn C", "", "", "", "", "", "05/08", 1200000, 25000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ["Campaign_A", 4, "KOL Name D", "https://tiktok.com/@kolname_d", "45K", "Nano", "DN", "Food Reviewer", 3000000, "", "Aired", "Món ăn D", "20/06", "25/06", "02/07", "https://tiktok.com/@kolname_d/video/456", "https://fb.com/...", "01/07", 100000, 2000, 150000, 3000, 150, 50, 80, 1.5, 1.5, 20000, 0.75, 10000, 500],
      ["Campaign_A", 5, "KOL Name E", "https://tiktok.com/@kolname_e", "500K", "Mid-tier", "HCM", "Couple", 22000000, "", "Cancel", "Món ăn E", "10/06", "", "", "", "", "", 800000, 15000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ["Campaign_B", 6, "KOL Name F", "https://tiktok.com/@kolname_f", "300K", "Mid-tier", "HN", "Food", 12000000, "", "Aired", "Món ăn F", "01/07", "05/07", "10/07", "https://tiktok.com/@kolname_f/video/123", "", "10/07", 200000, 5000, 250000, 4000, 100, 20, 50, 1.25, 0.8, 15000, 0.5, 0, 0]
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([unifiedHeaders, ...unifiedData]), "Data");
    XLSX.writeFile(wb, "KOL_Tracker_Template.xlsx");
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

  const ensureCampaignLabel = (campaignKey) => {
    if (campaignKey && !campaignLabels[campaignKey]) {
      setCampaignLabels(prev => {
        const next = { ...prev, [campaignKey]: campaignKey };
        localStorage.setItem("kol_campaign_labels", JSON.stringify(next));
        return next;
      });
    }
  };

  const handleSave = (updated) => {
    ensureCampaignLabel(updated.campaign);
    setData(d => d.map(r => r.id === updated.id ? updated : r));
  };
  const handleDelete = (id) => {
    setData(d => d.filter(r => r.id !== id));
  };
  const handleAdd = (newRow) => {
    ensureCampaignLabel(newRow.campaign);
    setData(d => [...d, newRow]);
  };

  const getProfileForKol = (kolName) => {
    if (!kolName) return null;
    const name = kolName.trim();
    const key = name.toLowerCase();
    
    const matchingRows = data.filter(r => (r.kol || "").trim().toLowerCase() === key);
    if (!matchingRows.length) return null;

    const profile = {
      kol: matchingRows[0].kol.trim(),
      follower: "",
      type: "",
      location: "",
      group: "",
      link: "",
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

    matchingRows.forEach(r => {
      const campaignKey = resolveCampaignKey(r);
      if (campaignKey) profile.campaigns.add(campaignKey);
      profile.totalCost += Number(r.cost) || 0;
      profile.totalViews += Number(r.views) || 0;
      profile.totalLikes += Number(r.likes) || 0;
      profile.totalComments += Number(r.comments) || 0;
      profile.totalSaves += Number(r.saves) || 0;
      profile.totalShares += Number(r.shares) || 0;
      profile.totalConversions += Number(r.conversions) || 0;
      profile.totalRevenue += Number(r.revenue) || 0;

      (r.phaseTags || "").split(",").map(s => s.trim()).filter(Boolean).forEach(p => profile.phases.add(p));
      profile.campaignDetails.push(r);

      if (!profile.follower && r.follower) profile.follower = r.follower;
      if (!profile.type && r.type) profile.type = r.type;
      if (!profile.location && r.location) profile.location = r.location;
      if (!profile.group && r.group) profile.group = r.group;
      if (!profile.link && r.link) profile.link = r.link;
    });

    return profile;
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
  // Commit the preview from DualFileImportModal: update matched rows in place
  // (by id) and append brand-new ones, in a single history-tracked setData call.
  const handleDualFileMerge = (result) => {
    setData(d => {
      const byId = Object.fromEntries(d.map(r => [r.id, r]));
      result.toUpdate.forEach(u => {
        byId[u.id] = { ...byId[u.id], ...u.changes, updatedAt: new Date().toISOString().slice(0, 10) };
      });
      return [...Object.values(byId), ...result.toAdd];
    });

    if (result.sheetLabels && Object.keys(result.sheetLabels).length) {
      setCampaignLabels(prev => {
        const next = { ...prev, ...result.sheetLabels };
        localStorage.setItem("kol_campaign_labels", JSON.stringify(next));
        return next;
      });
    }

    showToast(`✅ Đã cập nhật ${result.toUpdate.length} dòng, thêm ${result.toAdd.length} KOL mới`);
    setShowDualImport(false);
  };
  const handleReset = () => {
    const clearAll = window.confirm(
      "Bạn muốn thực hiện thao tác nào?\n\n" +
      "- Bấm 'OK' để XÓA SẠCH toàn bộ dữ liệu hiện tại (về 0 KOLs).\n" +
      "- Bấm 'Cancel' để KHÔI PHỤC lại 66 dòng dữ liệu mẫu ban đầu."
    );
    if (clearAll) {
      setData([]);
      const defLabels = { AM: "AM", AX: "AX", Vinegar: "Vinegar", MSG: "MGS", Blendy: "Blendy" };
      setCampaignLabels(defLabels);
      localStorage.setItem("kol_campaign_labels", JSON.stringify(defLabels));
    } else {
      if (window.confirm("Bạn có chắc chắn muốn khôi phục lại 66 dòng dữ liệu mẫu ban đầu? Mọi chỉnh sửa hiện tại sẽ bị mất.")) {
        setData(SEED_DATA);
        const defLabels = { AM: "AM", AX: "AX", Vinegar: "Vinegar", MSG: "MGS", Blendy: "Blendy" };
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, overflowX: "auto", width: "100%", paddingBottom: 4 }} className="kt-scrollbar">
          {/* Group 1: Logo/Brand & View Toggles (Left aligned together) */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexShrink: 0 }}>
            {/* Logo & Brand Name */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: "#EA9216",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(234, 146, 22, 0.3)",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h1 style={{ 
                fontSize: 18, 
                color: "var(--ink)", 
                margin: 0, 
                fontWeight: 800, 
                letterSpacing: "-0.03em",
                fontFamily: "'Questrial', sans-serif"
              }}>
                KOL <span style={{ color: "#EA9216" }}>Tracking</span>
              </h1>
            </div>
            
            {/* View Toggle (Bảng, Kanban, Lịch) */}
            <div style={{ display: "flex", gap: 2, background: "var(--paper)", padding: 3, borderRadius: 20 }}>
              <button className={`kt-btn ${view === "table" ? "kt-btn-primary" : "kt-btn-ghost"}`}
                style={{ padding: "5px 12px", fontSize: 11, borderRadius: 16 }}
                onClick={() => setView("table")}>Bảng</button>
              <button className={`kt-btn ${view === "kanban" ? "kt-btn-primary" : "kt-btn-ghost"}`}
                style={{ padding: "5px 12px", fontSize: 11, borderRadius: 16 }}
                onClick={() => setView("kanban")}>Kanban</button>
              <button className={`kt-btn ${view === "calendar" ? "kt-btn-primary" : "kt-btn-ghost"}`}
                style={{ padding: "5px 12px", fontSize: 11, borderRadius: 16 }}
                onClick={() => setView("calendar")}>Lịch</button>
              <button className={`kt-btn ${view === "profile" ? "kt-btn-primary" : "kt-btn-ghost"}`}
                style={{ padding: "5px 12px", fontSize: 11, borderRadius: 16 }}
                onClick={() => setView("profile")}>Hồ sơ KOL</button>
            </div>
          </div>
 
          {/* Quick Actions (Add, Import, Undo/Redo) */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <button className="kt-btn kt-btn-ghost" onClick={handleDownloadTemplate}
              title="Tải file Excel mẫu đúng định dạng" style={{ padding: "6px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              Mẫu
            </button>
            <button className="kt-btn kt-btn-primary" onClick={() => setShowDualImport(true)}
              title="Kéo thả các file Excel hoặc JSON để cập nhật" style={{ padding: "6px 12px", fontSize: 12, display: "flex", alignItems: "center", gap: 6, borderRadius: 16 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
              Cập nhật
            </button>
            <button className="kt-btn kt-btn-ghost" onClick={handleExportData}
              title="Tải toàn bộ dữ liệu hiện tại trên web về máy (.xlsx)" style={{ padding: "6px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
              Lưu về máy
            </button>
            <button className="kt-btn kt-btn-ghost" onClick={() => setShowShareModal(true)}
              title="Chia sẻ dữ liệu online qua link trực tuyến" style={{ padding: "6px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              Chia sẻ online
            </button>
 
            {/* Undo / Redo */}
            <div style={{ display: "flex", gap: 1, border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden", padding: 2, background: "var(--card)" }}>
              <button 
                className="kt-btn kt-btn-ghost" 
                onClick={handleUndo} 
                disabled={history.length === 0}
                title="Hoàn tác (Ctrl+Z)" 
                style={{ padding: "5px 8px", border: "none", borderRadius: 16, opacity: history.length === 0 ? 0.35 : 1, cursor: history.length === 0 ? "not-allowed" : "pointer" }}
              >
                ↩️
              </button>
              <button 
                className="kt-btn kt-btn-ghost" 
                onClick={handleRedo} 
                disabled={redoHistory.length === 0}
                title="Làm lại (Ctrl+Y)" 
                style={{ padding: "5px 8px", border: "none", borderRadius: 16, opacity: redoHistory.length === 0 ? 0.35 : 1, cursor: redoHistory.length === 0 ? "not-allowed" : "pointer" }}
              >
                ↪️
              </button>
            </div>
 
            
            <button className="kt-btn kt-btn-ghost" onClick={() => setShowStatusSettings(true)}
              title="Cài đặt hệ thống (Thêm/bớt Trạng thái)" style={{ padding: "6px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Cài đặt
            </button>
            {/* Reset / Đặt lại */}

            <button className="kt-btn kt-btn-ghost" onClick={handleReset} title="Khôi phục dữ liệu ban đầu" style={{ padding: "6px 10px", fontSize: 12 }}>Đặt lại</button>
 
            {/* Main Add Button */}
            <button className="kt-btn kt-btn-primary" onClick={() => setShowNew(true)} style={{ padding: "6px 12px", fontSize: 12, borderRadius: 20 }}>+ Thêm KOL</button>
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
              <option value="all">Tất cả Chiến dịch</option>
              {dynamicCampaigns.map(c => <option key={c.key} value={c.key}>{campaignLabels[c.key] || c.label}</option>)}
            </select>

             {/* Status filter */}
            <select className="kt-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ width: 210 }}>
              <option value="all">Tất cả Trạng thái</option>
              <option value="in_progress">Đang xử lý (Chưa lên sóng)</option>
              {statusStages.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>

            {/* Type filter */}
            <select className="kt-select" value={filterType} onChange={e => setFilterType(e.target.value)}
              style={{ width: 150 }}>
              <option value="all">Tất cả Tiers</option>
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
          {view === "table" && <TableView rows={filtered} statusMap={statusMap} statusStages={statusStages} onOpen={r => setSelected(r)} onSave={(id, changes) => { setData(prev => prev.map(item => item.id === id ? { ...item, ...changes } : item)); }} campaignLabels={campaignLabels} />}
          {view === "kanban" && (
            <KanbanView 
              rows={filtered} 
              statusStages={statusStages}
              statusMap={statusMap} 
              onOpen={r => setSelected(r)} 
              onUpdateStatus={(id, newStatus) => {
                setData(prev => prev.map(item => item.id === id ? { ...item, statusKey: newStatus } : item));
                showToast(`Đã chuyển trạng thái sang: ${statusMap[newStatus]?.label || newStatus}`);
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
              dynamicCampaigns={dynamicCampaigns}
              statusStages={statusStages}
              statusMap={statusMap}
            />
          )}
        </div>
      </div>

      {/* ── DETAIL MODAL ── */}
      {selected && (
        <DetailModal
          kol={selected}
          statusStages={statusStages}
          dynamicCampaigns={dynamicCampaigns}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {/* ── NEW KOL MODAL ── */}
      {showNew && (
        <DetailModal
          kol={emptyKOL()}
          statusStages={statusStages}
          dynamicCampaigns={dynamicCampaigns}
          onClose={() => setShowNew(false)}
          onSave={(row) => { handleAdd(row); setShowNew(false); }}
          onDelete={() => setShowNew(false)}
        />
      )}

      {/* ── IMPORT WIZARD ── */}
      {showDualImport && (
        <DualFileImportModal
          existingData={data}
          statusLabelToKey={statusLabelToKey}
          statusMap={statusMap}
          statusLabelToKey={statusLabelToKey}
          onClose={() => setShowDualImport(false)}
          onConfirm={handleDualFileMerge}
          onImportSingle={importSingleFile}
        />
      )}

      {wizardData && (
        <ImportWizard
          {...wizardData}
          onClose={() => setWizardData(null)}
          campaignLabels={campaignLabels}
          onConfirm={(importedRows) => {
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

            let mergedCount = 0;
            let addedCount = 0;
            const updatedData = [...data];
            importedRows.forEach(imp => {
              const impCampaign = resolveCampaignKey(imp);
              const matchIdx = updatedData.findIndex(existing => {
                if (imp.id && existing.id === imp.id) return true;
                if (!isKolMatch(imp.kol, existing.kol)) return false;
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
          statusMap={statusMap}
          onClose={() => setSelectedProfile(null)}
          campaignLabels={campaignLabels}
          onSaveProfile={handleUpdateProfile}
          onOpenRow={(row) => setSelected(row)}
        />
      )}

      
      {/* ── SETTINGS MODAL ── */}
      {showStatusSettings && (
        <StatusSettingsModal
          statuses={statusStages}
          onClose={() => setShowStatusSettings(false)}
          onSave={(newList) => {
            setStatusStages(newList);
            localStorage.setItem("kol_status_stages", JSON.stringify(newList));
            setShowStatusSettings(false);
          }}
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
          <span>© JB 2026. All Rights Reserved.</span>
          <span style={{ color: "var(--line)" }}>|</span>
          <span>Dữ liệu chiến dịch: <strong>FY26</strong></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span>Trạng thái hệ thống: <span style={{ color: "var(--ok)", fontWeight: 700 }}>● Online</span></span>
          <span style={{ color: "var(--line)" }}>|</span>
          <span>Hệ thống quản lý KOL Tracking</span>
        </div>
      </div>

      {/* ── LOADING SHARE OVERLAY ── */}
      {loadingShare && (
        <div className="kt-overlay" style={{ zIndex: 1000, background: "rgba(255, 255, 255, 0.8)", display: "flex", flexDirection: "column", gap: 16, alignItems: "center", justifyContent: "center" }}>
          <div className="kt-spinner" style={{ width: 40, height: 40, border: "4px solid var(--line)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "kt-spin 1s linear infinite" }}></div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Đang đồng bộ dữ liệu chia sẻ...</span>
        </div>
      )}

      {/* ── ONLINE SHARE MODAL ── */}
      {showShareModal && (
        <OnlineShareModal
          data={data}
          onClose={() => setShowShareModal(false)}
          onExport={handleExportData}
        />
      )}
    </div>
  );
}

const OnlineShareModal = ({ data, onClose, onExport }) => {
  const [shareId, setShareId] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://dpaste.com/api/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        content: JSON.stringify(data),
        expiry_days: "30",
        syntax: "json"
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Không thể tạo link chia sẻ online");
        return res.text();
      })
      .then(url => {
        const id = url.trim().split("/").pop();
        setShareId(id);
      })
      .catch(err => {
        window.alert(`Lỗi chia sẻ: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data]);

  const shareUrl = shareId 
    ? `${window.location.origin}${window.location.pathname}?share=${shareId}`
    : "";

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="kt-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="kt-modal kt-anim" style={{ maxWidth: 640, padding: "24px 30px", borderRadius: 12, background: "var(--card)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🔗</span> Chia sẻ dữ liệu online
          </h2>
          <button className="kt-btn kt-btn-ghost" onClick={onClose} style={{ padding: "6px 10px", borderRadius: "50%", minWidth: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Content Card */}
        <div style={{
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 18,
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.01)"
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 6px 0" }}>Link chia sẻ</h3>
          <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 16px 0" }}>Sao chép link để người khác xem và lưu dữ liệu của bạn.</p>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: 0, background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: 30, padding: "10px 18px", display: "flex", alignItems: "center" }}>
              {loading ? (
                <span style={{ fontSize: 13, color: "#94A3B8", fontStyle: "italic" }}>Đang tạo link chia sẻ online...</span>
              ) : (
                <input
                  readOnly
                  value={shareUrl}
                  style={{ width: "100%", border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#334155", fontFamily: "monospace" }}
                  onClick={e => e.target.select()}
                />
              )}
            </div>

            <button
              onClick={handleCopy}
              className="kt-btn"
              disabled={loading || !shareUrl}
              style={{
                background: copied ? "var(--ok)" : "#6366F1",
                color: "#FFFFFF",
                padding: "10px 20px",
                borderRadius: 30,
                fontWeight: 600,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "none",
                cursor: loading || !shareUrl ? "not-allowed" : "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {copied ? (
                  <path d="M20 6L9 17l-5-5" />
                ) : (
                  <>
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </>
                )}
              </svg>
              {copied ? "Đã chép!" : "Sao chép"}
            </button>
          </div>
        </div>

        {/* Offline Export Link */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={onExport}
            className="kt-btn kt-btn-ghost"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "#475569",
              fontWeight: 600,
              padding: "6px 12px",
              background: "transparent",
              border: "none"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Hoặc xuất file Excel / JSON để dùng offline.
          </button>
        </div>

      </div>
    </div>
  );
};