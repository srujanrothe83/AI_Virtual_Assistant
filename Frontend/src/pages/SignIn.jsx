import React, { useContext, useState } from 'react'
import { Eye , EyeOff} from 'lucide-react';
import { userDataContext } from '../components/UserContext'
import GoogleLoginButton from '../components/Google';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';



function SignIn() {

  const {serverURL, user,setUser} = useContext(userDataContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [eye, setEye] = useState(true)
  const [err, setErr] = useState("")
  const navigate = useNavigate()


  const handleSignin = async (e) => {
    e.preventDefault()
    setErr("")

    try {
        const result = await axios.post(
            `${serverURL}/api/auth/login`,
            { email, password },
            { withCredentials: true }
        )

        console.log("Login response:", result.data)

        setUser(result.data.existingUser)

        navigate("/", { replace: true })

    } catch (error) {
        console.log("Login error:", error.response?.data)
        setErr(error.response?.data?.message || "Login failed")
    }
}
  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-t from-gray-800 to-white flex justify-center items-center'>
      <div className='md:h-120 md:w-180 h-125 w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center'>
      <h1 className='md:text-3xl text-[19px] font-bold text-gray-800'>Welcome to <span className='text-blue-700'>Virtual Assistant</span></h1>

      <form onSubmit={handleSignin} className="flex flex-col gap-5 justify-center items-center w-full max-w-md h-full p-8 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl">

 

  <input
    type="email" onChange={(e)=>{setEmail(e.target.value)}} value={email}
    placeholder="spongbob@gmail.com" className="w-full px-4 py-3 rounded-xl bg-white/40 border border-white/50 text-gray-800 placeholder-gray-600 outline-none focus:ring-2 focus:ring-gray-400 transition-all"
  />

  <div className='w-full h-fit relative'>
    <input onChange={(e)=>{setPassword(e.target.value)}} value={password}
    type={eye ? "password" : "text"} 
    placeholder="password123" className="w-full px-4 py-3 rounded-xl bg-white/40 border border-white/50 text-gray-800 placeholder-gray-600 outline-none focus:ring-2 focus:ring-gray-400 transition-all"
  />
  {eye ? <EyeOff onClick={()=>setEye(false)} className='absolute right-3 top-4 text-gray-900 cursor-pointer h-5'/> : <Eye onClick={()=>setEye(true)}  className='absolute right-3 top-4 text-gray-900 cursor-pointer h-5'/>}
  </div>
  {err.length > 0 && <p className='text-red-600'>*{err}</p>}
  <button
    type="submit"
    className="w-full py-3 mt-2 rounded-xl
    bg-gradient-to-r from-gray-800 to-gray-600
    text-white font-semibold
    shadow-lg hover:scale-[1.02]
    active:scale-95 transition-all duration-300"
  >
    Sign In
  </button>
  <GoogleLoginButton />
    <p className="text-sm ">Create new account? <span className="text-blue-900 cursor-pointer hover:text-blue-600" onClick={()=>navigate("/signup")}>Signup</span></p>
</form>

      </div>
    </div>
  )
}

export default SignIn