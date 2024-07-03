import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Landing } from './screens/Landing'
import { Game } from './screens/Game'
import { io } from 'socket.io-client';
import { useSocket } from './hooks/useSocket.js';
import { SocketProvider } from './context/SocketContext'

function App() {

  const socket = useSocket();

  return (
    <SocketProvider socket={socket}>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </BrowserRouter>
      </div>
    </SocketProvider>
  )
}

export default App
