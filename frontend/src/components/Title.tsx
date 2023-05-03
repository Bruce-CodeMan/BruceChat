import { useState } from "react";
import axios from "axios";
import Resfresh from "../icons/Refesh";


interface IProps {
    setMessages: any;
}

function Title({ setMessages }: IProps) {

    const [ isResetting, setIsResetting ] = useState(false);

    // Reset the Conversation
    const resetConversation = async () => {
        setIsResetting(true);

        await axios.get("http://localhost:8000/reset-messages")
                    .then((res)=>{
                        if(res.status === 200) {
                            alert("Success")
                            setMessages([])
                        }else{
                            console.error("There was an error with the API request to backend.")
                        }
                    })
                    .catch((err)=>{
                        console.error(err.messages)
                    })


        setIsResetting(false);

    }

    return (
        <div className="flex justify-between items-center w-full p-4 bg-pink-600 text-white">
            <div className="italic">Bruce Chat</div>
            <button 
                onClick={resetConversation} 
                className={"transition-all duration-300 text-white-300 hover:text-yellow-300 " + 
                (isResetting && "animate-pulse")}
            >
                { Resfresh }
            </button>
        </div>
    )
}

export default Title;