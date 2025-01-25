import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import "./styles/prescription-list.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { fetchAllPrescriptions } from "../../Services/prescriptionServices";

const PrescriptionsList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleId, setVisibleId] = useState(null);
  const { currentUser, role } = useAuth();
  const itemsPerPage = 8; // Define how many prescriptions per page
  const history = useHistory();

  const [summaryStats, setSummaryStats] = useState({
    prescriptionsThisMonth: 0,
    patientsRequestingRefill: 0,
    newPatientRequests: 0,
  });

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const { success, data, error } = await fetchAllPrescriptions(currentUser);
  
        if (success) {
          setPrescriptions(data);
        } else {
          console.error("Error fetching prescriptions:", error);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };
  
    fetchPrescriptions();
  }, [currentUser, role]);
  

  // const fetchSummaryStats = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3000/home/summary-stats/${currentUser}`,
  //       {
  //         method: "GET",
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch summary stats: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     setSummaryStats({
  //       prescriptionsThisMonth: data.prescriptionsThisMonth || 0,
  //       patientsRequestingRefill: data.patientsRequestingRefill || 0,
  //       newPatientRequests: data.newPatientRequests || 0,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching summary stats:", error.message);
  //   }
  // };

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
        <input
          type="text"
          placeholder="Caută rețetă..."
          value={filter}
          onChange={handleFilterChange}
        />
        <button onClick={handleAddNewPrescription}>Adaugă o noua rețetă</button>
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
                    <strong>{product.medication.title}</strong> - {product.medication.brand}
                  </p>
                  <p className="product-price">Preț: {product.medication.price.toFixed(2)} Lei</p>
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
            <strong>Investigații:</strong> {prescription.investigations}
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
  );
};

export default PrescriptionsList;
