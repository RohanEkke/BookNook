import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/orderplaced.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const OrderPlaced = () => {

    const navigate = useNavigate();
    const location = useLocation();

    // If you pass orderId while navigating to this page
    const orderId = location.state?.orderId;

    return (
        <div className="order-success-page">

            <div className="success-card">

                {/* Success Icon */}
                <div className="success-icon-wrapper">
                    <div className="success-icon">
                        <i className="bi bi-check-lg"></i>
                    </div>
                </div>


                {/* Book Illustration */}
                <div className="book-illustration">
                    <i className="bi bi-book-half"></i>
                </div>


                {/* Heading */}
                <h1>
                    Order placed successfully!
                </h1>

                <p className="success-message">
                    Thank you for shopping with <strong>BookNook</strong>.
                    <br />
                    Your order has been placed and is being processed.
                </p>


                {/* Order Information */}
                <div className="order-info">

                    <div className="info-item">

                        <div className="info-icon">
                            <i className="bi bi-receipt"></i>
                        </div>

                        <div>
                            <span>Order Number</span>

                            <strong>
                                {orderId ? `#BNK${orderId}` : "Your Order"}
                            </strong>
                        </div>

                    </div>


                    <div className="info-divider"></div>


                    <div className="info-item">

                        <div className="info-icon">
                            <i className="bi bi-calendar-check"></i>
                        </div>

                        <div>
                            <span>Estimated Delivery</span>

                            <strong>
                                3–7 Business Days
                            </strong>
                        </div>

                    </div>

                </div>


                {/* Buttons */}
                <div className="success-actions">

                    <button
                        className="continue-shopping-btn"
                        onClick={() => navigate("/")}
                    >
                        <i className="bi bi-bag me-2"></i>
                        Continue Shopping
                    </button>


                    <button
                        className="view-orders-btn"
                        onClick={() => navigate("/account/orders")}
                    >
                        <i className="bi bi-receipt me-2"></i>
                        View My Orders
                    </button>

                </div>


                {/* Bottom Message */}
                <div className="happy-reading">
                    <i className="bi bi-heart"></i>
                    <span>Happy Reading!</span>
                </div>

            </div>

        </div>
    );
};

export default OrderPlaced;