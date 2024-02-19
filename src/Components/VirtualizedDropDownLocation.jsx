import React, { useState, useEffect } from "react";
import { FixedSizeList } from "react-window";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import "./DropDownList.css";
import axios from "axios";

const VirtualizedDropdownLocation = ({
  searchbarId,
  searchbarName,
  onSelect,
  placeholderValue,
  toSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    // Filter options based on search term
    if (options) {
      //   const filtered = options?.filter((option) =>
      //     option[toSearch].toLowerCase().includes(searchTerm.toLowerCase())
      //   );
      const filtered = options.slice(0, 10);
      setFilteredOptions(filtered);
      //   setFilteredOptions(filtered);
    }
  }, [options]);

  async function sendFormFunction() {
    const data = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${searchTerm}&format=json&limit=4&addressdetails=1`
    );
    console.log(data?.data);
    setOptions(data?.data);
  }

  useEffect(() => {
    sendFormFunction();
  }, [searchTerm]);

  const handleSelect = (option) => {
    onSelect(option);
    setSelected(option[toSearch]);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="searchable-dropdown-container">
      <input
        className="searchable-dropdown-input"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={toggleDropdown}
        placeholder={selected ? selected : placeholderValue}
      />
      {isOpen && filteredOptions?.length > 0 && (
        <ul className="dropdown-list-ul">
          <FixedSizeList
            height={Math.min(200, filteredOptions.length * 35)} // Set the desired height for the virtualized list
            width={200} // Set the desired width
            itemSize={35} // Set the height of each list item
            itemCount={filteredOptions.length}
          >
            {({ index, style }) => (
              <li
                className="dropdown-list-li"
                key={index}
                style={{
                  ...style,
                  height: "32px",
                  width: "86%",
                  marginBottom: "10px",
                }}
                onClick={() => handleSelect(filteredOptions[index])}
              >
                <ListItemText
                  className="listItemInSearchbar"
                  primary={filteredOptions[index][toSearch].slice(0, 20)}
                />
              </li>
            )}
          </FixedSizeList>
        </ul>
      )}
    </div>
  );
};

export default VirtualizedDropdownLocation;
