import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Landing } from './screens/Landing'
import { Game } from './screens/Game'
import { Signup } from './screens/Signup.jsx'
import { Signin } from './screens/Signin.jsx'
import { io } from 'socket.io-client';
import { useSocket } from './hooks/useSocket.js';
import { SocketProvider } from './context/SocketContext'
import { Profile } from './screens/Profile.jsx'
import { Settings } from './screens/Settings.jsx'

function App() {

  // const socket = useSocket();

  return (
    // <SocketProvider socket={socket}>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/game" element={<Game />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
      </div>
    // </SocketProvider>
  )
}

export default App
