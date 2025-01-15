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
  

  const handleMarkAsTaken = async (medIndex) => {
    const updatedPrescriptions = [...prescriptions];
    const prescription = updatedPrescriptions[0];
    const medication = prescription.products[medIndex];

    // Ensure progressHistory is initialized
    if (!Array.isArray(medication.progressHistory)) {
      medication.progressHistory = [];
    }

    // Add a new entry for the current date or increment doses for the same day
    const now = new Date();
    const today = now.toLocaleDateString("en-GB"); // Format as DD-MM-YYYY
    const currentTime = now.toLocaleTimeString(); // Current time in local format

    const existingEntry = medication.progressHistory.find(
      (entry) => entry.date === today
    );

    if (existingEntry) {
      // Check if the daily dosage limit is exceeded
      if (existingEntry.dosesTaken >= medication.doza) {
        setLimitExceeded((prev) => ({
          ...prev,
          [medIndex]: `Doza zilnica de ${medication.doza} doze a fost depășită pentru ${medication.medication.title}.`,
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
      [medIndex]: null,
    }));

    console.log(medication.progressHistory)

    try {
      // Send updated progress to the backend
      const response = await fetch(
        `http://localhost:3000/home/update-progress/${prescription._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medIndex,
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

  if (loading) return <p>Loading...</p>;
  if (prescriptions.length === 0)
    return <p>No current prescription found for this patient.</p>;

  return (
    <div className="current-prescription-container">
      <h2>Rețeta curentă</h2>
      <div className="current-prescription-container-all">
        <div className="prescription-layout">
          <div className="prescription-details-div">
            <div className="prescription-details">
              {prescriptions.map((prescription, presIndex) => (
                <div key={presIndex}>
                  <h3>Detalli Rețetă</h3>
                  <p>
                    <strong>Număr Rețeta:</strong>{" "}
                    {prescription.prescriptionNumber}
                  </p>
                  <p>
                    <strong>Diagnostic:</strong> {prescription.diagnosis}
                  </p>
                  <p>
                    <strong>Investigații:</strong> {prescription.investigations}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {prescription.patient.lastName}
                  </p>
                  <p>
                    <strong>Rețetă emisă in data de:</strong>{" "}
                    {new Date(prescription.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="add-notes-section">
            <div className="notes-box">
              <h3>Notes</h3>
              <p>{notes}</p>
              <button className="add-note-button">+</button>
            </div>
          </div>
        </div>

        <div className="medication-table">
          {prescriptions.map((prescription, presIndex) => (
            <div key={presIndex}>
              <h3>Medicamente</h3>
              {Object.values(prescription.products).map((med, medIndex) => {
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
                        Start Date:{" "}
                        {new Date(prescription.date).toLocaleDateString()}
                      </p>
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p>{progress}% completed</p>
                      {limitExceeded[medIndex] && (
                        <p style={{ color: "red" }}>
                          {limitExceeded[medIndex]}
                        </p>
                      )}
                    </div>
                    <button onClick={() => handleMarkAsTaken(medIndex)}>
                      Doză administrată
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentPrescription;
