import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import "../../assets/css/style.css"

const Cart = () => {

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);


  // =========================
  // GET CART
  // =========================
  const getCart = async () => {

    try {

      const response = await axiosInstance.get("/cart/");

      console.log("Cart data ======>", response.data);

      setCart(response.data);

    } catch (error) {

      console.log(
        "Cart error ======>",
        error.response?.data
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================
  // UPDATE QUANTITY
  // =========================
  const updateQuantity = async (itemId, quantity) => {

    // Don't allow quantity below 1
    if (quantity < 1) {
      return;
    }

    try {

      await axiosInstance.patch(
        `/cart/items/${itemId}/`,
        {
          quantity: quantity
        }
      );

      // Get updated cart
      getCart();

    } catch (error) {

      console.log(
        "Update quantity error ======>",
        error.response?.data
      );

    }
  };


  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = async (itemId) => {

    try {

      await axiosInstance.delete(
        `/cart/items/${itemId}/`
      );

      // Get updated cart
      getCart();

    } catch (error) {

      console.log(
        "Remove item error ======>",
        error.response?.data
      );

    }
  };


  // =========================
  // GET CART WHEN PAGE LOADS
  // =========================
  useEffect(() => {

    getCart();

  }, []);


  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="container py-5">
        <h3>Loading cart...</h3>
      </div>
    );
  }


  // =========================
  // EMPTY CART
  // =========================
  if (!cart || cart.items.length === 0) {

    return (
      <div className="container py-5 text-center">

        <h2>Your cart is empty</h2>

        <p className="text-muted">
          You haven't added any books yet.
        </p>

        <Link
          to="/"
          className="btn text-white"
          style={{ backgroundColor: "#A3572A" }}
        >
          Continue Shopping
        </Link>

      </div>
    );
  }


  // =========================
  // CART
  // =========================
  return (

    <div className="container py-5">

      <div className="row">

        {/* =========================
            LEFT SIDE - CART ITEMS
        ========================= */}

        <div className="col-lg-8">

          <div className="card mb-4">

            <div className="card-body">

              <h4 className="mb-4">
                Shopping Cart
              </h4>


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
                        ₹{item.book_price}
                      </p>

                    </div>


                    {/* QUANTITY */}

                    <div className="col-md-2">

                      <div className="input-group">

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>


                        <span
                          className="form-control form-control-sm text-center"
                        >
                          {item.quantity}
                        </span>


                        <button
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>


                    {/* PRICE + DELETE */}

                    <div className="col-md-2 text-end">

                      <p className="fw-bold">
                        ₹{item.subtotal}
                      </p>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          removeItem(item.id)
                        }
                      >
                        <i className="bi bi-trash"></i>
                      </button>

                    </div>

                  </div>

                  <hr />

                </React.Fragment>

              ))}

            </div>

          </div>


          {/* CONTINUE SHOPPING */}

          <div className="text-start mb-4">

            <Link
              to="/"
              className="btn btn-outline-primary"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </Link>

          </div>

        </div>


        {/* =========================
            RIGHT SIDE - SUMMARY
        ========================= */}

        <div className="col-lg-4">

          <div className="card">

            <div className="card-body">

              <h5 className="card-title mb-4">
                Order Summary
              </h5>


              {/* SUBTOTAL */}

              <div className="d-flex justify-content-between mb-3">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹{cart.total}
                </span>

              </div>


              {/* SHIPPING */}

              <div className="d-flex justify-content-between mb-3">

                <span>
                  Shipping
                </span>

                <span>
                  Free
                </span>

              </div>


              <hr />


              {/* TOTAL */}

              <div className="d-flex justify-content-between mb-4">

                <strong>
                  Total
                </strong>

                <strong>
                  ₹{cart.total}
                </strong>

              </div>


              <button
                className="btn text-white w-100"
                style={{ backgroundColor: "#A3572A" }}
              >
                Proceed to Checkout
              </button>

            </div>

          </div>


          {/* PROMO CODE */}

          <div className="card mt-4">

            <div className="card-body">

              <h5 className="card-title mb-3">
                Apply Promo Code
              </h5>

              <div className="input-group">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter promo code"
                />

                <button
                  className="btn btn-outline-secondary"
                  type="button"
                >
                  Apply
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
};

export default Cart;