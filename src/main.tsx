import React from 'react';
import ReactDOM from 'react-dom';

import './polyfill';

import App from './App';

import './main.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
