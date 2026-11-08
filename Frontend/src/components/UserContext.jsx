import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'


export const userDataContext = createContext()
function UserContext({children}) {
    const [user, setUser] = useState(null)
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [loading, setLoading] = useState(true)


    const serverURL = "http://localhost:8000"
    
    const CurrentUser = async ()=>{
      try {
        const result = await axios.get(`${serverURL}/api/user/getuser`,{

          withCredentials:true
        })
        setUser(result.data.user)
        console.log(result.data.user)
      } catch (error) {
        console.log(error)
      }finally {
      setLoading(false)
    }
    }
    useEffect(()=>{
        CurrentUser();
    
    },[])

    const getGeminiResponse = async (prompt)=>{
      const result = await axios.post(`${serverURL}/api/user/asktoassistant`,{prompt},{withCredentials:true})
      return result.data
    }

    
    const value = {
        serverURL,user, setUser , frontendImage , setFrontendImage , backendImage , setBackendImage , selectedImage , setSelectedImage , loading, setLoading , getGeminiResponse
    }
  return (
    <userDataContext.Provider value={value} >
    {children}
    </userDataContext.Provider>
  )
}

export default UserContext