import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faArrowLeftLong,
  faSearch,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/pres-details.css";
import {
  fetchPrescriptions,
  removeCurrentPrescription,
} from "../Services/prescriptionServices";
import { fetchDoctorName } from "../Services/userServices";
import {markPresAsCurrent} from "../Services/prescriptionServices"

const PrescriptionsList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleId, setVisibleId] = useState(null);
  const { currentUser, token } = useAuth();
  const [currentPrescriptionId, setCurrentPrescriptionId] = useState(null);
  const [doctor, setDoctor] = useState("");
  const itemsPerPage = 8; // Prescriptions per page
  const [sortOption, setSortOption] = useState(null); // Tracks current sort option
  
    const sortPrescriptions = (option) => {
      const sortedPrescriptions = [...prescriptions]; // Create a copy to avoid mutating the state directly
  
      if (option === "date-newest") {
        sortedPrescriptions.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (option === "date-oldest") {
        sortedPrescriptions.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
  
      setPrescriptions(sortedPrescriptions);
      setSortOption(option);
    };

  useEffect(() => {
    const getDoctorForPatient = async () => {
      if (currentUser) {
        const  doctorName= await fetchDoctorName(token
        );
        console.log("lala",doctorName)
        setDoctor(doctorName);
      }
    };
    if(token)
    {
    getDoctorForPatient();
    }
  }, [token]);

  useEffect(() => {
    const fetchPrescriptionsData = async () => {
      try {
        const data = await fetchPrescriptions(token);
        setPrescriptions(data);

        const activePrescription = data.find(
          (p) => p.currentPrescription === true
        );
        if (activePrescription) {
          setCurrentPrescriptionId(activePrescription._id);
        }
      } catch (error) {
        console.error("Error fetching prescription data:", error.message);
      }
    };

    fetchPrescriptionsData();
  }, []);

  const handleMarkAsCurrent = async (prescriptionId) => {
    try {
      console.log("lalalaaaa")
      const { success } = await markPresAsCurrent(prescriptionId, token);

      if (success) {
        setCurrentPrescriptionId(prescriptionId);
      }
    } catch (error) {
      console.error("Error marking prescription as current:", error);
      alert("An error occurred while marking the prescription as current.");
    }
  };

  const handleRemoveCurrent = async () => {
    try {
      if (!currentPrescriptionId) return;

      const { success, error } = await removeCurrentPrescription(currentPrescriptionId, token);

      if (success) {
        setCurrentPrescriptionId(null); // Clear the active prescription
        fetchPrescriptions(); // Refresh the prescription list
      } else {
        console.error("Error removing current prescription:", error);
        alert("An error occurred while removing the current prescription.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page
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
    <div className="prescription-page-container">
      <h2>Rețete</h2>
      <div className="prescriptions-list-page">
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
              <th>Nume Doctor</th>
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
                  <td>{doctor}</td>
                  <td>{new Date(prescription.date).toLocaleDateString()}</td>
                  <td>{prescription.status}</td>
                  <td>
                    <button onClick={() => toggleDetails(prescription._id)}>
                      {visibleId === prescription._id ? "Ascunde" : "Vezi"}
                    </button>
                    {currentPrescriptionId === prescription._id ? (
                      <button
                        className="remove-current"
                        onClick={handleRemoveCurrent}
                      >
                        Elimină
                      </button>
                    ) : (
                      !currentPrescriptionId && (
                        <button
                          className="mark-current"
                          onClick={() => handleMarkAsCurrent(prescription._id)}
                        >
                          Setează ca activă
                        </button>
                      )
                    )}
                  </td>
                </tr>
                {visibleId === prescription._id && (
                  <tr>
                    <td colSpan="5">
                      <div className="med-diag">
                        {/* Product Details */}
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
                                    <strong>{product.medication.title}</strong>{" "}
                                    - {product.medication.brand}
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
                                  <strong>Cantitate:</strong>{" "}
                                  {product.cantitate}
                                </p>
                                <p>
                                  <strong>Alte detalii:</strong>{" "}
                                  {product.detalii}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Diagnosis and Investigation */}
                        <div className="diagnosis-invest">
                          <p>
                            <strong>Diagnostic:</strong>{" "}
                            {prescription.diagnosis}
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
    </div>
  );
};

export default PrescriptionsList;
