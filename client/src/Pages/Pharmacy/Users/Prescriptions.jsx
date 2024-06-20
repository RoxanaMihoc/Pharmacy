import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from "../../../Context/AuthContext";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {currentUser} = useAuth();
  const history = useHistory();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(`http://localhost:3000/home/notification/${currentUser}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data);
      setPrescriptions(data);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addAllToCart = () => {
    prescriptions.forEach(async product => {
        product.details[0].products.forEach(async product => {
        
        console.log("alal",product.medication._id);
        try {
            const result = await addToCart(currentUser, product.medication._id);
            console.log('Product added to cart:', result);
          } catch (error) {
            console.error('Failed to add product to cart:', error.message);
            // Handle error, show an error message to the user
          }
        });
    });
    alert('All medications have been added to your cart.');
};

  return (
    <div className="prescriptions-list-page">
      <h1>Prescriptions List</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="prescriptions-grid">
          {prescriptions.map((prescription, index) => (
            <div key={index} className="prescription-card">
              <h2>Diagnosis: {prescription.details[0].diagnosis}</h2>
              <h3>Prescription date: {prescription.dateReceived}</h3>
              <ul>
                {prescription.details[0].products.map((product, idx) => (
                  <li key={idx}>
                    <img src={product.medication.photo} alt={product.medication.title} style={{width: '100px'}} />
                    <strong>{product.medication.title} ({product.medication.brand})</strong>
                    <p>Dosage: {product.dosage}</p>
                    <p>Duration: {product.duration}</p>
                    <p>Reason: {product.reason}</p>
                    <p>Side Effects: {product.sideEffects}</p>
                  </li>
                ))}
              </ul>
              <button onClick={addAllToCart} className="addAllButton">Add All to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
