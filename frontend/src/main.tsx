/**
 * @file main.tsx
 * @description Application bootstrap file.
 *
 * Mounts the root React application into the `#root` DOM element defined
 * in `index.html`.  Wrapped in `React.StrictMode` to surface potential
 * issues during development (e.g. impure renders, deprecated lifecycle usage).
 *
 * Global CSS is imported here so it is guaranteed to load before the first
 * component renders.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
