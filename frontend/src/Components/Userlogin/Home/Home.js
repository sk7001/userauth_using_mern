import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: ""
  })
  const getUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({
        name: response.data.name,
        email: response.data.email
      });
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleOnLogout = () => {
    localStorage.clear();
    navigate('/')

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
