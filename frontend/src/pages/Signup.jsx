import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import axios from "axios";

function Signup() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    })
    const navigate = useNavigate();

    const handleChange = (e)=>{
        const {name, value} = e.target;
        console.log(name,value);
        const copySignupInfo = {...signupInfo};
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

    const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
        return handleError('All fields are required');
    }

    try {
        const url = `${API_URL}/auth/signup`;
        const response = await axios.post(url, signupInfo);
        const result = response.data;

        const { message, success, error } = result;
        if (success) {
            handleSuccess(message);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } else {
            const joiMessage = error?.details?.[0]?.message;
            handleError(joiMessage || message || 'Signup failed');
        }

    } catch (err) {
        // ✅ handle Axios errors correctly
        if (err.response && err.response.data) {
            const { error, message } = err.response.data;
            const joiMessage = error?.details?.[0]?.message;
            handleError(joiMessage || message || 'Signup failed');
        } else {
            handleError(err.message || 'Something went wrong');
        }
    }
};


  return (
    <div className="container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            autoFocus
            placeholder="Enter Your Name"
            value={signupInfo.name}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input 
          onChange={handleChange}
          type="email" 
          name="email" 
          placeholder="Enter Your Email" 
          value={signupInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter Your Password"
            value={signupInfo.password}
          />
        </div>
        <button type="submit">Signup</button>
        <span>
          Already have an account?
          <Link to="/login">Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Signup;
