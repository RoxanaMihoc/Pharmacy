import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import "./styles/overview.css"; // Make sure to create and link this CSS for styling
import io from "socket.io-client";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const socket = io('http://localhost:3000');

const PrescriptionOverview = () => {
  const location = useLocation();
  const patient = location.state?.patient;
  const diagnosis = location.state?.diagnosis;
  const selectedItems = location.state?.selectedItems;
  const investigations = location.state?.investigations;
  const advice= location.state?.advice;
  console.log("ll", advice);
  const { currentUser } = useAuth();
  console.log("In overview", patient, diagnosis, selectedItems);

  const sendPrescription = async () => {
    try {
      const prescriptionData  = {
        doctorId: currentUser, // Assuming currentUser contains the doctor's ID
        patient: patient, // Patient ID from the state
        diagnosis: diagnosis,
        products: selectedItems.map((item) => ({
          medication: item, // ID of the medication
          dosage: item.details[0].dosage, // Dosage information
          duration: item.details[0].hour, // Duration for which the medication is prescribed
          notes: item.details[0].notes,
        })),
        investigations: investigations, // Reason for the prescription
        advice: advice, // Possible side effects
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

  const generatePDF = () => {
    setTimeout(() => {
      const input = document.getElementsByClassName('overview-container');
      if (!input) {
        console.error("Element to generate PDF from was not found!");
        return;
      }
  
      html2canvas(input, { scale: 1, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
        });
        const imgWidth = 210;  // A4 width in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
  
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('prescription-overview.pdf');
      }).catch(err => {
        console.error("Failed to generate PDF", err);
      });
    }, 500); // delay in milliseconds
  };
  

  return (
    <div className="overview-container">
      <h1>Sumar Prescripție</h1>
      <p></p>
      <div className="patient-info">
        <h2>Informații Pacient</h2>
        <p>
          Nume: {patient.lastName}
        </p>
        <p>
          Prenume: {patient.firstName}
        </p>
        <p>Email: {patient.email}</p>
        <p>CNP: {patient.identifier}</p>
        <p>Gen: {patient.gender}</p>
        <p>Data nasterii: {patient.birth_date}</p>
      </div>

      <div className="diagnosis-info">
        <h2>Diagnostic</h2>
        <p>
          {diagnosis}
        </p>
      </div>
      <div className="prescription-details-2">
        <h2>Medicamente selectate</h2>
        <ul>
          {selectedItems.map((item, index) => (
            <li key={index}>
              <span>
                {item.title} - Cantitate: {item.quantity} - Note: {item.details[0].notes} - Durata {item.details[0].hour} - Doza -{item.details[0].dosage}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={sendPrescription} className="send-button">
        Trimite Prescripție
      </button>
      <button onClick={generatePDF} className="generate-pdf-button">
      Generează PDF
    </button>

    </div>
  );
};

export default PrescriptionOverview;
