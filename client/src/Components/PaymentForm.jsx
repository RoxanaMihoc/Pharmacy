import React, { useState } from 'react';
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from '@stripe/react-stripe-js';
import "./payment.css";

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4"
            }
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
        }
    }
};

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        const cardNumberElement = elements.getElement(CardNumberElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardNumberElement,
        });

        if (error) {
            console.error("Payment error:", error);
            setError(error.message);
            setLoading(false);
        } else {
            console.log("PaymentMethod:", paymentMethod);
            setError("");
            alert("Payment successful!");
            setLoading(false);
        }
    };

    return (
        <div className='div-container'>
        <form className="form-payment" onSubmit={handleSubmit}>
            <h2>Payment Info</h2>
            <div className="card-input-payment">
                <label>Full Name</label>
                <input type="text" placeholder="Name" />
            </div>
            <div className="card-input-payment">
                <label>Credit Card Number</label>
                <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <div className="card-input-payment">
                <label>Exp Date</label>
                <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <div className="card-input-payment">
                <label>CVV</label>
                <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={!stripe || loading}>
                Confirm Payment
            </button>
            <p className="confirmation-text">You verify that this info is correct</p>
        </form>
        </div>
    );
};

export default PaymentForm;
