import { useState } from "react";
import ButtonIcon from "./ButtonIcon";

const InputBox = ({ placeholder }) => {

  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    sendInputToBackend(inputValue);
    setInputValue("");
  };

  const sendInputToBackend = async (inputValue) => {
    try{
    const response = await fetch('https://your-backend-endpoint.com/api', {
            method: 'POST', // or 'GET', 'PUT', 'DELETE', etc.
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        console.log('Success:', result);
        // Handle success
    } catch (error) {
        console.error('Error:', error);
        // Handle errors
    }
    
    console.log("Form submitted with: ", inputValue);
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex" > 
      <input
        id="email-address"
        type="text"
        name="query"
        required
        className="min-w-0 flex-auto mr-2 rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
        placeholder={placeholder}
        onChange={handleInputChange}
        value={inputValue}
      />
      <ButtonIcon />
    </form>
  );
};

export default InputBox;
