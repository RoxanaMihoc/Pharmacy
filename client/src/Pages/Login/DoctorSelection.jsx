import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./styles/doctor-selection.css";  // Import the stylesheet

const DoctorSelection = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const location = useLocation();
  const history = useHistory();
  const { firstName, lastName, email, password, identifier, role} = location.state || {};

  useEffect(() => {
    const getAllDoctors = async () => {
      try {
        const response = await fetch(`http://localhost:3000/doctors/all-doctors`);
        if (!response.ok) {
          throw new Error("Failed to get all doctors");
        }
        const data = await response.json();
        console.log(data);
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    getAllDoctors();
  }, []);

  const handleRadioChange = (doctorId) => {
    setSelectedDoctor(doctorId);
  };

  const handleRegister = async (e) => {
      e.preventDefault();
      history.push('/others', { firstName, lastName, email, password, identifier, role, selectedDoctor });
  };

  return (
    <div className="doctor-selection-container">
      <h1>Select a Doctor</h1>
      {doctors.map((doctor, index) => (
        <div key={index} className="doctor-group">
            <div key={doctor._id} className="doctor-item">
              <label>
                <input
                  type="radio"
                  checked={selectedDoctor === doctor._id}
                  onChange={() => handleRadioChange(doctor._id)}
                />
                {doctor.firstName} {doctor.lastName}
              </label>
            </div>
        </div>
      ))}
      <button className="submit-button" onClick={handleRegister}>Submit Doctor Choice</button>
    </div>
  );
};

export default DoctorSelection;
