import Diagnosis from "./Diagnosis";
import PrescriptionsOverview from "./PrescriptionOverview";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import PrescriptionsList from "./PrescriptionsList";

function Recommend() {
  return (
    <div className="prescription-app">
      <Switch>
        <Route
          path="/doctor/prescription/path-to-overview"
          component={PrescriptionsOverview}
        />
        <Route
          path="/doctor/prescription/medicine"
          component={Diagnosis}
        />
        <Route path="/doctor/prescription" component={PrescriptionsList} />
        <Redirect from="/home" exact to="/doctor/dashboard" />
        <Route component={() => <div>Page not found</div>} />
      </Switch>
    </div>
  );
}

export default Recommend;
