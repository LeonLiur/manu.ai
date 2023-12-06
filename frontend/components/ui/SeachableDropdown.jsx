import { DropdownMenuIcon } from "@radix-ui/react-icons";
import { useId, useState } from "react";
import Select from "react-select";


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
        <Select 
            className="basic-single"
            classNamePrefix="select"
            options={options}
            instanceId={useId()}
            onChange={handleChange}
            value={selectedOption}
        / > 
    );
}