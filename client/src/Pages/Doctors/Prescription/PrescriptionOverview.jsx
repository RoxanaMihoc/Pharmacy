import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import "./styles/overview.css"; // Updated CSS
import io from "socket.io-client";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const socket = io("http://localhost:3000");

const PrescriptionOverview = () => {
  const location = useLocation();
  const history = useHistory();
  const { currentUser } = useAuth();

  // Grab all data from location.state
  const patient = location.state?.patient;
  const diagnosis = location.state?.diagnosis;
  const prescribedMedicine = location.state?.prescribedMedicine;
  console.log(location.state?.prescribedMedicine.med);
  const investigations = location.state?.investigations;
  console.log(location.state?.patient.birth_date);
  const age = calculateAge(location.state?.patient.birth_date);
  console.log(age);

  function calculateAge(birthDateString) {
    // Convert the birthDateString into a Date object
    const [day, month, year] = birthDateString.split("-");
  
    // 2. Construct a valid Date object: note that months are zero-based in JS
    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
    
    // 3. Create a "today" reference
    const today = new Date();
  
    // 4. Get the rough difference in years
    let age = today.getFullYear() - birthDate.getFullYear();
  
    // 5. Check if birthday has happened yet this year
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
  
    return age;
  }

  console.log("In overview (prescribedMedicine):", prescribedMedicine);

  // Send the prescription to the backend
  const sendPrescription = async () => {
    try {
      const prescriptionData = {
        doctorId: currentUser,
        patient: patient,
        diagnosis: diagnosis,
        products: prescribedMedicine.map((item) => ({
          medication: item.med,
          cantitate: item.cantitate,
          detalii: item.detalii,
          doza: item.doza,
          durata: item.durata,
        })),
        investigations: investigations,
      };

      const response = await fetch("http://localhost:3000/home/add-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescriptionData),
      });

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

  // Generate a PDF of the page
  const generatePDF = () => {
    setTimeout(() => {
      const input = document.getElementsByClassName("overview-container")[0];
      if (!input) {
        console.error("Element to generate PDF from was not found!");
        return;
      }

      html2canvas(input, { scale: 1, useCORS: true })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({ orientation: "portrait" });
          const imgWidth = 210; // A4 width in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
          pdf.save("prescription-overview.pdf");
        })
        .catch((err) => {
          console.error("Failed to generate PDF", err);
        });
    }, 500);
  };

  return (
    <div className="overview-container">
      <h1>Sumar Prescripție</h1>

      {/* Two-column layout */}
      <div className="diagnosis-content">
        {/* Left column */}
        <div className="overview-left">

          {/* Profile card (similar to screenshot) */}
          <div className="profile-card">
            {/* Example: use actual patient data or placeholders */}
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

          {/* Patient Info */}
          <div className="patient-info">
            <h2>Informații Pacient</h2>
            <p>Nume: {patient?.lastName}</p>
            <p>Prenume: {patient?.firstName}</p>
            <p>Email: {patient?.email}</p>
            <p>CNP: {patient?.identifier}</p>
            <p>Gen: {patient?.gender}</p>
            <p>Data nașterii: {patient?.birth_date}</p>
          </div>
        </div>

        {/* Right column: Diagnosis, Investigations, Medicines */}
        <div className="overview-right">
          <div className="diagnosis-info">
            <h2>Diagnostic</h2>
            <p>{diagnosis}</p>
          </div>
          <div className="investigation-info">
            <h2>Investigații</h2>
            <p>{investigations}</p>
          </div>
          <div className="prescription-details-2">
            <h2>Medicamente selectate</h2>
            <ul>
  {prescribedMedicine
    ?.filter((item) => item.medicineName.trim() !== "")
    .map((item, index) => (
      <li key={index}>
        <span className="medicine-name">{item.medicineName}</span>
        
        <div className="medicine-detail-row">
          <span className="label">Cantitate:</span>
          <span>{item.cantitate}</span>
        </div>

        <div className="medicine-detail-row">
          <span className="label">Doză:</span>
          <span>{item.doza}</span>
        </div>

        <div className="medicine-detail-row">
          <span className="label">Durata:</span>
          <span>{item.durata}</span>
        </div>

        <div className="medicine-detail-row">
          <span className="label">Detalii:</span>
          <span>{item.detalii}</span>
        </div>
      </li>
    ))
  }
</ul>

          </div>
        </div>
      </div>

      {/* Buttons at the bottom */}
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
