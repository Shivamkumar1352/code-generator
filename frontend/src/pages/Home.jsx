import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

function Home() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [loggedInUser, setLoggedInUser] = useState("");
    const [home,setHome]=useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    },[]);

    const handleLogout= (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('user');
        handleSuccess('Logged Out');
        setTimeout(()=>{
            navigate('/login');
        },1000)
    }

    const fetchHome = async ()=>{
        try{
            const url = `${API_URL}/`;
            const token = localStorage.getItem('token');

        const response = await axios.get(url, {
            headers: {
                Authorization: token // ✅ attach token properly
            }
        });

        const result = response.data;
        console.log(result);
        setHome(result);

        }catch(err){
            handleError(err);
        }
    }

    useEffect(()=>{
        fetchHome()
    },[]);

  return (
    <div>
        <div className="navbar">
            <h1>{loggedInUser}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
        <div>{home.message}</div>
        <ToastContainer/>
    </div>
  )
}

export default Home