import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import "./styles/patient-profile.css";

const PatientProfile = () => {
  const [newAllergy, setNewAllergy] = useState({ name: "", severity: "Low" });
  const [showForm, setShowForm] = useState(false);
  const { currentUser } = useAuth();
  const [patient, setPatientData] = useState({});

  useEffect(() => {
    const fetchPatientData = async () => {
      if (currentUser) {
        try {
          const response = await fetch(
            `http://localhost:3000/home/details/${currentUser}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch patient data");
          }
          const data = await response.json();
          setPatientData(data);
        } catch (error) {
          console.error("Error fetching patient data:", error);
        }
      }
    };

    fetchPatientData();
  }, [currentUser]);

  const handleAddAllergy = () => {
    if (newAllergy.name.trim() === "") {
      alert("Please enter an allergy name.");
      return;
    }

    const updatedAllergies = [...patient.allergies, newAllergy];
    setPatientData((prevState) => ({
      ...prevState,
      allergies: updatedAllergies,
    }));

    setNewAllergy({ name: "", severity: "Low" });
    setShowForm(false);
  };

  return (
    <div className="patient-profile-container">
      {/* Left Side: Profile Card */}
      <div className="profile-left">
        <div className="profile-card">
          <img src={patient.photo} alt="Patient" className="profile-avatar" />
          <h2 className="patient-name">{patient.name}</h2>
          <p className={`status ${patient.status}`}>{patient.status}</p>
          <div className="info">
          <p>
              <strong>CNP:</strong> {patient.identifier}
            </p>
            <p>
              <strong>Gender:</strong> {patient.gender}
            </p>
            {/* <p>
              <strong>Age:</strong> {age}
            </p> */}
            <p>
              <strong>Height:</strong> {patient.height}
            </p>
            <p>
              <strong>Weight:</strong> {patient.weight}
            </p>
          </div>
        </div>

        {/* Allergies Section */}
        <div className="allergies-section">
          <h4>Allergies</h4>
          <ul>
            {patient.allergies?.length > 0 ? (
              patient.allergies.map((allergy, index) => (
                <li key={index}>
                  {allergy.name}{" "}
                  <span className={allergy.severity.toLowerCase()}>
                    {allergy.severity}
                  </span>
                </li>
              ))
            ) : (
              <p>No allergies found.</p>
            )}
          </ul>
          <button
            className="add-allergy"
            onClick={() => setShowForm(!showForm)}
          >
            + Add allergy
          </button>

          {showForm && (
            <div className="add-allergy-form">
              <input
                type="text"
                placeholder="Allergy Name"
                value={newAllergy.name}
                onChange={(e) =>
                  setNewAllergy({ ...newAllergy, name: e.target.value })
                }
              />
              <select
                value={newAllergy.severity}
                onChange={(e) =>
                  setNewAllergy({ ...newAllergy, severity: e.target.value })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button onClick={handleAddAllergy}>Add</button>
            </div>
          )}
        </div>

         {/* Allergies Section */}
         <div className="allergies-section">
          <h4>Medicamente</h4>
          <ul>
            {patient.medicationList?.length > 0 ? (
              patient.medicationLis.map((allergy, index) => (
                <li key={index}>
                  {allergy.name}{" "}
                  <span className={allergy.severity.toLowerCase()}>
                    {allergy.severity}
                  </span>
                </li>
              ))
            ) : (
              <p>No medication found.</p>
            )}
          </ul>
          <button
            className="add-allergy"
            onClick={() => setShowForm(!showForm)}
          >
            + Add medication
          </button>

          {showForm && (
            <div className="add-allergy-form">
              <input
                type="text"
                placeholder="Allergy Name"
                value={newAllergy.name}
                onChange={(e) =>
                  setNewAllergy({ ...newAllergy, name: e.target.value })
                }
              />
              <select
                value={newAllergy.severity}
                onChange={(e) =>
                  setNewAllergy({ ...newAllergy, severity: e.target.value })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button onClick={handleAddAllergy}>Add</button>
            </div>
          )}
        </div>


      </div>

      {/* Right Side: General Info and Prescription List */}
      <div className="profile-right">
        {/* General Information */}
        <div className="general-section">
          <h3>General Information</h3>
          <p>
            <strong>First Name:</strong> {patient.firstName}
          </p>

          <p>
            <strong>Last Name:</strong> {patient.lastName}
          </p>
          <p>
            <strong>Address:</strong> {patient.address}
          </p>
          <p>
            <strong>Phone:</strong> {patient.phone}
          </p>
          <p>
            <strong>Email:</strong> {patient.email}
          </p>
          <p>
            <strong>City:</strong> {patient.city}
          </p>
          <p>
            <strong>Cod Postal:</strong> {patient.postal_code}
          </p>
          <p>
            <strong>Data de nastere:</strong> {patient.birth_date}
          </p>
        </div>

        {/* Prescription List */}
        <div className="prescription-section">
          <h3>Prescriptions</h3>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
