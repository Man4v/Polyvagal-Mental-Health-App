import React from 'react'
import '../App.css';

function Navbar() {
  return (
    <div className='navbar'>
      <div className='logo'>
        Caesura
      </div>
      <ul className='navbar-items'>
        <li><a href="/">Home</a></li>
        <li><a href="chatbot">Chatbot</a></li>
        <li><a href="about">About</a></li>
        <li><a href="login">Login</a></li>
      </ul>
    </div>
  )
}

export default Navbar
