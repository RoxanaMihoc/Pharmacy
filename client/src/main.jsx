import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './Context/AuthContext';
import { CartProvider } from "./Context/CartContext";
import { BrowserRouter } from 'react-router-dom'  // <-- Import the Router component

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <CartProvider>
    <BrowserRouter>
        <App />
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
