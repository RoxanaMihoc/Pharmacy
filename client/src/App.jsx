import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import FirstPage from "./Pages/Login/FirstPage";
import HomeDoctor from "./Pages/Doctors/HomeDoctor";
import { useAuth } from "./Context/AuthContext";
import DoctorSelection from "./Pages/Login/DoctorSelection";
import AdminOrders from "./Pages/Admin Interface/AdminOrders";
import "./Pages/styles/main.css";
import UserForm from "./Pages/Login/UserForm";
import RoleSelection from "./Pages/Login/RoleSelection";
import HomeUser from "./Pages/Users/Home-User";
import Recommend from "./Pages/Doctors/Prescription/Recommend";
import Pharmacy from "./Pages/Pharmacy/HomePharmacy";

const App = () => {
  const { token, role } = useAuth();
  console.log(role);

  const getInitialRoute = () => {
    switch (role) {
      case "Patient":
        return "/home";
      case "Doctor":
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
        <Route path="/others" component={UserForm} />
        <Route path="/login" component={FirstPage} />
        <Route path="/role" component={RoleSelection} />
        <Route path="/doctors" component={DoctorSelection} />
        <Route path="/rem" component={Recommend} />
        <Route
          path="/home"
          render={() => (token ? <HomeUser /> : <Redirect to="/role" />)}
        />

        <Route
          path="/patients"
          render={() => (token ? <HomeDoctor /> : <Redirect to="/role" />)}
        />

      <Route
          path="/pharmacy"
          render={() => (token ? <Pharmacy /> : <Redirect to="/role" />)}
        />
      </Switch>
    </Router>
  );
};

export default App;
