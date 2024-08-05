import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { emailRegex, passwordRegex } from "../../../Utils/Regex";
import toast from "react-hot-toast";
import axios from "axios";


function ResendVerification() {
  const [userDetails, setuserDetails] = useState({
    email: "",
    password: "",
    isResendRequest:true
  })

  const [show, setshow] = useState(false)

  function handleonchange(event) {
    const { name, value } = event.target;
    setuserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    console.log(userDetails)
  }

  const navigate = useNavigate();

  const handleonclick = async () => {
    if (!emailRegex.test(userDetails.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!passwordRegex.test(userDetails.password)) {
      toast.error("Password must be atleast 8 characters and must include at least one special character and one number.");
      return;
    }

    try {
      toast.loading("Sending verification mail")
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/resendVerification`, userDetails);
      console.log(response.data);
      toast.dismiss();
      toast.success(response.data.message)
      navigate("/")
    } catch (error) {
      console.log(error)
      toast.dismiss();
      toast.error(error.response.data.message)
    }
  }

  function handleshow() {
    setshow(!show)
  }


  return (
    <div className="Container">
      <div className="FormContainer">
        <h2>Resend Verification Email</h2>
        <div className="InputContainer">
          <input value={userDetails.email} name="email" type="text" onChange={handleonchange} placeholder="E-Mail" autocomplete="off" />
          <div className="PasswordContainer">
            <input value={userDetails.password} name="password" type={show ? "text" : "Password"} onChange={handleonchange} placeholder="Password" autocomplete="off" />
            <button onClick={handleshow}>{show ? "HIDE" : "SHOW"}</button>
          </div>
          <button onClick={handleonclick}>Resend</button>
        </div>
        <Link to="/">Already have an account? Login</Link>
        <Link to="/register">Don't have an account? Register</Link>
      </div>
    </div>
  );
}

export default ResendVerification;