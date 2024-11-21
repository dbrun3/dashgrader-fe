import React, {useState} from 'react';
import GradedTestRow from '../../components/GradedTestRow';

const FinishedTests = ({ gradedTests }) => {

    const [pressedRowIndex, setPressedRowIndex] = useState(null);
    const handleTestButtonClick = (index, error) => {
        setPressedRowIndex((prev) => (prev === index ? null : index));
    };

    const pressedImageBase64 =
        pressedRowIndex !== null
            ? gradedTests.find((entry) => entry.index === pressedRowIndex)?.data.graded_test ?? gradedTests.find((entry) => entry.index === pressedRowIndex)?.data.base64
            : null
    return (<div className='bottomRow'>
        <ul style={{ width: "100%" }}>
            {gradedTests
                .slice() // Create a copy of the array to avoid mutating the original
                .sort((a, b) => a.index - b.index) // Sort by the `index` property
                .map((entry, idx) => (
                    <li key={idx}>
                        {entry.error ? (
                            <GradedTestRow
                                index={entry.index}
                                error={entry.error}
                                isPressed={pressedRowIndex === entry.index}
                                onButtonClick={handleTestButtonClick}
                            />
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
            <div style={{ textAlign: "center", paddingLeft: "10px", position:"sticky", top: "0px",
                maxHeight: "88vh", overflowY:"scroll", minWidth: "255px"
            }}>
                <img
                    src={`data:image/jpeg;base64,${pressedImageBase64}`}
                    alt={`Graded Test ${pressedRowIndex}`}
                    style={{
                        width: "250px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                    }}
                />
            </div>
        )}
    </div>)
}

export default FinishedTests;