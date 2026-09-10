import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import axiosInstance from '../../axiosInstance';


const OrderList = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /* =====================================================
       GET ORDERS
    ===================================================== */

    const getOrders = async () => {

        try {

            setLoading(true);

            const response = await axiosInstance.get("/orders/");

            console.log("Orders ======>", response.data);

            setOrders(response.data);

        } catch (error) {

            console.log(
                "Orders error ======>",
                error.response?.data
            );

            setError("Unable to load your orders.");

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        getOrders();
    }, []);


    /* =====================================================
       STATUS BADGE
    ===================================================== */

    const getStatusClass = (status) => {

        switch (status) {

            case "delivered":
                return "bg-success";

            case "cancelled":
                return "bg-danger";

            case "shipped":
                return "bg-primary";

            case "out_for_delivery":
                return "bg-info text-dark";

            case "processing":
                return "bg-warning text-dark";

            case "confirmed":
                return "bg-success";

            default:
                return "bg-secondary";

        }

    };


    /* =====================================================
       PAYMENT STATUS
    ===================================================== */

    const getPaymentClass = (status) => {

        switch (status) {

            case "paid":
                return "text-success";

            case "failed":
                return "text-danger";

            case "refunded":
                return "text-primary";

            default:
                return "text-warning";

        }

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <main className="bg-light min-vh-100">

                <div className="container py-5">

                    <div className="text-center py-5">

                        <div
                            className="spinner-border text-success"
                            role="status"
                        />

                        <p className="text-muted mt-3 mb-0">
                            Loading your orders...
                        </p>

                    </div>

                </div>

            </main>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {

        return (

            <main className="bg-light min-vh-100">

                <div className="container py-5">

                    <div className="alert alert-danger text-center">

                        <i className="bi bi-exclamation-circle me-2"></i>

                        {error}

                    </div>

                </div>

            </main>

        );

    }


    return (

        <main className="bg-light min-vh-100">


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="container py-5">

                <div className="row align-items-center g-3">

                    <div className="col">

                        <span className="text-uppercase text-success fw-bold small">
                            Account
                        </span>

                        <h1 className="fw-bold mb-1">
                            My Orders
                        </h1>

                        <p className="text-muted mb-0">
                            Track and manage your BookNook orders.
                        </p>

                    </div>


                    <div className="col-auto">

                        <Link
                            to="/books"
                            className="btn btn-dark rounded-3 px-3"
                        >

                            <i className="bi bi-book me-2"></i>

                            Continue Shopping

                        </Link>

                    </div>

                </div>

            </section>



            {/* =================================================
                ORDERS
            ================================================= */}

            <section className="container pb-5">


                {orders.length === 0 ? (

                    /* =================================================
                       EMPTY ORDERS
                    ================================================= */

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body text-center py-5">

                            <div
                                className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-4"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                }}
                            >

                                <i
                                    className="bi bi-bag fs-1 text-secondary"
                                />

                            </div>


                            <h3 className="fw-bold">
                                No orders yet
                            </h3>


                            <p className="text-muted mb-4">
                                You haven't placed any orders yet.
                                Start exploring our collection.
                            </p>


                            <Link
                                to="/books"
                                className="btn btn-dark px-4 rounded-3"
                            >

                                Browse Books

                                <i className="bi bi-arrow-right ms-2"></i>

                            </Link>

                        </div>

                    </div>

                ) : (


                    /* =================================================
                       ORDER LIST
                    ================================================= */

                    <div className="d-flex flex-column gap-4">

                        {orders.map((order) => (

                            <div
                                className="card border-0 shadow-sm rounded-4 overflow-hidden"
                                key={order.id}
                            >


                                {/* =====================================
                                    ORDER HEADER
                                ====================================== */}

                                <div className="card-header bg-white border-bottom p-3 p-md-4">

                                    <div className="row align-items-center g-3">


                                        {/* Order ID */}

                                        <div className="col-6 col-md-3">

                                            <small className="text-muted d-block">
                                                Order
                                            </small>

                                            <span className="fw-bold">
                                                #{order.id}
                                            </span>

                                        </div>


                                        {/* Date */}

                                        <div className="col-6 col-md-3">

                                            <small className="text-muted d-block">
                                                Ordered on
                                            </small>

                                            <span className="fw-semibold">

                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}

                                            </span>

                                        </div>


                                        {/* Status */}

                                        <div className="col-6 col-md-3">

                                            <small className="text-muted d-block mb-1">
                                                Status
                                            </small>

                                            <span
                                                className={`badge rounded-pill px-3 py-2 ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >

                                                {order.status
                                                    ?.replaceAll("_", " ")
                                                    ?.replace(
                                                        /\b\w/g,
                                                        (char) =>
                                                            char.toUpperCase()
                                                    )}

                                            </span>

                                        </div>


                                        {/* Total */}

                                        <div className="col-6 col-md-3 text-md-end">

                                            <small className="text-muted d-block">
                                                Total
                                            </small>

                                            <span className="fs-5 fw-bold text-danger">

                                                ₹{order.total_amount}

                                            </span>

                                        </div>


                                    </div>

                                </div>



                                {/* =====================================
                                    ORDER BODY
                                ====================================== */}

                                <div className="card-body p-3 p-md-4">


                                    {/* BOOK ITEMS */}

                                    <div className="d-flex flex-column gap-3">


                                        {order.items?.map((item) => (

                                            <div
                                                key={item.id}
                                                className="row align-items-center g-3"
                                            >


                                                {/* Book */}

                                                <div className="col-8 col-md-6">

                                                    <div className="d-flex align-items-center">


                                                        <img
                                                            src={`http://127.0.0.1:8000${item.book_image}`}
                                                            alt={item.book_title}
                                                            className="rounded-3 me-3 shadow-sm"
                                                            style={{
                                                                width: "65px",
                                                                height: "80px",
                                                                objectFit: "cover",
                                                            }}
                                                        />

                                                        <div>

                                                            <h6 className="fw-bold mb-1">

                                                                {item.book_title}

                                                            </h6>

                                                            <small className="text-muted">

                                                                Quantity:{" "}
                                                                {item.quantity}

                                                            </small>

                                                        </div>


                                                    </div>

                                                </div>


                                                {/* Price */}

                                                <div className="col-4 col-md-3">

                                                    <small className="text-muted d-block">
                                                        Price
                                                    </small>

                                                    <span className="fw-semibold">

                                                        ₹{item.price}

                                                    </span>

                                                </div>


                                                {/* Quantity */}

                                                <div className="col-md-3 d-none d-md-block text-md-end">

                                                    <small className="text-muted d-block">
                                                        Item Total
                                                    </small>

                                                    <span className="fw-bold">

                                                        ₹
                                                        {(
                                                            Number(item.price) *
                                                            Number(item.quantity)
                                                        ).toFixed(2)}

                                                    </span>

                                                </div>


                                            </div>

                                        ))}

                                    </div>


                                    <hr className="my-4" />


                                    {/* =================================
                                        BOTTOM INFORMATION
                                    ================================== */}

                                    <div className="row g-3 align-items-center">


                                        {/* Payment */}

                                        <div className="col-md-4">

                                            <small className="text-muted d-block">
                                                Payment
                                            </small>

                                            <span className="fw-semibold">

                                                {order.payment_method === "cod"
                                                    ? "Cash on Delivery"
                                                    : "Online Payment"}

                                            </span>

                                        </div>


                                        {/* Payment Status */}

                                        <div className="col-md-4">

                                            <small className="text-muted d-block">
                                                Payment status
                                            </small>

                                            <span
                                                className={`fw-semibold ${getPaymentClass(
                                                    order.payment_status
                                                )}`}
                                            >

                                                {order.payment_status
                                                    ?.replaceAll("_", " ")
                                                    ?.replace(
                                                        /\b\w/g,
                                                        (char) =>
                                                            char.toUpperCase()
                                                    )}

                                            </span>

                                        </div>


                                        {/* View */}

                                        <div className="col-md-4 text-md-end">

                                            <Link
                                                to={`/account/orders/${order.id}`}
                                                className="btn btn-outline-dark rounded-3 px-4"
                                            >

                                                View Order

                                                <i className="bi bi-arrow-right ms-2"></i>

                                            </Link>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </main>

    );

};


export default OrderList;