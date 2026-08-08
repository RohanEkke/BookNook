import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './components/Login'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from './components/Homepage'
import Register from './components/Register'
import AuthProvider from './AuthProvider'
import OrderDetails from './components/orders/OrderDetails'
import Profile from './components/orders/Profile'
import Payment from './components/orders/Payment'
import Cart from './components/orders/Cart'
import OrderList from './components/orders/OrderList'
import Address from './components/orders/Address'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import BookDetail from './components/BookDetail'



function App() {
  

  return (
    <>
    <AuthProvider>
    <BrowserRouter>
      <Header/>

      <Routes>
        <Route path='/' element={<PublicRoute><Homepage/></PublicRoute>} />
        <Route path='/login' element={<PublicRoute><Login/></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register/></PublicRoute>} />
        <Route path='/bookdetail' element={<PublicRoute><BookDetail/></PublicRoute>} />

        <Route path='/orderdetail' element={<PrivateRoute><OrderDetails/></PrivateRoute>} />
        <Route path='/orderlist' element={<PrivateRoute><OrderList/> </PrivateRoute>} />
        <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>} />
        <Route path='/payment' element={<PrivateRoute><Payment/></PrivateRoute>} />
        <Route path='/cart' element={<PrivateRoute><Cart/></PrivateRoute>} />
        <Route path='/address' element={<PrivateRoute><Address/></PrivateRoute>} />
      </Routes>

      <Footer/>
    </BrowserRouter>
    </AuthProvider>
      
      
      
    </>
  )
}

export default App
