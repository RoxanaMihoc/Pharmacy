import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import "./styles/prescription-list.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight, faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

const PrescriptionsList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleId, setVisibleId] = useState(null);
  const itemsPerPage = 8; // Define how many prescriptions per page
  const history = useHistory();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('http://localhost:3000/home/all-prescriptions');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page after filter change
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patient.lastName.toLowerCase().includes(filter) ||
    prescription.patient.firstName.toLowerCase().includes(filter)
  );

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentPrescriptions = filteredPrescriptions.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);

  const toggleDetails = (id) => {
    setVisibleId(visibleId === id ? null : id);
  };

  const handleAddNewPrescription = () => {
    history.push('/doctor/prescription/users');
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="prescriptions-list-page">
      <div className="search-add-bar">
        <input
          type="text"
          placeholder="Caută rețetă..."
          value={filter}
          onChange={handleFilterChange}
        />
        <button onClick={handleAddNewPrescription}>Adaugă o noua rețetă</button>
      </div>
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
          {currentPrescriptions.map(prescription => (
            <React.Fragment key={prescription._id}>
              <tr>
                <td>{prescription.prescriptionNumber}</td>
                <td>{prescription.patient.firstName} {prescription.patient.lastName}</td>
                <td>{new Date(prescription.date).toLocaleDateString()}</td>
                <td>{prescription.status}</td>
                <td>
                  <button onClick={() => toggleDetails(prescription._id)}>
                    {visibleId === prescription._id ? "Hide" : "View"}
                  </button>
                </td>
              </tr>
              {visibleId === prescription._id && (
                <>
                  <tr>
                    <td colSpan="5"><strong>Diagnostic:</strong> {prescription.diagnosis}</td>
                  </tr>
                  {prescription.products.map((product, index) => (
                    <tr key={index}>
                      <td colSpan="5">
                        <div className="product-details">
                          <img src={product.medication.photo} alt={product.medication.title} className="product-image-4" />
                          <div>
                            <p><strong>{product.medication.title}</strong> - {product.medication.brand}</p>
                            <p>Preț: {product.medication.price.toFixed(2)}Lei</p>
                            <p>Doză: {product.dosage}</p> <p> Durată: {product.duration}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button 
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}>
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1}
                  disabled={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
        <button 
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}>
          <FontAwesomeIcon icon={faArrowAltCircleRight} />
        </button>
      </div>
    </div>
  );
};

export default PrescriptionsList;
