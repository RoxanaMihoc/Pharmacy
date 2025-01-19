import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import "./styles/current-prescription.css";

const CurrentPrescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState(
    "Patient is allergic to walnuts and ivy syrup."
  );
  const [limitExceeded, setLimitExceeded] = useState({}); // Track dosage limit exceeded messages
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCurrentPrescriptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/home/current-prescription/${currentUser}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setPrescriptions(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setLoading(false);
      }
    };

    fetchCurrentPrescriptions();
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

    try {
      // Send updated progress to the backend
      const response = await fetch(
        `http://localhost:3000/home/update-progress/${prescription._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medicationId,
            progressHistory: medication.progressHistory,
            currentUser,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update progress");

      // Update state
      setPrescriptions(updatedPrescriptions);
    } catch (error) {
      console.error("Error updating progress:", error);
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

    try {
      // Send updated progress to the backend
      const response = await fetch(
        `http://localhost:3000/home/delete-progress/${prescription._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medicationId,
            progressHistory: medication.progressHistory,
            currentUser,
          }),
        }
      );

      if (!response.ok)
        throw new Error("Failed to delete the last progress entry.");

      // Update state
      setPrescriptions(updatedPrescriptions);
    } catch (error) {
      console.error("Error deleting the last progress entry:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  // Check if any prescription has currentPrescription = true
  const currentPrescription = prescriptions.find(
    (prescription) => prescription.currentPrescription === true
  );

  return (
    <div className="current-prescription-container">
      <h2>Rețeta curentă</h2>
      <div className="current-prescription-container-all">
        <div className="prescription-layout">
          <div className="prescription-details-div">
            <div className="prescription-details">
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
          </div>
          <div className="add-notes-section">
            <div className="notes-box">
              <h3>Notes</h3>
              <p>{notes}</p>
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
                        <p></p>
                        <b>Durată:</b> {med.durata} zile
                      </p>
                      <p>Progres:</p>
                      <ul>
                        {med.progressHistory &&
                          med.progressHistory.map((entry, index) =>
                            entry.date && entry.dosesTaken ? (
                              <li key={index}>
                                {formatDate(entry.date)}: {entry.dosesTaken}{" "}
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
