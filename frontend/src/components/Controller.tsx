import { useState } from "react";
import Title from "./Title";
import RecordMessages from "./RecordMessages";
import axios from "axios";

function Controller() {

    const [ isLoading, setIsLoading ] = useState(false);
    const [ messages, setMessages ] = useState<any[]>([]);

    const createBlobUrl = (data: any) => {
        const blob = new Blob([data], { type: "audio/mpeg" })
        const url = window.URL.createObjectURL(blob);
        return url;
    };

    const handleStop = async(blobUrl: string) => {
        setIsLoading(true);
        const myMessages = { sender: "me", blobUrl };
        const messageArr = [...messages, myMessages];

        // Convert blob url to blob object
        fetch(blobUrl)
            .then((res) => res.blob())
            .then(async (blob) => {

                // Construct audio to send file
                const formData = new FormData();
                formData.append("file", blob, "myFile.wav");

                // Send formData to API endpoint
                await axios.post(
                    "http://localhost:8000/post-audio", 
                    formData, 
                    {
                        headers: {
                            "Content-Type": "audio/mpeg"
                        },
                        responseType: "arraybuffer"
                    }).then((res: any) => {
                        const blob = res.data;
                        const audio = new Audio();
                        audio.src = createBlobUrl(blob);

                        // Append to audio
                        const bruceMessage = { sender: "rachel", blobUrl: audio.src };
                        messageArr.push(bruceMessage)
                        setMessages(messageArr);

                        // Play Audio
                        setIsLoading(false);
                        audio.play();
                    }).catch((err) => {
                        console.error(err.messages)
                        setIsLoading(false);
                    })
            })
    };

    return (
        <div className="h-screen overflow-y-auto">
            <Title setMessages={setMessages}/>
            <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
                
                <div className="mt-5 px-5">
                    {messages.map((audio, index) => {
                        return (
                        <div 
                            key={index + audio.sender} 
                            className={
                                "flex flex-col " + 
                                (audio.sender != "rachel" && "flex items-end")}
                            >
                                {/* Sender */}
                                <div className="mt-4">
                                    <p className={
                                        audio.sender=="rachel" 
                                        ? "text-left ml-2 italic text-green-500"
                                        : "mr-2 italic text-blue-500"}
                                    >
                                        {audio.sender}
                                    </p>

                                    {/* Audio Message */}
                                    <audio 
                                        src={audio.blobUrl}
                                        className="appearance-none"
                                        controls
                                    ></audio>
                                </div>
                            </div>
                        )
                    })}
                    { messages.length === 0 && !isLoading && (
                        <div className="text-center font-light italic mt-10">Please Send Rachel a message...</div>
                    )}

                    { isLoading && (
                        <div className="text-center font-light italic mt-10 animate-pulse">Please Give me a few seconds...</div>
                    ) }

                </div>

                <div className="fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r from-sky-500 to-green-500">
                    <div className="flex justify-center items-center w-full">
                        <RecordMessages handleStop={handleStop}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Controller;