import React from 'react'

export default function Home() {
  const handleOnLogout=()=>{
    localStorage.clear();
    window.location.reload();
  }
  return (
    <div>
      <nav className='nav'>
        <p>Hello user</p>
      </nav>
      <h1>Welcome to my website</h1>
      <button onClick={handleOnLogout}>Logout</button>
    </div>
  )
}
