import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import FirstPage from "./Pages/Login/FirstPage";
import Home from "./Pages/Pharmacy/Users/Home-Farmacy";
import ProductPage from "./Pages/Pharmacy/Users/ProductPage";
import HomeDoctor from "./Pages/Pharmacy/Doctors/HomeDoctor";
import CartPage from "./Pages/Pharmacy/Users/CartPage";
import { useAuth } from "./Context/AuthContext";
import HomePage from "./Pages/FirstPage/HomePage";
import ProductDetails from "./Pages/Pharmacy/Users/ProductDetails";
import DoctorSelection from "./Pages/Login/DoctorSelection";
import AdminOrders from "./Pages/Admin Interface/AdminOrders";
import "./Pages/styles/main.css";
import UserForm from "./Pages/Login/UserForm";
import HomeUser from "./Pages/Pharmacy/Users/Home-User";

const App = () => {
  const { token } = useAuth();

  return (
    <Router>
      <Switch>
        <Route path="/admin" component={AdminOrders} />
        <Route path="/others" component={UserForm} />
        <Route path="/first-page" component={HomePage} />
        <Route path="/login" component={FirstPage} />
        <Route path="/doctors" component={DoctorSelection} />
        <Route path="/patients" component={HomeDoctor} />
        <Route
          path="/home/product/details/:productId"
          component={ProductDetails}
        />
        <Route path="/home/:category/:subcategory" component={ProductPage} />
        <Route path="/home/:category" component={ProductPage} />
        <Route path="/home/cart-page" component={CartPage} />
        <Route path="/home" component={HomeUser} />

        <Route
          path="/home"
          render={() => (token ? <Home-User /> : <Redirect to="/login" />)}
        />

        <Route
          path="/patients"
          render={() => (token ? <Home-Doctor /> : <Redirect to="/login" />)}
        />
      </Switch>
    </Router>
  );
};

export default App;
