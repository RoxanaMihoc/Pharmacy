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
import "./Pages/styles/main.css";
import UserForm from "./Pages/Login/UserForm";
import LoggedOut from "./Pages/Login/LoggedOut";
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
        return "/doctor";
      default:
        return "/role";
    }
  };

  return (
    <Router>
      <Switch>
        {role === "Doctor" && <Route path="/doctor" component={HomeDoctor} />}
        {role === "Patient" && <Route path="/home/medicamente-otc" component={HomeUser} />}
        {role === "Pharmacist" && <Route path="/pharmacy" component={Pharmacy} />}
        <Route path="/others" component={UserForm} />
        <Route path="/login" component={FirstPage} />
        <Route path="/register" component={FirstPage} />
        <Route path="/role" component={LoggedOut} />
        <Route path="/doctors" component={DoctorSelection} />
        <Route path="/rem" component={Recommend} />
        <Route
          path="/home"
          render={() => (token ? <HomeUser /> : <Redirect to="/role" />)}
        />

        <Route
          path="/doctor"
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
