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
  const [currentPrescription, setCurrentPrescription] = useState(null);
  console.log(patient);
  const [age, setAge] = useState(0);

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
        setPatient(data[0]);
        setAge(calculateAge(data[0]?.birth_date));
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
      const current = data.find(
        (prescription) => prescription.currentPrescription === true
      );
      setCurrentPrescription(current || null); 
      console.log(currentPrescription)
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

  const formatDate2 = (date) => {
    // If the date is already in DD/MM/YYYY format, return it directly
    if (date.includes("/")) {
      return date;
    }

    // Handle ISO date strings (YYYY-MM-DD)
    const parts = date.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`; // Convert to DD/MM/YYYY
    }

    return date; // Return the original value if it doesn't match expected formats
  };

  const tabContent = () => {
    switch (activeTab) {
      case "current-pres":
        return (
          <div className="current-press">
          <h2>Reteta Nr: {currentPrescription?.prescriptionNumber}</h2>
          {currentPrescription ? (
            currentPrescription.products.map((med, medIndex) => {
              const totalDoses = med.durata * med.doza;
              const takenDoses = med.progressHistory
                ? med.progressHistory.reduce(
                    (acc, entry) => acc + entry.dosesTaken,
                    0
                  )
                : 0;
              const progress = Math.min(
                (takenDoses / totalDoses) * 100,
                100
              ).toFixed(2);

              return (
                <div key={medIndex} className="medication-row">
                  <div className="medication-info">
                    <img
                      src={med.medication.photo}
                      alt={med.medication.title}
                    />
                    <div>
                      <h4>{med.medication.title}</h4>
                      <p>{med.medication.brand}</p>
                      <p>
                        <b>Doză:</b> {med.doza} pe zi
                        <p></p>
                        <b>Durată:</b> {med.durata} zile
                      </p>
                      <p>Progres:</p>
                      <ul>
                        {med.progressHistory &&
                          med.progressHistory.map((entry, index) =>
                            entry.date && entry.dosesTaken ? (
                              <li key={index}>
                                {formatDate2(entry.date)}: {entry.dosesTaken}{" "}
                                doze luate
                                {entry.timeTaken &&
                                  entry.timeTaken.length > 0 && (
                                    <ul>
                                      {entry.timeTaken.map(
                                        (time, timeIndex) => (
                                          <li key={timeIndex}>
                                            La ora: {time}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  )}
                              </li>
                            ) : null
                          )}
                      </ul>
                    </div>
                  </div>
                  <div className="medication-progress">
                    <p>
                      Dată începere:{" "}
                      {med.progressHistory && med.progressHistory.length > 0
                        ? formatDate2(med.progressHistory[0].date)
                        : "Tratamentul nu a fost inceput"}{" "}
                    </p>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p>{progress}% completed</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Nu există medicamente disponibile pentru nicio rețetă activă.</p>
          )}
              
          </div>
        );
      case "medications":
        return (
          <><ul className="prescriptions-list">
            {currentItems.map((prescription, index) => (
              <li key={prescription._id || index}>
                <div className="prescription-header">
                  <h3>Rețeta medicală nr: {prescription.prescriptionNumber}</h3>
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
                          <p>Doza: {product.doza || 'N/A'}, Durata: {product.durata || 'N/A'}</p>
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

  function calculateAge(birthDateString) {
    const [day, month, year] = birthDateString.split("-");
    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  return (
    <div className="patient-profile-container-doctor">
      <button className="button-back" onClick={handleBack}>
        Înapoi la lista pacienților
      </button>

      <div className="header-info">
      <div className="header-details">
            <img
              src={patient?.photo}
              alt="Patient Avatar"
              className="profile-avatar"
            />
            <h3>{patient?.firstName} {patient?.lastName}</h3>
            <p>CNP: {patient?.identifier}</p>
            <p>Vârsta: {age}</p>
            <button className="btn view-profile">Vezi Profil</button>
          </div>
        <div className="user-profile2">
              <div className="user-stats">
                <p>
                  <strong>Gen:</strong> {patient.gender}
                </p>
                <p>
                  <strong>Zi de naștere:</strong> {patient.birth_date}
                </p>
                <p>
                  <strong>Oraș:</strong> {patient.city}
                </p>
                <p>
                  <strong>Numar mobil:</strong> {patient.phone}
                </p>
                <p>
                  <strong>Cod Postal:</strong> {patient.postal_code}
                </p>
                <p>
                  <strong>Adresă:</strong> {patient.address}
                </p>
                <p>
                  <strong>Data nașterii:</strong> {patient.birth_date}
                </p>
              </div>
          </div>
      </div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "current-pres" ? "active" : ""}`}
          onClick={() => setActiveTab("current-pres")}
        >
          Reteta curenta
        </button>
        <button
          className={`tab ${activeTab === "medications" ? "active" : ""}`}
          onClick={() => setActiveTab("medications")}
        >
          Toate retetele
        </button>
      </div>
      <div className="tab-content">{tabContent()}</div>
    </div>
  );
};

export default PatientProfile;
