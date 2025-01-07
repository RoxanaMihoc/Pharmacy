import React from "react";
import { useHistory, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTablets, faUsers, faArrowLeftLong, faCommentMedical } from '@fortawesome/free-solid-svg-icons';
import './styles/page.css';
import vitamins from "../../Utils/vitamins.png";
import flu from "../../Utils/flu.png";
import pres from "../../Utils/pres.png";
import skin from "../../Utils/skin.png";
import lala from "../../Utils/lala2.png";

const PharmacyPage = () => {
  const history = useHistory();

  const handleRoleSelectionLogIn = (role) => {
    history.push('/login', { role });
  };

  const handleRoleSelectionSignUp = (role) => {
    history.push('/register', { role });
  };
  return (
    <div className="pharmacy-container">
      {/* Navigation */}
      <nav className="navbar">
                <Link to="/role" className="nav-logo">
                <FontAwesomeIcon icon={faCommentMedical} /> MedMonitor
              </Link>
        <ul className="nav-links">
          <li><a href="#medicines">Medicines</a></li>
          <li><a href="#doctors">Doctors</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div className="nav-buttons">
          <button className="btn sign-up" onClick={() => handleRoleSelectionSignUp('Patient')}>Înregistrare</button>
          <button className="btn sign-in"onClick={() => handleRoleSelectionLogIn('Patient')}>Conectare</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
  <div className="hero-content">
    <h1 className="hero-title"> <FontAwesomeIcon icon={faCommentMedical} /> MedMonitor</h1>
    <p className="hero-subtitle">Cea mai bună alegere pentru tine și familia ta</p>
    <p className="hero-sub-subtitle">Achiziții online • Livrare gratuită</p>
    <div className="hero-buttons">
      <button className="btn primary">Search medicine</button>
      <button className="btn secondary">Doctor’s consultation</button>
    </div>
  </div>

  {/* Right side images */}
  <div className="hero-image">
    <img
      src={lala}
      alt="Additional pharmacy-related illustration"
    />
  </div>
</header>


      {/* Trending Topics */}
      <section className="trending-topics">
        <h2></h2>
        <div className="topics-grid">
          <div className="topic-card">
            <img
              src={vitamins}
              alt="Vitamins icon"
            />
            <p>Vitamine</p>
          </div>
          <div className="topic-card">
            <img
              src={flu}
              alt="Flu Remedies icon"
            />
            <p>Medicamente</p>
          </div>
          <div className="topic-card">
            <img
              src={pres}
              alt="Prescriptions icon"
            />
            <p>Prescripții medicale</p>
          </div>
          <div className="topic-card">
            <img
              src={skin}
              alt="Consultation icon"
            />
            <p>Cosmetice si Dermato-cosmetice</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PharmacyPage;
