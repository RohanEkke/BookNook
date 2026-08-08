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
            const response = await axios.post('http://127.0.0.1:8000/api/token/', userData)
            localStorage.setItem('accessToken', response.data.access)
            localStorage.setItem('refreshToken', response.data.refresh)
            setIsLoggedIn(true)
            navigate('/')
            
        }catch(error){
            
        console.error(error.response?.data);

        setErrors(
            error.response?.data?.detail || "Invalid credentials"
        );
        }finally{
            setLoading(false)
        }
    }

  return (
    <>
    <div className='container m-5'>
        <div className='row justify-content-center'>
            <div className='col-md-6'>

                <form className='shadow p-4 m-5 bg-light rounded-3' onSubmit={handleLogin}>
                    <img 
                    src={logo} 
                    alt="Brand Logo" 
                    height="auto"
                    width="auto"
                    className="d-block mx-auto mb-4" 
                    />
                    <h3 className='text-dark text-center mb-4'>Login to BookNook</h3>
                    <div className="form-group m-4">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email"  value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        
                    </div>
                    
                    <div className="form-group m-4">
                        <label >Password</label>
                        <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        
                    </div>
                    
                    {errors && <div className='text-danger text-center'>{errors}</div> }
                    {loading ? (
                        <div className="d-flex justify-content-center m-4">
                            <button type="submit" className="btn btn-primary w-100 mt-2">Logging in...</button>
                        </div>
                    ) : (
                        <div className="d-flex justify-content-center m-4">
                            <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
                        </div>
                    )}   
                </form>

            </div>
        </div>
    
    </div>
    
    </>
  )
}

export default Login