import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./styles/pres-details.css";
import { useAuth } from "../../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight, faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";

const PrescriptionsList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleId, setVisibleId] = useState(null);
  const { currentUser } = useAuth();
  const [currentPrescriptionId, setCurrentPrescriptionId] = useState(null); // State for the current prescription
  const itemsPerPage = 8; // Define how many prescriptions per page

  useEffect(() => {
    fetchPrescriptions();
  }, [currentUser]);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/home/all-prescriptions/${currentUser}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleMarkAsCurrent = async (prescriptionId) => {
    try {
      const response = await fetch(`http://localhost:3000/home/prescription/${prescriptionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ current: true, currentUser: currentUser, }), // Mark as current in the database
      });
  
      if (!response.ok) {
        throw new Error("Failed to mark the prescription as current.");
      }
  
      setCurrentPrescriptionId(prescriptionId); // Update state to reflect the change
    } catch (error) {
      console.error("Error marking prescription as current:", error);
      alert("An error occurred while marking the prescription as current.");
    }
  };
  
  const handleRemoveCurrent = async () => {
    try {
      if (!currentPrescriptionId) return;
      let prescriptionId = currentPrescriptionId;
      const response = await fetch(`http://localhost:3000/home/prescription/remove-current/${prescriptionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ current: false,
          currentUser: currentUser,
         }), // Remove as current in the database
      });
  
      if (!response.ok) {
        throw new Error("Failed to remove the current prescription.");
      }
  
      setCurrentPrescriptionId(null); // Update state to reflect the change
    } catch (error) {
      console.error("Error removing current prescription:", error);
      alert("An error occurred while removing the current prescription.");
    }
  };
  

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page after filter change
  };

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patient.lastName.toLowerCase().includes(filter) ||
      prescription.patient.firstName.toLowerCase().includes(filter)
  );

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentPrescriptions = filteredPrescriptions.slice(
    firstIndex,
    lastIndex
  );

  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);

  const toggleDetails = (id) => {
    setVisibleId(visibleId === id ? null : id);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="prescriptions-list-page">
      {/* Search Bar */}
      <div className="search-add-bar">
        <input
          type="text"
          placeholder="Caută rețetă..."
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      {/* Prescriptions Table */}
      <table className="prescriptions-table">
        <thead>
          <tr>
            <th>Număr rețetă</th>
            <th>Nume Pacient</th>
            <th>Data</th>
            <th>Status</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {currentPrescriptions.map((prescription) => (
            <React.Fragment key={prescription._id}>
              <tr>
                <td>{prescription.prescriptionNumber}</td>
                <td>
                  {prescription.patient.firstName}{" "}
                  {prescription.patient.lastName}
                </td>
                <td>{new Date(prescription.date).toLocaleDateString()}</td>
                <td>{prescription.status}</td>
                <td>
                  <button onClick={() => toggleDetails(prescription._id)}>
                    {visibleId === prescription._id ? "Ascunde" : "Vezi"}
                  </button>
                  {!currentPrescriptionId && (
                    <button
                      className="mark-current"
                      onClick={() => handleMarkAsCurrent(prescription._id)}
                    >
                      Setează ca activă
                    </button>
                  )}
                  {currentPrescriptionId === prescription._id && (
                    <button
                      className="remove-current"
                      onClick={handleRemoveCurrent}
                    >
                      Elimină ca activă
                    </button>
                  )}
                </td>
              </tr>
              {visibleId === prescription._id && (
                <tr>
                  <td colSpan="5">
                    <div className="med-diag">
                      {/* Product Details Section */}
                      <div className="product-details-prescription">
                        {prescription.products.map((product, index) => (
                          <div key={index} className="product-details-pres">
                            <div className="name-photo">
                              <img
                                src={product.medication.photo}
                                alt={product.medication.title}
                                className="product-image-4"
                              />
                              <div>
                                <p className="product-title">
                                  <strong>{product.medication.title}</strong> -{" "}
                                  {product.medication.brand}
                                </p>
                                <p className="product-price">
                                  Preț: {product.medication.price.toFixed(2)} Lei
                                </p>
                              </div>
                            </div>
                            <div className="dosage">
                              <p>
                                <strong>Doză:</strong> {product.doza}
                              </p>
                              <p>
                                <strong>Durată:</strong> {product.durata}
                              </p>
                              <p>
                                <strong>Cantitate:</strong> {product.cantitate}
                              </p>
                              <p>
                                <strong>Alte detalii:</strong> {product.detalii}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Diagnosis and Investigation Section */}
                      <div className="diagnosis-invest">
                        <p>
                          <strong>Diagnostic:</strong> {prescription.diagnosis}
                        </p>
                        <p>
                          <strong>Investigații:</strong>{" "}
                          {prescription.investigations}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            disabled={currentPage === index + 1}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <FontAwesomeIcon icon={faArrowAltCircleRight} />
        </button>
      </div>
    </div>
  );
};

export default PrescriptionsList;
