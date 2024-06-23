import React, { useState, useEffect } from "react";
import "./styles/patient-profile.css";
import { useParams } from "react-router-dom";

const PatientProfile = ({ onBack }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const patientId = useParams();
  const user = patientId.patientId;
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchPatient = async () => {
      console.log(patientId);
      try {
        const response = await fetch(
          `http://localhost:3000/doctors/patient/${patientId.patientId}`
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

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/home/prescription/${user}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);
      setPrescriptions(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!patient) return <div>No patient found</div>;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const tabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="user-profile2">
            <div className="user-details">
              <div className="user-info">
                <img
                  src={patient[0].photoUrl}
                  alt={patient[0].firstName}
                  className="user-photo"
                />
                <h3>
                  {patient[0].firstName} {patient[0].lastName}
                </h3>
                <p>{patient[0].email}</p>
              </div>
              <div className="user-stats">
                <p>
                  <strong>Gen:</strong> {patient[0].gender}
                </p>
                <p>
                  <strong>Zi de naștere:</strong> {patient[0].birth_date}
                </p>
                <p>
                  <strong>Oraș:</strong> {patient[0].city}
                </p>
                <p>
                  <strong>Numar mobil:</strong> {patient[0].phone}
                </p>
                <p>
                  <strong>Cod Postal:</strong> {patient[0].postal_code}
                </p>
                <p>
                  <strong>Adresă:</strong> {patient[0].address}
                </p>
              </div>
            </div>
          </div>
        );
      case "medications":
        return (
          <ul className="prescriptions-list">
            {prescriptions.map((prescription, index) => (
              <li key={prescription._id || index}>
                <div>
                  <h3>
                    Reteta medicala din data: {formatDate(prescription.date)}
                  </h3>
                  {prescription.products.map((product, idx) => (
                    <div key={idx}>
                      <img
                        src={product.medication.photo}
                        alt={product.medication.title}
                        style={{ width: "100px" }}
                      />
                      <p>
                        <strong>{product.medication.title}</strong>
                      </p>
                      <p>
                        Brand: {product.medication.brand}
                        <p></p>
                        Preț:
                        {product.medication.price} Lei
                      </p>
                      <p>
                        Doza: {product.dosage || "N/A"}
                        <p></p>
                        Duratta: {product.duration || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="patient-profile-container">
      <button className="button-back" onClick={onBack}>
        Înapoi la lista pacienților
      </button>

      <div className="header-info">
        <div className="header-details">
          <img
            src={patient[0].photo || "default_profile.png"}
            alt={`${patient[0].firstName} ${patient[0].lastName}`}
            className="header-photo"
          />
          <div className="header-text">
            <h1>{`${patient[0].firstName} ${patient[0].lastName}`}</h1>
            <p>{patient[0].email}</p>
          </div>
        </div>
        <div className="notes-section">
          <h3>Notes</h3>
          <p>{patient.notes || "No additional notes"}</p>
          <button className="add-note-button">+</button>
        </div>
      </div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`tab ${activeTab === "medications" ? "active" : ""}`}
          onClick={() => setActiveTab("medications")}
        >
          Medications
        </button>
      </div>
      <div className="tab-content">{tabContent()}</div>
    </div>
  );
};

export default PatientProfile;
