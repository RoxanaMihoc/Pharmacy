import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from '../../../Context/AuthContext';
import {addToCart, addToCartF} from '../../../Components/CartButton';
import './styles/prescription-details.css';  // Import the CSS

const PrescriptionDetails = () => {
    const location = useLocation();
    const { notification } = location.state;
    const { currentUser} = useAuth();

    const addAllToCart = () => {
        notification.prescriptionDetails.products.forEach(async product => {
            try {
                console.log(product.medication._id);
                const result = await addToCart(currentUser, product.medication._id);
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
                    <p className="detailItem"><strong>Category:</strong> {product.medication.category}</p>
                    <p className="detailCheckbox"><strong>Availability:</strong> {product.medication.availability}</p>
                    <p className="detailCheckbox"><strong>Price:</strong> ${product.medication.price}</p>
                    <p className="detailCheckbox"><strong>Dosage:</strong> {product.dosage}</p>
                    <p className="detailCheckbox"><strong>Duration:</strong> {product.duration}</p>
                    <p className="detailCheckbox"><strong>Reason:</strong> {product.reason}</p>
                    <p className="detailCheckbox"><strong>Side Effects:</strong> {product.sideEffects || 'None specified'}</p>
                    <p className="notes"><strong>Notes:</strong> {product.notes}</p>
                </div>
            </div>
        ));
    };

    return (
        <div className="container">
            <h1 className="header">Prescription Details</h1>
            <div>
                {renderProducts(notification.prescriptionDetails.products)}
            </div>
            <button onClick={addAllToCart} className="addAllButton">Add All to Cart</button>
        </div>
    );
};

export default PrescriptionDetails;
