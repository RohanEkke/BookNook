import React from 'react'
import logo from '../../assets/img/logo2.png'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../../AuthProvider';
import '../../assets/css/style.css'

const AccountLayout = () => {
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
  const navigate = useNavigate()
  const handleLogout = () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setIsLoggedIn(false)
      navigate('/')
  }
 
  return (
    <>
    <div className='container-fluid h-100'>
        <div className='row'>
            <div className='col-md-3 bg-light justify-content-center'>
                <img
                src={logo} 
                alt="Brand Logo" 
                height="auto"
                width="auto"
                className="d-block mx-auto m-4" 
                />
                <hr/>
                <NavLink to="orders" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><i className="bi bi-clipboard2-check"></i>Orders</NavLink>                
                <NavLink to="profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><i className="bi bi-person-circle"/>  Profile<br/></NavLink>
                <NavLink to="addresses" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><i className="bi bi-geo-alt-fill"/> Address<br/></NavLink>
                <NavLink to="wishlist" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><i className="bi bi-bag-heart"/> Wishlist<br/></NavLink>
                <NavLink to="payment-methods" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><i className="bi bi-credit-card"/> Payment Method<br/></NavLink>
                <NavLink to="notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}><i className="bi bi-bell"/> Notifications<br/></NavLink>
                <button type="button" onClick={handleLogout} className="sidebar-link"><i className="bi bi-box-arrow-right"></i><span>Logout</span></button>            
            </div>

            <div className='col-md-9 '>
              <Outlet/>

            </div>

        </div>
    </div>
    </>
  )
}

export default AccountLayout