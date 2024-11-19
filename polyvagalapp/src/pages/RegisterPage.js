import React, { useState } from 'react';
import '../App.css';
import Navbar from '../components/Navbar';
function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confpassword, setConfpassword] = useState('');

   const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Logging in with:', { name, email, password,confpassword });
   };
   return (
    <div>
        <Navbar></Navbar>
      <div className="container">
         <h2>Register</h2>
         <form onSubmit={handleSubmit} className="formlogin">
            <label className="label">Name:</label>
               <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  required
                />
            <label className="label">Email:</label>
               <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  required
               />
            <label className="label">Password:</label>
               <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
               />
            <label className="label">Confirm Password:</label>
               <input
                  type="password"
                  value={confpassword}
                  onChange={(e) => setConfpassword(e.target.value)}
                  className="input"
                  required
               />
            <button type="submit" className="button">Signup</button>
         </form>
         <div>
            Have an Account?
            <a className="changebutt" href="login">Login</a>
         </div>
    </div>
</div>
  )
}

export default Register;
