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
    paymentMethod: "Cash", // Default payment method
    deliveryMethod: "", // For delivery options
  });

  const generateFutureDate = () => {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * (7 - 4 + 1)) + 4; // Random number between 4 and 7
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + randomDays);
    return futureDate.toLocaleDateString("ro-RO"); // Format the date for Romania
  };

  const [futureDate, setFutureDate] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "deliveryMethod" && (value === "Ridicare din magazin" || value === "Livrare acasă")) {
      setFutureDate(generateFutureDate());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass the address data back to the parent component
  };

  return (
    <form className="order-details-x" onSubmit={handleSubmit}>
      <h2>Detalii livrare si plata</h2>
      <div className="section-all">
        <div className="section-details">
          <h3>1. Informații client</h3>
          <div className="personal-info">
            <label>
              Nume*
              <input
                type="text"
                name="firstName"
                placeholder="Nume"
                required
                onChange={handleInputChange}
                value={formData.firstName}
              />
            </label>
            <label>
              Prenume*
              <input
                type="text"
                name="lastName"
                placeholder="Prenume"
                required
                onChange={handleInputChange}
                value={formData.lastName}
              />
            </label>
            <label>
              CNP*
              <input
                type="text"
                name="cnp"
                placeholder="CNP"
                required
                onChange={handleInputChange}
                value={formData.cnp}
              />
            </label>
            <label>
              Telefon*
              <input
                type="tel"
                name="phone"
                placeholder="Telefon"
                required
                onChange={handleInputChange}
                value={formData.phone}
              />
            </label>
            <label>
              E-mail*
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                required
                onChange={handleInputChange}
                value={formData.email}
              />
            </label>
            <label>
              Adresă
              <input
                type="text"
                name="address"
                placeholder="Adresă"
                required
                onChange={handleInputChange}
                value={formData.address}
              />
            </label>

            <label>
              Județ
              <select
                name="county"
                required
                onChange={handleInputChange}
                value={formData.county}
              >
                <option value="" disabled>
                  Judet
                </option>
                <option value="Iasi">Iasi</option>
                {/* Add more options here */}
              </select>
            </label>
            <label>
              Oraș
              <select
                name="city"
                required
                onChange={handleInputChange}
                value={formData.city}
              >
                <option value="" disabled>
                  Oraș
                </option>
                <option value="Iasi">Iasi</option>
                {/* Add more options here */}
              </select>
            </label>
          </div>
          <div className="additional-info">
            <label>
              Informații adiționale
              <textarea
                name="additionalInfo"
                placeholder="Alte detalii"
                onChange={handleInputChange}
                value={formData.additionalInfo}
              ></textarea>
            </label>
          </div>
        </div>

        <div className="section-payment-delivery">
          <div className="section-payment">
            <h3>2. Metoda de plată</h3>
            <div className="payment-methods">
              <div className="method">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    checked={formData.paymentMethod === "Cash"}
                    onChange={handleInputChange}
                  />
                </label>
                <p>Cash</p>
              </div>
              <div className="method">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked={formData.paymentMethod === "Card"}
                    onChange={handleInputChange}
                  />
                </label>
                <p>Card</p>
              </div>
            </div>
          </div>

          <div className="section-delivery">
            <h3>3. Livrare</h3>
            <div className="delivery-methods">
              <div className="method">
                <label>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="Ridicare din magazin"
                    checked={formData.deliveryMethod === "Ridicare din magazin"}
                    onChange={handleInputChange}
                  />
                </label>
                <p>Ridicare din magazin</p>
                {formData.deliveryMethod === "Ridicare din magazin" && (
                  <p className="delivery-info">
                    Comanda va putea fi ridicată începând cu data de {futureDate} de la magazinul din locația Iași.
                  </p>
                )}
              </div>
              <div className="method">
                <label>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="Livrare acasă"
                    checked={formData.deliveryMethod === "Livrare acasă"}
                    onChange={handleInputChange}
                  />
                </label>
                <p>Livrare SamDay</p>
                {formData.deliveryMethod === "Livrare acasă" && (
                  <p className="delivery-info">
                    Comanda va fi livrată la domiciliu începând cu data de {futureDate}.
                  </p>
                )}
              </div>
              <div className="method">
                <label>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="Easybox"
                    checked={formData.deliveryMethod === "Easybox"}
                    onChange={handleInputChange}
                  />
                </label>
                <p>Easybox</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <button type="submit" className="next-step">
          Finalizarea comenzii <span className="arrow">→</span>
        </button>
      </div>
    </form>
  );
};

export default AddressPage;