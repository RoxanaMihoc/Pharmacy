import React, { useState, useEffect } from "react";
import "./styles/patient-profile-doctor.css";
import { useParams, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight, faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

const PatientProfile = ({ onBack }) => {
  const [patient, setPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const patientId = useParams();
  const user = patientId.patientId;
  const [activeTab, setActiveTab] = useState("profile");
  const [visibleId, setVisibleId] = useState(null);
  const history= useHistory();
  const itemsPerPage = 4; // Number of prescriptions per page
  const totalPages = Math.ceil(prescriptions.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    setCurrentPage(current => (current < totalPages ? current + 1 : current));
  };

  const prevPage = () => {
    setCurrentPage(current => (current > 1 ? current - 1 : current));
  };

  const firstIndex = (currentPage - 1) * itemsPerPage;
  const lastIndex = firstIndex + itemsPerPage;
  const currentItems = prescriptions.slice(firstIndex, lastIndex);

  const toggleDetails = (id) => {
    setVisibleId(visibleId === id ? null : id);
  };

  useEffect(() => {
    const fetchPatient = async () => {
      console.log(patientId);
      try {
        const response = await fetch(
          `http://localhost:3000/doctors/patient/${patientId.patientId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setPatient(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/home/prescription/${user}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);
      setPrescriptions(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!patient) return <div>No patient found</div>;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const handleBack=() =>{
    history.push("/doctor/profile");
  }

  const tabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="user-profile2">
              <div className="user-stats">
                <p>
                  <strong>Gen:</strong> {patient[0].gender}
                </p>
                <p>
                  <strong>Zi de naștere:</strong> {patient[0].birth_date}
                </p>
                <p>
                  <strong>Oraș:</strong> {patient[0].city}
                </p>
                <p>
                  <strong>Numar mobil:</strong> {patient[0].phone}
                </p>
                <p>
                  <strong>Cod Postal:</strong> {patient[0].postal_code}
                </p>
                <p>
                  <strong>Adresă:</strong> {patient[0].address}
                </p>
                <p>
                  <strong>Data nașterii:</strong> {patient[0].birth_date}
                </p>
              </div>
          </div>
        );
      case "medications":
        return (
          <><ul className="prescriptions-list">
            {currentItems.map((prescription, index) => (
              <li key={prescription._id || index}>
                <div className="prescription-header">
                  <h3>Rețeta medicală din data: {formatDate(prescription.date)}</h3>
                  <button onClick={() => toggleDetails(index)} className="view-button">
                    {visibleId === index ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
                {visibleId === index && (
                  <div className="prescription-details">
                    {prescription.products.map((product, idx) => (
                      <div key={idx} className="product-details">
                        <img src={product.medication.photo} alt={product.medication.title} className="product-image2" />
                        <div>
                          <p><strong>{product.medication.title}</strong></p>
                          <p>Brand: {product.medication.brand}</p>
                          <p>Preț: {product.medication.price} Lei</p>
                          <p>Doza: {product.dosage || 'N/A'}, Durata: {product.duration || 'N/A'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul><div className="pagination">
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
            </div></>
        );
      default:
        return null;
    }
  };

  return (
    <div className="patient-profile-container-doctor">
      <button className="button-back" onClick={handleBack}>
        Înapoi la lista pacienților
      </button>

      <div className="header-info">
        <div className="header-details">
          <img
            src={patient[0].photo || "default_profile.png"}
            alt={`${patient[0].firstName} ${patient[0].lastName}`}
            className="header-photo"
          />
          <div className="header-text">
            <h1>{`${patient[0].firstName} ${patient[0].lastName}`}</h1>
            <p>{patient[0].email}</p>
          </div>
        </div>
      </div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`tab ${activeTab === "medications" ? "active" : ""}`}
          onClick={() => setActiveTab("medications")}
        >
          Medications
        </button>
      </div>
      <div className="tab-content">{tabContent()}</div>
    </div>
  );
};

export default PatientProfile;
