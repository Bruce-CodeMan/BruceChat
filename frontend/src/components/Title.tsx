import { useState } from "react";
import axios from "axios";


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
        <div>
            <button onClick={resetConversation} className="bg-gray-500 p-5">Reset</button>
        </div>
    )
}

export default Title;