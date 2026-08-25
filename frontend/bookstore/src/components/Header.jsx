import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/img/logo.png'
import { AuthContext } from '../AuthProvider'

const Header = () => {
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
    <nav className='navbar navbar-expand-lg bg-body-light shadow-sm'  >
        <div className='container-fluid'>
           <Link className="navbar-brand d-flex align-items-center" to="/">
                <img src={logo} alt="Brand Logo" height="auto"width="auto"className="d-inline-block align-text-top me-2"/>
            </Link>
            <div className='d-flex align-items-center ms-auto gap-2'>
            {isLoggedIn ? (
                <>
                <Link to="/cart"><button className="btn btn-outline-success">Cart</button></Link>
                <Link to="/account"><button className='btn btn-outline-success'>Account</button></Link>
                
                <button className='btn btn-outline-danger' onClick={handleLogout}>Logout</button>
                </>
                
            ) : (
                <>
                <Link to="/login"><button className='btn text-dark fw-bold' style={{ backgroundColor: '#fffff', borderColor: 'black' }}>Login</button></Link>
                <Link to="/register"><button className='btn text-light fw-bold' style={{ backgroundColor: '#131F33'}}>SignUp</button></Link>
                </>
                
            )}
            </div>

        </div>

    </nav>
    
    </>
  )
}

export default Header