import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Global React Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "30px", background: "#FFF5F5", color: "#9B1C1C", fontFamily: "monospace", minHeight: "100vh" }}>
          <h2>⚠️ React Runtime Error:</h2>
          <pre style={{ background: "#FED7D7", padding: "15px", borderRadius: "8px", overflowX: "auto" }}>
            {this.state.error?.toString()}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>,
);
