import React, { useState, useEffect } from "react";
import "./styles/recom.css";

const PrescriptionList = ({ prescriptions, onSelectItem }) => {
    const [filter, setFilter] = useState("");
  const [filteredPrescriptions, setFilteredPrescriptions] = useState(prescriptions);

  // Function to handle filtering of prescriptions
  const handleFilterChange = (e) => {
    const searchText = e.target.value;
    console.log(searchText);
    setFilter(searchText);
    const filtered = prescriptions.filter(prescription =>
      prescription.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPrescriptions(filtered);
  };
    return (
        <div className="prescription-list-container">
             <input
        type="text"
        placeholder="Search prescriptions..."
        value={filter}
        onChange={handleFilterChange}
        className="search-input"
      />
      <table className="prescription-list">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Notes</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrescriptions.map((prescription, index) => (
            <tr key={index}>
              <td>{prescription.title}</td>
              <td>
                <input 
                  type="number" 
                  defaultValue={1} 
                  min={1} 
                  onChange={(e) => {
                    prescription.quantity = parseInt(e.target.value, 10);
                  }}
                />
              </td>
              <td>
                <textarea 
                  placeholder="Add notes" 
                  onChange={(e) => {
                    prescription.notes = e.target.value;
                  }}
                />
              </td>
              <td>
                {/* <input 
                  type="checkbox" 
                  onChange={(e) => onSelectionChange(index, e.target.checked)}
                /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
  }
  
  export default PrescriptionList;
  