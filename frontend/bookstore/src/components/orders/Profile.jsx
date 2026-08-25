import axios from 'axios'
import {useEffect, useState} from 'react'
import axiosInstance from '../../axiosInstance'
import profilephoto from '../../assets/img/profile photo.jpeg'

const Profile = () => {
    const [profile, setProfile] = useState(null)
    
    const getProfile = async () => {
        try{
            const response = await axiosInstance.get("/profile/")
            console.log("user profile====>", response.data)
            setProfile(response.data)
        }catch(error){
            console.log("error======>", error.response?.data)
        }
    }
    useEffect(() => {
        getProfile();
      }, [])

   
    
  return (
    <>
    <div className='container m-5 '>
        <div className='row justify-content-center'>
            <div className='col-md-10'>
                <div className='row justify-content-center bg-light border rounded-3'>
                    {profile &&(
                    <div className='col-md-4 text-center border-end'>
                        <img 
                        src={`http://127.0.0.1:8000${profile.profile_image}`} 
                        alt="Brand Logo" 
                        style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '50%'
                                }}
                        className="d-block mx-auto m-4 border" 
                        
                        />
                        <h6 className='text-muted'>{profile.first_name} {profile.last_name}</h6>
                        <h6 className='mb-3'>{profile.email}</h6>

                    </div>
                    
                    )}
                    
                    {profile && (
                    <div className='col-8 mx-auto p-5 ' >
                        <h5>{profile.first_name} {profile.last_name}</h5>
                        <h5>{profile.email}</h5>
                        <h5>Phone: {profile.phone}</h5>
                    </div>
                    )}
                </div>

            </div>

        </div>

    </div>
    </>
  )
}

export default Profile