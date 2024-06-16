import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const PrescriptionsList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  // useEffect(() => {
  //   fetchPrescriptions();
  // }, []);

  // const fetchPrescriptions = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3000/home/all-prescriptions');
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch data');
  //     }
  //     const data = await response.json();
  //     setPrescriptions(data);
  //   } catch (error) {
  //     setError(error.message);
  //   }
  //   setIsLoading(false);
  // };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.name.toLowerCase().includes(filter.toLowerCase())
  );
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
          {filteredPrescriptions.map((prescription) => (
            <li key={prescription.id}>
              {prescription.name} - {prescription.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PrescriptionsList;
