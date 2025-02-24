import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import "./styles/current-prescription.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import {
  fetchCurrentPrescriptions,
  updateMedicationProgress,
  deleteLastProgressEntry,
  notifyDoctorAboutCompletion,
} from "../Services/prescriptionServices";
import lala2 from "../../Assets/lala2.png"

const CurrentPrescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [limitExceeded, setLimitExceeded] = useState({}); // Track dosage limit exceeded messages
  const { currentUser, name, token } = useAuth();
  const [historyVisibility, setHistoryVisibility] = useState({}); // State for tracking individual medication history visibility

  useEffect(() => {
    const fetchCurrentPrescriptionsData = async () => {
      const { success, data, error } = await fetchCurrentPrescriptions(
        currentUser, token
      );

      if (success) {
        setPrescriptions(data);
        setLoading(false);
      } else {
        console.error("Error fetching prescriptions:", error);
        setLoading(false);
      }
    };

    fetchCurrentPrescriptionsData();
  }, [currentUser]);

  const formatDate = (date) => {
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

  const handleMarkAsTaken = async (medicationId) => {
    const updatedPrescriptions = [...prescriptions];
    const prescription = updatedPrescriptions[0];

    // Find the medication by its ID
    const medication = prescription.products.find(
      (product) => product._id === medicationId
    );

    if (!medication) {
      console.error(`Medication with ID ${medicationId} not found.`);
      return;
    }

    // Ensure progressHistory is initialized
    if (!Array.isArray(medication.progressHistory)) {
      medication.progressHistory = [];
    }

    // Add a new entry for the current date or increment doses for the same day
    const now = new Date();
    const today = now.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
    const currentTime = now.toLocaleTimeString(); // Current time in local format

    const existingEntry = medication.progressHistory.find(
      (entry) => entry.date === today
    );
    const dailyDose =
      typeof medication.doza === "string"
        ? parseFloat(medication.doza)
        : medication.doza;

    if (existingEntry) {
      // Check if the daily dosage limit is exceeded
      if (existingEntry.dosesTaken >= dailyDose) {
        setLimitExceeded((prev) => ({
          ...prev,
          [medicationId]: `Doza zilnică de ${medication.doza} doze a fost depășită pentru ${medication.medication.title}.`,
        }));
        return; // Exit if the limit is exceeded
      }
      existingEntry.dosesTaken += 1; // Increment dosesTaken by 1
      existingEntry.timeTaken.push(currentTime); // Add the current time
    } else {
      // Add a new entry if no entry exists for today
      medication.progressHistory.push({
        date: today,
        dosesTaken: 1,
        timeTaken: [currentTime],
      });
    }

    // Clear any previous limit exceeded message
    setLimitExceeded((prev) => ({
      ...prev,
      [medicationId]: null,
    }));

    const totalExpectedDoses = medication.durata * medication.doza;

    const totalDaysWithProgress = medication.progressHistory.length; // Days with progress
    const totalDosesTaken = medication.progressHistory.reduce(
      (acc, entry) => acc + entry.dosesTaken,
      0
    );
    console.log("notif",totalDaysWithProgress," ", totalDosesTaken, Number(medication.doza), medication.durata )
    if (
      totalDaysWithProgress === Number(medication.durata) &&
      totalDosesTaken === Number(medication.doza)
    ) {
      setCompleted(true);

      await notifyDoctorAboutCompletion(prescription._id,
        medicationId,
        medication.progressHistory,
        currentUser,
        prescription.doctorId,
        name,
        completed, token);
    }
    else
    {
    // Call the service to update progress in the backend
    const { success } = await updateMedicationProgress(
      prescription._id,
      medicationId,
      medication.progressHistory,
      currentUser,
      prescription.doctorId,
      name,
      completed, token
    );
  

    if (success) {
      setPrescriptions(updatedPrescriptions);
    } else {
      alert("Failed to update medication progress.");
    }
  }
  };

  const handleDeleteLastProgress = async (medicationId) => {
    const updatedPrescriptions = [...prescriptions];
    const prescription = updatedPrescriptions[0];

    // Find the medication by its ID
    const medication = prescription.products.find(
      (product) => product._id === medicationId
    );

    if (!medication) {
      console.error(`Medication with ID ${medicationId} not found.`);
      return;
    }

    // Ensure progressHistory is initialized and has entries
    if (
      !Array.isArray(medication.progressHistory) ||
      medication.progressHistory.length === 0
    ) {
      console.error(
        `No progress history found for medication ID ${medicationId}.`
      );
      return;
    }

    // Remove the last entry
    medication.progressHistory.pop();

    // Call the service to delete the last progress entry in the backend
    const { success } = await deleteLastProgressEntry(
      prescription._id,
      medicationId,
      medication.progressHistory,
      currentUser, token
    );

    if (success) {
      setPrescriptions(updatedPrescriptions); // Update state only if API call is successful
    } else {
      alert("Failed to delete the last progress entry.");
    }
  };

  if (loading) return <p>Loading...</p>;

  // Check if any prescription has currentPrescription = true
  const currentPrescription = prescriptions.find(
    (prescription) => prescription.currentPrescription === true
  );

  const toggleHistoryVisibility = (medicationId) => {
    setHistoryVisibility((prev) => ({
      ...prev,
      [medicationId]: !prev[medicationId], // Toggle the visibility for the specific medication
    }));
  };

  return (
    <div className="current-prescription-container">
      <h2>Rețeta curentă</h2>
      <div className="current-prescription-container-all">
        <div className="prescription-layout">
          <div className="prescription-details-3">
            {currentPrescription ? (
              <div>
                <h3>Detalii Rețetă</h3>
                <p>
                  <strong>Număr Rețeta:</strong>{" "}
                  {currentPrescription.prescriptionNumber}
                </p>
                <p>
                  <strong>Diagnostic:</strong> {currentPrescription.diagnosis}
                </p>
                <p>
                  <strong>Investigații:</strong>{" "}
                  {currentPrescription.investigations}
                </p>
                <p>
                  <strong>Doctor:</strong>{" "}
                  {currentPrescription.patient.lastName}
                </p>
                <p>
                  <strong>Rețetă emisă în data de:</strong>{" "}
                  {new Date(currentPrescription.date).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p>
                Nu există nicio rețetă activă. Selectați o rețetă pentru a
                continua.
              </p>
            )}
          </div>
          <div className="add-notes-section">
            <div className="hero-image">
                <img
                  src={lala2}
                  alt="Additional pharmacy-related illustration"
                />
              </div>
            
          </div>
        </div>

        <div className="medication-table">
          <h3>Medicamente</h3>
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
                        </p>
                        <p>
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
                                <FontAwesomeIcon icon={faArrowRightLong} />{" "}
                                {formatDate(entry.date)}: {entry.dosesTaken}{" "}
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
                        ? formatDate(med.progressHistory[0].date)
                        : "Tratamentul nu a fost inceput"}{" "}
                    </p>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p>{progress}% completed</p>
                    {limitExceeded[med._id] && (
                      <p style={{ color: "red" }}>{limitExceeded[med._id]}</p>
                    )}
                  </div>
                  <div className="button-doza">
                    <button onClick={() => handleMarkAsTaken(med._id)}>
                      Doză administrată
                    </button>
                    <button onClick={() => handleDeleteLastProgress(med._id)}>
                      Șterge ultima doză
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Nu există medicamente disponibile pentru nicio rețetă activă.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentPrescription;
