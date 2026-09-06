import React, { useState, useEffect } from 'react'
import axiosInstance from '../../axiosInstance';
import { useLocation } from "react-router-dom";

const Chekout = () => {

    const [selectAddress, setSelectAddress] = useState(null)
    const [paymentMethod, setPaymentMenthod] = useState("cod")

    const location = useLocation();

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

        } catch (error) {

            console.log("Place order error:", error.response?.data)

        }
    }
    
  return (
    <>
    <div className='container py-5'>
        <div className='row '>
            <div className='col  justify-content-center'>
                <div className='fw-semibold text-center h2'> Dilevery Address</div>
                <div className='p-5'>

                    {addresses.length === 0 ? (

                        <div className="alert alert-light">
                            No addresses added yet.<br/>Add address first.
                        </div>

                    ) : (
                            addresses.map((address) => (
                                <div className="card mb-3" key={address.id}>
                                    <div className="card-body">

                                        <div className="form-check">

                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="checkoutAddress"
                                                value={address.id}
                                                checked={selectAddress === address.id}
                                                onChange={() => setSelectAddress(address.id)}
                                            />

                                            <label className="form-check-label">

                                                <strong>
                                                    {address.address_type}
                                                </strong>

                                                <br />

                                                {address.full_name}
                                                <br />

                                                {address.address_line_1}

                                                {address.address_line_2 && (
                                                    <>
                                                        <br />
                                                        {address.address_line_2}
                                                    </>
                                                )}

                                                <br />

                                                {address.city}, {address.state}
                                                <br />

                                                {address.postal_code}, {address.country}
                                                <br />

                                                Phone: {address.phone}

                                            </label>

                                        </div>

                                    </div>
                                </div>
                            ))
                    )}
                </div>
                
                <div className='m-5 align-item-center '>
                    <div className='h2 fw-semibold mb-3 text-center'>Payment Method</div>
                    <div className="form-check mb-3">
                        <input 
                        className="form-check-input" 
                        type="radio" 
                        name="paymentMethod" 
                        id="cod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMenthod(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                            Cash on dilevery
                        </label>
                    </div>
                    <div className="form-check mb-3">
                        <input 
                        className="form-check-input" 
                        type="radio" 
                        name="paymentMethod" 
                        id="online"
                        value="online" 
                        checked={paymentMethod === "online"}
                        onChange={(e) => setPaymentMenthod(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                            Online payment
                        </label>
                        </div>
                    </div>
                </div>
            
            <div className='col'>
                <div>
                    <div className='fw-semibold h2 text-center'>
                        Secure cheakout
                    </div>
                    <div className='m-5'>
                        {buyNow ? (
                            // Buy Now
                            getBook && (
                                <>
                                <div className='row'>
                                    <div className='col-md-3'>
                                        <img 
                                        src={`http://127.0.0.1:8000${getBook.image}`} 
                                        alt={getBook.title} 
                                        className="img-fluid rounded"
                                        />
                                    </div>
                                    <div className='col-md-9'>
                                        <div>
                                            <h5>{getBook.title}</h5>
                                            <p className='text-muted mb-1'>Price: ₹{getBook.price}</p>
                                            <p className='fw-bold'>Quantity: {buyNow.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                </>
                                
                            )
                        ) : (
                            // Cart checkout
                            cart && (
                                <>
                                {cart.items.map((item) => (
                                
                                    <React.Fragment key={item.id}>
                    
                                        <div className="row cart-item mb-3">
                    
                                        {/* IMAGE */}
                    
                                            <div className="col-md-3">
                        
                                                <img
                                                src={`http://127.0.0.1:8000${item.book_image}`}
                                                alt={item.book_title}
                                                className="img-fluid rounded"
                                                />
                        
                                            </div>
                    
                    
                                        {/* BOOK DETAILS */}
                    
                                            <div className="col-md-5">
                        
                                                <h5 className="card-title">
                                                {item.book_title}
                                                </h5>
                        
                                                <p className="text-muted mb-1">
                                                Author: {item.book_author}
                                                </p>

                                                <p className="fw-bold">
                                                Quantity: {item.quantity}
                                                </p>
                        
                                                <p className="fw-bold">
                                                ₹{item.subtotal}
                                                </p>

                        
                                            </div>
                                            
                                        </div>
                                        
                                    </React.Fragment>
                                    
                                    
                                ))}
                                </>
                                
                            )
                            
                        )}
                        
                        <p className="fw-bold">
                            Total: ₹{total}
                        </p>

                        <button
                            className="btn text-white w-100"
                            style={{ backgroundColor: "#A3572A" }}
                            onClick={handlePlaceOrder}
                        >
                            Place order
                        </button>
                    </div>
                    
                    
                </div>

            </div>
        </div>
    
    </div>
    
    </>
  )
}

export default Chekout