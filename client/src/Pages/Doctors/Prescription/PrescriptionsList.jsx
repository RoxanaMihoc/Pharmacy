import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import "./styles/prescription-list.css"

const PrescriptionsList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('http://localhost:3000/home/all-prescriptions');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleAddNewPrescription = () => {
    history.push('/patients/prescription/users'); // Redirect to the PatientsList page
  };

  return (
    <div className="prescriptions-list-page">
      <div className="search-add-bar">
        <input
          type="text"
          placeholder="Search prescriptions..."
          value={filter}
          onChange={handleFilterChange}
        />
        <button onClick={handleAddNewPrescription}>
          Add New Prescription
        </button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul className="prescriptions-list">
          {prescriptions.map((prescription, index) => (
            <li key={prescription._id || index}>
             <h3>Prescriptia cu numarul: {prescription.prescriptionNumber}</h3> 
              <div>
              <h1>Detalii Pacient</h1>
              <p>Nume: {prescription.patient.lastName} Prenume: {prescription.patient.firstName}</p>
              <p>Gen: {prescription.patient.gender} Data Nasterii:{prescription.patient.birth_date}</p>
              <p>Doctor ID: {prescription.doctorId} - CNP: {prescription.patient.identifier}</p>
              <p>{prescription.description}</p>
              </div>
              <div>
              <h1>Diagnostic</h1>
              <p>{prescription.diagnosis}</p>
              </div>
              <div>
              <h1>Prescriptie medicala</h1>
                {prescription.products.map((product, idx) => (
                  <div key={idx}>
                    <img src={product.medication.photo} alt={product.medication.title} style={{width: '100px'}} />
                    <p><strong>{product.medication.title}</strong></p>
                    <p>Brand: {product.medication.brand}, Price: ${product.medication.price}</p>
                    <p>Dosage: {product.dosage || 'N/A'}, Duration: {product.duration || 'N/A'}</p>
                  </div>
                ))}
              </div>
              <h3>Status prescriptie: {prescription.status}</h3>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PrescriptionsList;
