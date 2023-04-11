import App from './App';
import { ClickToComponent } from 'click-to-react-component';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'redux/store';

import './index.css';
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <ClickToComponent />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
