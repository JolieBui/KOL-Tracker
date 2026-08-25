import re

with open("src/App.jsx", "r") as f:
    text = f.read()

# Create StatusSettingsModal component
modal_code = """
/* ================================================================
   STATUS SETTINGS MODAL
================================================================ */
const StatusSettingsModal = ({ statuses, onSave, onClose }) => {
  const [list, setList] = useState([...statuses]);

  const handleChange = (idx, field, val) => {
    const arr = [...list];
    arr[idx][field] = val;
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
"""

text = re.sub(r'/\* ================================================================\n   DETAIL MODAL', modal_code + '\n/* ================================================================\n   DETAIL MODAL', text)

# Add Settings button to header
btn_code = """
            <button className="kt-btn kt-btn-ghost" onClick={() => setShowStatusSettings(true)}
              title="Cài đặt hệ thống (Thêm/bớt Trạng thái)" style={{ padding: "6px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Cài đặt
            </button>
            {/* Reset / Đặt lại */}
"""
text = text.replace('{/* Reset / Đặt lại */}', btn_code)

# Add rendering of StatusSettingsModal inside App
render_code = """
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
"""
text = text.replace('{/* ── FOOTER ── */}', render_code)

with open("src/App.jsx", "w") as f:
    f.write(text)
print("Added Settings Modal")
