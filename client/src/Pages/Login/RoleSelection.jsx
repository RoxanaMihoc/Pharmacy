import React from 'react';
import { useHistory } from 'react-router-dom';
import './styles/role-selection.css';  // Assuming you have saved the CSS in RoleSelection.css

const RoleSelection = () => {
  const history = useHistory();

  const handleRoleSelection = (role) => {
    history.push('/login', { role });
  };

  return (
    <div className="role-selection">
      <h1>Bine ai venit pe MedMonitor!</h1>
      <h2>Conectează-te ca:</h2>
      <button className="button-role" onClick={() => handleRoleSelection('Doctor')}>Doctor</button>
      <button className="button-role" onClick={() => handleRoleSelection('Patient')}>Pacient</button>
      <button className="button-role" onClick={() => handleRoleSelection('Pharmacist')}>Farmacist</button>
    </div>
  );
};

export default RoleSelection;

