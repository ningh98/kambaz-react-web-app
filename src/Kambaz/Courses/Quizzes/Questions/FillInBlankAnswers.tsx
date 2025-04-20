import { FaTrash, FaEdit } from 'react-icons/fa';
import { useState } from 'react';

interface FillInBlankAnswersProps {
    answers: string[];
    setAnswers: React.Dispatch<React.SetStateAction<string[]>>;
    focusedIndex: number | null;
    setFocusedIndex: React.Dispatch<React.SetStateAction<number | null>>;
    preventBlur: boolean;
}

export default function FillInBlankAnswers({
    answers,
    setAnswers,
    focusedIndex,
    setFocusedIndex,
    preventBlur,
}: FillInBlankAnswersProps) {
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false);

    // 删除答案
    const handleRemoveAnswer = (indexToRemove: number) => {
        const newAnswers = answers.filter((_, index) => index !== indexToRemove);
        setAnswers(newAnswers);
    };

    return (
        <div className="fill-in-blank-answers">
            <div className="card mb-4">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Acceptable Answers</h5>
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="case-sensitive-switch"
                            checked={caseSensitive}
                            onChange={() => setCaseSensitive(!caseSensitive)}
                        />
                        <label className="form-check-label" htmlFor="case-sensitive-switch">
                            Case Sensitive
                        </label>
                    </div>
                </div>
                <div className="card-body">
                    <p className="text-muted mb-3">
                        Add all possible correct answers. Students must match one of these exactly
                        {caseSensitive ? ' (case sensitive)' : ' (case insensitive)'}.
                    </p>
                    
                    {answers.length === 0 ? (
                        <div className="alert alert-info">
                            No answers added yet. Use the "Add Answer" button below the question editor to add possible answers.
                        </div>
                    ) : (
                        <div className="answer-list">
                            {answers.map((ans, index) => (
                                <div key={index} className="answer-item mb-2 p-2 border rounded d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <span className="badge bg-primary me-2">{index + 1}</span>
                                        <span>{ans}</span>
                                    </div>
                                    <div className="answer-actions">
                                        <button 
                                            className="btn btn-outline-secondary btn-sm me-1"
                                            onClick={() => setFocusedIndex(index)}
                                            title="Edit this answer"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleRemoveAnswer(index)}
                                            title="Remove this answer"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {focusedIndex !== null && (
                <div className="edit-answer-form">
                    <div className="card">
                        <div className="card-header bg-light">
                            <h6 className="mb-0">Edit Answer #{focusedIndex + 1}</h6>
                        </div>
                        <div className="card-body">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={answers[focusedIndex] || ''}
                                    onChange={(e) => {
                                        const newAnswers = [...answers];
                                        newAnswers[focusedIndex] = e.target.value;
                                        setAnswers(newAnswers);
                                    }}
                                    onBlur={() => {
                                        if (!preventBlur) {
                                            setFocusedIndex(null);
                                        }
                                    }}
                                    autoFocus
                                />
                                <button 
                                    className="btn btn-success" 
                                    type="button"
                                    onClick={() => setFocusedIndex(null)}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
