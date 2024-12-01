
import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './components/LandingPage'
import { useState } from 'react'
import RoomPage from './components/RoomPage'


function App() {
 
  const [socket,setSocket]= useState<WebSocket | null>(null)
  const [uid,setUid]= useState("")
  const [name,setName]= useState("")
  return (
   <>
    <Routes>
      <Route path='/' element={<LandingPage  setSocket={setSocket} setUid={setUid} setName={setName} name={name} />}   />
      <Route path='/room/:roomId' element={<RoomPage uid={uid} socket={socket!} name={name} />}   />
    </Routes>
     
   </>
  )
}

export default App
