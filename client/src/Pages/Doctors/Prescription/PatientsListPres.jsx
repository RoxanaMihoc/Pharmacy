import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { fetchPatientsFromAPI } from "../../Services/userServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./styles/patientlist.css";

const PatientsListPres = () => {
  const [patients, setPatients] = useState([]);
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const {currentUser, token} = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { success, data, error } = await fetchPatientsFromAPI(
          currentUser, token
        );

        if (success) {
          console.log(data);
          setPatients(data);
        } else {
          console.error("Error fetching patients:", error);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchPatients();
  }, [currentUser]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    console.log("Selected patient:", patient);
  };

  const handleSendClick = () => {
    if (selectedPatient) {
      history.push(`/doctor/prescription/medicine`, {
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
      <h1>Listă pacienți</h1>
      <div className="search-input-wrapper">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Caută după nume..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>
      <div className="patient-items-container">
        {filteredPatients.map((patient, index) => (
          <div
            key={index}
            onClick={() => handlePatientSelect(patient)}
            className="patient-item"
          >
            <img
              src={patient.photo || "default_profile.png"}
              alt={`${patient.firstName} ${patient.lastName}`}
              className="header-photo"
            ></img>
            <div className="patient-details">
              <h4>
                {patient.firstName} {patient.lastName}
              </h4>
              <p>{patient.email}</p>
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
      <button
        onClick={handleSendClick}
        disabled={!selectedPatient}
        className="send-button"
      >
        Mai departe {" "}
        <FontAwesomeIcon icon={faArrowRight} className="search-icon" />
      </button>
    </div>
  );
};

export default PatientsListPres;

