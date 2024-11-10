import React, { useState } from "react";
import "./address.css";

const AddressPage = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cnp: "",
    phone: "",
    email: "",
    county: "",
    city: "",
    address: "",
    additionalInfo: "",
    paymentMethod: "Cash"  // Default payment method
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);  // Pass the address data back to the parent component
  };

  return (
    <form className="order-details" onSubmit={handleSubmit}>
      <h2>Detalii comanda</h2>
      
      <div className="section">
        <h3>1. Informații client</h3>
        <div className="personal-info">
          <label> 
            Nume*
            <input type="text" name="firstName" placeholder="First Name" required onChange={handleInputChange} value={formData.firstName} />
          </label>
          <label>
            Prenume*
            <input type="text" name="lastName" placeholder="Last Name" required onChange={handleInputChange} value={formData.lastName} />
          </label>
          <label>
            CNP*
            <input type="text" name="cnp" placeholder="CNP" required onChange={handleInputChange} value={formData.cnp} />
          </label>
          <label>
            Telefon*
            <input type="tel" name="phone" placeholder="Telefon" required onChange={handleInputChange} value={formData.phone} />
          </label>
          <label>
            E-mail*
            <input type="email" name="email" placeholder="E-mail" required onChange={handleInputChange} value={formData.email} />
          </label>
        </div>
        
        <div className="location-info">
          <label>
            Județ
            <select name="county" required onChange={handleInputChange} value={formData.county}>
              <option value="" disabled>Select the County</option>
              <option value="Iasi">Iasi</option>
              {/* Add more options here */}
            </select>
          </label>
          <label>
            Oraș
            <select name="city" required onChange={handleInputChange} value={formData.city}>
              <option value="" disabled>Select the City</option>
              <option value="Iasi">Iasi</option>
              {/* Add more options here */}
            </select>
          </label>
          <div className="street-info">
          <label>
            Adresă
            <input type="text" name="address" placeholder="Address" required onChange={handleInputChange} value={formData.address} />
          </label>
        </div>
        <div className="street-info">
        <label>
          Informații adiționale
          <textarea name="additionalInfo" placeholder="Other details" onChange={handleInputChange} value={formData.additionalInfo}></textarea>
        </label>
        </div>
        </div>
      </div>

      <div className="section">
        <h3>2. Metoda de plată</h3>
        <div className="payment-methods">
          <label>
          Cash
            <input type="radio" name="paymentMethod" value="Cash" checked={formData.paymentMethod === "Cash"} onChange={handleInputChange} />
          </label>
          <label>

          Card
            <input type="radio" name="paymentMethod" value="Card" checked={formData.paymentMethod === "Card"} onChange={handleInputChange} />

          </label>
        </div>
      </div>
      <div className="section">
        <button type="submit" className="next-step">
          Urmatoarea pagina <span className="arrow">→</span>
        </button>
      </div>
    </form>
  );
};

export default AddressPage;
