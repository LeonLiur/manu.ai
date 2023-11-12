// components/InputBox.js
import { Input } from "@chakra-ui/react";

const InputBox = ({ placeholder, onChange, onSubmit, value }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <input
      id="email-address"
      name="email"
      type="email"
      autoComplete="email"
      required
      className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
    />
);
};

export default InputBox;
