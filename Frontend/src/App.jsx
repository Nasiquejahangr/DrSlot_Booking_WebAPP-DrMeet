import React from 'react'
import Nav from './components/Nav'
import Logoandprofile from './components/Logoandprofile'
import Landing from './pages/users/Landing'
import { Routes, Route, useLocation } from 'react-router-dom';
import Profile from './pages/users/profile';
import SearchDoct from './pages/users/SearchDoct';
import Appointment from './pages/users/Appointment';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/auth/User/Login';
import Register from './pages/auth/User/Register';
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from './pages/Doctor/Dashboard';
import DoctorRegistration from './pages/auth/Doctor/DoctorRegistration';
import Doctorprofile from './pages/Doctor/Doctorprofile';
import Vieslot from './pages/users/ViewSlot';
import ManageSlots from './pages/Doctor/MagangeSlot';

function App() {



  const location = useLocation();

  // const hideLayout = location.pathname === "/login" || location.pathname === "/register";
  const authRoutes = ["/login", "/register", "/DoctorRegister"];
  const hideLayout = authRoutes.includes(location.pathname);

  // Show Logoandprofile only on landing page
  const showLogoAndProfile = location.pathname === "/" && !hideLayout;




  const pageFade = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -15
    },
    transition: {
      type: "tween",
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]   // material design smooth easing
    }
  };


  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Conditionally render Logoandprofile and Nav based on the current route */}
      {showLogoAndProfile && <Logoandprofile />}
      {!hideLayout && <Nav />}

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={
            <motion.div {...pageFade}>
              <PrivateRoute>
                <Landing />
              </PrivateRoute>
            </motion.div>
          } />
          <Route path='/profile' element={
            <motion.div {...pageFade}>
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            </motion.div>
          } />
          <Route path='/search' element={
            <motion.div {...pageFade}>
              <SearchDoct />
            </motion.div>
          } />
          <Route path='/appointment' element={
            <motion.div {...pageFade}>
              <Appointment />
            </motion.div>
          } />

          {/* // Auth Routes */}
          <Route path='/login' element={
            <motion.div {...pageFade}>
              <Login />
            </motion.div>
          } />
          <Route path='/register' element={
            <motion.div {...pageFade}>
              <Register />
            </motion.div>
          } />

          <Route path='/Dashboard' element={
            <motion.div {...pageFade}>
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            </motion.div>
          } />
          <Route path='/DoctorRegister' element={
            <motion.div {...pageFade}>
              <DoctorRegistration />
            </motion.div>
          } />
          <Route path='/DoctorProfile' element={
            <motion.div {...pageFade}>
              <Doctorprofile />
            </motion.div>
          } />
          <Route path='/doctor/:id' element={
            <motion.div {...pageFade}>
              <Vieslot />
            </motion.div>
          } />
          <Route path='/ManageSlot' element={
            <motion.div {...pageFade}>
              <ManageSlots />
            </motion.div>
          } />
        </Routes>

      </AnimatePresence>
    </>
  )
}

export default App
