import { Navigate, Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Login from './pages/AdminAuth';
import Signup from './pages/Signup';
import Home from './pages/Home';
// import { use, useState } from 'react'; 
import RefrshHandler from './RefreshHandler';
import { useAuth } from '../utils/useAuth';
import { useEffect } from 'react';
import LoginWorker from './pages/EmployeeAuth';
import SignupWorker from './pages/SignupWorker';
import Dashboard from './pages/AdminDashboard';
import Header from './components/Header';

function App() {
   const {authUser,checkAuth,isCheckingAuth}=useAuth();
   useEffect(()=>{
      checkAuth();
   },[checkAuth]);
   console.log({authUser})
   if(isCheckingAuth && !authUser){
      return <div>Loading...</div>
   }
  return (
    <div className="App">
      
      
      <Routes>
        <Route path='/' element={<Navigate to="/home" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/loginWorker' element={<LoginWorker />} />
        <Route path='/signupWorker' element={<SignupWorker />} />
        <Route path='/dashboard' element={< Dashboard/>} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home/>} /> 
      </Routes>
     
    </div>
  );
}

export default App;