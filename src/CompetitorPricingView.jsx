import React, { useState, useEffect } from "react";

export default function CompetitorPricingView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/competitors")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load competitor pricing:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--ink-soft)" }}>
        ⏳ Đang tải số liệu theo dõi giá đối thủ cạnh tranh...
      </div>
    );
  }

  const { brands = [], lastUpdate } = data || {};

  const filteredBrands = brands.filter(b => selectedBrand === "all" || b.brand === selectedBrand);

  return (
    <div style={{ padding: "24px", maxWidth: "1300px", margin: "0 auto", height: "100%", overflowY: "auto" }}>
      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #0F172A 0%, #065F46 100%)",
        color: "#FFF",
        padding: "24px",
        borderRadius: "16px",
        marginBottom: "24px",
        boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.25)"
      }}>
        <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#A7F3D0", fontWeight: 700, marginBottom: "4px" }}>
          Market Pricing Intelligence
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: 800, margin: 0 }}>
          📊 Báo Cáo Theo Dõi & So Sánh Giá Đối Thủ Cạnh Tranh (AVN vs Competitors)
        </h2>
        <p style={{ margin: "6px 0 0 0", color: "#94A3B8", fontSize: "14px" }}>
          Theo dõi biến động giá niêm yết (RRP) & chương trình Voucher XTra trên sàn thương mại điện tử | Cập nhật gần nhất: {lastUpdate ? new Date(lastUpdate).toLocaleDateString('vi-VN') : 'Gần đây'}
        </p>
      </div>

      {/* Brand Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        <div
          className="kt-card"
          onClick={() => setSelectedBrand("all")}
          style={{
            padding: "14px",
            cursor: "pointer",
            background: selectedBrand === "all" ? "#E0F2FE" : "var(--card)",
            borderLeft: "4px solid #0284C7"
          }}
        >
          <div style={{ fontSize: "11px", color: "var(--ink-soft)", fontWeight: 700 }}>TẤT CẢ ĐỐI THỦ</div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--ink)", marginTop: "4px" }}>
            {brands.reduce((acc, b) => acc + b.totalSKUs, 0)} SKUs
          </div>
        </div>

        {brands.map(b => (
          <div
            key={b.brand}
            className="kt-card"
            onClick={() => setSelectedBrand(selectedBrand === b.brand ? "all" : b.brand)}
            style={{
              padding: "14px",
              cursor: "pointer",
              background: selectedBrand === b.brand ? "#DCFCE7" : "var(--card)",
              borderLeft: "4px solid #15803D"
            }}
          >
            <div style={{ fontSize: "11px", color: "var(--ink-soft)", fontWeight: 700 }}>{b.brand.toUpperCase()}</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--ink)", marginTop: "4px" }}>
              {b.totalSKUs} SKUs
            </div>
          </div>
        ))}
      </div>

      {/* Brand SKU Detail Tables */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {filteredBrands.map(b => (
          <div key={b.brand} className="kt-card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
                🏷️ THƯƠNG HIỆU: {b.brand.toUpperCase()} ({b.products.length} sản phẩm)
              </h3>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "var(--surface)", borderBottom: "2px solid var(--rule)", textAlign: "left" }}>
                    <th style={{ padding: "10px", color: "var(--ink-soft)" }}>Tên sản phẩm</th>
                    <th style={{ padding: "10px", color: "var(--ink-soft)" }}>Giá Tháng 11 (Nov)</th>
                    <th style={{ padding: "10px", color: "var(--ink-soft)" }}>Giá T12 Trước 29/12</th>
                    <th style={{ padding: "10px", color: "var(--ink-soft)" }}>Giá T12 Sau 29/12</th>
                    <th style={{ padding: "10px", color: "var(--ink-soft)", textAlign: "center" }}>Voucher XTra</th>
                    <th style={{ padding: "10px", color: "var(--ink-soft)" }}>Link Shopee</th>
                  </tr>
                </thead>
                <tbody>
                  {b.products.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid var(--rule)" }}>
                      <td style={{ padding: "10px", fontWeight: 600, color: "var(--ink)", maxWidth: "300px" }}>
                        {p.title}
                      </td>
                      <td style={{ padding: "10px", color: "var(--ink-soft)" }}>
                        {typeof p.rrpNov === 'number' ? `${p.rrpNov.toLocaleString()} đ` : p.rrpNov}
                      </td>
                      <td style={{ padding: "10px", color: "var(--ink-soft)" }}>
                        {typeof p.rrpDecBefore === 'number' ? `${p.rrpDecBefore.toLocaleString()} đ` : p.rrpDecBefore}
                      </td>
                      <td style={{ padding: "10px", fontWeight: 700, color: p.rrpDecAfter === 'OOS' ? '#E11D48' : '#15803D' }}>
                        {typeof p.rrpDecAfter === 'number' ? `${p.rrpDecAfter.toLocaleString()} đ` : p.rrpDecAfter}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        <span style={{
                          background: p.voucherDecAfter === "Yes" ? "#DCFCE7" : "#F1F5F9",
                          color: p.voucherDecAfter === "Yes" ? "#15803D" : "#64748B",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontSize: "11px",
                          fontWeight: 700
                        }}>
                          {p.voucherDecAfter === "Yes" ? "Có Voucher" : "Không"}
                        </span>
                      </td>
                      <td style={{ padding: "10px" }}>
                        {p.link ? (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#0284C7", fontWeight: 600, textDecoration: "none" }}
                          >
                            🔗 Xem Shopee
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
