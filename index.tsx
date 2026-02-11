import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

console.log("🚀 Intentando arrancar la aplicación...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("❌ ERROR FATAL: No encuentro el div 'root' en index.html");
  document.body.innerHTML = '<h1 style="color:red;text-align:center;margin-top:50px">ERROR: Falta <div id="root"></div> en index.html</h1>';
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log("✅ Aplicación renderizada correctamente.");
}