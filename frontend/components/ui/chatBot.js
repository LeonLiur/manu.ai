
import { useState } from "react";
import ButtonIcon from "./ButtonIcon";
//import axios from "axios";

export default function ChatBot() {

    const [inputValue, setInputValue] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setChatLog((prevChatLog) => [...prevChatLog, {type: "user", message: inputValue}]);
        sendMessage(inputValue);
        setInputValue('');
    }

    const sendMessage = (message) => {
        const url = "https://your-backend-endpoint.com/api";
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_API_KEY
        }
        const data = {
            messages: [{role: "user", content: message}]
        }

        setIsLoading(true);
        
        setChatLog((prevChatLog) => [...prevChatLog, {type: "bot", message: "Placeholder message"}]);

        // axios.post(url, data, {headers: headers}.then((response) => {
        //     console.log(response);
        //     setChatLog((prevChatLog) => [...prevChatLog, {type: "bot", message: response.data.messages[0].content}]);
        //     setIsLoading(false);
        // }).catch((error) => {
        //     console.log(error);
        //     setIsLoading(false);
        // }));
    }

    return(
    <>
        <div className="container mx-auto max-w-[700px] bottom-0 bg-slate-100">
            <div className="flex flex-col h-full bg-gray-900">
            <div className="flex-grow p-6 bg-slate-50 ">
                <div className="flex flex-col bg-slate-700">
                    <div className="flex flex-col space-y-4">
                        {
                            chatLog.map((message, index) => (
                                <div 
                                    key="index"
                                    className= {`${message.type === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className= {`${message.type === "user" ? "bg-blue-500" : "bg-gray-500"} rounded-lg p-4 text-white max-w-sm`}>
                                    {message.message}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            
            <form onSubmit={handleSubmit} className="w-full flex" > 
            <input
                id="email-address"
                type="text"
                name="query"
                required
                className="min-w-0 flex-auto mr-2 rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                placeholder="Ask Anything"
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
            />
            <ButtonIcon />
            </form>
        </div>
        </div>
        </div>
    </>
    );
}