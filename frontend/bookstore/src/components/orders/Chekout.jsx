import React, { useState, useEffect } from 'react'
import axiosInstance from '../../axiosInstance';
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/checkout.css"

const Chekout = () => {

    const [selectAddress, setSelectAddress] = useState(null)
    const [paymentMethod, setPaymentMenthod] = useState("cod")

    const location = useLocation();

    const navigate = useNavigate();

    const buyNow = location.state;

    console.log("Checkout state:", buyNow);

    const [addresses, setAddresses] = useState([]);
    const [getBook, setGetBook] = useState(null)
    const [cart, setCart] = useState(null)

    const getAddresses = async () => {
        try {
            const response = await axiosInstance.get("/addresses/");
            console.log("Checkout addresses:", response.data);
            setAddresses(response.data);
            const defaultAddress = response.data.find(
                address => address.is_default
            )
            if (defaultAddress) {
                setSelectAddress(defaultAddress.id)
            }
        } catch (error) {
            console.log(error.response?.data);
        }
    };

    useEffect(() => {
        getAddresses();
    }, []);

    useEffect(() => {

        if (buyNow) {

            // Buy Now flow
            const getBookDetails = async () => {
                try{
                    const response = await axiosInstance.get(`/book/${buyNow.bookId}/`)
                    console.log("Get book details======>", response.data)
                    setGetBook(response.data)
                }catch (error) {
                    console.log(error.response?.data);

                }

            }
            getBookDetails();

        } else {
        // Cart checkout flow
            const getCartDetails = async () => {
                try{
                    const response = await axiosInstance.get("/cart/");

                    console.log("Cart data ======>", response.data);

                    setCart(response.data);
                } catch (error) {
                    console.log(error.response?.data);
                }
            }
            getCartDetails()
        }
    }, [buyNow])

    const total = buyNow
        ? getBook
            ? Number(getBook.price) * Number(buyNow.quantity)
            : 0
        : cart?.items?.reduce(
            (total, item) => total + Number(item.subtotal),
            0
        ) || 0;

    const handlePlaceOrder = async () => {
        if (!selectAddress) {
            alert("Please select delivery addesss")
            return
        }

        const orderData = buyNow ? {
            address_id: selectAddress,
            payment_method: paymentMethod,
            checkout_type: "buy_now",
            book_id: buyNow.bookId,
            quantity: buyNow.quantity,
        } : {
            address_id: selectAddress,
            payment_method: paymentMethod,
            checkout_type: "cart"
        }

        console.log("order Data ====>", orderData)
        console.log("payment method======>", paymentMethod)

        try {

            const response = await axiosInstance.post("/orders/", orderData)

            console.log("order created=======>", response.data)

            navigate("/order-success")

        } catch (error) {

            console.log("Place order error:", error.response?.data)

        }
    }
    
  return (
    <div className="checkout-page">

        {/* Checkout Header */}
        <div className="checkout-header border-bottom">
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center">
            <div>
                <h3 className="fw-bold mb-1">Checkout</h3>
                <p className="text-muted mb-0">
                Complete your order securely
                </p>
            </div>

            <div className="secure-badge">
                <i className="bi bi-shield-check me-2"></i>
                Secure Checkout
            </div>
            </div>

            {/* Progress */}
            <div className="checkout-progress mt-4">
            <div className="progress-step active">
                <span>1</span>
                <div>
                <strong>Delivery</strong>
                <small>Choose address</small>
                </div>
            </div>

            <div className="progress-line"></div>

            <div className="progress-step active">
                <span>2</span>
                <div>
                <strong>Payment</strong>
                <small>Select payment</small>
                </div>
            </div>

            <div className="progress-line"></div>

            <div className="progress-step">
                <span>3</span>
                <div>
                <strong>Confirmation</strong>
                <small>Place order</small>
                </div>
            </div>
            </div>
        </div>
        </div>


        <div className="container py-5">

        <div className="row g-5">

            {/* LEFT SIDE */}
            <div className="col-lg-7">

            {/* Delivery Address */}
            <div className="checkout-section">

                <div className="section-heading">
                <div className="section-icon">
                    <i className="bi bi-geo-alt"></i>
                </div>

                <div>
                    <h4 className="mb-1">Delivery Address</h4>
                    <p className="text-muted mb-0">
                    Select where you want your order delivered
                    </p>
                </div>
                </div>


                {addresses.length === 0 ? (

                <div className="empty-address">
                    <i className="bi bi-house-x"></i>

                    <h5>No address found</h5>

                    <p className="text-muted">
                    Add a delivery address before placing your order.
                    </p>

                    <button
                    className="btn btn-outline-dark"
                    onClick={() => navigate("/addresses")}
                    >
                    Add Address
                    </button>
                </div>

                ) : (

                <div className="address-list">

                    {addresses.map((address) => (

                    <label
                        key={address.id}
                        className={`address-card ${
                        selectAddress === address.id ? "selected" : ""
                        }`}
                    >

                        <div className="address-radio">

                        <input
                            type="radio"
                            name="checkoutAddress"
                            value={address.id}
                            checked={selectAddress === address.id}
                            onChange={() =>
                            setSelectAddress(address.id)
                            }
                        />

                        </div>


                        <div className="address-content">

                        <div className="d-flex justify-content-between align-items-center mb-2">

                            <div className="d-flex align-items-center gap-2">

                            <strong className="text-capitalize">
                                {address.address_type}
                            </strong>

                            {address.is_default && (
                                <span className="default-badge">
                                Default
                                </span>
                            )}

                            </div>

                            {selectAddress === address.id && (
                            <i className="bi bi-check-circle-fill selected-icon"></i>
                            )}

                        </div>


                        <div className="address-details">

                            <strong>
                            {address.full_name}
                            </strong>

                            <div>
                            {address.address_line_1}
                            </div>

                            {address.address_line_2 && (
                            <div>
                                {address.address_line_2}
                            </div>
                            )}

                            <div>
                            {address.city}, {address.state}
                            </div>

                            <div>
                            {address.postal_code}, {address.country}
                            </div>

                            <div className="mt-2">
                            <i className="bi bi-telephone me-2"></i>
                            {address.phone}
                            </div>

                        </div>

                        </div>

                    </label>

                    ))}

                </div>

                )}

            </div>


            {/* Payment */}
            <div className="checkout-section mt-4">

                <div className="section-heading">

                <div className="section-icon">
                    <i className="bi bi-credit-card"></i>
                </div>

                <div>
                    <h4 className="mb-1">Payment Method</h4>
                    <p className="text-muted mb-0">
                    Choose your preferred payment method
                    </p>
                </div>

                </div>


                <div className="payment-options">

                {/* COD */}
                <label
                    className={`payment-card ${
                    paymentMethod === "cod" ? "selected" : ""
                    }`}
                >

                    <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                        setPaymentMenthod(e.target.value)
                    }
                    />

                    <div className="payment-icon">
                    <i className="bi bi-cash-stack"></i>
                    </div>

                    <div className="payment-info">
                    <strong>Cash on Delivery</strong>
                    <small>
                        Pay when your order arrives
                    </small>
                    </div>

                    {paymentMethod === "cod" && (
                    <i className="bi bi-check-circle-fill ms-auto selected-icon"></i>
                    )}

                </label>


                {/* Online */}
                <label
                    className={`payment-card ${
                    paymentMethod === "online" ? "selected" : ""
                    }`}
                >

                    <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) =>
                        setPaymentMenthod(e.target.value)
                    }
                    />

                    <div className="payment-icon">
                    <i className="bi bi-wallet2"></i>
                    </div>

                    <div className="payment-info">
                    <strong>Online Payment</strong>
                    <small>
                        Pay securely using UPI, card or net banking
                    </small>
                    </div>

                    {paymentMethod === "online" && (
                    <i className="bi bi-check-circle-fill ms-auto selected-icon"></i>
                    )}

                </label>

                </div>

            </div>

            </div>


            {/* RIGHT SIDE */}
            <div className="col-lg-5">

            <div className="order-summary">

                <div className="summary-header">

                <div>
                    <h4 className="mb-1">Order Summary</h4>

                    <p className="text-muted mb-0">
                    {buyNow
                        ? "1 item"
                        : `${cart?.items?.length || 0} items`}
                    </p>
                </div>

                <i className="bi bi-bag-check summary-bag"></i>

                </div>


                {/* BUY NOW */}
                {buyNow ? (

                getBook && (

                    <div className="product-item">

                    <img
                        src={`http://127.0.0.1:8000${getBook.image}`}
                        alt={getBook.title}
                    />

                    <div className="product-info">

                        <h6>
                        {getBook.title}
                        </h6>

                        <p>
                        ₹{getBook.price}
                        </p>

                        <span>
                        Qty: {buyNow.quantity}
                        </span>

                    </div>

                    <strong>
                        ₹
                        {Number(getBook.price) *
                        Number(buyNow.quantity)}
                    </strong>

                    </div>

                )

                ) : (

                /* CART */
                cart?.items?.map((item) => (

                    <div
                    className="product-item"
                    key={item.id}
                    >

                    <img
                        src={`http://127.0.0.1:8000${item.book_image}`}
                        alt={item.book_title}
                    />

                    <div className="product-info">

                        <h6>
                        {item.book_title}
                        </h6>

                        <p>
                        ₹{item.subtotal}
                        </p>

                        <span>
                        Qty: {item.quantity}
                        </span>

                    </div>

                    <strong>
                        ₹{item.subtotal}
                    </strong>

                    </div>

                ))

                )}


                <hr />


                <div className="price-row">
                <span>Subtotal</span>
                <strong>₹{total}</strong>
                </div>


                <div className="price-row">
                <span>Delivery</span>
                <strong className="text-success">
                    FREE
                </strong>
                </div>


                <div className="price-row">
                <span>Tax</span>
                <span>
                    Included
                </span>
                </div>


                <hr />


                <div className="total-row">

                <span>Total</span>

                <strong>
                    ₹{total}
                </strong>

                </div>


                <button
                className="place-order-btn"
                onClick={handlePlaceOrder}
                >

                <span>
                    Place Order
                </span>

                <i className="bi bi-arrow-right"></i>

                </button>


                <div className="secure-note">

                <i className="bi bi-shield-lock-fill"></i>

                <span>
                    Your order information is securely protected.
                </span>

                </div>

            </div>

            </div>

        </div>

        </div>

    </div>
    )
}

export default Chekout