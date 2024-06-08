import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../Context/AuthContext";
import { useLocation, useHistory } from "react-router-dom";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState("");
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

  return (
    <div className="container-section">
      <div className="filter">
      <h1>Filter</h1>
        {/* Filters can be dynamically added here */}
      </div>
      <div className="patient">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search patients"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button onClick={() => console.log("Add New Patient")}>
            Add New Patient
          </button>
        </div>
        <div className="patient-grid">
          {patients.map((patient) => (
             <div key={patient._id} className="patient-item" onClick={() => onPatientSelect(patient._id)}>
             {patient.firstName} {patient.lastName}
           </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientList;

