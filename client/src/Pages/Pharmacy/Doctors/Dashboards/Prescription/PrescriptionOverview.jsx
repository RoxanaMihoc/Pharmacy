import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../../../../Context/AuthContext";
import "./styles/overview.css"; // Make sure to create and link this CSS for styling
import io from "socket.io-client";

const socket = io('http://localhost:3000');

const PrescriptionOverview = () => {
  const location = useLocation();
  const patient = location.state?.patient;
  const selectedItems = location.state?.selectedItems;
  const { currentUser } = useAuth();
  console.log("In overview", patient._id, selectedItems);

  const sendPrescription = async () => {
    try {
      const prescriptionData  = {
        doctorId: currentUser, // Assuming currentUser contains the doctor's ID
        patientId: patient._id, // Patient ID from the state
        products: selectedItems.map((item) => ({
          medication: item, // ID of the medication
          dosage: item.dosage, // Dosage information
          duration: item.duration, // Duration for which the medication is prescribed
          reason: item.reason, // Reason for the prescription
          sideEffects: item.sideEffects, // Possible side effects
        })),
        notes: "Additional notes here", // Additional notes, if any
      };
      const response = await fetch(
        "http://localhost:3000/home/add-prescription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prescriptionData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send prescription");
      }
      const result = await response.json();

      alert("Prescription sent successfully!");
      console.log(result);
    } catch (error) {
      console.error("Error sending prescription:", error);
      alert("Failed to send prescription");
    }
  };

  return (
    <div className="overview-container">
      <h1>Prescription Overview</h1>
      <div className="patient-info">
        <h2>Patient Information</h2>
        <p>
          Name: {patient.firstName} {patient.lastName}
        </p>
        <p>Email: {patient.email}</p>
        <p>CNP: {patient.CNP}</p>
      </div>
      <div className="prescription-details">
        <h2>Selected Medications</h2>
        <ul>
          {selectedItems.map((item, index) => (
            <li key={index}>
              <span>
                {item.title} - Quantity: {item.quantity} - Notes: {item.notes}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={sendPrescription} className="send-button">
        Send Prescription
      </button>
    </div>
  );
};

export default PrescriptionOverview;
