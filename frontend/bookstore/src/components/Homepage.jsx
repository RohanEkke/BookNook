import React, { useState, useEffect, useRef } from 'react'
import tab1 from '../assets/img/tab1.png'
import tab2 from '../assets/img/tab2.png'
import tab3 from '../assets/img/tab3.png'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import mystery from '../assets/img/mystery.png'
import fantasy from '../assets/img/fantasy.png'
import friction from '../assets/img/friction.png'
import nonfriction from '../assets/img/non-friction.png'
import sifi from '../assets/img/si-fi.png'
import biography from '../assets/img/biography.png'
import axiosInstance from '../axiosInstance'
import { Link } from 'react-router-dom'

const Homepage = () => {
  const [book, setBook] = useState([])
  const getBook = async () => {
    try{
      const response = await axiosInstance.get("/books/")
      console.log("book data======>", response.data)
      setBook(response.data)
    }catch(error){
      console.log("error======>", error.response?.data)
    }
  }

  useEffect(() => {
      getBook();
    }, [])

  const bookContainerRef = useRef(null)

  const scrollLeft = () => {
    bookContainerRef.current.scrollBy({
      left: -400,
      behavior: "smooth"
    });
  };

  const scrollRight = () => {
    bookContainerRef.current.scrollBy({
      left: 400,
      behavior: "smooth"
    });
  };



  return (
    <>
    
    <div className='container'>
      <div id="carouselExampleIndicators" className="carousel slide carousel-fade mt-5 mb-5">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={tab1} className="d-block w-100 rounded-3" />
          </div>
          <div className="carousel-item">
            <img src={tab2} className="d-block w-100 rounded-3" />
          </div>
          <div className="carousel-item">
            <img src={tab3} className="d-block w-100 rounded-3" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      
      <div className='container '>
        <p className="h2 fw-bold">Browse by Genre</p>
        <div className='row '>

          <div className='col-md-3'>
            <img src={sifi} className='rounded-3 shadow h-75 w-75'/>
          </div>

          <div className='col-md-3'>
            <img src={mystery} className='rounded-3  shadow h-75 w-75'/>
          </div>

          <div className='col-md-3'>
            <img src={friction} className='rounded-3  shadow h-75 w-75'/>
          </div>

          <div className='col-md-3'>
            <img src={nonfriction} className='rounded-3  shadow h-75 w-75'/>
          </div>

          <div className='col-md-3'>
            <img src={biography} className='rounded-3  shadow h-75 w-75'/>
          </div>

          <div className='col-md-3'>
            <img src={fantasy} className='rounded-3  shadow h-75 w-75'/>
          </div>

          
        </div>
      </div>

      <div className='container p-2'>
        <div className="d-flex justify-content-between align-items-center mb-3">

          <p className="h2 fw-bold">Bestseller</p>
          <div>
            <button
              type="button"
              className="btn btn-link text-secondary p-1"
              onClick={scrollLeft}
            >
              <i className="bi bi-chevron-left fs-5"></i>
            </button>

            <button
              type="button"
              className="btn btn-link text-secondary p-1"
              onClick={scrollRight}
            >
              <i className="bi bi-chevron-right fs-5"></i>
            </button>
          </div>
        </div>

        <div ref={bookContainerRef} className='d-flex gap-4 overflow-hidden'>
          {book.map((book) =>  (
            <div className='col-md-2' key={book.id}>
              <Link
                to={`/bookdetail/${book.id}`}
                className="text-decoration-none text-dark"
              >
          
                <div className=" h-100 w-100 ">
                  
                  <img src={`http://127.0.0.1:8000${book.image}`} className="card-img-top w-100 mx-auto m-1 border-1 rounded-3 shadow" />
                  
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-0">{book.title}</h5>
                    <p className="text-success fw-bold mb-0">{book.author}</p>
                    <p className="text-muted fw-bold mb-0">{book.genre.join(", ")} </p>
                    <p className="text-danger fw-bold mb-0">₹{book.price} </p>
                  </div>
                  
                </div>
              </Link>
            </div>
          
          ))}
        </div>
      </div>
      

    </div>
    </>
  )
}

export default Homepage