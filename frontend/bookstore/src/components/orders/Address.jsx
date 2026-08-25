import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../AuthProvider'
import axiosInstance from '../../axiosInstance'

const Address = () => {
  const [fullname, setFullname] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postal, setPostal] = useState('')
  const [country, setCountry] = useState('')
  const [addressType, setAddressType] = useState("home");
  const [isDefault, setIsDefault] = useState(false);

  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  // const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true)

    const addressData = {
      full_name: fullname,
      phone: mobileNumber, 
      address_type: addressType, 
      address_line_1: addressLine1, 
      address_line_2: addressLine2, 
      city: city, 
      state: state, 
      postal_code: postal, 
      country: country, 
      is_default: isDefault
    }
    
    try{
      const response = await axiosInstance.post(
        '/address/', 
        addressData
      )
      console.log("address data ======>", response.data)
      console.log("added successful!")
      
      setErrors({})
      setSuccess(true)
    }catch(error){
      
      console.log("FULL ERROR:", error);
      console.log("MESSAGE:", error.message);
      console.log("RESPONSE:", error.response);
      console.log("REQUEST:", error.request);

      setErrors({
          detail: error.message || "Something went wrong"
      });
    }finally{
      setLoading(false)
    }
  }
  const getAddress = async () => {
    try{
      const response = await axiosInstance.get("/address/")
      console.log("get addresses====>", response.data)
      setAddresses(response.data)
    }catch(error){
      console.log("error==>", error.response?.data)
    }
  }
  useEffect(() => {
    getAddress();
  }, [])

  const handleDefaultChange = async (addressId, isDefault) => {
    try {
        const response = await axiosInstance.patch(
            `/address/${addressId}/`,
            {
                is_default: isDefault
            }
        );

        console.log("Updated address:", response.data);

        // Update frontend state
        setAddresses(prev =>
            prev.map(addresses =>
                addresses.id === addressId
                    ? { ...addresses, is_default: isDefault }
                    : addresses
            )
        );

    } catch (error) {
        console.log("Error:", error.response?.data);
    }
  };
  return (
    <>
    <div className='container m-5'>
      <div className='row g-4 align-item-start'>

        <div className="col-md-5 mb-3">
          {addresses.map((addresses) => (
                <div className="card mb-4 shadow-sm border-0 bg-light" key={addresses.id}>
                    <div className="card-header border-0">
                      <input className="form-check-input" type="checkbox" checked={addresses.is_default} onChange={(e) => handleDefaultChange(addresses.id, e.target.checked)}/>
                      <label className="form-check-label">
                        &nbsp;Set as default
                      </label>
                    </div>

                    <div className="card-body p-3">
                        <p className='text-center font-weight-bold'>{addresses.address_type}</p>
                        <p className="card-text">
                            
                            <strong>{addresses.full_name}</strong><br />
                            {addresses.address_line_1},<br />
                            {addresses.address_line_2},<br />
                            {addresses.postal_code},
                            {addresses.city}, {addresses.state},
                            {addresses.country}<br />
                            Phone: {addresses.phone}
                        </p>
                    </div>
                </div>
          ))}
          </div>
            <div className='col-md-7'>
              <form className='shadow p-4 m-5 bg-light rounded-3' onSubmit={handleAddAddress}>
                <h3 className='text-center m-4'>Add your shipping address</h3>
                <div className="form-group m-4">
                  <label>Full Name</label>
                  <input type="text" className="form-control" placeholder="Your full name" value={fullname} onChange={(e) => setFullname(e.target.value)}></input>
                </div>

                <div className="form-group m-4">
                  <label>Mobile Number (+91)</label>
                  <input type="text" className="form-control" placeholder="Your mobile number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} ></input>
                </div>

                <div className='m-4'>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" value="home" checked={addressType === 'home'} onChange={(e) => setAddressType(e.target.value)} ></input>
                    <label className="form-check-label">Home</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" value="work" checked={addressType === 'work'} onChange={(e) => setAddressType(e.target.value)}></input>
                    <label className="form-check-label">Work</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" value="other" checked={addressType === 'other'} onChange={(e) => setAddressType(e.target.value)}></input>
                    <label className="form-check-label" >Other</label>
                  </div>
                </div>
                
                <div className="form-group m-4">
                  <label>Building no/Appartment no/Flat no</label>
                  <input type="text" className="form-control" placeholder="Your house number" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} ></input>
                </div>

                <div className="form-group m-4">
                  <label>Nearby mark</label>
                  <input type="text" className="form-control" placeholder="Nearby place" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} ></input>
                </div>

                <div className="form-group form-inline m-4">
                  <label>City</label>
                  <input type="text" className="form-control" placeholder="Your city name" value={city} onChange={(e) => setCity(e.target.value)} ></input>
                </div>
                
                <div className="form-group m-4">
                  <label>State</label>
                  <input type="text" className="form-control" placeholder="Your state" value={state} onChange={(e) => setState(e.target.value)} ></input>
                </div>

                <div className="form-group m-4">
                  <label>Postal code</label>
                  <input type="text" className="form-control" placeholder="City code" value={postal} onChange={(e) => setPostal(e.target.value)} ></input>
                </div>

                <div className="form-group m-4">
                  <label>Country</label>
                  <input type="text" className="form-control" placeholder="Your country" value={country} onChange={(e) => setCountry(e.target.value)} ></input>
                </div>

                <div className="form-check m-4">
                  <input className="form-check-input" type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} ></input>
                  <label className="form-check-label">
                    &nbsp;Set as default
                  </label>
                </div>

                {loading ? (
                      <div className="d-flex justify-content-center m-4">
                          <button type="submit" className="text-light btn w-100 mt-3" style={{ backgroundColor: '#A3572A' }}>Adding...</button>
                      </div>
                  ) : (
                      <div className="d-flex justify-content-center m-4">
                          <button type="submit" className="text-light btn w-100 mt-3" style={{ backgroundColor: '#A3572A' }}>Add Address</button>
                      </div>
                )}   

              </form>

             </div>
            
        </div>
    </div>

    
    </>
    
  )
}

export default Address