import React, { useState, useEffect, useRef } from "react";

import tab1 from "../assets/img/tab1.png";
import tab2 from "../assets/img/tab2.png";
import tab3 from "../assets/img/tab3.png";

import mystery from "../assets/img/mystery.png";
import fantasy from "../assets/img/fantasy.png";
import friction from "../assets/img/friction.png";
import nonfriction from "../assets/img/non-friction.png";
import sifi from "../assets/img/si-fi.png";
import biography from "../assets/img/biography.png";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import axiosInstance from "../axiosInstance";
import { Link } from "react-router-dom";


const Homepage = () => {

  const [book, setBook] = useState([]);

  const bookContainerRef = useRef(null);


  /* =========================
     GET BOOKS
  ========================= */

  const getBook = async () => {

    try {

      const response = await axiosInstance.get("/books/");

      console.log("book data======>", response.data);

      setBook(response.data);

    } catch (error) {

      console.log(
        "error======>",
        error.response?.data
      );

    }

  };


  useEffect(() => {
    getBook();
  }, []);


  /* =========================
     BESTSELLER SCROLL
  ========================= */

  const scrollLeft = () => {

    bookContainerRef.current?.scrollBy({
      left: -500,
      behavior: "smooth",
    });

  };


  const scrollRight = () => {

    bookContainerRef.current?.scrollBy({
      left: 500,
      behavior: "smooth",
    });

  };


  /* =========================
     GENRES
  ========================= */

  const genres = [
    {
      name: "Sci-Fi",
      image: sifi,
      description: "Explore new worlds",
    },
    {
      name: "Mystery",
      image: mystery,
      description: "Uncover the truth",
    },
    {
      name: "Fiction",
      image: friction,
      description: "Stories that inspire",
    },
    {
      name: "Non-Fiction",
      image: nonfriction,
      description: "Real stories",
    },
    {
      name: "Biography",
      image: biography,
      description: "Lives that inspire",
    },
    {
      name: "Fantasy",
      image: fantasy,
      description: "Where imagination lives",
    },
  ];


  return (

    <main className="bg-light">


      {/* =====================================================
          HERO CAROUSEL
      ====================================================== */}

      <section className="container py-4">

        <div
          id="homepageCarousel"
          className="carousel slide carousel-fade shadow-sm rounded-4 overflow-hidden"
          data-bs-ride="carousel"
        >

          {/* Indicators */}

          <div className="carousel-indicators">

            <button
              type="button"
              data-bs-target="#homepageCarousel"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            />

            <button
              type="button"
              data-bs-target="#homepageCarousel"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            />

            <button
              type="button"
              data-bs-target="#homepageCarousel"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            />

          </div>


          {/* Slides */}

          <div className="carousel-inner">

            <div className="carousel-item active">

              <img
                src={tab1}
                className="d-block w-100"
                alt="Discover your next great read"
              />

            </div>


            <div className="carousel-item">

              <img
                src={tab2}
                className="d-block w-100"
                alt="Book collection"
              />

            </div>


            <div className="carousel-item">

              <img
                src={tab3}
                className="d-block w-100"
                alt="Explore books"
              />

            </div>

          </div>


          {/* Previous */}

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#homepageCarousel"
            data-bs-slide="prev"
          >

            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            />

            <span className="visually-hidden">
              Previous
            </span>

          </button>


          {/* Next */}

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#homepageCarousel"
            data-bs-slide="next"
          >

            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            />

            <span className="visually-hidden">
              Next
            </span>

          </button>

        </div>

      </section>



      {/* =====================================================
          GENRES
      ====================================================== */}

      <section className="container py-3">


        {/* Section Heading */}

        <div className="d-flex justify-content-between align-items-end mb-4">

          <div>

            <p className="text-uppercase text-secondary fw-semibold small mb-1">
              Explore
            </p>

            <h2 className="fw-bold mb-1">
              Browse by Genre
            </h2>

            <p className="text-muted mb-0">
              Find your next favorite book
            </p>

          </div>


          <Link
            to="/genres"
            className="text-decoration-none fw-semibold text-dark d-none d-md-block"
          >
            View all categories
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>

        </div>



        {/* Genre Cards */}

        <div className="row g-3">


          {genres.map((genre) => (

            <div
              className="col-6 col-md-4 col-lg-2"
              key={genre.name}
            >

              <Link
                to={`/books?genre=${genre.name}`}
                className="text-decoration-none"
              >

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">

                  <img
                    src={genre.image}
                    className="card-img-top"
                    alt={genre.name}
                    style={{
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />


                  <div className="card-body p-3">

                    <h6 className="fw-bold text-dark mb-1">
                      {genre.name}
                    </h6>

                    <p className="text-muted small mb-2">
                      {genre.description}
                    </p>

                    <span className="small fw-semibold text-dark">

                      Explore

                      <i className="bi bi-arrow-right ms-1"></i>

                    </span>

                  </div>

                </div>

              </Link>

            </div>

          ))}

        </div>

      </section>



      {/* =====================================================
          BESTSELLERS
      ====================================================== */}

      <section className="container py-5">


        {/* Heading */}

        <div className="d-flex justify-content-between align-items-center mb-4">


          <div>

            <p className="text-uppercase text-secondary fw-semibold small mb-1">
              Popular picks
            </p>

            <h2 className="fw-bold mb-1">
              Bestsellers
            </h2>

            <p className="text-muted mb-0">
              Most loved by our readers
            </p>

          </div>


          {/* Arrows */}

          <div className="d-flex gap-2">

            <button
              type="button"
              className="btn btn-outline-secondary rounded-circle"
              onClick={scrollLeft}
              aria-label="Previous books"
            >

              <i className="bi bi-chevron-left"></i>

            </button>


            <button
              type="button"
              className="btn btn-outline-secondary rounded-circle"
              onClick={scrollRight}
              aria-label="Next books"
            >

              <i className="bi bi-chevron-right"></i>

            </button>

          </div>

        </div>



        {/* Books */}

        <div
          ref={bookContainerRef}
          className="d-flex gap-3 overflow-auto pb-3"
          style={{
            scrollbarWidth: "none",
          }}
        >


          {book.map((book) => (

            <div
              key={book.id}
              className="flex-shrink-0"
              style={{
                width: "210px",
              }}
            >


              <Link
                to={`/bookdetail/${book.id}`}
                className="text-decoration-none text-dark"
              >

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">


                  {/* Book Image */}

                  <div className="bg-light p-3">

                    <img
                      src={`http://127.0.0.1:8000${book.image}`}
                      alt={book.title}
                      className="card-img-top rounded-3 shadow-sm"
                      style={{
                        height: "250px",
                        objectFit: "cover",
                      }}
                    />

                  </div>


                  {/* Book Details */}

                  <div className="card-body p-3 d-flex flex-column">


                    <h6
                      className="fw-bold mb-1"
                      style={{
                        minHeight: "40px",
                      }}
                    >
                      {book.title}
                    </h6>


                    <p className="text-success small fw-semibold mb-1">
                      {book.author}
                    </p>


                    <p
                      className="text-muted small mb-2"
                      style={{
                        minHeight: "20px",
                      }}
                    >
                      {book.genre?.join(", ")}
                    </p>


                    <div className="d-flex justify-content-between align-items-center mt-auto">


                      <span className="text-danger fw-bold">
                        ₹{book.price}
                      </span>


                      <span
                        className="btn btn-sm text-white rounded-circle"
                        style={{
                          backgroundColor: "#A3572A",
                          width: "34px",
                          height: "34px",
                        }}
                      >

                        <i className="bi bi-arrow-right"></i>

                      </span>

                    </div>

                  </div>

                </div>

              </Link>

            </div>

          ))}


        </div>

      </section>



      {/* =====================================================
          WHY BOOKNOOK
      ====================================================== */}

      <section className="container pb-5">


        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">


          <div className="row g-4 text-center">


            <div className="col-md-4">

              <div className="fs-2 text-success mb-2">
                <i className="bi bi-book"></i>
              </div>

              <h6 className="fw-bold">
                Thousands of Books
              </h6>

              <p className="text-muted small mb-0">
                Discover books across every genre.
              </p>

            </div>


            <div className="col-md-4">

              <div className="fs-2 text-success mb-2">
                <i className="bi bi-truck"></i>
              </div>

              <h6 className="fw-bold">
                Fast Delivery
              </h6>

              <p className="text-muted small mb-0">
                Get your favorite books delivered to your door.
              </p>

            </div>


            <div className="col-md-4">

              <div className="fs-2 text-success mb-2">
                <i className="bi bi-shield-check"></i>
              </div>

              <h6 className="fw-bold">
                Secure Shopping
              </h6>

              <p className="text-muted small mb-0">
                Safe and secure checkout every time.
              </p>

            </div>


          </div>

        </div>

      </section>


    </main>
  );
};


export default Homepage;