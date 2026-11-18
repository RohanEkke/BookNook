import React, {useState} from 'react'
import axios from 'axios'
import logo from '../assets/img/logo.png'

const Register = () => {
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    


    const handleRegistration = async (e) => {
        e.preventDefault();
        setLoading(true)

        const userData = {
            first_name, last_name, email, password
        }

        try{
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/register`, userData)
            // console.log("data=======>", response.data)
            // console.log("registration successful!")
            setErrors({})
            setSuccess(true)
        }catch(error){
            setErrors(error.response.data)
            // console.log("error======>", error.response.data)
        }finally{
            setLoading(false)
        }
    }


  return (
    
        <>
            <div className="container-fluid px-3 py-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-7 col-lg-6">

                        <form
                            className="shadow p-3 p-sm-4 p-md-5 my-3 rounded-3 bg-light w-100"
                            onSubmit={handleRegistration}
                        >

                            <img
                                src={logo}
                                alt="Brand Logo"
                                className="d-block mx-auto mb-4 img-fluid"
                                style={{ maxWidth: "300px", width: "100%", height: "auto" }}
                            />

                            <h3 className="text-dark text-center mb-4">
                                Sign Up
                            </h3>

                            <div className="form-group mb-3">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-control w-100"
                                    placeholder="First Name"
                                    value={first_name}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <small className="form-text text-danger">
                                    {errors.first_name}
                                </small>
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control w-100"
                                    placeholder="Last Name"
                                    value={last_name}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <small className="form-text text-danger">
                                    {errors.last_name}
                                </small>
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Email address</label>
                                <input
                                    type="email"
                                    className="form-control w-100"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <small className="form-text text-danger">
                                    {errors.email}
                                </small>
                            </div>

                            <div className="form-group mb-4">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control w-100"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <small className="form-text text-danger">
                                    {errors.password}
                                </small>
                            </div>

                            {success && (
                                <div className="text-center text-success mb-3">
                                    Registration Successful!
                                </div>
                            )}

                            <button
                                type="submit"
                                className="text-light btn w-100 mt-2 py-2"
                                style={{ backgroundColor: '#A3572A' }}
                                disabled={loading}
                            >
                                {loading ? "Signing up..." : "Signup"}
                            </button>

                        </form>

                    </div>
                </div>
            </div>
        </>

  )
}

export default Register