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
import Documents from './pages/Documents';
import DocumentDetails from './pages/DocumentDetails';
import PreviousDocument from './pages/PreviousDocument';
import SharedDocuments from './components/SharedDocuments';
import SharedDocument from './pages/SharedDocument';
import TeamMembers from './pages/TeamMembers';
import DashboardOverview from './pages/Dashboard';
import Upload from './pages/UploadDocument';

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

        <Route path='/dash' element={<DashboardOverview/>} /> 
        <Route path='/documents' element={<Documents/>} /> 
        <Route path='/details' element={<DocumentDetails/>} /> 
        <Route path='/previous' element={<PreviousDocument/>} /> 
        <Route path='/shared' element={<SharedDocument/>} /> 
        <Route path='/upload' element={<Upload/>} /> 
        <Route path='/team' element={<TeamMembers/>} /> 
      </Routes>
     
    </div>
  );
}

export default App;