import { useState, useRef, useEffect } from 'react';
import pLimit from 'p-limit';

import DragAndDropUploader from './blocks/DragAndDropUploader/DragAndDropUploader';
import DynamicButtonRows from './blocks/DynamicButtonRows/DynamicButtonRows';
import FinishedTests from './blocks/FinishedTests/FinishedTests';
import './App.css';
import Dropdown from './components/Dropdown';

const limit = pLimit(10); // Max 25 concurrent requests

function App() {
  const [fileList, setFileList] = useState([]);
  const [rows, setRows] = useState(
    Array(10)
      .fill(null)
      .map(() => ({ selected: null }))
  );
  const [buttonPressed, setButtonPressed] = useState(false);
  const [gradedTests, setGradedTests] = useState([]);
  const buttonRef = useRef(null);

  const convertFilesToBase64AndSend = async () => {

    const answerKey = {};
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      if (row.selected === null) break; // Stop processing when a `null` value is encountered
      answerKey[index] = row.selected.charCodeAt(0) - 'A'.charCodeAt(0);
    }

    console.log(answerKey);

    if (fileList.length === 0 || answerKey.length === 0) return;

    setButtonPressed(true);
    setGradedTests([]);

    Array.from(fileList).map(async (file, index) =>
      // Perform the HTTP POST request with .then
      limit(() => fetch("https://om1i1j9kdd.execute-api.us-east-1.amazonaws.com/default/autogradeLambda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ index: index, test: file.base64, answer_key: answerKey }),
      })
        .then(response => {
          if (!response.ok) {
            console.log(response);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json(); // or response.text(), response.blob(), etc., based on your API
        })
        .then(data => {
          console.log(`Response for file ${index}:`, data);
          setGradedTests((prevTests) => [...prevTests, { index: index, data: data.data }]);
        })
        .catch((error) => {
          console.error(`Error for file ${index}:`, error);
          setGradedTests((prevTests) => [...prevTests, { index: index, data: fileList[index], error: error }]);
        })
    ));
  };

  const handleDownload = (sheet) => {
    const link = document.createElement('a');
    link.href = `${process.env.PUBLIC_URL}/sheets/${sheet}.pdf`; // Path to your PDF file
    link.download = `${sheet}.pdf`; // File name for the downloaded file
    link.click();
};

  useEffect(() => {
    // Only scroll when buttonPressed becomes true
    if (buttonPressed) {
      buttonRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [buttonPressed]);

  useEffect(() => {
    if (gradedTests.length > 0) {
      setButtonPressed(false);
      setFileList([]);
    }

  }, [gradedTests]);

  console.log(gradedTests);

  return (
    <div className="App">
      <div className='header'>
        <img className='logo' src={`${process.env.PUBLIC_URL}/assets/logoOutlined.png`} alt="DashGrader"></img>
        <div className='downloads'>
          <div><strong>Get the sheets here!</strong></div>
          <Dropdown label="Print">
            <button className="printOpt" onClick={() => handleDownload("single-sheet")}> Single </button>
            <button className="printOpt" onClick={() => handleDownload("double-sheet")}> Double </button>
            <button className="printOpt" onClick={() => handleDownload("two-sheets")}> Two Sheets </button>
          </Dropdown>
        </div>
      </div>
      <div className='mainRow'>
        <DragAndDropUploader fileList={fileList} setFileList={setFileList} />
        <DynamicButtonRows rows={rows} setRows={setRows} scroll={(gradedTests.length === 0)}/>
      </div>
      <button ref={buttonRef} className={`processButton ${buttonPressed ? "on" : ""}`} onClick={convertFilesToBase64AndSend}>Dash Grade</button>
      {(buttonPressed && gradedTests.length === 0) && <div className={"imageHolder"}>
        <img src={`${process.env.PUBLIC_URL}/Rainbow_dash_sword_tpp_by_creshosk-d42e6e3.webp`} alt="Loading..." />
      </div>}{/*https://i.gifer.com/origin/c1/c1e52de687b5acd4a359eb936d05de99_w200.webp */}
      {(gradedTests.length !== 0) && <FinishedTests gradedTests={gradedTests} fileList={fileList}/>}
    </div>
  );
}

export default App;
