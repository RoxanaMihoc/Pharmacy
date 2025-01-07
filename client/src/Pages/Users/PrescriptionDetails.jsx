import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from '../../Context/AuthContext';
import {addToFav} from '../../Components/FavButton';
import './styles/prescription-details.css';

const PrescriptionDetails = () => {
    const location = useLocation();
    const { notification } = location.state;
    const { currentUser} = useAuth();
    console.log("lala", notification);

    const addAllToCart = () => {
        notification.prescriptionDetails.products.forEach(async product => {
            try {
                console.log(product.medication._id);
                const result = await addToFav(currentUser, product.medication._id, notification.prescriptionNumber);
                console.log('Product added to cart:', result);
              } catch (error) {
                console.error('Failed to add product to cart:', error.message);
                // Handle error, show an error message to the user
              }
        });
        alert('All medications have been added to your cart.');
    };

    const renderProducts = (products) => {
        if (!products || !products.length) return <p className="detailItem">No products listed.</p>;

        return products.map((product, index) => (
            <div key={index} className="productCard">
                <img src={product.medication.photo} alt={product.medication.title} className="productImage" />
                <div className="details">
                    <p className="detailItem title">{product.medication.title || 'No title provided'}</p>
                    <p className="detailItem"><strong>Brand:</strong> {product.medication.brand}</p>
                    <p className="detailItem"><strong>Categorie:</strong> {product.medication.category}</p>
                    <p className="detailCheckbox"><strong>Preț:</strong> {product.medication.price} RON</p>
                    <p className="detailCheckbox"><strong>Doza:</strong> {product.doza}</p>
                    <p className="detailCheckbox"><strong>Durata:</strong> {product.durata}</p>
                    <p className="detailCheckbox"><strong>Cantitate:</strong> {product.cantitate}</p>
                    <p className="detailCheckbox"><strong>Detalii:</strong> {product.detalii}</p>
                </div>
            </div>
        ));
    };

    return (
        <div className="pres-container">
            <h1 className="header">Detalii Prescripție</h1>
            <div>
                {renderProducts(notification.prescriptionDetails.products)}
                <p className="detailCheckbox"><strong>Diagnostic:</strong> {notification.prescriptionDetails.diagnosis}</p>
                <p className="detailCheckbox"><strong>Investigații:</strong> {notification.prescriptionDetails.investigations}</p>
            </div>
            <button onClick={addAllToCart} className="addAllButton">Cumpara acum</button>
            <button onClick={addAllToCart} className="addAllButton">Cumpara mai tarziu</button>
        </div>
    );
};

export default PrescriptionDetails;
