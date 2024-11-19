import React, { useState } from "react";
import "./DragAndDropUploader.css";

const DragAndDropUploader = ({fileList, setFileList}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      addFiles(event.dataTransfer.files);
    }
  };

  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      addFiles(event.target.files);
    }
  };

  const addFiles = async (files) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    // Filter files by allowed types
    const filteredFiles = Array.from(files).filter((file) =>
      allowedTypes.includes(file.type)
    );

    // Convert files to Base64 and include in the file object
    const base64Promises = filteredFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve({
            name: file.name,
            size: file.size,
            lastModified: new Date(file.lastModified),
            base64: reader.result.split(",")[1], // Remove Base64 prefix
          });
        };

        reader.onerror = () => {
          reject(new Error(`Failed to read file: ${file.name}`));
        };

        reader.readAsDataURL(file); // Start reading the file
      });
    });

    try {
      const newFiles = await Promise.all(base64Promises);

      // Merge with existing file list and sort by lastModified
      const updatedFileList = [...fileList, ...newFiles].sort(
        (a, b) => a.lastModified - b.lastModified
      );

      setFileList(updatedFileList);

      console.log(updatedFileList);
    } catch (error) {
      console.error("Error processing files:", error);
    }
  };

  const removeFile = (fileName) => {
    setFileList((prevList) => prevList.filter((file) => file.name !== fileName));
  };

  return (
    <div
      className={`labelUploader ${dragActive ? "drag-active" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {fileList.length > 0 && (
        <ul className="fileList">
          {fileList.map((file, index) => (
            <li key={index} className="fileItem">
              <span>{file.name}</span>
              <button
                className="removeButton"
                onClick={() => removeFile(file.name)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="uploadArea">
        {fileList.length === 0 && <p>Drag and drop files here, <br/>or click to select files</p>}
        <input
          className="innerUploader"
          type="file"
          multiple
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};

export default DragAndDropUploader;
