import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PayPalScriptProvider} from "@paypal/react-paypal-js";
// ✅ Import your UserProvider
import { UserProvider } from './pages/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
        <UserProvider>
      <App />
    </UserProvider>

  </React.StrictMode>
);

reportWebVitals();
