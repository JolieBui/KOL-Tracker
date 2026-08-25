import re

with open("src/App.jsx", "r") as f:
    content = f.read()

# 1. Replace domain constants with DEFAULT_STATUS_STAGES and color util
domain_constants = """const CAMPAIGNS = [
  { key: "AM", label: "AM", color: "#FFAFA3" },
  { key: "AX", label: "AX", color: "#A2C2E8" },
  { key: "Vinegar", label: "Vinegar", color: "#A8C3A0" },
  { key: "MSG", label: "MGS", color: "#FFD175" },
  { key: "Blendy", label: "Blendy", color: "#C7B1E6" },
];
const CAMPAIGN_COLOR = Object.fromEntries(CAMPAIGNS.map(c => [c.key, c.color]));
const CAMPAIGN_LABELS = Object.fromEntries(CAMPAIGNS.map(c => [c.key, c.label]));

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
]);"""

new_domain_constants = """const PREDEFINED_COLORS = ["#FFAFA3", "#A2C2E8", "#A8C3A0", "#FFD175", "#C7B1E6", "#F4A261", "#E76F51", "#2A9D8F", "#E9C46A", "#264653"];
const getCampaignColor = (key) => {
  if (!key) return "#888";
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PREDEFINED_COLORS[Math.abs(hash) % PREDEFINED_COLORS.length];
};

const normalizeCampaignKey = (name) => {
  if (!name) return "";
  return name.toString().trim();
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
];"""

content = content.replace(domain_constants, new_domain_constants)

with open("src/App.jsx", "w") as f:
    f.write(content)
print("Updated domain constants")
