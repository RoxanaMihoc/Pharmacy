import SelectionList from './SelectionList';
import PrescriptionList from './PrescriptionList';
import React, { useState, useEffect } from "react";

function Recommend() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    const fetchPrescriptions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/home/all-products');
        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
        const data = await response.json();
        setPrescriptions(data);
        console.log(data);
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };

    fetchPrescriptions();
  }, []);

  const handleSelectItem = (item) => {
    setSelectedItems(prevItems => [...prevItems, {...item}]);
};

  return (
    <div className="prescription-app">
      <PrescriptionList 
                prescriptions={prescriptions} 
                onSelectItem={handleSelectItem} 
            />
    </div>
  );
}

export default Recommend;
