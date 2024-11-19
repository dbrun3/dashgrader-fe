import React from "react";

const GradedTestRow = ({ index, score, error, isPressed, onButtonClick }) => {
  return (
    <div
      style={{
        display: "flex",
        borderRadius: "10px",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "50px",
        paddingRight: "10px",
        border: "1px solid #ddd",
        padding: "0 10px",
        boxSizing: "border-box",
        background: isPressed ? "#eef" : "#f9f9f9",
      }}
    >
      <div style={error ? {color:"red"} : {}}>
        <strong>Index:</strong> {index + 1} | <strong>
          {`${error? "Error" : "Score"}:`}</strong> {`${error? error : `${score}%`}`}
      </div>
      <button
        style={{
          height: "30px",
          padding: "0 15px",
          backgroundColor: isPressed ? "#0056b3" : "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => onButtonClick(index)}
      >
        {isPressed ? "Hide Test" : "Show Test"}
      </button>
    </div>
  );
};

export default GradedTestRow;
