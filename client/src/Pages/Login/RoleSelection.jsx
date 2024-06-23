import React from 'react';
import { useHistory } from 'react-router-dom';

const RoleSelection = () => {
  const history = useHistory();

  const handleRoleSelection = (role) => {
    // Navigate to the login route and pass the selected role via state
    history.push('/login', { role });
  };

  return (
    <div className="role-selection">
      <h1>Select Your Role</h1>
      <button onClick={() => handleRoleSelection('Doctor')}>Doctor</button>
      <button onClick={() => handleRoleSelection('Patient')}>Patient</button>
      <button onClick={() => handleRoleSelection('Pharmacist')}>Pharmacist</button>
    </div>
  );
};

export default RoleSelection;
