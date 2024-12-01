import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface Props{
  
    sender:string,
    name:string,
    message:string
  
}


const RoomPage = ({uid, socket,name}:{uid:string, socket:WebSocket, name:string}) => {

  const params= useParams()
  const [message,setMessage]= useState("")
  const [chat,setChat] =useState<Props[]>([]);
  const [connected, setConnected]= useState(false);
  const navigate=useNavigate();


  useEffect(() => {
    socket.onmessage=(ev: any)=>{
    
      const info=JSON.parse(ev.data);
      if(info.type==='message'){
      let newObj;
      newObj={
        message:info.payload.message,
        name: info.payload.name,
        sender:"other"
      }
  
      setChat((prevChat)=>[...prevChat,newObj])


    }
    else if(info.type==='connected'){
      setConnected(true)

    }
    else if(info.type==='disconnect'){
      setConnected(false)
      setChat([])
      let data={
        type:"join",
        payload:{
          id:uid,
          name:name,
          room: params.roomId
        }
      }
      if(socket){
        socket.send(JSON.stringify(data));
      }

    }
  }
  }, [])

  const handleDisconnect=()=>{
    console.log("Hii")
    let data={
      type:"disconnect",
      payload:{
        id:uid,
        socket:socket,
    }
    }

    if(socket){
      socket.send(JSON.stringify(data));
    }
    let data2={
      type:"join",
      payload:{
        id:uid,
        room: params.roomId,
        name:name
      }
    }
    if(socket){
      socket.send(JSON.stringify(data2));
    }
    setConnected(false)
    setChat([]);

  }

  const handleback=()=>{
    // if(!connected){
    //    navigate("/");
  // }
    // else{
      let data={
        type:"disconnect",
        payload:{
          id:uid,
          socket:socket,
      }
      }
      if(socket){
        socket.send(JSON.stringify(data));
      }
      navigate("/")

    // }
  }
  

  const handleSubmit =(event:any)=>{

    event.preventDefault();
    // console.log(message)
    let data={
      type:"message",
      payload:{
        id:uid,
        message:message,
        name:name
      }
    }
    let newObj;
    newObj={
      message:message,
      name:name,
      sender:"me"
    }
    
    setChat((prevChat)=>[...prevChat,newObj])
    if(socket){
      socket.send(JSON.stringify(data));
    }

    setMessage("")
  }


  return (
    <div className="bg-[#181818] h-screen text-white flex items-center justify-center">
    <div className="flex flex-col items-center  h-[90vh] rounded-xl w-[80vw] relative">

      <form onSubmit={handleSubmit} className="absolute bottom-2 flex gap-2 -mt-4 lg:mt-0">
        <input type="text" id="message" value={message} onChange={e=>(setMessage(e.target.value ))} className="w-[60vw] p-2 rounded-xl text-black" placeholder="Enter Your Message" />
        <button type="submit" className="border p-2 rounded-xl cursor-pointer hover:font-semibold">Send</button>
        
      </form>

      <div className="mt-10 flex gap-2 items-center justify-center">
      <svg className="bg-white p-1 rounded-full cursor-pointer" onClick={handleback} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#0e0e0e" fill="none">
    <path d="M3.99982 11.9998L19.9998 11.9998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.99963 17C8.99963 17 3.99968 13.3176 3.99966 12C3.99965 10.6824 8.99966 7 8.99966 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
      <h1 className=" text-2xl">{name} is in {params.roomId} room</h1>

      </div>
      {connected ?
      <div className=" m-2 flex items-center justify-center gap-5">
      <h1 className="lg:text-xl">You are connected now :)</h1>
      <button onClick={handleDisconnect} className="border p-2 bg-white text-black rounded-xl cursor-pointer hover:font-semibold">Disconnect</button>
      </div> :
      <h1 className="mt-7 text-xl">Waiting for a person to join room</h1> 
      }


<div className="h-[67vh] lg:h-[64vh] w-[70vw] border rounded-xl overflow-y-auto scrollbar-hide relative p-4 mt-5 lg:mt-0">
  <div className="flex flex-col gap-4">
    {chat && chat.length > 0 ? (
      chat.map((value, key) => (
        <div
          key={key}
          className={`flex items-start gap-2 ${
            value.sender === "me" ? "justify-end text-white" : "justify-start"
          } p-3 rounded-lg`}
        >
        
          <div>{value.message}</div>
        </div>
      ))
    ) : (
      <div className="text-center"></div>
    )}
  </div>
</div>
      
      
    </div>
    </div>
  )
}

export default RoomPage
