import React, { useState, useEffect } from "react";

export default function AutomationHub() {
  const [status, setStatus] = useState(null);
  const [config, setConfig] = useState({ lark_webhook_url: "", viral_spike_threshold: 150000 });
  const [savingConfig, setSavingConfig] = useState(false);
  const [toast, setToast] = useState(null);

  // Console log state
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeJob, setActiveJob] = useState(null);

  const fetchSystemInfo = async () => {
    try {
      const [resStatus, resConfig] = await Promise.all([
        fetch("http://localhost:3001/api/status"),
        fetch("http://localhost:3001/api/config")
      ]);
      if (resStatus.ok) setStatus(await resStatus.json());
      if (resConfig.ok) setConfig(await resConfig.json());
    } catch (err) {
      console.error("API Server offline:", err);
    }
  };

  useEffect(() => {
    fetchSystemInfo();
    const timer = setInterval(fetchSystemInfo, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      const res = await fetch("http://localhost:3001/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        showToast("✅ Đã lưu cấu hình Lark Webhook & Ngưỡng Viral!");
      } else {
        showToast("❌ Lỗi lưu cấu hình", false);
      }
    } catch (err) {
      showToast(`❌ Lỗi: ${err.message}`, false);
    } finally {
      setSavingConfig(false);
    }
  };

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const startJob = (endpoint, jobName) => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveJob(jobName);
    setLogs([{ type: "start", message: `[${new Date().toLocaleTimeString()}] Bắt đầu tiến trình: ${jobName}` }]);

    const eventSource = new EventSource(`http://localhost:3001/api/${endpoint}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLogs((prev) => [...prev, data]);
        if (data.type === "end") {
          eventSource.close();
          setIsRunning(false);
          setActiveJob(null);
          fetchSystemInfo();
        }
      } catch (err) {
        console.error(err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      setLogs((prev) => [...prev, { type: "err", message: "❌ Lỗi kết nối luồng dữ liệu log (SSE disconnected)" }]);
      eventSource.close();
      setIsRunning(false);
      setActiveJob(null);
    };
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto", height: "100%", overflowY: "auto" }}>
      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        color: "#FFF",
        padding: "24px",
        borderRadius: "16px",
        marginBottom: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.25)"
      }}>
        <div>
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#38BDF8", fontWeight: 700, marginBottom: "4px" }}>
            Hệ Thống Tự Động Hóa FY26
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, margin: 0 }}>
            ⚡ Automation Control Hub & Schedule Monitor
          </h2>
          <p style={{ margin: "6px 0 0 0", color: "#94A3B8", fontSize: "14px" }}>
            Quản lý thu thập số liệu TikTok thời gian thực, đồng bộ Master Tracking & gửi báo cáo Lark tự động.
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: status?.status === "online" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
            border: `1px solid ${status?.status === "online" ? "#10B981" : "#EF4444"}`,
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 600,
            color: status?.status === "online" ? "#34D399" : "#F87171"
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: status?.status === "online" ? "#34D399" : "#F87171",
              boxShadow: status?.status === "online" ? "0 0 8px #34D399" : "none"
            }} />
            {status?.status === "online" ? "API Engine Connected" : "API Engine Disconnected"}
          </div>
        </div>
      </div>

      {toast && (
        <div style={{
          padding: "12px 20px",
          background: toast.ok ? "#DCFCE7" : "#FFE4E6",
          color: toast.ok ? "#15803D" : "#E11D48",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: 600,
          border: `1px solid ${toast.ok ? "#86EFAC" : "#FDA4AF"}`
        }}>
          {toast.msg}
        </div>
      )}

      {/* Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        
        {/* Card 1: Trigger Controls */}
        <div className="kt-card" style={{ padding: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 16px 0", color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
            🎯 Kích Hoạt Tiến Trình Tự Động
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "var(--surface)", padding: "14px", borderRadius: "10px", border: "1px solid var(--rule)" }}>
              <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "4px" }}>
                1. Scrape TikTok Live & Gửi Báo Cáo Lark Bot
              </div>
              <p style={{ fontSize: "12px", color: "var(--ink-soft)", margin: "0 0 10px 0" }}>
                Quét 100% số liệu TikTok (Views, Likes, Comments, Shares, Saves), ghi snapshots & gửi tin nhắn báo cáo vào Lark.
              </p>
              <button
                disabled={isRunning}
                onClick={() => startJob("run-scrape-stream", "Daily Scrape & Lark Report")}
                style={{
                  background: isRunning && activeJob === "Daily Scrape & Lark Report" ? "#94A3B8" : "linear-gradient(135deg, #0284C7, #0369A1)",
                  color: "#FFF",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: isRunning ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)"
                }}
              >
                {isRunning && activeJob === "Daily Scrape & Lark Report" ? "⏳ Đang quét..." : "🚀 Kích Hoạt Daily Scrape Ngay"}
              </button>
            </div>

            <div style={{ background: "var(--surface)", padding: "14px", borderRadius: "10px", border: "1px solid var(--rule)" }}>
              <div style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "4px" }}>
                2. Đồng Bộ Dữ Liệu Master Tracking (Excel)
              </div>
              <p style={{ fontSize: "12px", color: "var(--ink-soft)", margin: "0 0 10px 0" }}>
                Ghi đè số liệu TikTok mới nhất vào file `KOL_KOC_MASTER_TRACKING_FY26.xlsx`.
              </p>
              <button
                disabled={isRunning}
                onClick={() => startJob("run-sync-stream", "Sync Master Tracking")}
                style={{
                  background: isRunning && activeJob === "Sync Master Tracking" ? "#94A3B8" : "linear-gradient(135deg, #7C3AED, #6D28D9)",
                  color: "#FFF",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: isRunning ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)"
                }}
              >
                {isRunning && activeJob === "Sync Master Tracking" ? "⏳ Đang đồng bộ..." : "🔄 Kích Hoạt Đồng Bộ Master Excel"}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Schedule & Launchd Status */}
        <div className="kt-card" style={{ padding: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 16px 0", color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
            ⏰ Lịch Chạy Tự Động macOS Launchd Daemon
          </h3>

          <div style={{ background: "var(--surface)", padding: "14px", borderRadius: "10px", border: "1px solid var(--rule)", marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: "var(--ink-soft)" }}>Trạng thái Schedule (`com.avn.dailyreport`):</span>
              <span style={{
                fontWeight: 700,
                color: status?.launchd?.isScheduled ? "#15803D" : "#D97706",
                background: status?.launchd?.isScheduled ? "#DCFCE7" : "#FEF3C7",
                padding: "2px 8px",
                borderRadius: "6px",
                fontSize: "12px"
              }}>
                {status?.launchd?.isScheduled ? "Active (Đang Chạy Tự Động)" : "Inactive / Idle"}
              </span>
            </div>
            <div style={{ fontSize: "13px", color: "var(--ink)", marginBottom: "4px" }}>
              <strong>Lịch chạy:</strong> Hàng ngày lúc 21:00 (Daily 9:00 PM)
            </div>
            <div style={{ fontSize: "12px", color: "var(--ink-soft)" }}>
              <strong>File cấu hình:</strong> `com.avn.dailyreport.plist` ({status?.launchd?.plistExists ? "Đã cài đặt" : "Chưa tìm thấy"})
            </div>
          </div>

          <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "16px 0 10px 0" }}>⚙️ Cấu Hình Lark Bot Webhook</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink-soft)", display: "block", marginBottom: "4px" }}>
                Lark Webhook URL:
              </label>
              <input
                type="text"
                value={config.lark_webhook_url || ""}
                onChange={(e) => setConfig({ ...config, lark_webhook_url: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--rule)",
                  fontSize: "13px"
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink-soft)", display: "block", marginBottom: "4px" }}>
                Ngưỡng Cảnh Báo Clip Viral (Views):
              </label>
              <input
                type="number"
                value={config.viral_spike_threshold || 150000}
                onChange={(e) => setConfig({ ...config, viral_spike_threshold: parseInt(e.target.value) || 0 })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--rule)",
                  fontSize: "13px"
                }}
              />
            </div>

            <button
              disabled={savingConfig}
              onClick={handleSaveConfig}
              style={{
                background: "#0F172A",
                color: "#FFF",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: 600,
                cursor: "pointer",
                marginTop: "6px"
              }}
            >
              {savingConfig ? "Đang lưu..." : "💾 Lưu Cấu Hình"}
            </button>
          </div>
        </div>
      </div>

      {/* Execution Log Console */}
      <div className="kt-card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
            🖥️ Terminal Console (Live Process Output)
          </h3>
          {logs.length > 0 && (
            <button
              onClick={() => setLogs([])}
              style={{
                background: "transparent",
                border: "1px solid var(--rule)",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
                color: "var(--ink-soft)"
              }}
            >
              Xóa Console
            </button>
          )}
        </div>

        <div style={{
          background: "#090D16",
          color: "#00FF66",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "13px",
          padding: "16px",
          borderRadius: "10px",
          height: "280px",
          overflowY: "auto",
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.8)"
        }}>
          {logs.length === 0 ? (
            <div style={{ color: "#475569", fontStyle: "italic" }}>
              [Chờ lệnh...] Nhấn "Kích Hoạt Daily Scrape" hoặc "Đồng Bộ Master Excel" ở trên để xem log tiến trình trực tiếp.
            </div>
          ) : (
            logs.map((item, idx) => (
              <div key={idx} style={{
                color: item.type === "err" ? "#FF5555" : item.type === "start" ? "#38BDF8" : item.type === "end" ? "#FACC15" : "#A7F3D0",
                marginBottom: "4px",
                whiteSpace: "pre-wrap"
              }}>
                {item.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
