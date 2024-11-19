import React, { useState } from "react";
import './Dropdown.css'

const Dropdown = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Dropdown Button */}
      <button className={`dropdown ${isOpen ? "open" : ""}`} onClick={toggleDropdown} style={{ padding: "10px 20px" }}>
        {label}
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="dropdownContainer">
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
