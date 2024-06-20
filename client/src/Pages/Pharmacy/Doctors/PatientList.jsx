import React, { useState, useEffect } from "react";
import { useAuth } from "../../../Context/AuthContext";
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
      const response = await fetch(`http://localhost:3000/doctors/patients-list/${currentUser}`);
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
        console.log(patients);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch patients");
      }
    };

    fetchPatients().catch(err => {
      console.error("Error fetching patients:", err);
      setLoading(false);
    });
  }, [currentUser]);

  if (loading) return <div>Loading...</div>;

  const onPatientSelect = (patientId) => {
    history.push(`/patients/profile/${patientId}`);
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(filter.toLowerCase()) &&
    (genderFilter ? patient.gender === genderFilter : true)
  );

  return (
    <div className="container-section">
      <div className="filter">
        <h1>Filter</h1>
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="gender-filter"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="patient">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search patients"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button className="button-add-patient" onClick={() => console.log("Add New Patient")}>
            Add New Patient
          </button>
        </div>
        <div className="patient-grid">
          {filteredPatients.map((patient) => (
             <div key={patient._id} className="patient-item" onClick={() => onPatientSelect(patient._id)}>
               <div className="patient-details">

                 <h3>{patient.firstName} {patient.lastName}</h3>
                 <p>{patient.email}</p> {/* Assuming email is a detail you want to show */}
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientList;
