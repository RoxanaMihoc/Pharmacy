import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";
import "./styles/doctor-selection.css"; // Updated CSS
// import doc from "../../Utils/doc.png";

const DoctorSelection = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const location = useLocation();
  const history = useHistory();
  const { firstName, lastName, email, password, identifier, role } =
    location.state || {};

  useEffect(() => {
    const getAllDoctors = async () => {
      try {
        const response = await fetch("http://localhost:3000/doctors/all-doctors");
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
    history.push("/others", {
      firstName,
      lastName,
      email,
      password,
      identifier,
      role,
      selectedDoctor,
    });
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-logo">
          <FontAwesomeIcon icon={faCommentMedical} /> MedMonitor
        </div>
        <ul className="nav-links">
          <li>
            <a href="#medicines">Medicines</a>
          </li>
          <li>
            <a href="#doctors">Doctors</a>
          </li>
          <li>
            <a href="#blog">Blog</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
        </ul>
        <div className="nav-buttons"></div>
      </nav>
      <div className="doctor-selection-container-nav">
      <div className="doctor-selection-container">
        <h1>Selectează un doctor:</h1>
        {doctors.map((doctor) => (
          <div key={doctor._id} className="doctor-item">
            {/* Doctor's photo. Replace doctor.imageUrl with the actual property if it differs. 
                Use a placeholder if no image is available. */}
                <div className="doctor-name-photo">
            <img
              src={
                doctor.imageUrl
                  ? doctor.imageUrl
                  : "https://via.placeholder.com/50?text=Doctor"
              }
              alt={`${doctor.firstName} ${doctor.lastName} profile`}
              className="doctor-photo"
            />
                          <span>
                {doctor.firstName} {doctor.lastName}
              </span>
              </div>

            <label className="checkbox-label">
              <input
                type="radio"
                name="doctorSelection"
                checked={selectedDoctor === doctor._id}
                onChange={() => handleRadioChange(doctor._id)}
              />
            </label>
          </div>
        ))}
        <button className="submit-button" onClick={handleRegister}>
          Submit Doctor Choice
        </button>
      </div>
      {/* <div className="hero-image">
          <img
            src={doc}
            alt="Additional pharmacy-related illustration"
          />
        </div> */}
    </div>
    </div>
  );
};

export default DoctorSelection;
