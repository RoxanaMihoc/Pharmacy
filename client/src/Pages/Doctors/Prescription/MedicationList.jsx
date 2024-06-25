import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./styles/medicine.css";

const MedicationList = () => {
  const [filter, setFilter] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [diagnosis, setDiagnosis] = useState("");
  const location = useLocation();
  const patient = location.state?.patient;
  const itemsPerPage = 4;

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

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const handleInputChange = (index, key, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][key] = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handleSave = () => {
    const selectedItems = prescriptions.filter((item) => item.selected);
    history.push("/doctor/prescription/path-to-overview", {
      diagnosis,
      patient,
      selectedItems,
    });
  };

  const visibleItems = prescriptions
    .filter((item) => item.title.toLowerCase().includes(filter))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(prescriptions.length / itemsPerPage);

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
      <h2>Listă medicamente</h2>
      <input
        type="text"
        placeholder="Caută medicamente.."
        value={filter}
        onChange={handleFilterChange}
        className="search-input"
      />
      <table className="table-container">
        <thead>
          <tr>
            <th>Produs</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item, index) => (
            <>
              <tr key={item.id || index}>
                <td>
                  <img
                    src={item.photo}
                    alt={item.title}
                    className="product-image"
                  />
                  <span>{item.title}</span>
                </td>
                <td>
                  <button
                    className="button-more"
                    onClick={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                  >
                    {expandedId === item.id ? "Mai puține detalii" : "Mai multe detalii"}
                  </button>
                </td>
              </tr>
              {expandedId === item.id && (
                <tr className="details-row">
                  <td colspan="2">
                    <div className="prescription-details">
                      <input
                        type="text"
                        value={item.dosage}
                        onChange={(e) =>
                          handleInputChange(index, "dosage", e.target.value)
                        }
                        placeholder="Doză"
                      />
                      <input
                        type="text"
                        value={item.duration}
                        onChange={(e) =>
                          handleInputChange(index, "duration", e.target.value)
                        }
                        placeholder="Durată"
                      />
                      <input
                        type="text"
                        value={item.sideEffects}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "sideEffects",
                            e.target.value
                          )
                        }
                        placeholder="Efecte Adverse"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "quantity",
                            parseInt(e.target.value, 10)
                          )
                        }
                        placeholder="Cantitate"
                      />
                      <div className="text-area-button">
                        <textarea
                          value={item.notes}
                          onChange={(e) =>
                            handleInputChange(index, "notes", e.target.value)
                          }
                          placeholder="Note"
                        />
                        <button
                          className="button-selected"
                          onClick={() =>
                            handleInputChange(index, "selected", !item.selected)
                          }
                        >
                          {item.selected ? "Deselectează" : "Selectează"}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      <div className="save-and-page">
        <button onClick={handleSave} className="save-button-med">
          Salvează
        </button>

        <div className="pagination">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationList;
