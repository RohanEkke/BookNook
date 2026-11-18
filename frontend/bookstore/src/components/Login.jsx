import axios from 'axios'
import React, { useContext, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import logo from '../assets/img/logo.png'
import { AuthContext } from '../AuthProvider'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState("")
    const navigate = useNavigate()
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
    
    

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)

        const userData = {email, password}
        // console.log("data===>", userData)

        try{
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/token/`, userData)
            localStorage.setItem('accessToken', response.data.access)
            localStorage.setItem('refreshToken', response.data.refresh)
            setIsLoggedIn(true)
            navigate('/')
            
        }catch(error){
            
        console.log("LOGIN ERROR:", error);
        console.log("STATUS:", error.response?.status);
        console.log("RESPONSE:", error.response?.data);
        console.log("REQUEST URL:", error.config?.url);

        setErrors(
            error.response?.data?.detail ||
            error.response?.data?.non_field_errors?.[0] ||
            "Login failed. Please try again."
        );
        }finally{
            setLoading(false)
        }
    }

  return (
    
        <>
            <div className="container-fluid px-3 py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-6">

                        <form
                            className="shadow p-4 p-md-5 m-0 bg-light rounded-3"
                            onSubmit={handleLogin}
                        >
                            <img
                                src={logo}
                                alt="Brand Logo"
                                className="d-block mx-auto mb-4 img-fluid"
                            />

                            <h3 className="text-dark text-center mb-4">
                                Login to BookNook
                            </h3>

                            <div className="form-group m-3 m-md-4">
                                <label>Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-group m-3 m-md-4">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {errors && (
                                <div className="text-danger text-center">
                                    {errors}
                                </div>
                            )}

                            <div className="d-flex justify-content-center m-3 m-md-4">
                                <button
                                    type="submit"
                                    className="text-light btn w-100 mt-3"
                                    style={{ backgroundColor: '#A3572A' }}
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>

  )
}

export default Login