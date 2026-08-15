import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import * as XLSX from "xlsx";

/* ---------------- Design tokens (injected via <style>) ---------------- */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

    .kt-root {
      --ink: #001C44;
      --ink-soft: #4C7086;
      --paper: #F4FBFB;
      --card: #FFFFFF;
      --line: #D3E7E9;
      --red: #0C5776;
      --red-soft: #DCEEF1;
      --amber: #C97B58;
      --amber-soft: #F8DAD0;
      --green: #2D99AE;
      --green-soft: #DFF7F6;
      --blue: #0C5776;
      --blue-soft: #DCEEF1;
      font-family: 'Inter', sans-serif;
      color: var(--ink);
      background: var(--paper);
      min-height: 100vh;
    }
    .kt-display { font-family: 'Oswald', sans-serif; letter-spacing: 0.02em; text-transform: uppercase; }
    .kt-mono { font-family: 'IBM Plex Mono', monospace; }

    .kt-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
    .kt-scrollbar::-webkit-scrollbar-thumb { background: var(--line); border-radius: 4px; }
    .kt-scrollbar::-webkit-scrollbar-track { background: transparent; }

    .kt-ticket {
      position: relative;
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 10px;
    }
    .kt-ticket .kt-perf {
      position: relative;
      border-top: 1px dashed var(--line);
      margin: 0 14px;
    }
    .kt-ticket .kt-perf::before, .kt-ticket .kt-perf::after {
      content: '';
      position: absolute;
      top: -7px;
      width: 14px; height: 14px;
      border-radius: 50%;
      background: var(--paper);
      border: 1px solid var(--line);
    }
    .kt-ticket .kt-perf::before { left: -21px; }
    .kt-ticket .kt-perf::after { right: -21px; }

    .kt-stamp {
      display: inline-block;
      transform: rotate(-6deg);
      border: 2px solid var(--green);
      color: var(--green);
      font-family: 'Oswald', sans-serif;
      font-weight: 700;
      letter-spacing: 0.08em;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      text-transform: uppercase;
      opacity: 0.9;
    }

    .kt-btn {
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 13px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }
    .kt-btn-primary { background: var(--red); color: #FFFFFF; }
    .kt-btn-primary:hover { background: #001C44; }
    .kt-btn-ghost { background: transparent; color: var(--ink); border-color: var(--line); }
    .kt-btn-ghost:hover { background: #E7F5F5; }
    .kt-btn-ghost.active { background: var(--ink); color: var(--paper); border-color: var(--ink); }
    .kt-btn-danger { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
    .kt-btn-danger:hover { background: #fca5a5; }

    .kt-input, .kt-select, .kt-textarea {
      font-family: 'Inter', sans-serif;
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 7px;
      padding: 7px 10px;
      font-size: 13px;
      color: var(--ink);
      width: 100%;
      outline: none;
    }
    .kt-input:focus, .kt-select:focus, .kt-textarea:focus { border-color: var(--red); box-shadow: 0 0 0 3px var(--red-soft); }
    .kt-label { font-size: 11px; font-weight: 600; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; display: block; }

    .kt-badge { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 999px; white-space: nowrap; display: inline-block; }

    @keyframes kt-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    .kt-anim { animation: kt-fade-in 0.25s ease; }

    .kt-kanban-col {
      min-width: 260px;
      max-width: 260px;
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 280px);
    }

    /* Modal overlay */
    .kt-overlay {
      position: fixed; inset: 0;
      background: rgba(0,28,68,0.35);
      backdrop-filter: blur(3px);
      z-index: 100;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
    }
    .kt-modal {
      background: var(--card);
      border-radius: 14px;
      width: 100%;
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 24px 64px rgba(0,28,68,0.18);
    }

    /* Table */
    .kt-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .kt-table th {
      background: var(--red-soft);
      border-bottom: 2px solid var(--line);
      padding: 10px 12px;
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
      top: 184px;
      z-index: 10;
    }
    .kt-table td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--line);
      vertical-align: top;
      line-height: 1.45;
    }
    .kt-table tr:last-child td { border-bottom: none; }
    .kt-table tr:hover td { background: #F0F9FA; }
    .kt-table a { color: var(--blue); text-decoration: none; word-break: break-all; }
    .kt-table a:hover { text-decoration: underline; }

    /* Kanban */
    .kt-kanban-card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 12px 14px;
      cursor: pointer;
      transition: box-shadow 0.15s, transform 0.15s;
    }
    .kt-kanban-card:hover { box-shadow: 0 4px 16px rgba(0,28,68,0.10); transform: translateY(-2px); }

    @media (prefers-reduced-motion: reduce) {
      .kt-anim { animation: none; }
      .kt-kanban-card:hover { transform: none; }
    }
  `}</style>
);

/* ---------------- Domain constants ---------------- */
const CAMPAIGNS = [
  { key: "AM", label: "AM · Ajimayo", color: "#001C44" },
  { key: "AX", label: "AX · Aji-Xốt", color: "#2D99AE" },
  { key: "Vinegar", label: "Vinegar · Giấm", color: "#0C5776" },
  { key: "MSG", label: "MSG · Bột ngọt", color: "#C97B58" },
  { key: "Blendy", label: "Blendy", color: "#2D7D46" },
];
const CAMPAIGN_COLOR = Object.fromEntries(CAMPAIGNS.map(c => [c.key, c.color]));

const normalizeCampaignKey = (sheetName) => {
  if (!sheetName) return "";
  const name = sheetName.toString().toLowerCase().trim();
  if (name.includes("mayo") || name === "am") return "AM";
  if (name.includes("xốt") || name === "ax") return "AX";
  if (name.includes("giấm") || name.includes("vinegar") || name === "giấm_fy25") return "Vinegar";
  if (name.includes("msg") || name.includes("bột ngọt") || name.includes("mì chính")) return "MSG";
  if (name.includes("blendy")) return "Blendy";
  return sheetName;
};

const STATUS_STAGES = [
  { key: "waiting_food",   label: "Chờ duyệt món ăn",   color: "#C97B58", soft: "#F8DAD0" },
  { key: "waiting_script", label: "Chờ duyệt script",   color: "#7C5C74", soft: "#EDE0E7" },
  { key: "doing_demo",     label: "Đang làm demo",       color: "#0C5776", soft: "#DCEEF1" },
  { key: "waiting_demo",   label: "Chờ duyệt demo",      color: "#C97B58", soft: "#F8DAD0" },
  { key: "revised_demo",   label: "Demo đã chỉnh sửa",   color: "#7C5C74", soft: "#EDE0E7" },
  { key: "confirmed_demo", label: "Demo đã duyệt",       color: "#2D7D46", soft: "#DCFCE7" },
  { key: "aired",          label: "Đã lên sóng",         color: "#2D99AE", soft: "#DFF7F6" },
];
const STATUS_MAP = Object.fromEntries(STATUS_STAGES.map(s => [s.key, s]));
// reverse: label → key  (also accept key directly)
const STATUS_LABEL_TO_KEY = Object.fromEntries([
  ...STATUS_STAGES.map(s => [s.label.toLowerCase(), s.key]),
  ...STATUS_STAGES.map(s => [s.key.toLowerCase(), s.key]),
  // common aliases
  ["aired", "aired"],
  ["đã lên sóng", "aired"],
  ["chờ duyệt script", "waiting_script"],
  ["waiting script", "waiting_script"],
  ["waiting feedback script", "waiting_script"],
  ["đang làm demo", "doing_demo"],
  ["doing demo", "doing_demo"],
  ["chờ duyệt demo", "waiting_demo"],
  ["waiting demo", "waiting_demo"],
  ["waiting feedback demo", "waiting_demo"],
  ["demo đã chỉnh sửa", "revised_demo"],
  ["revised demo", "revised_demo"],
  ["demo đã duyệt", "confirmed_demo"],
  ["confirmed demo", "confirmed_demo"],
  ["chờ duyệt món ăn", "waiting_food"],
  ["waiting food", "waiting_food"],
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
  status:        ["status", "trạng thái", "trang thai"],
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
const LOCATIONS = ["Urban", "Rural", "TP HCM", "HCM", "HN", "Hà Nội", "Hải Phòng", "Thái Nguyên", "Thanh Hóa", "Hưng Yên", "Đăk Lăk", "Quảng Ninh", "Lào Cai / Hà Nội"];

const fmtVND = (n) => {
  if (!n && n !== 0) return "—";
  return new Intl.NumberFormat("vi-VN").format(n) + "đ";
};

const urlify = (text) => {
  if (!text) return null;
  const urlRx = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRx);
  return parts.map((p, i) =>
    urlRx.test(p)
      ? <a key={i} href={p} target="_blank" rel="noopener noreferrer">{p}</a>
      : p
  );
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
    } else {
      out.id = `import-${Date.now()}-${idx}`;
    }

    for (const [rawCol, field] of Object.entries(mapping)) {
      if (!field || rawCol.startsWith("__") || !(rawCol in row)) continue;
      const raw = row[rawCol];
      // Convert Excel serial date numbers to string
      let val = "";
      if (typeof raw === "number" && raw > 40000 && raw < 60000) {
        // Likely an Excel date serial
        const date = XLSX.SSF.parse_date_code(raw);
        val = `${date.d}/${date.m}/${date.y}`;
      } else {
        val = raw == null ? "" : String(raw).trim();
      }

      const numericFields = ["cost", "estView", "estEng", "views", "likes", "comments", "saves", "shares", "adSpend", "conversions", "addToCart", "revenue"];
      if (numericFields.includes(field)) {
        out[field] = parseFloat(val.replace(/[^0-9.-]/g, "")) || 0;
      } else if (field === "status") {
        out.statusKey = STATUS_LABEL_TO_KEY[val.toLowerCase()] || "waiting_food";
      } else if (field === "statusKey") {
        out.statusKey = STATUS_LABEL_TO_KEY[val.toLowerCase()] || val || "waiting_food";
      } else {
        out[field] = val;
      }
    }
    return out;
  });
};

const ImportWizard = ({ rawHeaders, rawRows, sheetInfo, fileName, onConfirm, onClose }) => {
  const visibleHeaders = rawHeaders.filter(h => !h.startsWith("__"));
  const [mapping, setMapping] = useState(() => autoMapColumns(visibleHeaders));
  const previewRows = rawRows.slice(0, 3);
  const unmapped = visibleHeaders.filter(h => !mapping[h]);
  const preview = applyMapping(previewRows, mapping);
  const totalRows = rawRows.length;

  return (
    <div className="kt-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="kt-modal kt-anim" style={{ maxWidth: 860 }}>
        {/* Header */}
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              📥 Import Wizard
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
            <div className="kt-label" style={{ marginBottom: 10 }}>🔍 Mapping cột — kiểm tra và chỉnh nếu cần</div>
            {unmapped.length > 0 && (
              <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#92400E" }}>
                ⚠️ Chưa nhận diện được: <strong>{unmapped.join(", ")}</strong> — chọn field tương ứng bên dưới
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
            <div className="kt-label" style={{ marginBottom: 8 }}>👀 Preview {previewRows.length} dòng đầu sau khi map</div>
            <div style={{ overflowX: "auto", background: "var(--paper)", borderRadius: 8, padding: 12 }}>
              {preview.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap", fontSize: 12 }}>
                  <span style={{ fontWeight: 700, minWidth: 60 }}>{r.kol || `Row ${i+1}`}</span>
                  <span style={{ color: CAMPAIGN_COLOR[r.campaign] || "var(--ink-soft)" }}>{r.campaign}</span>
                  <span className="kt-mono">{r.follower || "?"}</span>
                  <StatusBadge statusKey={r.statusKey} />
                  <span className="kt-mono" style={{ color: "var(--red)" }}>{fmtVND(r.cost)}</span>
                  {r.monAn && <span style={{ color: "var(--ink-soft)" }}>🍽 {r.monAn.slice(0, 40)}{r.monAn.length > 40 ? "…" : ""}</span>}
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
              ✅ Xác nhận import {rawRows.length} KOLs
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
const CampaignDot = ({ campaign }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    fontSize: 12, fontWeight: 600, color: CAMPAIGN_COLOR[campaign] || "#888"
  }}>
    <span style={{
      width: 8, height: 8, borderRadius: "50%",
      background: CAMPAIGN_COLOR[campaign] || "#888", display: "inline-block"
    }} />
    {campaign}
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
const StatsBar = ({ rows }) => {
  const total = rows.reduce((s, r) => s + (r.cost || 0), 0);
  const aired = rows.filter(r => r.statusKey === "aired").length;
  const inProgress = rows.filter(r => r.statusKey !== "aired").length;

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {[
        { label: "Tổng KOL", value: rows.length, color: "var(--ink)" },
        { label: "Đã lên sóng", value: aired, color: "var(--green)" },
        { label: "Đang xử lý", value: inProgress, color: "var(--amber)" },
        { label: "Tổng chi phí", value: fmtVND(total), color: "var(--red)" },
      ].map(({ label, value, color }) => (
        <div key={label} style={{
          background: "var(--card)", border: "1px solid var(--line)",
          borderRadius: 10, padding: "10px 16px", minWidth: 130
        }}>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
          <div className="kt-display" style={{ fontSize: 20, color, marginTop: 2 }}>{value}</div>
        </div>
      ))}
    </div>
  );
};

/* ================================================================
   TABLE VIEW
================================================================ */
const TableView = ({ rows, onOpen }) => (
  <div style={{ overflow: "visible" }}>
    <table className="kt-table kt-table-sticky">
      <thead>
        <tr>
          <th>ID</th>
          <th>KOL</th>
          <th>Campaign</th>
          <th>Type</th>
          <th>Followers</th>
          <th>Chi phí</th>
          <th>Status</th>
          <th>Ngày air</th>
          <th>Script</th>
          <th>Demo</th>
          <th>Aired</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id} onClick={() => onOpen(r)} style={{ cursor: "pointer" }}>
            <td><span className="kt-mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>{r.id}</span></td>
            <td title={r.kol} style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <div style={{ fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis" }}>{r.kol}</div>
              {r.link && <a href={r.link} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ fontSize: 11, color: "var(--ink-soft)" }}>TikTok ↗</a>}
            </td>
            <td><CampaignDot campaign={r.campaign} /></td>
            <td>{r.type && <span className="kt-badge" style={{ background: "var(--paper)", color: "var(--ink-soft)", border: "1px solid var(--line)" }}>{r.type}</span>}</td>
            <td><span className="kt-mono" style={{ fontSize: 12 }}>{r.follower || "—"}</span></td>
            <td><span className="kt-mono" style={{ fontSize: 12, color: "var(--ink)" }}>{fmtVND(r.cost)}</span></td>
            <td><StatusBadge statusKey={r.statusKey} /></td>
            <td title={r.ngayAir} style={{ fontSize: 12, color: "var(--ink-soft)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.ngayAir && r.ngayAir.startsWith("http") ? (
                <a href={r.ngayAir} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                  Link ↗
                </a>
              ) : (
                r.ngayAir || "—"
              )}
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
            <td>{r.airedLink ? (
              <a href={r.airedLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                <span className="kt-stamp">AIRED</span>
              </a>
            ) : "—"}</td>
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

/* ================================================================
   KANBAN VIEW
================================================================ */
const KanbanView = ({ rows, onOpen }) => (
  <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: 16, alignItems: "flex-start" }}
    className="kt-scrollbar">
    {STATUS_STAGES.map(stage => {
      const cards = rows.filter(r => r.statusKey === stage.key);
      return (
        <div key={stage.key} className="kt-kanban-col">
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
          <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", flex: 1 }} className="kt-scrollbar">
            {cards.map(r => (
              <div key={r.id} className="kt-kanban-card kt-anim" onClick={() => onOpen(r)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <CampaignDot campaign={r.campaign} />
                  <span className="kt-mono" style={{ fontSize: 10, color: "var(--ink-soft)" }}>{r.id}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)", marginBottom: 4, lineHeight: 1.3 }}>{r.kol}</div>
                {r.type && <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 4 }}>{r.type} · {r.follower || "?"}</div>}
                {r.monAn && <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 6, paddingTop: 6, borderTop: "1px dashed var(--line)", lineHeight: 1.4, maxHeight: 56, overflow: "hidden" }}>
                  🍽 {r.monAn.split("\n")[0]}
                </div>}
                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="kt-mono" style={{ fontSize: 11, color: "var(--red)", fontWeight: 600 }}>{fmtVND(r.cost)}</span>
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
    })}
  </div>
);

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

const fmtFollowers = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
};

const StatCard = ({ title, value, subtext, color = "var(--ink)" }) => (
  <div style={{
    background: "var(--card)",
    border: "1px solid var(--line)",
    borderRadius: 12,
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
  }}>
    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{title}</span>
    <span style={{ fontSize: 20, fontWeight: 700, color: color, margin: "6px 0", wordBreak: "break-all" }}>{value}</span>
    <span style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.3 }}>{subtext}</span>
  </div>
);

const InsightsView = ({ rows, insightsNotes, onSaveNote }) => {
  const [subView, setSubView] = useState("account");
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    setNoteText(insightsNotes[selectedCampaign] || "");
  }, [selectedCampaign, insightsNotes]);

  const campaigns = useMemo(() => {
    const list = Array.from(new Set(rows.map(r => r.campaign).filter(Boolean)));
    return ["all", ...list];
  }, [rows]);

  const activeRows = useMemo(() => {
    if (selectedCampaign === "all") return rows;
    return rows.filter(r => r.campaign === selectedCampaign);
  }, [rows, selectedCampaign]);

  const metrics = useMemo(() => {
    if (activeRows.length === 0) return null;

    const totalKOL = activeRows.length;
    const totalCost = activeRows.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
    const avgCost = totalCost / totalKOL;
    const airedKOLs = activeRows.filter(r => r.statusKey === "aired");
    const airedCount = airedKOLs.length;
    const airedRate = Math.round((airedCount / totalKOL) * 100);
    const zeroCostCount = activeRows.filter(r => (Number(r.cost) || 0) === 0).length;

    // Phase 2 performance & Ecom metrics
    const totalViews = activeRows.reduce((sum, r) => sum + (Number(r.views) || 0), 0);
    const totalEstViews = activeRows.reduce((sum, r) => sum + (Number(r.estView) || 0), 0);
    const kpiViewsAchievedRate = totalEstViews > 0 ? Math.round((totalViews / totalEstViews) * 100) : 0;

    const totalLikes = activeRows.reduce((sum, r) => sum + (Number(r.likes) || 0), 0);
    const totalComments = activeRows.reduce((sum, r) => sum + (Number(r.comments) || 0), 0);
    const totalSaves = activeRows.reduce((sum, r) => sum + (Number(r.saves) || 0), 0);
    const totalShares = activeRows.reduce((sum, r) => sum + (Number(r.shares) || 0), 0);
    const totalEngagement = totalLikes + totalComments + totalSaves + totalShares;
    const avgEngRate = totalViews > 0 ? parseFloat(((totalEngagement / totalViews) * 100).toFixed(2)) : 0;

    const totalAdSpend = activeRows.reduce((sum, r) => sum + (Number(r.adSpend) || 0), 0);
    const totalSpend = totalCost + totalAdSpend;

    const totalConversions = activeRows.reduce((sum, r) => sum + (Number(r.conversions) || 0), 0);
    const totalAddToCart = activeRows.reduce((sum, r) => sum + (Number(r.addToCart) || 0), 0);
    const totalRevenue = activeRows.reduce((sum, r) => sum + (Number(r.revenue) || 0), 0);

    const roas = totalAdSpend > 0 ? parseFloat((totalRevenue / totalAdSpend).toFixed(2)) : 0;
    const cpv = totalViews > 0 ? Math.round(totalAdSpend / totalViews) : 0;

    // Top 5 viral and Top 5 sales creators
    const topKOLsByViews = [...activeRows]
      .filter(r => (Number(r.views) || 0) > 0)
      .sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0))
      .slice(0, 5);

    const topKOLsByRevenue = [...activeRows]
      .filter(r => (Number(r.revenue) || 0) > 0)
      .sort((a, b) => (Number(b.revenue) || 0) - (Number(a.revenue) || 0))
      .slice(0, 5);

    // 1. Account: Campaign Analysis
    const campaignMap = {};
    activeRows.forEach(r => {
      const c = r.campaign || "Unknown";
      if (!campaignMap[c]) {
        campaignMap[c] = { campaign: c, count: 0, cost: 0, adSpend: 0, totalSpend: 0, airedCount: 0 };
      }
      campaignMap[c].count += 1;
      campaignMap[c].cost += (Number(r.cost) || 0);
      campaignMap[c].adSpend += (Number(r.adSpend) || 0);
      campaignMap[c].totalSpend += ((Number(r.cost) || 0) + (Number(r.adSpend) || 0));
      if (r.statusKey === "aired") campaignMap[c].airedCount += 1;
    });
    const campaignList = Object.values(campaignMap).sort((a, b) => b.totalSpend - a.totalSpend);

    // Account: Bottlenecks (stages where statusKey !== 'aired')
    const statusMap = {};
    activeRows.forEach(r => {
      if (r.statusKey !== "aired") {
        const s = r.statusKey || "waiting_food";
        statusMap[s] = (statusMap[s] || 0) + 1;
      }
    });
    const bottlenecks = Object.entries(statusMap)
      .map(([key, count]) => {
        const stage = STATUS_MAP[key] || { label: key, color: "#666" };
        return { key, count, label: stage.label, color: stage.color };
      })
      .sort((a, b) => b.count - a.count);

    // 2. Marketing: Tiers
    const tierMap = {};
    activeRows.forEach(r => {
      const t = r.type || "Chưa phân loại";
      if (!tierMap[t]) {
        tierMap[t] = { name: t, count: 0, cost: 0, followers: 0 };
      }
      tierMap[t].count += 1;
      tierMap[t].cost += (Number(r.cost) || 0);
      tierMap[t].followers += parseFollowers(r.follower);
    });
    const tierList = Object.values(tierMap).sort((a, b) => b.count - a.count);

    // Marketing: Locations
    const locMap = {};
    activeRows.forEach(r => {
      const l = r.location || "Chưa xác định";
      if (!locMap[l]) {
        locMap[l] = { name: l, count: 0, cost: 0 };
      }
      locMap[l].count += 1;
      locMap[l].cost += (Number(r.cost) || 0);
    });
    const locList = Object.values(locMap).sort((a, b) => b.count - a.count);

    // Marketing: Audience Groups
    const groupMap = {};
    activeRows.forEach(r => {
      const g = r.group || "Chưa xác định";
      if (!groupMap[g]) {
        groupMap[g] = { name: g, count: 0 };
      }
      groupMap[g].count += 1;
    });
    const groupList = Object.values(groupMap).sort((a, b) => b.count - a.count);

    // Total followers
    const totalFollowers = activeRows.reduce((sum, r) => sum + parseFollowers(r.follower), 0);

    // 3. Ecom: Cost efficiency
    const ecomList = activeRows
      .map(r => {
        const fl = parseFollowers(r.follower);
        const cost = Number(r.cost) || 0;
        return {
          ...r,
          followersNum: fl,
          cpf: fl > 0 ? cost / fl : null,
        };
      })
      .filter(r => r.followersNum > 0);
    const sortedEcom = [...ecomList]
      .filter(r => r.cpf !== null)
      .sort((a, b) => a.cpf - b.cpf);

    // Ecom: Aired link status
    const airedKOLsCount = activeRows.filter(r => r.statusKey === "aired").length;
    const airedWithLink = activeRows.filter(r => r.statusKey === "aired" && r.airedLink && r.airedLink.trim().startsWith("http")).length;
    const linkAiredRate = airedKOLsCount ? Math.round((airedWithLink / airedKOLsCount) * 100) : 0;
    const airedMissingLink = activeRows.filter(r => r.statusKey === "aired" && (!r.airedLink || !r.airedLink.trim().startsWith("http")));

    // Ecom: Dish analysis
    const dishMap = {};
    activeRows.forEach(r => {
      if (r.monAn) {
        const firstLine = r.monAn.split("\n")[0].trim();
        if (firstLine) {
          dishMap[firstLine] = (dishMap[firstLine] || 0) + 1;
        }
      }
    });
    const dishList = Object.entries(dishMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // CPM Est
    const totalFollowersOfEcom = ecomList.reduce((sum, r) => sum + r.followersNum, 0);
    const totalCostOfEcom = ecomList.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
    const cpmEst = totalFollowersOfEcom > 0 ? (totalCostOfEcom / totalFollowersOfEcom) * 1000 : 0;

    return {
      totalKOL, totalCost, avgCost, airedCount, airedRate, zeroCostCount,
      campaignList, bottlenecks,
      tierList, locList, groupList, totalFollowers,
      sortedEcom, linkAiredRate, airedMissingLink, dishList, cpmEst,
      totalViews, totalEstViews, kpiViewsAchievedRate,
      totalLikes, totalComments, totalSaves, totalShares, totalEngagement, avgEngRate,
      totalAdSpend, totalSpend, totalConversions, totalAddToCart, totalRevenue, roas, cpv,
      topKOLsByViews, topKOLsByRevenue
    };
  }, [activeRows]);

  if (!metrics) return null;

  // Helper colors for charts
  const COLOR_PALETTE = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE"];

  // Smart Insights Texts
  const accountInsights = [];
  const topCampaign = metrics.campaignList[0];
  if (topCampaign) {
    const pct = Math.round((topCampaign.totalSpend / metrics.totalSpend) * 100);
    accountInsights.push(`💼 Chiến dịch <strong>${topCampaign.campaign}</strong> đang dẫn đầu về tổng ngân sách đầu tư (Booking + Ads) với <strong>${fmtVND(topCampaign.totalSpend)}</strong> (chiếm <strong>${pct}%</strong> tổng ngân sách).`);
  }
  const topBottleneck = metrics.bottlenecks[0];
  if (topBottleneck && topBottleneck.count > 0) {
    accountInsights.push(`⚠️ Trạng thái <strong>"${topBottleneck.label}"</strong> hiện là nút thắt cổ chai lớn nhất với <strong>${topBottleneck.count} KOL</strong> đang chờ xử lý/phê duyệt.`);
  }
  if (metrics.zeroCostCount > 0) {
    accountInsights.push(`🎁 Có <strong>${metrics.zeroCostCount} KOL</strong> chạy hình thức đổi quà/miễn phí booking trực tiếp, giúp tiết kiệm chi phí.`);
  }
  if (metrics.airedRate > 70) {
    accountInsights.push(`📈 Tỷ lệ hoàn thành lên sóng đạt mức cao (<strong>${metrics.airedRate}%</strong>), dự án đang nghiệm thu tốt.`);
  } else if (metrics.airedRate < 35) {
    accountInsights.push(`⏳ Tỷ lệ lên sóng hiện tại khá thấp (<strong>${metrics.airedRate}%</strong>), team Account cần đôn đốc duyệt kịch bản & demo.`);
  }

  const marketingInsights = [];
  const topTier = metrics.tierList[0];
  if (topTier) {
    const pct = Math.round((topTier.count / metrics.totalKOL) * 100);
    marketingInsights.push(`🎯 Phân khúc <strong>${topTier.name}</strong> chiếm đa số với <strong>${topTier.count} KOLs</strong> (tỷ lệ <strong>${pct}%</strong>).`);
  }
  const topLoc = metrics.locList[0];
  if (topLoc) {
    marketingInsights.push(`📍 Điểm nóng địa lý tập trung cao nhất tại <strong>${topLoc.name}</strong> với <strong>${topLoc.count} KOLs</strong>.`);
  }
  const topGroup = metrics.groupList[0];
  if (topGroup) {
    marketingInsights.push(`👥 Nhóm đối tượng độc giả <strong>"${topGroup.name}"</strong> đang được phủ sóng nhiều nhất.`);
  }
  if (metrics.totalViews > 0) {
    marketingInsights.push(`📈 Tổng lượt xem thực tế đạt <strong>${metrics.totalViews.toLocaleString()} views</strong>, hoàn thành <strong>${metrics.kpiViewsAchievedRate}%</strong> so với KPI dự kiến.`);
  }
  if (metrics.totalEngagement > 0) {
    marketingInsights.push(`🔥 Tệp nội dung tạo ra <strong>${metrics.totalEngagement.toLocaleString()} tương tác</strong> (Likes, Comments, Saves, Shares), đạt tỷ lệ tương tác bình quân <strong>${metrics.avgEngRate}%</strong> trên lượt xem.`);
  }
  if (metrics.totalFollowers > 0) {
    marketingInsights.push(`📢 Tổng độ phủ truyền thông (followers) tích lũy của tệp KOL đạt khoảng <strong>${fmtFollowers(metrics.totalFollowers)}</strong>.`);
  }

  const ecomInsights = [];
  const bestKOL = metrics.sortedEcom[0];
  if (bestKOL) {
    ecomInsights.push(`🛒 KOL <strong>${bestKOL.kol}</strong> (${bestKOL.follower}) đạt hiệu số tiếp cận tối ưu nhất với chi phí chỉ <strong>${Math.round(bestKOL.cpf).toLocaleString()}đ</strong> / follower.`);
  }
  if (metrics.totalRevenue > 0) {
    ecomInsights.push(`💰 Tổng doanh thu / GMV ghi nhận đạt <strong>${fmtVND(metrics.totalRevenue)}</strong>. Tỷ lệ doanh số trên chi phí chạy ads (ROAS) đạt <strong>${metrics.roas}x</strong>.`);
  }
  if (metrics.totalAdSpend > 0) {
    ecomInsights.push(`💸 Tổng ngân sách chạy quảng cáo ads đã giải ngân là <strong>${fmtVND(metrics.totalAdSpend)}</strong>, với chi phí bình quân trên mỗi lượt xem (CPV) là <strong>${metrics.cpv}đ/view</strong>.`);
  }
  if (metrics.linkAiredRate < 100 && metrics.airedCount > 0) {
    const missingCount = metrics.airedMissingLink.length;
    ecomInsights.push(`🔗 Còn <strong>${missingCount} KOL</strong> đã lên sóng nhưng chưa cập nhật Link Video. Cần bổ sinh link video để chạy ads / đo lường giỏ hàng.`);
  }
  const topDish = metrics.dishList[0];
  if (topDish) {
    ecomInsights.push(`🍽 Sản phẩm/Món ăn được quảng bá chủ đạo là <strong>"${topDish.name}"</strong> (${topDish.count} bài kịch bản).`);
  }
  if (metrics.cpmEst > 0) {
    ecomInsights.push(`💸 Chỉ số CPM trung bình dự kiến của chiến dịch là <strong>${fmtVND(metrics.cpmEst)}</strong> / 1,000 followers tiếp cận.`);
  }

  return (
    <div style={{ padding: 20 }}>
      {/* ── Campaign Selector ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
        flexWrap: "wrap",
        background: "var(--red-soft)",
        padding: "10px 16px",
        borderRadius: 10,
        border: "1px solid var(--line)"
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap" }}>📁 Chọn Báo cáo Dự án:</span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            className={`kt-btn ${selectedCampaign === "all" ? "kt-btn-primary" : "kt-btn-ghost"}`}
            onClick={() => setSelectedCampaign("all")}
            style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6 }}
          >
            Tổng cộng (Tất cả)
          </button>
          {campaigns.filter(c => c !== "all").map(c => (
            <button
              key={c}
              className={`kt-btn ${selectedCampaign === c ? "kt-btn-primary" : "kt-btn-ghost"}`}
              onClick={() => setSelectedCampaign(c)}
              style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6 }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Role perspective selector tabs ── */}
      <div style={{
        display: "flex",
        gap: 8,
        borderBottom: "1px solid var(--line)",
        paddingBottom: 12,
        marginBottom: 20,
        flexWrap: "wrap"
      }}>
        <button
          className={`kt-btn ${subView === "account" ? "kt-btn-primary" : "kt-btn-ghost"}`}
          onClick={() => setSubView("account")}
          style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8 }}
        >
          💼 Account (Tài chính & Tiến độ)
        </button>
        <button
          className={`kt-btn ${subView === "marketing" ? "kt-btn-primary" : "kt-btn-ghost"}`}
          onClick={() => setSubView("marketing")}
          style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8 }}
        >
          🎯 Marketing (Đối tượng & Độ phủ)
        </button>
        <button
          className={`kt-btn ${subView === "ecom" ? "kt-btn-primary" : "kt-btn-ghost"}`}
          onClick={() => setSubView("ecom")}
          style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8 }}
        >
          🛒 E-commerce (Hiệu quả & Link)
        </button>
      </div>

      {/* ── Subviews Rendering ── */}
      {subView === "account" && (
        <div className="kt-anim">
          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
            <StatCard title="Tổng ngân sách" value={fmtVND(metrics.totalSpend)} subtext={`Booking: ${fmtVND(metrics.totalCost)} | Ads: ${fmtVND(metrics.totalAdSpend)}`} color="var(--red)" />
            <StatCard title="Chi phí trung bình" value={fmtVND(metrics.totalSpend / metrics.totalKOL)} subtext="Tổng chi phí trên mỗi KOL" />
            <StatCard title="Tỷ lệ lên sóng" value={`${metrics.airedRate}%`} subtext={`${metrics.airedCount} / ${metrics.totalKOL} KOL đã hoàn thành`} color="var(--green)" />
            <StatCard title="KOL đổi quà (0đ)" value={`${metrics.zeroCostCount} KOL`} subtext="Không tính phí booking" color="var(--amber)" />
          </div>

          {/* Campaign breakdown table */}
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px 0", color: "var(--ink)" }}>Phân bổ ngân sách theo Chiến dịch</h3>
            <div style={{ overflowX: "auto" }} className="kt-scrollbar">
              <table className="kt-table" style={{ margin: 0, minWidth: 600 }}>
                <thead>
                  <tr>
                    <th>Chiến dịch</th>
                    <th>Số lượng KOL</th>
                    <th>Booking Cost</th>
                    <th>Ad Spend</th>
                    <th>Tổng Chi Phí</th>
                    <th>Chi phí TB/KOL</th>
                    <th>Tiến độ đã Aired</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.campaignList.map(c => {
                    const progress = c.count ? Math.round((c.airedCount / c.count) * 100) : 0;
                    return (
                      <tr key={c.campaign}>
                        <td><strong>{c.campaign}</strong></td>
                        <td>{c.count}</td>
                        <td>{fmtVND(c.cost)}</td>
                        <td>{fmtVND(c.adSpend)}</td>
                        <td><strong>{fmtVND(c.totalSpend)}</strong></td>
                        <td>{fmtVND(c.totalSpend / c.count)}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--line)", overflow: "hidden", minWidth: 80 }}>
                              <div style={{ width: `${progress}%`, background: "var(--green)", height: "100%" }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, minWidth: 30 }}>{progress}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottlenecks */}
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px 0", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
              ⚠️ Cảnh báo điểm nghẽn duyệt kịch bản / demo
            </h3>
            {metrics.bottlenecks.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                {metrics.bottlenecks.map(b => (
                  <div key={b.key} style={{ padding: 12, borderRadius: 8, background: "var(--amber-soft)", border: "1px solid var(--line)" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase" }}>{b.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: b.color, marginTop: 4 }}>{b.count} KOL đang kẹt</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 12, borderRadius: 8, background: "var(--green-soft)", color: "var(--green)", fontSize: 12, fontWeight: 600 }}>
                🎉 Tuyệt vời! Không có KOL nào đang bị nghẽn ở các bước duyệt trung gian.
              </div>
            )}
          </div>

          {/* Insights statements */}
          <div style={{ background: "var(--red-soft)", borderRadius: 12, padding: 16, border: "1px solid var(--line)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px 0", color: "var(--red)" }}>💡 Đúc kết Insight cho Account</h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "var(--ink)" }}>
              {accountInsights.map((ins, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: ins }} />
              ))}
            </ul>
          </div>
        </div>
      )}

      {subView === "marketing" && (
        <div className="kt-anim">
          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
            <StatCard title="Tổng số người theo dõi" value={fmtFollowers(metrics.totalFollowers)} subtext="Tích lũy tệp truyền thông" color="var(--red)" />
            <StatCard title="Tổng lượt xem (Views)" value={metrics.totalViews.toLocaleString()} subtext={`Đạt ${metrics.kpiViewsAchievedRate}% KPI (${metrics.totalEstViews.toLocaleString()} views)`} color="var(--blue)" />
            <StatCard title="Tổng tương tác" value={metrics.totalEngagement.toLocaleString()} subtext={`Tỷ lệ tương tác/views: ${metrics.avgEngRate}%`} color="var(--green)" />
            <StatCard title="Phân khúc chủ đạo" value={metrics.tierList[0]?.name || "N/A"} subtext="Loại KOL chiếm số đông" />
          </div>

          {/* Tiers Segmented Bar Chart */}
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px 0", color: "var(--ink)" }}>Phân bố loại KOL (Tiers) & Độ phủ</h3>
            
            {/* Visual Bar Chart */}
            <div style={{ display: "flex", height: 16, borderRadius: 8, overflow: "hidden", background: "var(--line)", marginBottom: 16 }}>
              {metrics.tierList.map((t, idx) => {
                const pct = Math.round((t.count / metrics.totalKOL) * 100);
                if (pct === 0) return null;
                const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                return (
                  <div
                    key={t.name}
                    style={{ width: `${pct}%`, background: color, height: "100%" }}
                    title={`${t.name}: ${t.count} KOL (${pct}%)`}
                  />
                );
              })}
            </div>

            {/* Breakdown details */}
            <div style={{ overflowX: "auto" }} className="kt-scrollbar">
              <table className="kt-table" style={{ margin: 0, minWidth: 400 }}>
                <thead>
                  <tr>
                    <th>Loại KOL</th>
                    <th>Số lượng</th>
                    <th>Tỷ lệ</th>
                    <th>Tổng ngân sách</th>
                    <th>Tổng Followers</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.tierList.map((t, idx) => {
                    const pct = Math.round((t.count / metrics.totalKOL) * 100);
                    return (
                      <tr key={t.name}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: COLOR_PALETTE[idx % COLOR_PALETTE.length] }} />
                            <strong>{t.name}</strong>
                          </div>
                        </td>
                        <td>{t.count}</td>
                        <td>{pct}%</td>
                        <td>{fmtVND(t.cost)}</td>
                        <td>{fmtFollowers(t.followers)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Locations & Groups grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 20 }}>
            {/* Locations */}
            <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px 0", color: "var(--ink)" }}>📍 Địa bàn của KOL</h3>
              <table className="kt-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Khu vực</th>
                    <th>Số KOL</th>
                    <th>Chi phí</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.locList.slice(0, 5).map(l => (
                    <tr key={l.name}>
                      <td><strong>{l.name}</strong></td>
                      <td>{l.count}</td>
                      <td>{fmtVND(l.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Audience Groups */}
            <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px 0", color: "var(--ink)" }}>👥 Nhóm target của KOL</h3>
              <table className="kt-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Nhóm khán giả</th>
                    <th>Số KOL</th>
                    <th>Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.groupList.slice(0, 5).map(g => (
                    <tr key={g.name}>
                      <td><strong>{g.name}</strong></td>
                      <td>{g.count}</td>
                      <td>{Math.round((g.count / metrics.totalKOL) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Viral KOLs */}
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px 0", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
              🔥 Top 5 KOLs Đạt Lượt Xem (Views) Cao Nhất
            </h3>
            {metrics.topKOLsByViews.length > 0 ? (
              <div style={{ overflowX: "auto" }} className="kt-scrollbar">
                <table className="kt-table" style={{ margin: 0, minWidth: 500 }}>
                  <thead>
                    <tr>
                      <th>KOL</th>
                      <th>Chiến dịch</th>
                      <th>KPI Views</th>
                      <th>Views thực tế</th>
                      <th>Đạt KPI</th>
                      <th>Tỷ lệ Tương tác (ER)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topKOLsByViews.map(r => {
                      const totalEng = (Number(r.likes) || 0) + (Number(r.comments) || 0) + (Number(r.saves) || 0) + (Number(r.shares) || 0);
                      const er = (Number(r.views) || 0) > 0 ? ((totalEng / r.views) * 100).toFixed(2) + "%" : "0%";
                      const kpiPct = (Number(r.estView) || 0) > 0 ? Math.round((r.views / r.estView) * 100) + "%" : "—";
                      return (
                        <tr key={r.id}>
                          <td><strong>{r.kol}</strong></td>
                          <td>{r.campaign}</td>
                          <td>{Number(r.estView) ? Number(r.estView).toLocaleString() : "—"}</td>
                          <td><strong style={{ color: "var(--blue)" }}>{Number(r.views).toLocaleString()}</strong></td>
                          <td>
                            <span className="kt-badge" style={{
                              background: parseFloat(kpiPct) >= 100 ? "var(--green-soft)" : "var(--amber-soft)",
                              color: parseFloat(kpiPct) >= 100 ? "var(--green)" : "var(--amber)",
                              border: `1px solid ${parseFloat(kpiPct) >= 100 ? "var(--green)" : "var(--amber)"}`
                            }}>
                              {kpiPct}
                            </span>
                          </td>
                          <td>{er}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 12, borderRadius: 8, background: "var(--amber-soft)", color: "var(--amber)", fontSize: 12 }}>
                ⚠️ Chưa có dữ liệu Lượt Xem thực tế được nhập.
              </div>
            )}
          </div>

          {/* Insights statements */}
          <div style={{ background: "var(--red-soft)", borderRadius: 12, padding: 16, border: "1px solid var(--line)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px 0", color: "var(--red)" }}>💡 Đúc kết Insight cho Marketing</h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "var(--ink)" }}>
              {marketingInsights.map((ins, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: ins }} />
              ))}
            </ul>
          </div>
        </div>
      )}

      {subView === "ecom" && (
        <div className="kt-anim">
          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
            <StatCard title="Tổng doanh số (GMV)" value={fmtVND(metrics.totalRevenue)} subtext={`Chỉ số sinh lời ROAS: ${metrics.roas}x`} color="var(--red)" />
            <StatCard title="Chi phí chạy Ads" value={fmtVND(metrics.totalAdSpend)} subtext={`CPV trung bình: ${metrics.cpv}đ / view`} color="var(--blue)" />
            <StatCard title="Đơn hàng (Conversions)" value={`${metrics.totalConversions.toLocaleString()} đơn`} subtext={`Thêm giỏ hàng: ${metrics.totalAddToCart.toLocaleString()} lượt`} color="var(--green)" />
            <StatCard title="CPM toàn chiến dịch" value={metrics.cpmEst ? `${fmtVND(metrics.cpmEst)}` : "N/A"} subtext="CPM trên 1000 followers tiếp cận" color="var(--amber)" />
          </div>

          {/* Top 5 cost-effective KOLs */}
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px 0", color: "var(--ink)" }}>🛒 Top 5 KOL có hiệu suất chi phí tiếp cận tối ưu nhất (CPF)</h3>
            {metrics.sortedEcom.length > 0 ? (
              <div style={{ overflowX: "auto" }} className="kt-scrollbar">
                <table className="kt-table" style={{ margin: 0, minWidth: 400 }}>
                  <thead>
                    <tr>
                      <th>KOL</th>
                      <th>Chiến dịch</th>
                      <th>Followers</th>
                      <th>Chi phí</th>
                      <th>Chi phí / 1 Follower</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.sortedEcom.slice(0, 5).map(r => (
                      <tr key={r.id}>
                        <td><strong>{r.kol}</strong></td>
                        <td>{r.campaign}</td>
                        <td>{r.follower}</td>
                        <td>{fmtVND(r.cost)}</td>
                        <td style={{ color: "var(--green)", fontWeight: 600 }}>{fmtVND(r.cpf)} / follow</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 12, borderRadius: 8, background: "var(--amber-soft)", color: "var(--amber)", fontSize: 12, fontWeight: 600 }}>
                Không tìm thấy KOL nào có ghi nhận thông tin Followers để tính chỉ số hiệu suất.
              </div>
            )}
          </div>

          {/* Top Sales KOLs */}
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px 0", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
              🛍 Top 5 KOLs Mang Lại Doanh Số / GMV Cao Nhất
            </h3>
            {metrics.topKOLsByRevenue.length > 0 ? (
              <div style={{ overflowX: "auto" }} className="kt-scrollbar">
                <table className="kt-table" style={{ margin: 0, minWidth: 500 }}>
                  <thead>
                    <tr>
                      <th>KOL</th>
                      <th>Chiến dịch</th>
                      <th>Chi phí Ads</th>
                      <th>Đơn hàng</th>
                      <th>Lượt thêm giỏ</th>
                      <th>Doanh thu (GMV)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topKOLsByRevenue.map(r => (
                      <tr key={r.id}>
                        <td><strong>{r.kol}</strong></td>
                        <td>{r.campaign}</td>
                        <td>{fmtVND(r.adSpend)}</td>
                        <td>{Number(r.conversions).toLocaleString()}</td>
                        <td>{Number(r.addToCart).toLocaleString()}</td>
                        <td><strong style={{ color: "var(--green)" }}>{fmtVND(r.revenue)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 12, borderRadius: 8, background: "var(--amber-soft)", color: "var(--amber)", fontSize: 12 }}>
                ⚠️ Chưa có dữ liệu doanh số/GMV được ghi nhận.
              </div>
            )}
          </div>

          {/* Ecom actions: Aired missing link checklist */}
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px 0", color: "var(--ink)" }}>🔗 Checklist việc cần làm: Thu thập Video Link các bài đã lên sóng (Aired)</h3>
            {metrics.airedMissingLink.length > 0 ? (
              <div>
                <p style={{ fontSize: 11, color: "var(--ink-soft)", margin: "0 0 8px 0" }}>Phát hiện <strong>{metrics.airedMissingLink.length} bài</strong> đã lên sóng nhưng chưa có đường dẫn video để đối soát:</p>
                <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid var(--line)", borderRadius: 8 }} className="kt-scrollbar">
                  <table className="kt-table" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        <th>Tên KOL</th>
                        <th>Chiến dịch</th>
                        <th>Món ăn</th>
                        <th>Ngày lên sóng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.airedMissingLink.map(r => (
                        <tr key={r.id}>
                          <td><strong>{r.kol}</strong></td>
                          <td>{r.campaign}</td>
                          <td>{r.monAn || "—"}</td>
                          <td>{r.ngayAir || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div style={{ padding: 12, borderRadius: 8, background: "var(--green-soft)", color: "var(--green)", fontSize: 12, fontWeight: 600 }}>
                ✅ Rất tốt! Toàn bộ KOL đã lên sóng (Aired) đều đã được gắn link video đầy đủ.
              </div>
            )}
          </div>

          {/* Insights statements */}
          <div style={{ background: "var(--red-soft)", borderRadius: 12, padding: 16, border: "1px solid var(--line)" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px 0", color: "var(--red)" }}>💡 Đúc kết Insight cho E-commerce</h3>
            <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "var(--ink)" }}>
              {ecomInsights.map((ins, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: ins }} />
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── Custom Notes Card ── */}
      <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: 16, marginTop: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 8px 0", color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
          📝 Nhận xét & Đánh giá của tôi
        </h3>
        <p style={{ fontSize: 11, color: "var(--ink-soft)", margin: "0 0 12px 0" }}>
          Ghi chú này sẽ được lưu riêng cho chiến dịch <strong>{selectedCampaign === "all" ? "Tổng cộng (Tất cả)" : selectedCampaign}</strong>.
        </p>
        <textarea
          className="kt-textarea"
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Nhập đánh giá hiệu quả, đề xuất tối ưu hoặc lưu ý quan trọng cho dự án tại đây..."
          style={{ width: "100%", height: 100, resize: "vertical", fontSize: 13, padding: 10, borderRadius: 8, border: "1px solid var(--line)", outline: "none", marginBottom: 12 }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="kt-btn kt-btn-primary"
            onClick={() => onSaveNote(selectedCampaign, noteText)}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "8px 16px" }}
          >
            💾 Lưu Nhận xét & Đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   MAIN APP
================================================================ */
const LS_KEY = "kol_tracker_v1";

export default function App() {
  const [data, setData] = useState(() => {
    try { const s = localStorage.getItem(LS_KEY); return s ? JSON.parse(s) : SEED_DATA; }
    catch { return SEED_DATA; }
  });
  const [view, setView] = useState("table"); // "table" | "kanban"
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

  const [insightsNotes, setInsightsNotes] = useState(() => {
    try {
      const s = localStorage.getItem("kol_tracker_insights_notes_v1");
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("kol_tracker_insights_notes_v1", JSON.stringify(insightsNotes));
  }, [insightsNotes]);

  const [wizardData, setWizardData] = useState(null); // { rawHeaders, rawRows, fileName }

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // Parse Excel or JSON → open wizard
  const handleImport = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isExcel = /\.(xlsx|xls)$/i.test(file.name);
    const isJson = /\.json$/i.test(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        let rawHeaders = [];
        let rawRows = [];

        if (isExcel) {
          const wb = XLSX.read(ev.target.result, { type: "array" });

          // Read ALL sheets and combine
          const allSheets = wb.SheetNames
            .map(shName => {
              const ws = wb.Sheets[shName];
              const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
              // Skip rows where KOL is empty (summary rows, totals, etc)
              const real = json.filter(r => r["KOL"] && String(r["KOL"]).trim());
              return { name: shName, rows: real };
            })
            .filter(s => s.rows.length > 0);

          if (!allSheets.length) throw new Error("Không tìm thấy dữ liệu KOL trong file");

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
          const parsed = JSON.parse(new TextDecoder().decode(ev.target.result));
          const arr = Array.isArray(parsed) ? parsed : parsed.data || parsed.kols || null;
          if (!arr || !Array.isArray(arr)) throw new Error("Không tìm thấy mảng dữ liệu trong JSON");
          if (!arr.length) throw new Error("File không có dữ liệu");
          rawHeaders = Object.keys(arr[0]);
          rawRows = arr;
          setWizardData({ rawHeaders, rawRows, fileName: file.name, sheetInfo: null });
        } else {
          throw new Error("Chỉ hỗ trợ file .xlsx, .xls hoặc .json");
        }
      } catch (err) {
        showToast(`❌ Lỗi: ${err.message}`, false);
      } finally {
        e.target.value = "";
      }
    };

    if (isExcel) reader.readAsArrayBuffer(file);
    else reader.readAsArrayBuffer(file);
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

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(r => {
      if (filterCampaign !== "all" && r.campaign !== filterCampaign) return false;
      if (filterStatus !== "all" && r.statusKey !== filterStatus) return false;
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
  const handleReset = () => {
    const clearAll = window.confirm(
      "Bạn muốn thực hiện thao tác nào?\n\n" +
      "- Bấm 'OK' để XÓA SẠCH toàn bộ dữ liệu hiện tại (về 0 KOLs).\n" +
      "- Bấm 'Cancel' để KHÔI PHỤC lại 66 dòng dữ liệu mẫu ban đầu."
    );
    if (clearAll) {
      setData([]);
    } else {
      if (window.confirm("Bạn có chắc chắn muốn khôi phục lại 66 dòng dữ liệu mẫu ban đầu? Mọi chỉnh sửa hiện tại sẽ bị mất.")) {
        setData(SEED_DATA);
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
        padding: "14px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "sticky", top: 0, zIndex: 50,
      }}>
        {/* Top Row: Title + Main Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <h1 className="kt-display" style={{ fontSize: 22, color: "var(--ink)", margin: 0 }}>KOL Tracker</h1>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {/* View toggle */}
            <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
              <button className={`kt-btn kt-btn-ghost${view === "table" ? " active" : ""}`}
                onClick={() => setView("table")}>☰ Bảng</button>
              <button className={`kt-btn kt-btn-ghost${view === "kanban" ? " active" : ""}`}
                onClick={() => setView("kanban")}>⬛ Kanban</button>
              <button className={`kt-btn kt-btn-ghost${view === "insights" ? " active" : ""}`}
                onClick={() => setView("insights")}>📊 Insights</button>
            </div>

            {/* Excel / JSON Actions */}
            <input ref={importRef} type="file" accept=".xlsx,.xls,.json,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              style={{ display: "none" }} onChange={handleImport} />
            <button className="kt-btn kt-btn-ghost" onClick={handleDownloadTemplate}
              title="Tải file Excel mẫu đúng định dạng" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              📎 Template
            </button>
            <button className="kt-btn kt-btn-ghost" onClick={() => importRef.current?.click()}
              title="Import file Excel (.xlsx) hoặc JSON" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              📥 Import Excel / JSON
            </button>

            {/* Add & Reset */}
            <button className="kt-btn kt-btn-primary" onClick={() => setShowNew(true)}>＋ Thêm KOL</button>
            <button className="kt-btn kt-btn-ghost" onClick={handleReset} title="Reset data" style={{ padding: "8px 12px" }}>↺</button>
          </div>
        </div>

        {/* Bottom Row: Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Search */}
          <input className="kt-input" placeholder="🔍 Tìm tên KOL, món ăn…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: 220 }} />

          {/* Campaign filter */}
          <select className="kt-select" value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)}
            style={{ width: 160 }}>
            <option value="all">All campaigns</option>
            {CAMPAIGNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>

          {/* Status filter */}
          <select className="kt-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ width: 190 }}>
            <option value="all">All status</option>
            {STATUS_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>

          {/* Type filter */}
          <select className="kt-select" value={filterType} onChange={e => setFilterType(e.target.value)}
            style={{ width: 130 }}>
            <option value="all">All types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Stats Row */}
        <StatsBar rows={filtered} />
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "20px" }}>
        <div style={{ background: "var(--card)", borderRadius: 12, border: "1px solid var(--line)", overflow: "clip" }}>
          {view === "table" && <TableView rows={filtered} onOpen={r => setSelected(r)} />}
          {view === "kanban" && <KanbanView rows={filtered} onOpen={r => setSelected(r)} />}
          {view === "insights" && (
            <InsightsView
              rows={data}
              insightsNotes={insightsNotes}
              onSaveNote={(campaign, text) => {
                setInsightsNotes(prev => ({ ...prev, [campaign]: text }));
                showToast("Đã lưu nhận xét thành công!");
              }}
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
          onConfirm={(rows) => {
            setData(rows);
            setWizardData(null);
            showToast(`✅ Đã import ${rows.length} KOLs thành công!`, true);
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
    </div>
  );
}
