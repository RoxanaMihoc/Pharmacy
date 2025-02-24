import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import "./styles/prescription-list.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faArrowLeftLong,
  faSearch,
  faSort,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { fetchPrescriptions } from "../../Services/prescriptionServices";

const PrescriptionsList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleId, setVisibleId] = useState(null);
  const { currentUser, role, token } = useAuth();
  const itemsPerPage = 8;
  const history = useHistory();
  const [sortOption, setSortOption] = useState(null);

  const sortPrescriptions = (option) => {
    const sortedPrescriptions = [...prescriptions];

    if (option === "date-newest") {
      sortedPrescriptions.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (option === "date-oldest") {
      sortedPrescriptions.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setPrescriptions(sortedPrescriptions);
    setSortOption(option);
  };

  useEffect(() => {
    console.log("Updated pres state:", prescriptions);
  }, [prescriptions]);

  useEffect(() => {
    const fetchAllPrescriptions = async () => {
      try {
        const data = await fetchPrescriptions(token);
        console.log("Fetched Data:", data);
        setPrescriptions(data); // ✅ Correct: Replace state instead of appending
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    if (token) {
      fetchAllPrescriptions();
    }
  }, [token]);

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

  const handleAddNewPrescription = () => {
    history.push("/doctor/prescription/users");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="prescriptions-list-page">
      {/* Search Bar and Add Button */}
      <div className="search-add-bar">
        <div className="search-input-wrapper">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Caută comanda"
            className="search-bar"
          />
        </div>
        <div className="action-buttons">
          <button className="add-pres" onClick={handleAddNewPrescription}>
            <FontAwesomeIcon icon={faPlus} className="search-icon" />
            Adaugă o noua rețetă
          </button>
          <div className="dropdown">
            <button className="sort-button">
              <span>
                <FontAwesomeIcon icon={faSort} className="search-icon" />
                Sort
              </span>
            </button>
            <div className="dropdown-menu">
              <span onClick={() => sortPrescriptions("date-newest")}>
                Data (Cea mai recenta)
              </span>
              <span onClick={() => sortPrescriptions("date-oldest")}>
                Data (Cea mai veche)
              </span>
            </div>
          </div>
          <button
            className="refresh-button"
            onClick={() => fetchPrescriptions(currentUser)}
          >
            <span>↻</span>
          </button>
        </div>
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
                                  Preț: {product.medication.price.toFixed(2)}{" "}
                                  Lei
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

      <div className="pagination">
        <span
          className="transparent-button"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <FontAwesomeIcon icon={faArrowLeftLong} />
        </span>
        {Array.from({ length: totalPages }, (_, index) => (
          <span
            key={index + 1}
            disabled={currentPage === index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active-page" : ""}
          >
            {index + 1}
          </span>
        ))}
        <span
          className="transparent-button"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <FontAwesomeIcon icon={faArrowRightLong} />
        </span>
      </div>
    </div>
  );
};

export default PrescriptionsList;
