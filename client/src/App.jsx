import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import FirstPage from "./Pages/Login/FirstPage";
import ProductPage from "./Pages/Pharmacy/Users/ProductPage";
import HomeDoctor from "./Pages/Pharmacy/Doctors/HomeDoctor";
import CartPage from "./Pages/Pharmacy/Users/CartPage";
import { useAuth } from "./Context/AuthContext";
import ProductDetails from "./Pages/Pharmacy/Users/ProductDetails";
import DoctorSelection from "./Pages/Login/DoctorSelection";
import AdminOrders from "./Pages/Admin Interface/AdminOrders";
import "./Pages/styles/main.css";
import UserForm from "./Pages/Login/UserForm";
import HomeUser from "./Pages/Pharmacy/Users/Home-User";
import Recommend from "./Pages/Pharmacy/Doctors/Dashboards/Prescription/Recommend";

const App = () => {
  const { token, role } = useAuth();
  console.log(role);

  const getInitialRoute = () => {
    switch (role) {
      case "patient":
        return "/home";
      case "doctor":
        return "/patients";
      default:
        return "/login"; // assuming there's a login or another default page
    }
  };

  return (
    <Router>
      <Switch>
        {role === "doctor" && <Route path="/patients" component={HomeDoctor} />}
        {role === "patient" && <Route path="/home" component={HomeUser} />}
        <Route path="/admin" component={AdminOrders} />
        <Route path="/others" component={UserForm} />
        <Route path="/login" component={FirstPage} />
        <Route path="/doctors" component={DoctorSelection} />
        <Route path="/rem" component={Recommend} />
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
