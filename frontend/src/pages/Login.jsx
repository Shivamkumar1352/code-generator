import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import axios from "axios";

function Login() {
  const API_URL = import.meta.env.VITE_API_URL;
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate();

    const handleChange = (e)=>{
        const {name, value} = e.target;
        console.log(name,value);
        const copyLoginInfo = {...loginInfo};
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
    e.preventDefault();
    const {email, password } = loginInfo;

    if (!email || !password) {
        return handleError('All fields are required');
    }

    try {
        const url = `${API_URL}/auth/login`;
        const response = await axios.post(url, loginInfo);
        const result = response.data;

        const { message, success, jwtToken, name, error } = result;
        if (success) {
            handleSuccess(message);
            localStorage.setItem('token', jwtToken);
            localStorage.setItem('loggedInUser', name);
            setTimeout(() => {
                navigate('/home');
            }, 1000);
        } else {
            const joiMessage = error?.details?.[0]?.message;
            handleError(joiMessage || message || 'Login failed');
        }

    } catch (err) {
        // ✅ handle Axios errors correctly
        if (err.response && err.response.data) {
            const { error, message } = err.response.data;
            const joiMessage = error?.details?.[0]?.message;
            handleError(joiMessage || message || 'Login failed');
        } else {
            handleError(err.message || 'Something went wrong');
        }
    }
};


  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input 
          onChange={handleChange}
          type="email" 
          name="email" 
          placeholder="Enter Your Email" 
          value={loginInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter Your Password"
            value={loginInfo.password}
          />
        </div>
        <button type="submit">Login</button>
        <span>
          Don't have an account?
          <Link to="/signup">Signup</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login