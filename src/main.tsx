import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { HashRouter } from 'react-router-dom';
require('dotenv').config();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
