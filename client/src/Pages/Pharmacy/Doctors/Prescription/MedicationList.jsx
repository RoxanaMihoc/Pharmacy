import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./styles/recom.css";

const MedicationList = () => {
  const [filter, setFilter] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [expandedId, setExpandedId] = useState(null); // Track which item is expanded
  const history = useHistory();
  const location = useLocation();
  const patient = location.state?.patient;
  const [diagnosis, setDiagnosis] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch("http://localhost:3000/home/all-products");
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await response.json();
        const enhancedData = data.map(item => ({
          ...item,
          quantity: 1,
          notes: "",
          dosage: "",
          duration: "",
          reason: "",
          sideEffects: "",
          selected: false,
        }));
        setPrescriptions(enhancedData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchPrescriptions();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
    const filtered = prescriptions.filter(prescription =>
      prescription.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setPrescriptions(filtered);
  };

  const handleInputChange = (index, key, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][key] = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handleSave = () => {
    const selectedItems = prescriptions.filter(item => item.selected);
    history.push("/patients/prescription/path-to-overview", {
      diagnosis,
      patient,
      selectedItems,
    });
  };

  return (
    <div className="prescription-list-container">
      <div className="diagnostic-section">
        <h2>Diagnostic</h2>
        <textarea
          placeholder="Diagnostic..."
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
      </div>
      <h2>Prescriptie</h2>
      <input
        type="text"
        placeholder="Cauta prescripții..."
        value={filter}
        onChange={handleFilterChange}
        className="search-input"
      />
      <div className="scrollable-table-container">
        {prescriptions.map((item, index) => (
          <div key={item.id || index} className="prescription-item">
            <div className="prescription-summary" onClick={() => toggleExpand(item.id)}>
            <img
                          src={item.photo}
                          alt={item.title}
                          className="cartImage"
                        />
              <h3>{item.title}</h3>
              <button className="button-more">{expandedId === item.id ? "Afișează mai puțin" : "Afișează mai mult"}</button>
            </div>
            {expandedId === item.id && (
              <div className="prescription-details">
                <input type="text" value={item.dosage} onChange={(e) => handleInputChange(index, "dosage", e.target.value)} placeholder="Doză"/>
                <input type="text" value={item.duration} onChange={(e) => handleInputChange(index, "duration", e.target.value)} placeholder="Durată"/>
                <input type="text" value={item.reason} onChange={(e) => handleInputChange(index, "reason", e.target.value)} placeholder="Reason"/>
                <input type="text" value={item.sideEffects} onChange={(e) => handleInputChange(index, "sideEffects", e.target.value)} placeholder="Efecte Adverse"/>
                <input type="number" value={item.quantity} onChange={(e) => handleInputChange(index, "quantity", parseInt(e.target.value, 10))} placeholder="Cantitate"/>
                <textarea value={item.notes} onChange={(e) => handleInputChange(index, "notes", e.target.value)} placeholder="Note"/>
                <input type="checkbox" checked={item.selected} onChange={(e) => handleInputChange(index, "selected", e.target.checked)}/>
                <button className="button-selected" onClick={() => handleInputChange(index, "selected", !item.selected)}>{item.selected ? "Deselectează" : "Selectează"}</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleSave} className="save-button-med">Salvează</button>
    </div>
  );
};

export default MedicationList;
