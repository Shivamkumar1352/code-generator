import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import { useState } from 'react'
import Refresh from './Refresh'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const PrivateRoute = ({element}) => {
    return isAuthenticated ? element : <Navigate to="/login"/>
  }

  return (
    <div className="App">
      <Refresh setIsAuthenticated={setIsAuthenticated}/>
      <Routes>
        <Route path='/'element={<Navigate to="/login"/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/home' element={<PrivateRoute element={<Home/>}/>}/>
      </Routes>
    </div>
  )
}

export default App
