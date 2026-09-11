import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn, exec } from "child_process";
import xlsx from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const app = express();
app.use(cors());
app.use(express.json());

const CONFIG_PATH = path.join(ROOT_DIR, "config.json");
const SNAPSHOTS_PATH = path.join(ROOT_DIR, "daily_snapshots.json");
const COMMENTS_CACHE_PATH = path.join(ROOT_DIR, "tiktok_comments_cache.json");
const COMPETITOR_EXCEL_PATH = path.join(ROOT_DIR, "[INT] AVN - COMPETITOR PRICE.xlsx");
const PLIST_PATH = path.join(ROOT_DIR, "com.avn.dailyreport.plist");

function readJSON(filePath, defaultVal = {}) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultVal;
}

// 1. Health & Launchd System Status
app.get("/api/status", (req, res) => {
  const isPlistExists = fs.existsSync(PLIST_PATH);
  
  exec("launchctl list | grep com.avn.dailyreport", (err, stdout) => {
    const isScheduled = !err && stdout.trim().length > 0;
    const pidMatch = stdout ? stdout.match(/^(\d+)/) : null;
    
    res.json({
      status: "online",
      serverTime: new Date().toISOString(),
      launchd: {
        plistExists: isPlistExists,
        isScheduled: isScheduled,
        pid: pidMatch ? pidMatch[1] : null,
        scheduleInfo: "Hàng ngày lúc 21:00 (Daily at 21:00)",
        rawOutput: (stdout || "").trim()
      }
    });
  });
});

// 2. Daily Snapshots
app.get("/api/snapshots", (req, res) => {
  const data = readJSON(SNAPSHOTS_PATH);
  res.json(data);
});

// 3. Config
app.get("/api/config", (req, res) => {
  const config = readJSON(CONFIG_PATH, {
    lark_webhook_url: "",
    viral_spike_threshold: 150000,
    competitors: []
  });
  res.json(config);
});

