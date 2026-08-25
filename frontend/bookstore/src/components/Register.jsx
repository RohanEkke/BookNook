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
            const response = await axios.post('http://127.0.0.1:8000/api/register', userData)
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
    <div className='container '>
        <div className='row justify-content-center'>
            <div className='col-md-7'>
                <form className='shadow p-5 m-5 rounded-3 bg-light' onSubmit={handleRegistration}>
                    
                    <img
                    src={logo} 
                    alt="Brand Logo" 
                    height="auto"
                    width="auto"
                    className="d-block mx-auto mb-4" 
                    />
                    <h3 className='text-dark text-center mb-3'>SignUp</h3>
                    <div className="form-group m-3">
                        <label>First Name</label>
                        <input type="text" className="form-control" placeholder="First Name" value={first_name} onChange={(e) => setFirstName(e.target.value)}></input>
                        <small className="form-text text-danger">{errors.first_name} </small>
                    </div>
                    <div className="form-group m-3">
                        <label>Last Name</label>
                        <input type="text" className="form-control" placeholder="Last Name" value={last_name} onChange={(e) => setLastName(e.target.value)}></input>
                        <small className="form-text text-danger">{errors.last_name}</small>
                    </div>
                    <div className="form-group m-3">
                        <label>Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <small className="form-text text-danger">{errors.email}</small>
                    </div>
                    <div className="form-group m-3">
                        <label >Password</label>
                        <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <small className="form-text text-danger">{errors.password}</small>
                    </div>

                    {/* <div className="form-group m-3">
                        <label >Re-enter password</label>
                        <input type="password" className="form-control" placeholder="Password"></input>
                    </div> */}
                    
                    
                    {success && <div className='text-center text-success h5'>Registration Successful!</div>}
                    {loading ? (
                        <div className="d-flex justify-content-center m-3">
                            <button type="submit" className="text-light btn w-100 mt-3" style={{ backgroundColor: '#A3572A' }}>Signingup...</button>
                        </div>
                    ) : (
                        <div className="d-flex justify-content-center m-3">
                            <button type="submit" className="text-light btn w-100 mt-3" style={{ backgroundColor: '#A3572A' }}>Signup</button>
                        </div>
                    )}   
                    
                    
                </form>

            </div>
        </div>
    
    </div>
    </>
  )
}

export default Register