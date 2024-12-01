import { useState } from "react"
import {  useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';





interface Props{
  
  setSocket :React.Dispatch<React.SetStateAction<WebSocket | null>>,
  setUid :React.Dispatch<React.SetStateAction<string>>,
  setName :React.Dispatch<React.SetStateAction<string>>,
  name:string
}


const LandingPage = ({setSocket, setUid, setName ,name}:Props) => {

    
   const navigate= useNavigate();
    
    // const [name, setName]= useState("");
    const [room,setRoom]= useState("")
    

    const handleSubmit =()=>{

        let ws:WebSocket= new WebSocket(`${import.meta.env.VITE_BACKEND_URL}?user-agent=CustomWSClient`)
        
        
        setSocket(ws);
        const id= uuidv4()
        setUid(id);
      
        let data ={
            type:"join",
            payload:{
              name:name,
              room:room,
              id:id
            }
        } 
        ws.onopen =()=>{
        ws.send(JSON.stringify(data));
        }
        navigate(`/room/${room}`);
        
    }
  return (
    <>
    
    <div className="bg-[#181818] h-screen flex  items-center justify-center">
      <div className="p-2 h-[50vh] w-[80vw] md:h-[55vh] md:w-[30vw] border border-white rounded-xl text-white flex flex-col gap-5 items-center">

        <h1 className="p-4 font-bold text-white text-5xl">Chat App</h1>
        <p className="pl-4 ">Place Where you won't get bored :)</p>
         
        <div className="mt-5 text-center flex gap-3 items-center justify-center">
        <label htmlFor="name">Name :</label>
        <input type="text" id="name" value={name} onChange={e=>{setName(e.target.value)}} className="rounded-xl p-2 text-black" placeholder="Enter your name" />
        </div>
        <div className="text-center flex gap-3 items-center justify-center">
        <label htmlFor="room">Room :</label>
        <input type="text" id="room" value={room} onChange={e=>{setRoom(e.target.value)}} className="rounded-xl p-2 text-black" placeholder="Enter room" />
        
        </div>
        <button className="text-black bg-white w-20 p-2 font-semibold rounded-xl cursor-pointer" onClick={handleSubmit} >Join</button>

      </div>
    </div>
    </>
  )
}

export default LandingPage
