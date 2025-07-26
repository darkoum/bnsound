import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Enable PWA functionality - app will work offline and load faster
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('✅ PWA: App is now available offline and cached');
    console.log('🎯 PWA: Ready for installation');
  },
  onUpdate: (registration) => {
    console.log('🔄 PWA: New version available');
    // The PWAUpdateNotification component will handle the UI
    // Send message to trigger update notification
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'UPDATE_AVAILABLE' });
    }
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
