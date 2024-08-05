import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'
import { emailRegex, passwordRegex } from '../../../Utils/Regex';
import axios from 'axios';


export default function Forgetpass() {
  const [step, setStep] = useState(0);

  return (
    <div>
      {step === 0 && <EmailComponent setStep={setStep} />}
      {step === 1 && <OTPComponent setStep={setStep} />}
      {step === 2 && <PasswordComponent />}
    </div>
  )
}


const EmailComponent = ({ setStep }) => {
  const [email, setemail] = useState("")
  const handleonchange = (e) => {
    setemail(e.target.value)
  }
  const handleonclick = async () => {
    if (!email) {
      toast.error("Email can't be empty.")
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    try {
      toast.loading(`Sending mail to ${email}`)
      console.log(email);
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/resetpassword`, { email })
      localStorage.setItem("email", email)
      toast.dismiss()
      toast.success(response.data.message)
      if (response) {
        setStep(1)
      }
    } catch (error) {
      console.log(error)
      toast.dismiss()
      toast.error(error.response.data.message)
    }
  }
  return (
    <div className="Container">
      <div className="FormContainer">
        <h2>Forgot Password</h2>
        <div className="InputContainer">
          <input value={email} name="email" type="email" onChange={handleonchange} placeholder="E-Mail" />
          <button onClick={handleonclick}>Send OTP</button>
        </div>
        <Link to="/">Remembered your password ? Login</Link>
        <Link to="/register">Don't have an account? Register</Link>
      </div>
    </div>
  )
}

const OTPComponent = ({ setStep }) => {
  const [otp, setOtp] = useState("")
  const handleonchange = (e) => {
    setOtp(e.target.value)
  }
  const handleonclick = async () => {
    if (!otp) {
      toast.error("OTP can't be empty.")
    }
    try {
      toast.loading(`Verifying OTP`)
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/verifyPasswordOTP`, { otp })
      toast.success(response.data.message)
      toast.dismiss()
      console.log(otp)
      if (response) {
        setStep(2)
      }
    } catch (error) {
      toast.dismiss()
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  const handleonResend = async () => {
    try {
      toast.loading(`Resending OTP`)
      const email = localStorage.getItem("email")
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/resetpassword`, { email, isResendOTP: true })
      toast.dismiss()
      toast.success(response.data.message)
    } catch (error) {
      console.log(error)
      toast.dismiss()
      toast.error(error.response.data.message)
    }
  }
  return (
    <div className="Container">
      <div className="FormContainer">
        <h2>OTP</h2>
        <div className="InputContainer">
          <input value={otp} name="otp" type="text" onChange={handleonchange} placeholder="OTP" />
          <button onClick={handleonclick}>Verify OTP</button>
          <button onClick={handleonResend}>Resend OTP</button>
        </div>
        <Link to="/">Remembered your password ? Login</Link>
        <Link to="/register">Don't have an account? Register</Link>
      </div>
    </div>
  )
}

const PasswordComponent = () => {
  const [newpassword, setnewPassword] = useState({
    password: "",
    confirmPassword: "",
  })
  const navigate = useNavigate();
  const [showcp, setshowcp] = useState(false)
  const [showp, setshowp] = useState(false)
  const handleonchange = (e) => {
    setnewPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleonclick = async () => {
    if (!passwordRegex.test(newpassword.password)) {
      toast.error("Passwords should contain atleast 8 characters with atleast one uppercase, one digit and one symbol");
      return;
    }
    if (newpassword.password !== newpassword.confirmPassword) {
      return toast.error("Passwords do not match")
    }
    try {
      toast.loading(`Resetting password`)
      const email = localStorage.getItem("email")
      console.log(email)
      const sendpassword = {
        email: email,
        password: newpassword.password
      }
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/updatepassword`, sendpassword)
      if (response) {
        navigate("/")
      }
      toast.dismiss()
      toast.success(response.data.message)
      console.log(response)
      localStorage.clear()
    } catch (error) {
      console.log(error)
      toast.dismiss()
      toast.error(error.response.data.message)
    }
  }
  function handleshowp() {
    setshowp(!showp)
  }
  function handleshowcp() {
    setshowcp(!showcp)
  }
  return (
    <div className="Container">
      <div className="FormContainer">
        <h2>Please enter your new password.</h2>
        <div className="InputContainer">
          <div className="PasswordContainer">
            <input value={newpassword.password} name="password" type={showp ? "text" : "Password"} onChange={handleonchange} placeholder="Password" />
            <button onClick={handleshowp}>{showp ? "HIDE" : "SHOW"}</button>
          </div>
          <div className="PasswordContainer">
            <input value={newpassword.confirmPassword} name="confirmPassword" type={showcp ? "text" : "Password"} onChange={handleonchange} placeholder="Confirm Password" />
            <button onClick={handleshowcp}>{showcp ? "HIDE" : "SHOW"}</button>
          </div>
          <button onClick={handleonclick}>Reset Password</button>
        </div>
        <Link to="/">Remembered your password ? Login</Link>
        <Link to="/register">Don't have an account? Register</Link>
      </div>
    </div>
  )
}