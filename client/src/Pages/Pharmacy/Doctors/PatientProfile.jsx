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

  return (
    <div>
       <button className="button-back" onClick={onBack}>
          Înapoi la lista pacienților
        </button>
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
        <div className="user-pres">
          <ul className="prescriptions-list">
            {prescriptions.map((prescription, index) => (
              <li key={prescription._id || index}>
                <div>
                  <h1>Prescriptie medicala</h1>
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
                        Duratta:{" "}
                        {product.duration || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
