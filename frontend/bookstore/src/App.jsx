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
import AccountLayout from './components/orders/AccountLayout'
import Wishlist from './components/orders/Wishlist'
import Notifications from './components/orders/Notifications'
import Chekout from './components/orders/Chekout'
import OrderPlaced from './components/orders/OrderPlaced'
import Genres from './components/Genres'
import Books from './components/Books'
import ChatAi from './components/orders/ChatAi'



function App() {
  

  return (
    <>
    <div style={{ backgroundColor: "#f0f4f8", fontFamily: "'Segoe UI', sans-serif" }}>
    <AuthProvider>
    <BrowserRouter>
      <Header/>

      <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route path='/genres' element={<Genres/>} />
        <Route path='/books' element={<Books/>} />
        <Route path='/login' element={<PublicRoute><Login/></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register/></PublicRoute>} />
        <Route path='/bookdetail/:id' element={<BookDetail/>} />

        <Route path='/account/orders/:id' element={<PrivateRoute><OrderDetails/></PrivateRoute>} />
        <Route path='/cart' element={<PrivateRoute><Cart/></PrivateRoute>} />
        <Route path='/cheakout' element={<PrivateRoute><Chekout/></PrivateRoute>} />
        <Route path='/order-success' element={<PrivateRoute><OrderPlaced/></PrivateRoute>} />
        <Route path='/chat-ai' element={<PrivateRoute><ChatAi/></PrivateRoute>} />
        
        <Route path='/account' element={<AccountLayout/>}>
          <Route index element={<PrivateRoute><Profile/></PrivateRoute>} />
          <Route path='orders' element={<PrivateRoute><OrderList/></PrivateRoute>}/>
          <Route path='profile' element={<PrivateRoute><Profile/></PrivateRoute>}/>
          <Route path='addresses' element={<PrivateRoute><Address/></PrivateRoute>}/>
          <Route path='payment-methods' element={<PrivateRoute><Payment/></PrivateRoute>}/>
          <Route path='wishlist' element={<PrivateRoute><Wishlist/></PrivateRoute>}/>
          <Route path='notifications' element={<PrivateRoute><Notifications/></PrivateRoute>}/>
          <Route path='logout' element={<PublicRoute><Homepage/></PublicRoute>}/>
        </Route>
      
      </Routes>
      <Footer/>
    </BrowserRouter>
    </AuthProvider>
    </div>
      
      
      
    </>
  )
}

export default App
