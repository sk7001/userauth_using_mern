import { Link } from "react-router-dom";
import "./Login.css"
import { useState } from "react";
import { emailRegex, passwordRegex } from "../../Utils/Regex";
import toast from "react-hot-toast";

function Login() {

  const [userDetails, setuserDetails] = useState({
    username: "",
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
    //console.log(userDetails)
  }

  function handleonclick() {

    if (!emailRegex.test(userDetails.email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (!passwordRegex.test(userDetails.password)) {
      toast.error("Please check your password again.");
      return;
    }

    toast.success("You have loggedin Successfully")
  }

  function handleshow(){
    setshow(!show)
  }


  return (
    <div className="Container">
      <div className="FormContainer">
        <h2>Login</h2>
        <div className="social">
          <div>
            FB
          </div>
          <div>
            GOOGLE
          </div>
        </div>
        <div className="InputContainer">
          <input value={userDetails.email} name="email" type="email" onChange={handleonchange} placeholder="E-Mail" />
          <div className="PasswordContainer">
            <input value={userDetails.password} name="password" type={show? "text" : "Password"} onChange={handleonchange} placeholder="Password" />
            <button onClick={handleshow}>{show? "HIDE" : "SHOW"}</button>
          </div>
          <button onClick={handleonclick}>Signup</button>
        </div>
        <Link to="/forgetpass">Forgot Password?</Link>
        <Link to="/register">Don't have an account? Register</Link>
      </div>
    </div>
  );
}

export default Login;