
import * as XLSX from 'xlsx';

const CAMPAIGNS = [
  { key: 'AM', label: 'Aji-ngon Heo' },
  { key: 'AX', label: 'Xốt Mè Rang' },
  { key: 'Vinegar', label: 'Giấm gạo & Giấm táo' },
  { key: 'MSG', label: 'MGS (Bột ngọt)' },
  { key: 'Blendy', label: 'Blendy' },
];
const STATUS_OPTIONS = [
  { key: 'waiting_food', label: 'Chờ gửi hàng' },
  { key: 'food_received', label: 'Đã nhận hàng' },
  { key: 'script_approved', label: 'Duyệt kịch bản' },
  { key: 'demo_approved', label: 'Duyệt demo' },
  { key: 'aired', label: 'Đã lên sóng' },
  { key: 'cancelled', label: 'Hủy' },
];
const statusLabelToKey = (lbl) => {
  if (!lbl) return 'waiting_food';
  const l = lbl.toString().toLowerCase().trim();
  if (l.includes('lên sóng') || l.includes('air')) return 'aired';
  if (l.includes('demo')) return 'demo_approved';
  if (l.includes('kịch bản') || l.includes('script')) return 'script_approved';
  if (l.includes('nhận hàng') || l.includes('received')) return 'food_received';
  if (l.includes('hủy') || l.includes('cancel')) return 'cancelled';
  return 'waiting_food';
};
const emptyKOL = () => ({ id: '', kol: '', campaign: 'AM', statusKey: 'waiting_food' });
const CUSTOM_INITIALS = {};
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
      <div className="kt-modal kt-anim" style={{ maxWidth: 860, borderRadius: 24 }}>
        {/* Header */}
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
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

        <div style={{ padding: "18px 22px", overflowY: "auto", flex: 1, minHeight: 0 }} className="kt-scrollbar">
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
        <div style={{ padding: "14px 22px", borderTop: "1px solid var(--line)", display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
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



const f1 = '/Users/xxzwnm/Downloads/TCV/[AVNxTCV] Social Outreach Campaign_FY26.xlsx';
const f2 = '/Users/xxzwnm/Downloads/TCV/[INTERNAL] AVN x TCV - AM + AX + Vinegar_FY26_Execution.xlsx';

const wb1 = XLSX.readFile(f1, { cellDates: true });
const wb2 = XLSX.readFile(f2, { cellDates: true });

console.log('--- Parsing Internal ---');
const internalMap = parseInternalWorkbook(wb2, statusLabelToKey);
for (const [camp, map] of Object.entries(internalMap)) {
  console.log();
  for (const [k, v] of map.entries()) {
    console.log();
    break;
  }
}

console.log('--- Parsing Social ---');
const socialMap = parseSocialWorkbook(wb1);
for (const [camp, map] of Object.entries(socialMap)) {
  console.log();
  for (const [k, v] of map.entries()) {
    console.log();
    break;
  }
}

console.log('--- Merging ---');
const merged = mergeDualFiles(internalMap, socialMap, null, []);
console.log();
console.log('Total Warnings:', merged.warnings.length);
console.log('Sample Warnings:', merged.warnings.slice(0, 10));
