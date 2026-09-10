import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import axiosInstance from "../axiosInstance";


const Books = () => {

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();


  /* =====================================================
     GET BOOKS
  ===================================================== */

  const getBooks = async () => {

    try {

      setLoading(true);

      const response = await axiosInstance.get("/books/");

      console.log("Books ======>", response.data);

      setBooks(response.data);
      setFilteredBooks(response.data);

    } catch (error) {

      console.log(
        "Books error ======>",
        error.response?.data
      );

      setError("Unable to load books.");

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    getBooks();
  }, []);


  /* =====================================================
     GENRE FROM URL
  ===================================================== */

  useEffect(() => {

    const genreFromUrl = searchParams.get("genre");

    if (genreFromUrl) {
      setSelectedGenre(genreFromUrl);
    }

  }, [searchParams]);


  /* =====================================================
     GET GENRES
  ===================================================== */

  const genres = [
    "All",
    "Sci-Fi",
    "Mystery",
    "Fiction",
    "Non-Fiction",
    "Biography",
    "Fantasy",
  ];


  /* =====================================================
     FILTER + SEARCH + SORT
  ===================================================== */

  useEffect(() => {

    let result = [...books];


    /* Search */

    if (search.trim()) {

      const searchText = search.toLowerCase();

      result = result.filter((book) =>

        book.title?.toLowerCase().includes(searchText) ||

        book.author?.toLowerCase().includes(searchText) ||

        book.genre?.some((genre) =>
          genre.toLowerCase().includes(searchText)
        )

      );

    }


    /* Genre */

    if (selectedGenre !== "All") {

      result = result.filter((book) =>
        book.genre?.some(
          (genre) =>
            genre.toLowerCase() ===
            selectedGenre.toLowerCase()
        )
      );

    }


    /* Sorting */

    if (sortBy === "price-low") {

      result.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );

    }


    if (sortBy === "price-high") {

      result.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );

    }


    if (sortBy === "name") {

      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );

    }


    setFilteredBooks(result);

  }, [
    books,
    search,
    selectedGenre,
    sortBy
  ]);


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <div className="container py-5">

        <div className="text-center py-5">

          <div
            className="spinner-border text-success"
            role="status"
          />

          <p className="text-muted mt-3">
            Loading books...
          </p>

        </div>

      </div>

    );

  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {

    return (

      <div className="container py-5">

        <div className="alert alert-danger text-center">
          {error}
        </div>

      </div>

    );

  }


  return (

    <main className="bg-light min-vh-100">


      {/* =================================================
          HEADER
      ================================================= */}

      <section className="container py-5">

        <div className="row align-items-center g-4">

          <div className="col-lg-7">

            <span className="badge bg-dark px-3 py-2 mb-3">
              BookNook Collection
            </span>

            <h1 className="display-5 fw-bold mb-2">
              Explore Our Books
            </h1>

            <p className="text-muted fs-5 mb-0">
              Discover stories, ideas and adventures
              waiting for you.
            </p>

          </div>


          <div className="col-lg-5">

            {/* Search */}

            <div className="input-group input-group-lg shadow-sm">

              <span className="input-group-text bg-white border-end-0">

                <i className="bi bi-search text-muted"></i>

              </span>

              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search books or authors..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

        </div>

      </section>



      {/* =================================================
          FILTER BAR
      ================================================= */}

      <section className="container pb-4">

        <div className="bg-white rounded-4 shadow-sm p-3">

          <div className="row align-items-center g-3">


            {/* Genres */}

            <div className="col-lg-8">

              <div className="d-flex align-items-center flex-wrap gap-2">

                <span className="fw-semibold me-2">
                  Genre:
                </span>


                {genres.map((genre) => (

                  <button
                    key={genre}
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 ${
                      selectedGenre === genre
                        ? "btn-dark"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() =>
                      setSelectedGenre(genre)
                    }
                  >
                    {genre}
                  </button>

                ))}

              </div>

            </div>


            {/* Sort */}

            <div className="col-lg-4">

              <div className="d-flex align-items-center justify-content-lg-end gap-2">

                <label
                  htmlFor="sortBooks"
                  className="fw-semibold text-nowrap"
                >
                  Sort by:
                </label>

                <select
                  id="sortBooks"
                  className="form-select"
                  style={{ maxWidth: "190px" }}
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                >

                  <option value="default">
                    Recommended
                  </option>

                  <option value="name">
                    Name
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                </select>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* =================================================
          RESULTS
      ================================================= */}

      <section className="container pb-5">


        {/* Result heading */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h5 className="fw-bold mb-1">

              {selectedGenre === "All"
                ? "All Books"
                : selectedGenre}

            </h5>

            <p className="text-muted small mb-0">

              {filteredBooks.length}{" "}
              {filteredBooks.length === 1
                ? "book"
                : "books"}{" "}
              found

            </p>

          </div>


          {search && (

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => setSearch("")}
            >

              <i className="bi bi-x-lg me-1"></i>

              Clear Search

            </button>

          )}

        </div>



        {/* =================================================
            BOOK GRID
        ================================================= */}

        {filteredBooks.length === 0 ? (

          <div className="bg-white rounded-4 shadow-sm text-center py-5">

            <i
              className="bi bi-book"
              style={{
                fontSize: "50px",
                color: "#adb5bd",
              }}
            />

            <h4 className="fw-bold mt-3">
              No books found
            </h4>

            <p className="text-muted">
              Try another search or genre.
            </p>

            <button
              className="btn btn-dark"
              onClick={() => {
                setSearch("");
                setSelectedGenre("All");
              }}
            >
              Show All Books
            </button>

          </div>

        ) : (

          <div className="row g-4">

            {filteredBooks.map((book) => (

              <div
                className="col-6 col-md-4 col-lg-3"
                key={book.id}
              >

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">


                  {/* Book Image */}

                  <div className="position-relative bg-light p-3">

                    <Link
                      to={`/bookdetail/${book.id}`}
                    >

                      <img
                        src={`http://127.0.0.1:8000${book.image}`}
                        alt={book.title}
                        className="w-100 rounded-3"
                        style={{
                          height: "300px",
                          objectFit: "cover",
                        }}
                      />

                    </Link>


                    {/* Stock */}

                    {book.stock === 0 ? (

                      <span className="position-absolute top-0 start-0 m-3 badge bg-danger">
                        Out of Stock
                      </span>

                    ) : book.stock <= 5 ? (

                      <span className="position-absolute top-0 start-0 m-3 badge bg-warning text-dark">
                        Only {book.stock} left
                      </span>

                    ) : (

                      <span className="position-absolute top-0 start-0 m-3 badge bg-success">
                        In Stock
                      </span>

                    )}

                  </div>



                  {/* Details */}

                  <div className="card-body d-flex flex-column p-3">


                    <Link
                      to={`/bookdetail/${book.id}`}
                      className="text-decoration-none text-dark"
                    >

                      <h5
                        className="card-title fw-bold mb-1"
                        style={{
                          minHeight: "48px",
                        }}
                      >
                        {book.title}
                      </h5>

                    </Link>


                    <p className="text-success small fw-semibold mb-1">

                      {book.author}

                    </p>


                    <p
                      className="text-muted small mb-3"
                      style={{
                        minHeight: "20px",
                      }}
                    >

                      {book.genre?.join(", ")}

                    </p>


                    {/* Bottom */}

                    <div className="d-flex justify-content-between align-items-center mt-auto">

                      <div>

                        <small className="text-muted d-block">
                          Price
                        </small>

                        <span className="text-danger fs-5 fw-bold">
                          ₹{book.price}
                        </span>

                      </div>


                      <Link
                        to={`/bookdetail/${book.id}`}
                        className="btn btn-dark btn-sm rounded-pill px-3"
                      >

                        View

                        <i className="bi bi-arrow-right ms-1"></i>

                      </Link>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>



      {/* =================================================
          BOTTOM INFO
      ================================================= */}

      <section className="container pb-5">

        <div className="bg-white rounded-4 shadow-sm p-4">

          <div className="row text-center g-4">

            <div className="col-md-4">

              <i className="bi bi-book fs-2 text-success"></i>

              <h6 className="fw-bold mt-2 mb-1">
                Wide Selection
              </h6>

              <p className="text-muted small mb-0">
                Books across multiple genres.
              </p>

            </div>


            <div className="col-md-4">

              <i className="bi bi-truck fs-2 text-success"></i>

              <h6 className="fw-bold mt-2 mb-1">
                Fast Delivery
              </h6>

              <p className="text-muted small mb-0">
                Get your books delivered to your door.
              </p>

            </div>


            <div className="col-md-4">

              <i className="bi bi-shield-check fs-2 text-success"></i>

              <h6 className="fw-bold mt-2 mb-1">
                Secure Checkout
              </h6>

              <p className="text-muted small mb-0">
                Shop with confidence.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>

  );
};


export default Books;