import React from "react";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import mystery from "../assets/img/mystery.png";
import fantasy from "../assets/img/fantasy.png";
import fiction from "../assets/img/friction.png";
import nonfiction from "../assets/img/non-friction.png";
import sifi from "../assets/img/si-fi.png";
import biography from "../assets/img/biography.png";


const Genres = () => {

  const genres = [
    {
      name: "Sci-Fi",
      image: sifi,
      description:
        "Explore futuristic worlds, advanced technology, space adventures and imaginative stories.",
    },
    {
      name: "Mystery",
      image: mystery,
      description:
        "Solve thrilling mysteries, uncover hidden secrets and follow unforgettable investigations.",
    },
    {
      name: "Fiction",
      image: fiction,
      description:
        "Escape into fascinating stories, memorable characters and beautifully imagined worlds.",
    },
    {
      name: "Non-Fiction",
      image: nonfiction,
      description:
        "Learn from real stories, ideas, experiences and fascinating subjects from the real world.",
    },
    {
      name: "Biography",
      image: biography,
      description:
        "Discover the inspiring lives, journeys and achievements of remarkable people.",
    },
    {
      name: "Fantasy",
      image: fantasy,
      description:
        "Enter magical worlds filled with adventure, mythical creatures and extraordinary characters.",
    },
  ];


  return (

    <main className="bg-light min-vh-100">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="container py-5">

        <div className="text-center">

          <span className="badge bg-dark px-3 py-2 mb-3">
            Explore BookNook
          </span>

          <h1 className="display-5 fw-bold mb-3">
            Browse by Genre
          </h1>

          <p
            className="text-muted mx-auto"
            style={{ maxWidth: "650px" }}
          >
            Discover your next favorite book from our carefully
            selected collection of genres. Choose a category and
            start exploring.
          </p>

        </div>

      </section>


      {/* =================================================
          GENRE CARDS
      ================================================= */}

      <section className="container pb-5">

        <div className="row g-4">

          {genres.map((genre) => (

            <div
              className="col-12 col-sm-6 col-lg-4"
              key={genre.name}
            >

              <Link
                to={`/books?genre=${encodeURIComponent(genre.name)}`}
                className="text-decoration-none"
              >

                <div
                  className="card border-0 shadow-sm rounded-4 overflow-hidden h-100"
                >

                  {/* Image */}

                  <div className="position-relative">

                    <img
                      src={genre.image}
                      alt={genre.name}
                      className="card-img-top"
                      style={{
                        height: "230px",
                        objectFit: "cover",
                      }}
                    />

                    {/* Genre badge */}

                    <span
                      className="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 px-3 py-2"
                    >
                      {genre.name}
                    </span>

                  </div>


                  {/* Content */}

                  <div className="card-body p-4">

                    <h4 className="card-title fw-bold text-dark mb-2">
                      {genre.name}
                    </h4>

                    <p className="card-text text-muted small mb-4">
                      {genre.description}
                    </p>


                    <div className="d-flex justify-content-between align-items-center">

                      <span className="fw-semibold text-dark">
                        Explore books
                      </span>

                      <span
                        className="btn btn-dark rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "38px",
                          height: "38px",
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


      {/* =================================================
          BOTTOM CTA
      ================================================= */}

      <section className="container pb-5">

        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">

          <div className="row align-items-center g-4">

            <div className="col-md-8">

              <span className="text-uppercase text-success fw-bold small">
                Can't decide?
              </span>

              <h3 className="fw-bold mt-2 mb-2">
                Explore our complete collection
              </h3>

              <p className="text-muted mb-0">
                Browse all the books available at BookNook
                and find something perfect for you.
              </p>

            </div>


            <div className="col-md-4 text-md-end">

              <Link
                to="/books"
                className="btn btn-dark px-4 py-2"
              >
                View All Books
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>

  );
};


export default Genres;