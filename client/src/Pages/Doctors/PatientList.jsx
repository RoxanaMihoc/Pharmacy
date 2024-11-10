import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useHistory } from "react-router-dom";
import "./styles/patient-general-list.css";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const history = useHistory();

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch(
        `http://localhost:3000/doctors/patients-list/${currentUser}`
      );
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
        console.log(patients);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch patients");
      }
    };

    fetchPatients().catch((err) => {
      console.error("Error fetching patients:", err);
      setLoading(false);
    });
  }, [currentUser]);

  if (loading) return <div>Loading...</div>;

  const onPatientSelect = (patientId) => {
    history.push(`/doctor/profile/${patientId}`);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(filter.toLowerCase()) &&
      (genderFilter ? patient.gender === genderFilter : true)
  );

  return (
    <div className="container-section">
      <div className="filter">
        <h1>Filtru</h1>
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="gender-filter"
        >
          <option value="">Gen</option>
          <option value="Bărbat">Masculin</option>
          <option value="Femeie">Feminin</option>
          <option value="Other">Altul</option>
        </select>
      </div>
      <div className="patient">
        <div className="search-bar2">
          <input
            type="text"
            placeholder="Caută pacienți.."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search-input-bar2"
          />
          <button
            className="button-add-patient"
            onClick={() => console.log("Add New Patient")}
          >
            Adaugă un nou pacient
          </button>
        </div>

        <div className="patient-grid">
          {filteredPatients.map((patient) => (
            <div
              key={patient._id}
              className="patient-item2"
              onClick={() => onPatientSelect(patient._id)}
            >
              <img
                src={patient.photo || "default_profile.png"}
                alt={`${patient.firstName} ${patient.lastName}`}
                className="header-photo-list"
              />
              <div className="patient-details">
                <h4>
                  {patient.firstName} {patient.lastName}
                </h4>
                <p>{patient.email}</p>{" "}
                {/* Assuming email is a detail you want to show */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientList;
