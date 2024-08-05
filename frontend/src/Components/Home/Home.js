import React from 'react'

export default function Home() {
  const handleOnClick=()=>{
    localStorage.clear();
    window.location.reload();
  }
  return (
    <div>
      <h1>Welcome to my website</h1>
      <button onClick={handleOnClick}>Logout</button>
    </div>
  )
}
