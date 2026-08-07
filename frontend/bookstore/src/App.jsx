import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './components/Login'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from './components/Homepage'
import Register from './components/Register'
import AuthProvider from './AuthProvider'



function App() {
  

  return (
    <>
    <AuthProvider>
    <BrowserRouter>
      <Header/>

      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/' element={<Homepage/>} />
        <Route path='/register' element={<Register/>} />
      </Routes>

      <Footer/>
    </BrowserRouter>
    </AuthProvider>
      
      
      
    </>
  )
}

export default App
