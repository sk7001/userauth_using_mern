import { Link } from "react-router-dom";
import "./Register.css"
import { useState } from "react";
import { emailRegex, passwordRegex } from "../../Utils/Regex";
import toast from "react-hot-toast";
import axios from "axios";


function Register() {

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
    console.log(userDetails)
  }

  const handleonclick=async()=> {
    if(!userDetails.username){
      toast.error("Username is required");
      return;
    }

    if (!emailRegex.test(userDetails.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!passwordRegex.test(userDetails.password)) {
      toast.error("Password must be atleast 8 characters and must include at least one special character and one number.");
      return;
    }

    try{
      const response= await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/register`,userDetails);
      console.log(response);
    }catch(error){
      console.log(error)
    }
  }

  function handleshow(){
    setshow(!show)
  }


  return (
    <div className="Container">
      <div className="FormContainer">
        <h2>Signup</h2>
        <div className="InputContainer">
          <input value={userDetails.username} name="username" type="text" onChange={handleonchange} placeholder="User Name" />
          <input value={userDetails.email} name="email" type="email" onChange={handleonchange} placeholder="E-Mail" />
          <div className="PasswordContainer">
            <input value={userDetails.password} name="password" type={show? "text" : "Password"} onChange={handleonchange} placeholder="Password" />
            <button onClick={handleshow}>{show? "HIDE" : "SHOW"}</button>
          </div>
          <button onClick={handleonclick}>Signup</button>
        </div>
        <Link to="/">Already have an account? Login</Link>
      </div>
    </div>
  );
}

export default Register;