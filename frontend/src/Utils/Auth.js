import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function Auth() {
  const [Isloggedin, setIsloggedin] = useState(false)
  return Isloggedin ? <Outlet /> : <Navigate to="/" />
}