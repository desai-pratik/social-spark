import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "react-redux";
import appStore from './context/appStore';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme/theme';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={appStore}>
    <ThemeProvider theme={theme}>
      {/* <React.StrictMode> */}
      <App />
      <CssBaseline />
      <ToastContainer />
      {/*  </React.StrictMode> */}
    </ThemeProvider >
  </Provider >
);