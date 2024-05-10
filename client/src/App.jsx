// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import FirstPage from './Pages/Login/FirstPage';
import Home from './Pages/Pharmacy/Home-Farmacy';
import ProductPage from './Pages/Pharmacy/ProductPage';
import CartPage from './Pages/Pharmacy/CartPage';
import { useAuth } from './Context/AuthContext';
import HomePage from './Pages/FirstPage/HomePage';
import './Pages/styles/main.css'

const App = () => {
  const { token } = useAuth();

  return (
    <Router>
      <Switch>
        <Route path="/first-page" component={HomePage} />
        <Route path="/login" component={FirstPage} />
        <Route path="/home/cart-page" component={CartPage} />
        <Route path="/home/:category/:subcategory" component={ProductPage} />
        <Route path="/home/:category" component={ProductPage} />

        <Route
          path="/home"
          render={() => (token ? <Home /> : <Redirect to="/login" />)}
        />
        {/* Other routes... */}
        <Redirect from="/" to="/first-page" />
      </Switch>
    </Router>
  );
};

export default App;
