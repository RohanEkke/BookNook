import axios from 'axios'
import {useEffect} from 'react'
import axiosInstance from '../../axiosInstance'

const Profile = () => {
   
    useEffect(() => {
        const fetchProtectedData = async () => {
            try{
                const response = await axiosInstance.get('/protected-view/')
                // console.log("successs:", response.data)

            }catch(error){
                console.error("Error fetching data:", error)
            }
        }
        fetchProtectedData();
    }, [])
  return (
    <div>Profile</div>
  )
}

export default Profile