// import React, { useState, useEffect } from "react";
// import { Modal, Button } from "react-bootstrap";
// import "./styles/medicine.css";

// const MedicineList = ({ show, handleClose, onMedicineSelect }) => {
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [selectedMedicine, setSelectedMedicine] = useState([]); // Array to store multiple selected medicines

//   useEffect(() => {
//     const fetchPrescriptions = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/home/all-products");
//         if (!response.ok) {
//           throw new Error("Something went wrong!");
//         }
//         const data = await response.json();
//         setPrescriptions(data);
//       } catch (error) {
//         console.error("Fetch error:", error);
//       }
//     };

//     fetchPrescriptions();
//   }, []);

//   const handleModalClose = () => {
//     // Clear selected medicines before closing
//     setSelectedMedicine([]);
//     handleClose();
//   };

//   const handleSave = () => {
//     console.log(selectedMedicine);
//     if (selectedMedicine.length > 0) {
//       onMedicineSelect(selectedMedicine); // Pass selected medicines to the parent
//       handleClose(); // Close the modal
//     } else {
//       alert("Please select at least one medicine.");
//     }
//   };

//   const handleMedicineClick = (medication) => {
//     setSelectedMedicine((prevSelected) => {
//       // Toggle the medication's selection
//       if (prevSelected.some((item) => item.id === medication.id)) {
//         // If already selected, remove it
//         return prevSelected.filter((item) => item.id !== medication.id);
//       } else {
//         // If not selected, add it
//         return [...prevSelected, medication];
//       }
//     });
//   };

//   return (
//     <Modal show={show} onHide={handleClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Listă Medicamente</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <ul className="medication-list">
//           {prescriptions.map((medication) => (
//             <li
//               key={medication.id}
//               className={`medication-item ${
//                 selectedMedicine.find((item) => item.id === medication.id)
//                   ? "selected"
//                   : ""
//               }`}
//               onClick={() => handleMedicineClick(medication)} // Toggle selection on click
//             >
//               <img
//                 src={medication.photo}
//                 alt={medication.title}
//                 className="medication-image"
//               />
//               <span className="medication-title">{medication.title}</span>
//             </li>
//           ))}
//           {prescriptions.length === 0 && (
//             <li className="no-results">No medications found</li>
//           )}
//         </ul>
//       </Modal.Body>
//       <Modal.Footer>
//         <span className="selected-count">
//           {selectedMedicine.length} items selected
//         </span>
//         <Button className="button-fav-preview" onClick={handleSave}>
//           Save
//         </Button>
//         <Button className="button-fav-preview" onClick={handleClose}>
//           Închide
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default MedicineList;
