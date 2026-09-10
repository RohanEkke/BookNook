import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import axiosInstance from '../../axiosInstance';


const OrderDetails = () => {

    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /* =====================================================
       GET SPECIFIC ORDER
    ===================================================== */

    const getOrder = async () => {

        try {

            setLoading(true);

            const response = await axiosInstance.get(
                `/orders/${id}/`
            );

            console.log("Order details ======>", response.data);

            setOrder(response.data);

        } catch (error) {

            console.log(
                "Order details error ======>",
                error.response?.data
            );

            setError(
                error.response?.data?.error ||
                "Unable to load order details."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        getOrder();

    }, [id]);


    /* =====================================================
       STATUS
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


    const formatStatus = (status) => {

        if (!status) return "";

        return status
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );

    };


    /* =====================================================
       PAYMENT STATUS
    ===================================================== */

    const getPaymentStatusClass = (status) => {

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

                        <p className="text-muted mt-3">
                            Loading order details...
                        </p>

                    </div>

                </div>

            </main>

        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error || !order) {

        return (

            <main className="bg-light min-vh-100">

                <div className="container py-5">

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body text-center py-5">

                            <i
                                className="bi bi-exclamation-circle text-danger"
                                style={{ fontSize: "50px" }}
                            />

                            <h3 className="fw-bold mt-3">
                                Order not found
                            </h3>

                            <p className="text-muted">
                                {error ||
                                    "We couldn't find this order."}
                            </p>

                            <Link
                                to="/account/orders"
                                className="btn btn-dark rounded-3 px-4"
                            >
                                <i className="bi bi-arrow-left me-2"></i>
                                Back to My Orders
                            </Link>

                        </div>

                    </div>

                </div>

            </main>

        );

    }


    return (

        <main className="bg-light min-vh-100">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <section className="container py-4">

                <div className="mb-4">

                    <Link
                        to="/account/orders"
                        className="text-decoration-none text-muted"
                    >

                        <i className="bi bi-arrow-left me-2"></i>

                        Back to My Orders

                    </Link>

                </div>


                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

                    <div>

                        <span className="text-uppercase text-success fw-bold small">
                            Order Details
                        </span>

                        <h1 className="fw-bold mb-1">
                            Order #{order.id}
                        </h1>

                        <p className="text-muted mb-0">

                            Placed on{" "}

                            {new Date(
                                order.created_at
                            ).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}

                        </p>

                    </div>


                    <div>

                        <span
                            className={`badge rounded-pill px-4 py-2 ${getStatusClass(
                                order.status
                            )}`}
                        >

                            {formatStatus(order.status)}

                        </span>

                    </div>

                </div>

            </section>



            {/* =================================================
                ORDER CONTENT
            ================================================= */}

            <section className="container pb-5">

                <div className="row g-4">


                    {/* =================================================
                        LEFT COLUMN
                    ================================================= */}

                    <div className="col-lg-8">


                        {/* =============================================
                            ORDER STATUS
                        ============================================== */}

                        <div className="card border-0 shadow-sm rounded-4 mb-4">

                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-4">

                                    <i className="bi bi-box-seam me-2"></i>

                                    Order Status

                                </h5>


                                <div className="row text-center g-3">


                                    {/* Confirmed */}

                                    <div className="col-6 col-md-3">

                                        <div
                                            className={`rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center ${
                                                [
                                                    "confirmed",
                                                    "processing",
                                                    "shipped",
                                                    "out_for_delivery",
                                                    "delivered",
                                                ].includes(order.status)
                                                    ? "bg-success text-white"
                                                    : "bg-light text-secondary"
                                            }`}
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                            }}
                                        >

                                            <i className="bi bi-check-lg"></i>

                                        </div>

                                        <small className="fw-semibold">
                                            Confirmed
                                        </small>

                                    </div>


                                    {/* Processing */}

                                    <div className="col-6 col-md-3">

                                        <div
                                            className={`rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center ${
                                                [
                                                    "processing",
                                                    "shipped",
                                                    "out_for_delivery",
                                                    "delivered",
                                                ].includes(order.status)
                                                    ? "bg-success text-white"
                                                    : "bg-light text-secondary"
                                            }`}
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                            }}
                                        >

                                            <i className="bi bi-box"></i>

                                        </div>

                                        <small className="fw-semibold">
                                            Processing
                                        </small>

                                    </div>


                                    {/* Shipped */}

                                    <div className="col-6 col-md-3">

                                        <div
                                            className={`rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center ${
                                                [
                                                    "shipped",
                                                    "out_for_delivery",
                                                    "delivered",
                                                ].includes(order.status)
                                                    ? "bg-success text-white"
                                                    : "bg-light text-secondary"
                                            }`}
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                            }}
                                        >

                                            <i className="bi bi-truck"></i>

                                        </div>

                                        <small className="fw-semibold">
                                            Shipped
                                        </small>

                                    </div>


                                    {/* Delivered */}

                                    <div className="col-6 col-md-3">

                                        <div
                                            className={`rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center ${
                                                order.status === "delivered"
                                                    ? "bg-success text-white"
                                                    : "bg-light text-secondary"
                                            }`}
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                            }}
                                        >

                                            <i className="bi bi-house-check"></i>

                                        </div>

                                        <small className="fw-semibold">
                                            Delivered
                                        </small>

                                    </div>

                                </div>

                            </div>

                        </div>



                        {/* =============================================
                            ORDER ITEMS
                        ============================================== */}

                        <div className="card border-0 shadow-sm rounded-4 mb-4">

                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-center mb-4">

                                    <h5 className="fw-bold mb-0">

                                        <i className="bi bi-book me-2"></i>

                                        Order Items

                                    </h5>

                                    <span className="text-muted small">

                                        {order.items?.length || 0}{" "}
                                        {order.items?.length === 1
                                            ? "item"
                                            : "items"}

                                    </span>

                                </div>


                                <div className="d-flex flex-column gap-3">


                                    {order.items?.map((item) => (

                                        <div
                                            key={item.id}
                                            className="border rounded-3 p-3"
                                        >

                                            <div className="row align-items-center g-3">


                                                {/* Book */}

                                                <div className="col-12 col-md-6">

                                                    <div className="d-flex align-items-center">


                                                        {item.book_image ? (

                                                            <img
                                                                src={`http://127.0.0.1:8000${item.book_image}`}
                                                                alt={item.book_title}
                                                                className="rounded-3 shadow-sm me-3"
                                                                style={{
                                                                    width: "75px",
                                                                    height: "95px",
                                                                    objectFit: "cover",
                                                                }}
                                                            />

                                                        ) : (

                                                            <div
                                                                className="bg-light rounded-3 d-flex align-items-center justify-content-center me-3"
                                                                style={{
                                                                    width: "75px",
                                                                    height: "95px",
                                                                }}
                                                            >

                                                                <i className="bi bi-book fs-3 text-secondary"></i>

                                                            </div>

                                                        )}


                                                        <div>

                                                            <h6 className="fw-bold mb-1">
                                                                {item.book_title}
                                                            </h6>

                                                            <small className="text-muted">
                                                                Quantity: {item.quantity}
                                                            </small>

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* Price */}

                                                <div className="col-6 col-md-3">

                                                    <small className="text-muted d-block">
                                                        Unit Price
                                                    </small>

                                                    <span className="fw-semibold">
                                                        ₹{item.price}
                                                    </span>

                                                </div>


                                                {/* Total */}

                                                <div className="col-6 col-md-3 text-md-end">

                                                    <small className="text-muted d-block">
                                                        Total
                                                    </small>

                                                    <span className="fw-bold text-danger">

                                                        ₹
                                                        {(
                                                            Number(item.price) *
                                                            Number(item.quantity)
                                                        ).toFixed(2)}

                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>



                        {/* =============================================
                            DELIVERY ADDRESS
                        ============================================== */}

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-4">

                                    <i className="bi bi-geo-alt me-2"></i>

                                    Delivery Address

                                </h5>


                                <div className="bg-light rounded-3 p-4">

                                    <h6 className="fw-bold mb-2">
                                        {order.address?.full_name}
                                    </h6>

                                    <p className="text-muted mb-1">

                                        {order.address?.address_line_1}

                                    </p>


                                    {order.address?.address_line_2 && (

                                        <p className="text-muted mb-1">

                                            {order.address.address_line_2}

                                        </p>

                                    )}


                                    <p className="text-muted mb-1">

                                        {order.address?.city},{" "}

                                        {order.address?.state}{" "}

                                        -{" "}

                                        {order.address?.postal_code}

                                    </p>


                                    <p className="text-muted mb-0">

                                        {order.address?.country}

                                    </p>


                                    {order.address?.phone && (

                                        <p className="text-muted mt-2 mb-0">

                                            <i className="bi bi-telephone me-2"></i>

                                            {order.address.phone}

                                        </p>

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>



                    {/* =================================================
                        RIGHT COLUMN
                    ================================================= */}

                    <div className="col-lg-4">


                        {/* =============================================
                            ORDER SUMMARY
                        ============================================== */}

                        <div className="card border-0 shadow-sm rounded-4 mb-4">

                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-4">
                                    Order Summary
                                </h5>


                                {/* Items total */}

                                <div className="d-flex justify-content-between mb-3">

                                    <span className="text-muted">
                                        Items
                                    </span>

                                    <span className="fw-semibold">

                                        ₹{order.total_amount}

                                    </span>

                                </div>


                                {/* Delivery */}

                                <div className="d-flex justify-content-between mb-3">

                                    <span className="text-muted">
                                        Delivery
                                    </span>

                                    <span className="text-success fw-semibold">
                                        Free
                                    </span>

                                </div>


                                <hr />


                                {/* Total */}

                                <div className="d-flex justify-content-between align-items-center">

                                    <span className="fw-bold">
                                        Total
                                    </span>

                                    <span className="fs-4 fw-bold text-danger">
                                        ₹{order.total_amount}
                                    </span>

                                </div>

                            </div>

                        </div>



                        {/* =============================================
                            PAYMENT
                        ============================================== */}

                        <div className="card border-0 shadow-sm rounded-4 mb-4">

                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-4">

                                    <i className="bi bi-credit-card me-2"></i>

                                    Payment

                                </h5>


                                <div className="mb-3">

                                    <small className="text-muted d-block">
                                        Payment Method
                                    </small>

                                    <span className="fw-semibold">

                                        {order.payment_method === "cod"
                                            ? "Cash on Delivery"
                                            : "Online Payment"}

                                    </span>

                                </div>


                                <div>

                                    <small className="text-muted d-block">
                                        Payment Status
                                    </small>

                                    <span
                                        className={`fw-semibold ${getPaymentStatusClass(
                                            order.payment_status
                                        )}`}
                                    >

                                        {formatStatus(
                                            order.payment_status
                                        )}

                                    </span>

                                </div>

                            </div>

                        </div>



                        {/* =============================================
                            ACTIONS
                        ============================================== */}

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-body p-4">

                                <Link
                                    to="/account/orders"
                                    className="btn btn-outline-dark w-100 rounded-3 mb-2"
                                >

                                    <i className="bi bi-arrow-left me-2"></i>

                                    Back to My Orders

                                </Link>


                                <Link
                                    to="/books"
                                    className="btn btn-dark w-100 rounded-3"
                                >

                                    <i className="bi bi-book me-2"></i>

                                    Continue Shopping

                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </main>

    );

};


export default OrderDetails;