// ================================================================
// index.js
// The entry point of the React app.
// We wrap the entire App inside AuthProvider so that ALL
// components can access the logged-in user via useAuth().
// ================================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

// Reset some default browser styles
const globalStyle = document.createElement("style");
globalStyle.innerHTML = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background: #f5f5f5;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  button:hover {
    opacity: 0.88;
  }
  input:focus, select:focus, textarea:focus {
    border-color: #3949ab !important;
    box-shadow: 0 0 0 2px rgba(57,73,171,0.15);
  }
`;
document.head.appendChild(globalStyle);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* AuthProvider makes user login state available to ALL pages */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
