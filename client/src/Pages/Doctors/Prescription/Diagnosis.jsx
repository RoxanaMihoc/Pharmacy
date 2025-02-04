import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./styles/diagnosis.css"; // Updated CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { fetchAllProducts } from "../../Services/productServices";
import {useAuth} from "../../../Context/AuthContext";

const Diagnosis = () => {
  const [filter, setFilter] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const {token}= useAuth();

  // Textareas in the left column
  const [diagnosis, setDiagnosis] = useState("");
  const [investigations, setInvestigations] = useState("");

  // Start with 6 rows in the medicine table
  const [tableData, setTableData] = useState(
    Array.from({ length: 1 }, (_, i) => ({
      rowNumber: i + 1,
      medicineName: "",
      doza: "",
      cantitate: "",
      detalii: "",
      durata: "",
      med: {},
    }))
  );

  const [showAllMedicines, setShowAllMedicines] = useState(false);

  const location = useLocation();
  const patient = location.state?.patient;
  const history = useHistory();


useEffect(() => {
  const fetchProducts = async () => {
    try {
      const { success, data, error } = await fetchAllProducts(token);

      if (success) {
        setPrescriptions(data); // Update state with fetched products
      } else {
        console.error("Error fetching prescriptions:", error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  fetchProducts();
}, []);

  // Filter logic for the search bar
  const filteredPrescriptions = prescriptions.filter((med) =>
    med.title.toLowerCase().includes(filter.toLowerCase())
  );

  // Handle medicine selection from overlays
  const handleSelectMedicine = (med) => {
    // Check if medicine already in table
    const existingRowIndex = tableData.findIndex(
      (row) => row.medicineName.toLowerCase() === med.title.toLowerCase()
    );

    if (existingRowIndex !== -1) {
      // If found, increment "cantitate"
      const updatedTable = [...tableData];
      const currentQty = parseInt(updatedTable[existingRowIndex].cantitate) || 0;
      updatedTable[existingRowIndex].cantitate = (currentQty + 1).toString();
      setTableData(updatedTable);
    } else {
      // Otherwise, find first empty row
      const nextEmptyIndex = tableData.findIndex(
        (row) => row.medicineName === ""
      );
      console.log("NUME",med);

      if (nextEmptyIndex === -1) {
        // If all 6 rows used, add a new row
        const newRow = {
          medicineName: med.title,
          doza: "",
          cantitate: "1",
          detalii: "",
          durata: "",
          med: med,
        };
        setTableData((prev) => [...prev, newRow]);
      } else {
        // Fill that empty row
        const updatedTable = [...tableData];
        updatedTable[nextEmptyIndex].medicineName = med.title;
        updatedTable[nextEmptyIndex].cantitate = "1";
        updatedTable[nextEmptyIndex].med = med;
        setTableData(updatedTable);
        console.log("tabel", tableData)
      }
    }

    setFilter("");
    setShowAllMedicines(false);
  };

  // Handle changes in the table’s input fields
  const handleTableChange = (index, field, value) => {
    const updated = [...tableData];
    updated[index][field] = value;
    setTableData(updated);
  };

  // Gather all data and navigate (or send to backend)
  const handleSave = () => {
    const dataToSend = {
      patient,
      diagnosis,
      investigations,
      prescribedMedicine: tableData,
    };

    history.push("/doctor/prescription/path-to-overview", dataToSend);
  };

  return (
      <div className="diagnosis-page-container">
        {/* LEFT COLUMN */}
        <div className="overview-content">
        <div className="left-column">

          {/* Diagnosis section */}
          <div className="text-section">
            <h3>Diagnostic</h3>
            <textarea
              placeholder="Diagnostic..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          {/* Other investigations */}
          <div className="text-section">
            <h3>Investigații</h3>
            <textarea
              placeholder="Ex. X-Ray, Analize de sânge..."
              value={investigations}
              onChange={(e) => setInvestigations(e.target.value)}
            />
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">
          <h3>Medicamente</h3>

          {/* Search bar + "Toate" button + Overlays */}
          <div className="search-wrapper">
            <div className="search-row">
              <input
                type="text"
                placeholder="Caută medicamente..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="medicine-search-input"
              />
              <button
                className="show-all-button"
                onClick={() => setShowAllMedicines(!showAllMedicines)}
              >
                Toate
              </button>
            </div>

            {/* Filtered Results */}
            {filter.length > 0 && (
              <div className="medicine-search-results-overlay">
                <ul className="medicine-search-results">
                  {filteredPrescriptions.map((med, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectMedicine(med)}
                      className="medicine-search-result-item"
                    >
                      <img
                        src={med.photo}
                        alt={med.title}
                        className="medicine-image"
                      />
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
                      <img
                        src={med.photo}
                        alt={med.title}
                        className="medicine-image"
                      />
                      {med.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Medicine Table */}
          <table className="medicine-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nume</th>
                <th>Doză</th>
                <th className="quantity-col">Cantitate</th>
                <th>Alte detalii</th>
                <th>Durata</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1 }</td>
                  <td>{row.medicineName}</td>
                  <td>
                    <input
                      type="text"
                      value={row.doza}
                      onChange={(e) =>
                        handleTableChange(index, "doza", e.target.value)
                      }
                      placeholder="Doza"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.cantitate}
                      onChange={(e) =>
                        handleTableChange(index, "cantitate", e.target.value)
                      }
                      placeholder="Cantitate"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.detalii}
                      onChange={(e) =>
                        handleTableChange(index, "detalii", e.target.value)
                      }
                      placeholder="Alte Detalii"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.durata}
                      onChange={(e) =>
                        handleTableChange(index, "durata", e.target.value)
                      }
                      placeholder="Durata"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      <div className="footer-buttons">
      <button className="cancel-button">Renunță</button>
        <button className="save-button" onClick={handleSave}>
        Mai departe {" "}
        <FontAwesomeIcon icon={faArrowRight} className="search-icon" />
        </button>
      </div>
    </div>
  );
};

export default Diagnosis;
