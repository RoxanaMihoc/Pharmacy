import React, { useState, useEffect } from "react";
import "./styles/patient-profile-doctor.css";
import { useParams, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchPrescriptionsForDoctors } from "../Services/prescriptionServices"
import { fetchPatientDetailsForDoctorPage } from "../Services/userServices"
import {
  faArrowRightLong,
  faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";

const PatientProfile = ({ onBack }) => {
  const [patient, setPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const patientId = useParams();
  const user = patientId.patientId;
  const [activeTab, setActiveTab] = useState("current-pres");
  const [visibleId, setVisibleId] = useState(null);
  const history = useHistory();
  const itemsPerPage = 5; // Number of prescriptions per page
  const totalPages = Math.ceil(prescriptions.length / itemsPerPage);
  const [currentPrescription, setCurrentPrescription] = useState(null);
  const [historyVisibility, setHistoryVisibility] = useState({}); // State for tracking individual medication history visibility
  
  console.log(patient);
  const [age, setAge] = useState(0);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    setCurrentPage((current) => (current < totalPages ? current + 1 : current));
  };

  const prevPage = () => {
    setCurrentPage((current) => (current > 1 ? current - 1 : current));
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
        const { success, data, error } = await fetchPatientDetailsForDoctorPage(
          patientId.patientId,token
        );
  
        if (success) {
          console.log(data);
          setPatient(data[0]);
          setAge(calculateAge(data[0]?.birth_date));
          setLoading(false);
        } else {
          console.error("Error fetching patient:", error);
          setError(error);
          setLoading(false);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
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
      const { success, data, error } = await fetchPrescriptionsForDoctors(user,token);
  
      if (success) {
        console.log(data);
        setPrescriptions(data);
  
        const current = data.find(
          (prescription) => prescription.currentPrescription === true
        );
        setCurrentPrescription(current || null);
        console.log(currentPrescription);
      } else {
        console.error("Error fetching prescriptions:", error);
        setError(error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
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

  const handleBack = () => {
    history.push("/doctor/profile");
  };

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

  const toggleHistoryVisibility = (medicationId) => {
    setHistoryVisibility((prev) => ({
      ...prev,
      [medicationId]: !prev[medicationId], // Toggle the visibility for the specific medication
    }));
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
                        <button
                        className="history-button"
                        onClick={() => toggleHistoryVisibility(med._id)}
                      >
                        {historyVisibility[med._id]
                          ? "Ascunde Istoric"
                          : "Afișează Istoric"}
                      </button>
                      </div>
                    </div>
                    {historyVisibility[med._id] && (
                      <div className="history-details">
                        <h4>Istoric:</h4>
                        <p>Progres:</p>
                        <ul>
                          {med.progressHistory &&
                            med.progressHistory.map((entry, index) =>
                              entry.date && entry.dosesTaken ? (
                                <li key={index}>
                                <FontAwesomeIcon icon={faArrowRightLong} /> {formatDate2(entry.date)}: {entry.dosesTaken}{" "}
                                  doze luate
                                  {entry.timeTaken &&
                                    entry.timeTaken.length > 0 && (
                                      <ul>
                                        {entry.timeTaken.map(
                                          (time, timeIndex) => (
                                            <li key={timeIndex}>
                                              • La ora: {time}
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
                    )}
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
              <p>
                Nu există medicamente disponibile pentru nicio rețetă activă.
              </p>
            )}
          </div>
        );
      case "medications":
        return (
          <>
            <ul className="prescriptions-list">
              {currentItems.map((prescription, index) => (
                <li key={prescription._id || index}>
                  <div className="prescription-header">
                    <h3>
                      Rețeta medicală nr: {prescription.prescriptionNumber}
                    </h3>
                    <button
                      onClick={() => toggleDetails(index)}
                      className="view-button"
                    >
                      {visibleId === index ? "Ascunde" : "Vezi"}
                    </button>
                  </div>
                  {visibleId === index && (
                    <div className="prescription-details">
                      <div key={index} className="product-details2">
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
                  )}
                </li>
              ))}
            </ul>
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
          </>
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
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  return (
    <div className="patient-profile-container-doctor">
      <button className="button-back" onClick={handleBack}>
      <FontAwesomeIcon icon={faArrowLeftLong} /> {" "}
        Înapoi la lista pacienților
      </button>

      <div className="header-info">
        <div className="header-details">
          <img
            src={patient?.photo}
            alt="Patient Avatar"
            className="profile-avatar"
          />
          <h3>
            {patient?.firstName} {patient?.lastName}
          </h3>
          <p>
            <strong>Email:</strong> {patient.email}
          </p>
          <p>
            <strong> CNP:</strong> {patient?.identifier}
          </p>
          <p>
            {" "}
            <strong>Vârsta: </strong> {age}
          </p>
        </div>
        <div className="user-profile2">
          <div className="user-info">
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
              <strong>Număr de telefon :</strong> {patient.phone}
            </p>
            <p>
              <strong>Cod Poștal:</strong> {patient.postal_code}
            </p>
            <p>
              <strong>Adresă:</strong> {patient.address}
            </p>
            <p>
              <strong>Data nașterii:</strong> {patient.birth_date}
            </p>
            <p>
              <strong>Alergii:</strong> {patient.allergies}
            </p>
            <p>
              <strong>Înălțime:</strong> {patient.height} m
            </p>
            <p>
              <strong>Greutate:</strong> {patient.weight} kg
            </p>
          </div>
        </div>
      </div>
      <div className="tabs2">
        <button
          className={`tabs2 ${activeTab === "current-pres" ? "active" : ""}`}
          onClick={() => setActiveTab("current-pres")}
        >
          Reteta curenta
        </button>
        <button
          className={`tabs2 ${activeTab === "medications" ? "active" : ""}`}
          onClick={() => setActiveTab("medications")}
        >
          Toate retetele
        </button>
      </div>
      <div className="tab-content2">{tabContent()}</div>
    </div>
  );
};

export default PatientProfile;
