import React, { useRef, useEffect } from "react";
import "./DynamicButtonRows.css";

const DynamicButtonRows = ({rows, setRows}) => {

  const containerRef = useRef(null);

  const handleSelect = (rowIndex, buttonValue) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const updatedRow = { ...updatedRows[rowIndex] };
      if (updatedRow.selected === buttonValue) {
        updatedRow.selected = null; // Deselect
      } else {
        updatedRow.selected = buttonValue; // Select the button
        // Add a new row only if the last row is selected
        if (rowIndex === prevRows.length - 1) {
          updatedRows.push({ selected: null });
        }
      }
      updatedRows[rowIndex] = updatedRow;
      return updatedRows;
    });
  };

    useEffect(() => {
      // Scroll to the bottom when messages change
      containerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [rows]);

  return (
    <div className="buttonScroll">
        <div className="buttonContainer">
        {rows.map((row, rowIndex) => (
            <div ref={(rowIndex === rows.length - 1) ? containerRef : null} 
            key={rowIndex} className="buttonRow">
            {<div className="indexLabel">{`${rowIndex + 1}.`}</div>}
            {["A", "B", "C", "D", "E"].map((buttonValue) => (
                <button
                key={buttonValue}
                className={`circleButton ${
                    rows[rowIndex].selected === buttonValue ? "selected" : ""
                }`}
                onClick={() => handleSelect(rowIndex, buttonValue)}
                >
                {buttonValue}
                </button>
            ))}
            </div>
        ))}
        </div>
    </div>
  );
};

export default DynamicButtonRows;
