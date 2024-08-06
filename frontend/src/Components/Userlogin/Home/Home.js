import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function Home() {
  const [user,setUser]=useState({
    name:"",
    email:""
  })
  const getUser = async () => {
    try {

      const token = localStorage.getItem("token")
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/`, { headers: { Authorization: `Bearer ${token}` } })
      console.log(response)
      setUser({
        name: response.data.name,
        email: response.data.email
      })
      console.log(user)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getUser();
  }, []);

  const handleOnLogout = () => {
    localStorage.clear();
    window.location.reload();
  }
  return (
    <div>
      <nav className='nav'>
        <p>Hello {user.name}</p>
      </nav>
      <h1>Welcome to my website</h1>
      <button onClick={handleOnLogout}>Logout</button>
    </div>
  )
}