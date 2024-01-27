// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import FirstPage from './Pages/FirstPage';
import Home from './Pages/Home';
import ProductPage from './Pages/ProductPage';
import { useAuth } from './Context/AuthContext';
import './Pages/styles/main.css'

const App = () => {
  const { token } = useAuth();

  return (
    <Router>
      <Switch>
        <Route path="/login" component={FirstPage} />
        <Route path="/home/:category" component={ProductPage} />

        <Route
          path="/home"
          render={() => (token ? <Home /> : <Redirect to="/login" />)}
        />
        {/* Other routes... */}
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
};

export default App;
