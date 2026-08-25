import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 30, fontFamily: "sans-serif", textAlign: "center", color: "#333" }}>
          <h2>⚠️ Đã xảy ra lỗi khi tải giao diện</h2>
          <p style={{ color: "#666", fontSize: 13 }}>{this.state.error?.message || "Vui lòng làm mới trang để thử lại."}</p>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: 15, padding: "8px 16px", borderRadius: 8, background: "#EA9216", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}
          >
            🔄 Xóa bộ nhớ đệm & Tải lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

