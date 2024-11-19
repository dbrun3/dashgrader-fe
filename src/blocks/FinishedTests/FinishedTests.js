import React, {useState} from 'react';
import GradedTestRow from '../../components/GradedTestRow';

const FinishedTests = ({ gradedTests }) => {

    const [pressedRowIndex, setPressedRowIndex] = useState(null);
    const handleTestButtonClick = (index) => {
        setPressedRowIndex((prev) => (prev === index ? null : index));
    };

    const pressedImageBase64 =
        pressedRowIndex !== null
            ? gradedTests.find((entry) => entry.index === pressedRowIndex)?.data.graded_test
            : null;

    return (<div className='bottomRow'>
        <ul style={{ width: "100%" }}>
            {gradedTests
                .slice() // Create a copy of the array to avoid mutating the original
                .sort((a, b) => a.index - b.index) // Sort by the `index` property
                .map((entry, idx) => (
                    <li key={idx}>
                        {entry.error ? (
                            `Error for file ${entry.index}: ${entry.error.message}`
                        ) : (
                            <GradedTestRow
                                index={entry.index}
                                score={entry.data.score}
                                isPressed={pressedRowIndex === entry.index}
                                onButtonClick={handleTestButtonClick}
                            />
                        )}
                    </li>
                ))}
        </ul>

        {pressedImageBase64 && (
            <div style={{ marginTop: "20px", textAlign: "center", paddingLeft: "10px" }}>
                <img
                    src={`data:image/jpeg;base64,${pressedImageBase64}`}
                    alt={`Graded Test ${pressedRowIndex}`}
                    style={{
                        maxWidth: "200px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                    }}
                />
            </div>
        )}
    </div>)
}

export default FinishedTests;