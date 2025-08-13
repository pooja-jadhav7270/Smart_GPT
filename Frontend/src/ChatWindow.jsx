import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState ,useEffect} from "react";
import {ScaleLoader} from "react-spinners";


function ChatWindow(){
    const {prompt,setPrompt,reply,setReply, currThreadId,prevChats,setPrevChats,setNewChat} = useContext(MyContext);
    const [loading,setLoading]= useState(false);
    const [isOpen, setIsOpen] = useState(false); //set default false value

    const getReply = async () => {
        setLoading(true);
        setNewChat(false); 

        console.log("message",prompt, "threadId",currThreadId);
        const options = {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                message: prompt,
                threadId:currThreadId
            })
        };

        try{
            const response = await fetch("http://localhost:8080/api/chat",options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        }catch(err){
            console.log(err);
        }
         setLoading(false);
    }

    //Append new chat to prevChats
    useEffect(() =>{
        if(prompt && reply){
            setPrevChats(prevChats => (
                [...prevChats,{
                    role:"user",
                    content:prompt
                },{
                    role:"assistant",
                    content:reply
                }]
            ));
        }

        setPrompt("");
    },[reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }


    return(
        <div className="chatWindow">
           <div className="navbar">
            <span >SmartGPT<i className="fa-solid fa-chevron-down"></i></span>
            <div className="userIconDiv" onClick={handleProfileClick}>
            <span className="userIcon"><i className="fa-solid fa-user"></i></span>
            </div>
           </div>
           {
            isOpen &&
            <div className="dropDown">
                <div className="dropDwnItem" ><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan</div>
                <div className="dropDwnItem"><i class="fa-solid fa-gear"></i>Setting</div>  
                <div className="dropDwnItem"><i class="fa-solid fa-arrow-right-from-bracket"></i>Log Out</div>  
            </div>
           }
           <Chat></Chat>

           <ScaleLoader color="#fff" loading={loading}>

           </ScaleLoader>

           <div className="chatInput">
               <div className="inputBox">
                <input  placeholder="Ask anythink"  
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter"? getReply() : ''}
                >
                       
                </input>
                <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
               </div>
               <p className="info">
                    SmartGPT can make mistakes.Check important info. See Cookie Perforences.
               </p>
           </div>

        </div>
      
    )
}
 export default ChatWindow;