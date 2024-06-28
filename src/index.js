import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "react-redux";
import appStore from './context/appStore';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={appStore}>
    {/* <React.StrictMode> */}
    {/* <AuthContextProvider> */}
      <App />
      <ToastContainer />
    {/* </AuthContextProvider> */}
    {/*  </React.StrictMode> */}
  </Provider>
);