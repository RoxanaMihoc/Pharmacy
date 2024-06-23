// src/PatientsList.js

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import "./styles/patientlist.css";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/doctors/patients-list/${currentUser.currentUser}`
      );
      const data = await response.json();
      setPatients(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to load patients", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    console.log("In ptient", patient);
  };

  const handleSendClick = () => {
    if (selectedPatient) {
      // Navigate to the medicine page with the selected patient's data
      history.push(`/patients/prescription/medicine`, {
        patient: selectedPatient,
      });
    } else {
      alert("Please select a patient first.");
    }
  };

  const filteredPatients =
    searchTerm.length > 0
      ? patients.filter((patient) =>
          `${patient.firstName} ${patient.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : patients;

  return (
    <div className="patients-container">
      <h1>Patients List</h1>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <div className="patient-items-container">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => handlePatientSelect(patient)}
            className="patient-item"
          >
            <div className="patient-details">
              <h4>
                {patient.firstName} {patient.lastName}
              </h4>
              <p></p>
              {patient.email}
            </div>
            <div> 
            <input
              type="checkbox"
              checked={selectedPatient === patient}
              onChange={() => handlePatientSelect(patient)}
              className="select-checkbox"
            />
            </div>
          </div>
        ))}
      </div>
      <div>
      <button
        onClick={handleSendClick}
        disabled={!selectedPatient}
        className="send-button"
      >
        Send to Medicine
      </button>
      </div>
    </div>
  );
};

export default PatientsList;
