import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../axiosInstance';

const BookDetail = () => {
  const {id} = useParams();
  const [book, setBook] = useState(null);

  console.log("book id =======>", id)

  const getBook = async () => {
    try{

      const response = await axiosInstance.get(`/book/${id}/`);
      console.log("specific book ==========>", response.data)
      setBook(response.data)

    }catch(error){

      console.log("error======>", error.response?.data)

    }

  
  }
  useEffect(() => {
    getBook();
  }, [id]);

  if (!book) {
    return <div className="container mt-5">Loading...</div>;
  }
    
  
  return (
    <>
    <div className='container py-5'>
      
      <div className='row justify-content-center align-items-center g-5'>
        <div className='col-md-5'>
          <img
            src={`http://127.0.0.1:8000${book.image}`}
            className="w-75 border-1 rounded-3 shadow"
            alt={book.title}
          />

        </div>
        <div className='col-md-7'>
          
            <span
              className="text-uppercase fw-semibold"
              style={{ color: "#A3572A", letterSpacing: "1px" }}
            >
              Mystery
            </span>

            <h1 className="display-5 fw-bold mt-2 mb-2">
              {book.title}
            </h1>
            <div className="mb-3">
            <span style={{ color: "#A3572A" }}>
              ★★★★★
            </span>
            <span className="text-muted ms-2">
              4.8 · 128 reviews
            </span>
          </div>

            <h2 className="fw-bold mb-1" style={{ color: "#A3572A" }}>
              ₹{book.price}
            </h2>

            <small className="text-success fw-semibold">
              ✓ In stock
            </small>
            <div className="border-top mt-4 pt-4">
              <h5 className="fw-bold">About this book</h5>

              <p className="text-secondary lh-lg">
                {book.description}
              </p>
            </div>
          <div className="d-flex gap-3 mt-4">

            <button
              className="btn btn-lg text-white px-4"
              style={{ backgroundColor: "#A3572A" }}
            >
              Add to Cart
            </button>

            <button
              className="btn btn-lg px-4"
              style={{
                border: "1px solid #A3572A",
                color: "#A3572A"
              }}
            >
              Buy Now
            </button>

          </div>


        </div>

      </div>
    

    </div>
    </>
  )
}

export default BookDetail