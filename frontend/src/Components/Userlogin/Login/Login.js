import { Link, useNavigate } from "react-router-dom";
import "./Login.css"
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useGoogleLogin } from "@react-oauth/google";
import { emailRegex, passwordRegex } from "../../../Utils/Regex";
function Login() {
  const navigate = useNavigate()

  const [userDetails, setuserDetails] = useState({
    email: "",
    password: "",
  })
  const [show, setshow] = useState(false)

  function handleonchange(event) {
    const { name, value } = event.target;
    setuserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  }

  const handleonclick = async () => {
    if (!emailRegex.test(userDetails.email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (!passwordRegex.test(userDetails.password)) {
      toast.error("Please check your password again.");
      return;
    }

    try {
      toast.loading("Logging in")
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/login`, userDetails)
      localStorage.setItem("token", response.data.token);
      navigate('/home')
      toast.dismiss()
      toast.success(response.data.message);
    } catch (error) {
      toast.dismiss()
      toast.error(error.response.data.message);
    }

  }

  function handleshow() {
    setshow(!show)
  }
  const handleContinueWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      const userData = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { 'Authorization': `Bearer ${response.access_token}` }
      });
      console.log(userData);
      const newUser = {
        username: userData.data.name,
        email: userData.data.email,
        autoGenerated: true
      }
      console.log(newUser)
      try {
        toast.loading("Logging in through google")
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/login`, newUser)
        localStorage.setItem("token", response.data.token);
        navigate('/home')
        toast.dismiss()
        toast.success(response.data.message);
      } catch (error) {
        toast.dismiss()
        toast.error(error.response.data.message);
      }

    },
    onError: (error) => {
      console.log(error)
    }
  })


  return (
    <div className="Container">
      <div className="FormContainer">
        <h2>Login</h2>
        <div className="social">
          <div>
            <GoogleLoginButton onClick={handleContinueWithGoogle}></GoogleLoginButton>
          </div>
        </div>
        <div className="InputContainer">
          <input value={userDetails.email} name="email" type="email" onChange={handleonchange} placeholder="E-Mail" />
          <div className="PasswordContainer">
            <input value={userDetails.password} name="password" type={show ? "text" : "Password"} onChange={handleonchange} placeholder="Password" />
            <button onClick={handleshow}>{show ? "HIDE" : "SHOW"}</button>
          </div>
          <button onClick={handleonclick}>Login</button>
        </div>
        <Link to="/forgetpass">Forgot Password? Reset</Link>
        <Link to="/register">Don't have an account? Register</Link>
        <Link to="/resendverificationlink">Lost verification link? Resend again</Link>
      </div>
    </div>
  );
}

export default Login;