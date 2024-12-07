import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faX,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import "./styles/diagnosis.css";

const Diagnosis = () => {
  const [filter, setFilter] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");

  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [investigations, setInvestigations] = useState([]);
  const [advice, setAdvice] = useState([]);

  const [showAddDiagnosisInput, setShowAddDiagnosisInput] = useState(false);
  const [newDiagnosis, setNewDiagnosis] = useState("");

  const [showAddInvestigationInput, setShowAddInvestigationInput] = useState(false);
  const [newInvestigation, setNewInvestigation] = useState("");

  const [showAddAdviceInput, setShowAddAdviceInput] = useState(false);
  const [newAdvice, setNewAdvice] = useState("");

  const [editingMedicineId, setEditingMedicineId] = useState(null);
  const [newDosage, setNewDosage] = useState("");
  const [newHours, setNewHours] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const [showAllMedicines, setShowAllMedicines] = useState(false);

  const location = useLocation();
  const patient = location.state?.patient;
  const history = useHistory();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch("http://localhost:3000/home/all-products");
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await response.json();
        setPrescriptions(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchPrescriptions();
  }, []);

  const filteredPrescriptions = prescriptions.filter((med) =>
    med.title.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddDiagnosis = () => {
    if (newDiagnosis.trim() !== "") {
      setDiagnoses((prev) => [...prev, newDiagnosis.trim()]);
      setNewDiagnosis("");
      setShowAddDiagnosisInput(false);
    }
  };

  const handleDeleteDiagnosis = (index) => {
    setDiagnoses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddInvestigation = () => {
    if (newInvestigation.trim() !== "") {
      setInvestigations((prev) => [...prev, newInvestigation.trim()]);
      setNewInvestigation("");
      setShowAddInvestigationInput(false);
    }
  };

  const handleDeleteInvestigation = (index) => {
    setInvestigations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAdvice = () => {
    if (newAdvice.trim() !== "") {
      setAdvice((prev) => [...prev, newAdvice.trim()]);
      setNewAdvice("");
      setShowAddAdviceInput(false);
    }
  };

  const handleDeleteAdvice = (index) => {
    setAdvice((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddMedicineDetail = (medicineId) => {
    if (newDosage.trim() === "" && newHours.trim() === "" && newNotes.trim() === "") {
      return;
    }

    setSelectedMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medicineId) {
          const newDetail = {
            dosage: newDosage,
            hours: newHours,
            notes: newNotes
          };
          return { ...med, details: [...med.details, newDetail] };
        }
        return med;
      })
    );

    setNewDosage("");
    setNewHours("");
    setNewNotes("");
    setEditingMedicineId(null);
  };

  const handleDeleteMedicineDetail = (medicineId, detailIndex) => {
    setSelectedMedicines((prev) =>
      prev.map((med) => {
        if (med.id === medicineId) {
          const updatedDetails = med.details.filter((_, i) => i !== detailIndex);
          return { ...med, details: updatedDetails };
        }
        return med;
      })
    );
  };

  const handleSelectMedicine = (med) => {
    if (selectedMedicines.some((m) => m.id === med.id)) {
      return; // Don't add duplicates
    }
    setSelectedMedicines((prev) => [...prev, { ...med, details: [] }]);
    setFilter(""); 
    setShowAllMedicines(false); 
  };

  const handleSave = () => {
    // Gather all the data
    const dataToSend = {
      patient: patient,
      diagnosis: diagnosis,
      investigations: investigations,
      advice: advice,
      selectedItems: selectedMedicines // includes {id, title, details:[{dosage, hours, notes}]}
    };

    history.push('/doctor/prescription/path-to-overview', dataToSend);
  };

  return (
    <div className="page-container">
      <div className="diagnosis-page-container">
        {/* Left Column */}
        <div className="left-column">
          <div className="patient-details">
            <h2>Detalii Pacient</h2>
            <p>
              {patient?.firstName} {patient?.lastName}
            </p>
          </div>

          {/* Diagnosis Section */}
          <div className="section">
            <div className="section-header-diagnosis">
              <h3>Diagnostic</h3>
              <textarea
              placeholder="Add main diagnosis description..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              style={{ width: "100%", height: "60px", marginBottom: "10px"}}
            />
            </div>
            <ul>
              {diagnoses.map((diag, i) => (
                <li key={i} className="list-item-with-actions">
                  {diag}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteDiagnosis(i)}
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </li>
              ))}
            </ul>
            {showAddDiagnosisInput && (
              <div className="add-item-input">
                <input
                  type="text"
                  placeholder="Add new diagnosis..."
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                />
                <button onClick={handleAddDiagnosis}>Add</button>
                <button onClick={() => setShowAddDiagnosisInput(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Investigation Section */}
          <div className="section">
            <div className="section-header">
              <h3>Investigatii</h3>
              <button
                className="add-button"
                onClick={() => setShowAddInvestigationInput(true)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
            <ul>
              {investigations.map((inv, i) => (
                <li key={i} className="list-item-with-actions">
                  {inv}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteInvestigation(i)}
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </li>
              ))}
            </ul>
            {showAddInvestigationInput && (
              <div className="add-item-input">
                <input
                  type="text"
                  placeholder="Add new investigation..."
                  value={newInvestigation}
                  onChange={(e) => setNewInvestigation(e.target.value)}
                />
                <button onClick={handleAddInvestigation}>Add</button>
                <button onClick={() => setShowAddInvestigationInput(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Advice Section */}
          <div className="section">
            <div className="section-header">
              <h3>Advice</h3>
              <button
                className="add-button"
                onClick={() => setShowAddAdviceInput(true)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
            <ul>
              {advice.map((ad, i) => (
                <li key={i} className="list-item-with-actions">
                  {ad}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteAdvice(i)}
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </li>
              ))}
            </ul>
            {showAddAdviceInput && (
              <div className="add-item-input">
                <input
                  type="text"
                  placeholder="Add new advice..."
                  value={newAdvice}
                  onChange={(e) => setNewAdvice(e.target.value)}
                />
                <button onClick={handleAddAdvice}>Add</button>
                <button onClick={() => setShowAddAdviceInput(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="medicine-section">
            <div className="medicine-header">
              <h3>Medicine (Rx)</h3>
            </div>

            <div className="medicine-search-and-list-container">
              <div className="search-row">
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="medicine-search-input"
                />
                <button
                  className="show-all-button"
                  onClick={() => setShowAllMedicines(!showAllMedicines)}
                >
                  Show All
                </button>
              </div>

              {/* Filtered Results Overlay */}
              {filter.length > 0 && (
                <div className="medicine-search-results-overlay">
                  <ul className="medicine-search-results">
                    {filteredPrescriptions.map((med) => (
                      <li
                        key={med.id}
                        onClick={() => handleSelectMedicine(med)}
                        className="medicine-search-result-item"
                      >
                        <img src={med.photo} alt={med.title} className="medicine-image" />
                        {med.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Show All Medicines Overlay */}
              {showAllMedicines && (
                <div className="medicine-search-results-overlay">
                  <ul className="medicine-search-results">
                    {prescriptions.map((med) => (
                      <li
                        key={med.id}
                        onClick={() => handleSelectMedicine(med)}
                        className="medicine-search-result-item"
                      >
                        <img src={med.photo} alt={med.title} className="medicine-image" />
                        {med.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMedicines.length > 0 && (
                <ol className="selected-medicines-list">
                  {selectedMedicines.map((med, index) => (
                    <li key={med.id} className="selected-medicine-item">
                      <div className="medicine-line">
                        <span>{index + 1}. {med.title}</span>
                        {editingMedicineId === med.id ? null : (
                          <button
                            className="add-button"
                            onClick={() => {
                              setEditingMedicineId(med.id);
                              setNewDosage("");
                              setNewHours("");
                              setNewNotes("");
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} /> 
                          </button>
                        )}
                      </div>

                      <div className="medicine-details-section">
                        {med.details && med.details.length > 0 && (
                          <ul className="medicine-details-list">
                            {med.details.map((detail, dIndex) => (
                              <li key={dIndex} className="list-item-with-actions">
                                <strong>Doza:</strong> {detail.dosage}, 
                                <strong> Durata:</strong> {detail.hours}, 
                                <strong> Note:</strong> {detail.notes}
                                <button
                                  className="delete-button"
                                  onClick={() => handleDeleteMedicineDetail(med.id, dIndex)}
                                  title="Delete Detail"
                                >
                                  <FontAwesomeIcon icon={faX} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                        {editingMedicineId === med.id && (
                          <div className="add-item-input medicine-detail-input">
                            <input
                              type="text"
                              placeholder="Doza..."
                              value={newDosage}
                              onChange={(e) => setNewDosage(e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Durata..."
                              value={newHours}
                              onChange={(e) => setNewHours(e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Note..."
                              value={newNotes}
                              onChange={(e) => setNewNotes(e.target.value)}
                            />
                            <button onClick={() => handleAddMedicineDetail(med.id)}>
                              Add
                            </button>
                            <button
                              onClick={() => {
                                setEditingMedicineId(null);
                                setNewDosage("");
                                setNewHours("");
                                setNewNotes("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-buttons">
        <button className="save-button" onClick={handleSave}>Save & Send</button>
        <button className="preview-button">Preview</button>
        <button className="template-button">Save as Template</button>
        <button className="print-button">Print</button>
        <button className="cancel-button">Cancel</button>
      </div>
    </div>
  );
};

export default Diagnosis;
