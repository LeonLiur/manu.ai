import { DropdownMenuIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import Select from "react-Select";


const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
];

export default function SearchableDropdown(){
    const [selectedOption, setSelectedOption] = useState();

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    return(
        <>
            <div className="flex flex-row justify-items-center justify-center">
                <Select 
                    options={options}
                    onChange={handleChange}
                    value={selectedOption}
                >
                </Select>  
            </div>
        </>
    );
}