import React, { useState } from 'react';
import '../App.css';
import Navbar from '../components/Navbar';

function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Logging in with:', { email, password });
   };

   return (
      <div>
      <Navbar></Navbar>
      <div className="container">
         <h2>Login</h2>
         <form onSubmit={handleSubmit} className="formlogin">
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
            <button type="submit" className="button">Login</button>
         </form>
         <div>
            Create Account
            <a className="changebutt" href="register">Signup</a>
         </div>
      </div>
   </div>
   );
}

export default Login;
