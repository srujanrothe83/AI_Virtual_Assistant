import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "./UserContext";



const GoogleLoginButton = () => {
  const navigate = useNavigate()
const {serverURL , setUser} = useContext(userDataContext)
  const handleSuccess = async (response) => {
    try {
      const result = await axios.post(
        `${serverURL}/api/auth/google`,
        {
          credential: response.credential,
        },
        {
          withCredentials: true,
        },
      );

      setUser(result.data.user)
      navigate("/")
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Google Login Failed")}
    />
  );
};

export default GoogleLoginButton;
