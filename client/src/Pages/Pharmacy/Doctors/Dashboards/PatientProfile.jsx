import React, { useState, useEffect } from "react";
import "./styles/patient-profile.css";

const PatientProfile = ({ patientId, onBack }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
        console.log(patientId);
      try {
        const response = await fetch(
          `http://localhost:3000/doctors/patient/${patientId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setPatient(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!patient) return <div>No patient found</div>;

  return (
    <div className="user-profile">
        <button onClick={onBack}>Back to Patients List</button>
      <div className="user-info">
        <img src={patient[0].photoUrl} alt={patient[0].firstName} className="user-photo" />
        <h3>{patient[0].firstName} {patient[0].lastName}</h3>
        <p>{patient[0].email}</p>
      </div>
      <div className="user-stats">
        <p><strong>Gender:</strong> {patient[0].gender}</p>
        <p><strong>Birth Date:</strong> {patient[0].birth_date}</p>
        <p><strong>City:</strong> {patient[0].city}</p>
        <p><strong>Mobile Number:</strong> {patient[0].phone}</p>
        <p><strong>Zip Code:</strong> {patient[0].postal_code}</p>
        <p><strong>Address:</strong> {patient[0].address}</p>
      </div>
    </div>
  );
};

export default PatientProfile;
