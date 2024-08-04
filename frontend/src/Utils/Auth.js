import React from 'react'
import { jwtDecode } from 'jwt-decode'
import { Navigate, Outlet } from 'react-router-dom'

const Auth = () => {
  return Isloggedin() ? <Outlet /> : <Navigate to="/" />
}

export default Auth;

const Isloggedin = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return false
  }
  const { exp } = jwtDecode(token)
  console.log(exp, Date.now())
  if (exp*1000 > Date.now()) {
    return true
  }
  else {
    localStorage.clear();
    return false
  }
}