app.post("/api/config", (req, res) => {
  try {
    const current = readJSON(CONFIG_PATH, {});
    const updated = { ...current, ...req.body };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), "utf-8");
    res.json({ success: true, config: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Comment Analysis & Sentiment
app.get("/api/comments", (req, res) => {
  const cache = readJSON(COMMENTS_CACHE_PATH, {});
  
  let totalComments = 0;
  let totalVideos = Object.keys(cache).length;
  
  const sentimentCounts = {
    Positive: 0,
    Neutral: 0,
    Negative: 0,
    Inquiry: 0,
    BuyingIntent: 0
  };
  
  const sampleComments = [];
  const keywordFreq = {};

  const recipeKeywords = ["xin công thức", "xin ct", "cách làm", "cách nấu", "mua ở đâu", "tỉ lệ", "hướng dẫn"];
  const negKeywords = ["dở", "đau đầu", "độc hại", "mặn quá", "ngọt quá", "chê", "không ngon", "ngấy"];
  const posKeywords = ["ngon", "thèm", "hấp dẫn", "tuyệt vời", "khéo tay", "đỉnh", "mê", "thích", "xuất sắc"];
  const buyKeywords = ["mua", "đặt", "chốt", "order", "giá bao nhiêu", "xin link"];

  Object.entries(cache).forEach(([videoKey, comments]) => {
    if (Array.isArray(comments)) {
      totalComments += comments.length;
      comments.forEach(c => {
        const text = (c.text || "").toLowerCase();
        
        let sentiment = "Neutral";
        if (negKeywords.some(k => text.includes(k))) {
          sentiment = "Negative";
          sentimentCounts.Negative++;
        } else if (posKeywords.some(k => text.includes(k))) {
          sentiment = "Positive";
          sentimentCounts.Positive++;
        } else if (recipeKeywords.some(k => text.includes(k))) {
          sentiment = "Inquiry";
          sentimentCounts.Inquiry++;
        } else if (buyKeywords.some(k => text.includes(k))) {
          sentiment = "BuyingIntent";
          sentimentCounts.BuyingIntent++;
        } else {
          sentimentCounts.Neutral++;
        }

        const words = text.split(/\s+/);
        words.forEach(w => {
          const cleanW = w.replace(/[^\wàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/gi, "");
          if (cleanW.length >= 3 && !["cho", "với", "này", "cái", "thì", "được", "mình", "ngon", "quá", "làm"].includes(cleanW)) {
            keywordFreq[cleanW] = (keywordFreq[cleanW] || 0) + 1;
          }
        });

        if (sampleComments.length < 150) {
          sampleComments.push({
            id: c.id,
            videoKey,
            text: c.text,
            nickname: c.nickname,
            unique_id: c.unique_id,
            digg_count: c.digg_count || 0,
            sentiment
          });
        }
      });
    }
  });

  const sortedKeywords = Object.entries(keywordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word, count]) => ({ word, count }));

  res.json({
    totalVideos,
    totalComments,
    sentimentCounts,
    topKeywords: sortedKeywords,
    comments: sampleComments
  });
});

// 5. Competitor Price Intelligence
app.get("/api/competitors", (req, res) => {
  try {
    if (!fs.existsSync(COMPETITOR_EXCEL_PATH)) {
      return res.status(404).json({ error: "Excel competitor price file not found" });
    }

    const wb = xlsx.readFile(COMPETITOR_EXCEL_PATH);
    const brands = ["Vedan", "Barona", "Knorr", "Nestle", "Masan", "Cholimex", "Kewpie", "Ông Chà Và"];
    
    const result = [];

    brands.forEach(brandName => {
      const sheet = wb.Sheets[brandName];
      if (sheet) {
        const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        const products = [];
        
        for (let i = 2; i < rows.length; i++) {
          const row = rows[i];
          if (row && row[0] && typeof row[0] === "string" && !row[0].includes("Product Title")) {
            products.push({
              title: row[0],
              link: row[1] || "",
              rrpNov: row[2] || 0,
              voucherNov: row[3] || "No",
              rrpDecBefore: row[4] || 0,
              voucherDecBefore: row[5] || "No",
              pctChangeDecVsNov: row[6] || 0,
              rrpDecAfter: row[7] || 0,
              voucherDecAfter: row[8] || "No"
            });
          }
        }

        result.push({
          brand: brandName,
          totalSKUs: products.length,
          products
        });
      }
    });

    res.json({
      lastUpdate: fs.statSync(COMPETITOR_EXCEL_PATH).mtime,
      brands: result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Execute Automation Run (SSE Log Stream for auto_daily_scrape.py)
app.get("/api/run-scrape-stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const scriptPath = path.join(ROOT_DIR, "auto_daily_scrape.py");
  res.write(`data: ${JSON.stringify({ type: "start", message: "🚀 Đang khởi động script auto_daily_scrape.py..." })}\n\n`);

  const proc = spawn("python3", [scriptPath, "--force"], { cwd: ROOT_DIR });

  proc.stdout.on("data", data => {
    const lines = data.toString().split("\n");
    lines.forEach(line => {
      if (line.trim()) {
        res.write(`data: ${JSON.stringify({ type: "log", message: line.trim() })}\n\n`);
      }
    });
  });

  proc.stderr.on("data", data => {
    const lines = data.toString().split("\n");
    lines.forEach(line => {
      if (line.trim()) {
        res.write(`data: ${JSON.stringify({ type: "err", message: line.trim() })}\n\n`);
      }
    });
  });

  proc.on("close", code => {
    res.write(`data: ${JSON.stringify({ type: "end", code, message: code === 0 ? "✅ Đã hoàn tất scraping & gửi báo cáo thành công!" : `❌ Tiến trình kết thúc với mã lỗi ${code}` })}\n\n`);
    res.end();
  });
});

// 7. Execute Sync Master Tracking (SSE Log Stream)
app.get("/api/run-sync-stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const scriptPath = path.join(ROOT_DIR, "sync_and_update_master_tracking.py");
  res.write(`data: ${JSON.stringify({ type: "start", message: "🔄 Đang khởi động đồng bộ Master Tracking..." })}\n\n`);

  const proc = spawn("python3", [scriptPath], { cwd: ROOT_DIR });

  proc.stdout.on("data", data => {
    const lines = data.toString().split("\n");
    lines.forEach(line => {
      if (line.trim()) {
        res.write(`data: ${JSON.stringify({ type: "log", message: line.trim() })}\n\n`);
      }
    });
  });

  proc.stderr.on("data", data => {
    const lines = data.toString().split("\n");
    lines.forEach(line => {
      if (line.trim()) {
        res.write(`data: ${JSON.stringify({ type: "err", message: line.trim() })}\n\n`);
      }
    });
  });

  proc.on("close", code => {
    res.write(`data: ${JSON.stringify({ type: "end", code, message: code === 0 ? "✅ Đồng bộ Master Tracking thành công!" : `❌ Mã lỗi ${code}` })}\n\n`);
    res.end();
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`⚡ Automation API Server running on http://localhost:${PORT}`);
});
