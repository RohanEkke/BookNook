import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import { AuthContext } from "../AuthProvider";
import "bootstrap-icons/font/bootstrap-icons.css";

const Header = () => {

    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setIsLoggedIn(false);

        navigate("/");
    };


    return (

        <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top">

            <div className="container-fluid px-3 px-md-4">


                {/* =========================
                    LOGO
                ========================== */}

                <Link
                    to="/"
                    className="navbar-brand d-flex align-items-center"
                >

                    <img
                        src={logo}
                        alt="BookNook"
                        className="img-fluid"
                        style={{
                            maxHeight: "52px",
                            width: "auto",
                        }}
                    />

                </Link>



                {/* =========================
                    RIGHT SIDE
                ========================== */}

                <div className="d-flex align-items-center gap-2">


                    {isLoggedIn ? (

                        <>


                            {/* CART */}

                            <Link
                                to="/cart"
                                className="btn btn-outline-success d-flex align-items-center gap-2 rounded-3 px-3"
                            >

                                <i className="bi bi-cart3"></i>

                                <span className="d-none d-sm-inline">
                                    Cart
                                </span>

                            </Link>



                            {/* ACCOUNT */}

                            <Link
                                to="/account"
                                className="btn btn-outline-dark d-flex align-items-center gap-2 rounded-3 px-3"
                            >

                                <i className="bi bi-person-circle"></i>

                                <span className="d-none d-sm-inline">
                                    Account
                                </span>

                            </Link>

                            <Link
                                to="/chat-ai"
                                className="btn btn-outline-dark d-flex align-items-center gap-2 rounded-3 px-3"
                            >

                                <span className="d-none d-sm-inline">
                                    AI
                                </span>

                            </Link>



                            {/* LOGOUT */}

                            <button
                                type="button"
                                className="btn btn-outline-danger d-flex align-items-center gap-2 rounded-3 px-3"
                                onClick={handleLogout}
                            >

                                <i className="bi bi-box-arrow-right"></i>

                                <span className="d-none d-sm-inline">
                                    Logout
                                </span>

                            </button>

                        </>

                    ) : (

                        <>


                            {/* LOGIN */}

                            <Link
                                to="/login"
                                className="btn btn-outline-dark rounded-3 px-3"
                            >

                                <i className="bi bi-box-arrow-in-right me-1"></i>

                                Login

                            </Link>



                            {/* SIGN UP */}

                            <Link
                                to="/register"
                                className="btn text-white rounded-3 px-3"
                                style={{
                                    backgroundColor: "#A3572A",
                                }}
                            >

                                <i className="bi bi-person-plus me-1"></i>

                                Sign Up

                            </Link>

                        </>

                    )}

                </div>

            </div>

        </nav>

    );
};

export default Header;