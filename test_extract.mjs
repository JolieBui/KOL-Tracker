const extractTikTokUsername = (link) => {
  if (!link) return "";
  let cleaned = link.trim().split("?")[0];
  cleaned = cleaned.split("#")[0];
  
  const atMatch = cleaned.match(/@([a-zA-Z0-9_\.]+)/);
  if (atMatch) return atMatch[1];
  
  const parts = cleaned.split("/");
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    if (part.startsWith("@")) return part.replace("@", "");
    if (part && !part.includes(".") && part !== "user") return part;
  }
  return "";
};

console.log("1:", extractTikTokUsername("https://www.tiktok.com/@annhien_boiboi?lang=en"));
console.log("2:", extractTikTokUsername("https://tiktok.com/@zachking/video/12345"));
console.log("3:", extractTikTokUsername("zachking"));
console.log("4:", extractTikTokUsername("@zachking"));
