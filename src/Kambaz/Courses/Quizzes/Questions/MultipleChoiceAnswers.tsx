/* eslint-disable @typescript-eslint/no-explicit-any */

import { FaArrowRight, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';

interface MultipleChoiceAnswersProps {
    answers: string[];
    setAnswers: React.Dispatch<React.SetStateAction<string[]>>;
    correctIndex: number | null;
    handleCorrectChange: (index: number) => void;
    focusedIndex: number | null;
    setFocusedIndex: React.Dispatch<React.SetStateAction<number | null>>;
    preventBlur: boolean;
    setPreventBlur: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MultipleChoiceAnswers(props: MultipleChoiceAnswersProps) {
    const {
        answers,
        setAnswers,
        correctIndex,
        handleCorrectChange,
        setFocusedIndex,
        preventBlur,
    } = props;

    // 删除答案选项
    const handleRemoveAnswer = (indexToRemove: number) => {
        if (answers.length <= 2) {
            alert("A multiple choice question must have at least 2 options.");
            return;
        }
        
        const newAnswers = answers.filter((_, index) => index !== indexToRemove);
        setAnswers(newAnswers);
        
        // 如果删除的是正确答案，重置正确答案索引
        if (correctIndex === indexToRemove) {
            handleCorrectChange(null as any);
        } else if (correctIndex !== null && correctIndex > indexToRemove) {
            // 如果删除的选项在正确答案之前，需要调整正确答案索引
            handleCorrectChange(correctIndex - 1);
        }
    };

    return (
        <div className="multiple-choice-answers">
            {answers.map((ans, index) => (
                <div key={index} className="answer-row mb-3 p-2 border rounded">
                    <div className="d-flex align-items-center">
                        {/* 正确答案指示器 */}
                        <div 
                            className={`correct-indicator me-2 ${correctIndex === index ? 'text-success' : 'text-muted'}`}
                            style={{ width: '30px', cursor: 'pointer' }}
                            onClick={() => handleCorrectChange(index)}
                        >
                            {correctIndex === index ? (
                                <div className="d-flex align-items-center">
                                    <FaArrowRight className="me-1" />
                                    <FaCheck />
                                </div>
                            ) : (
                                <div className="opacity-50">
                                    {String.fromCharCode(65 + index)}
                                </div>
                            )}
                        </div>
                        
                        {/* 答案标签 */}
                        <div className="answer-label me-2" style={{ width: '120px' }}>
                            <span className="text-muted">
                                {correctIndex === index ? 'Correct Answer' : 'Possible Answer'}
                            </span>
                        </div>
                        
                        {/* 答案输入框 */}
                        <div className="flex-grow-1">
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder={`Option ${index + 1}`}
                                value={ans} 
                                onChange={(e) => {
                                    const newAnswers = [...answers];
                                    newAnswers[index] = e.target.value;
                                    setAnswers(newAnswers);
                                }}
                                onFocus={() => setFocusedIndex(index)}
                                onBlur={() => {
                                    if (!preventBlur) {
                                        setFocusedIndex(null);
                                    }
                                }}
                            />
                        </div>
                        
                        {/* 操作按钮 */}
                        <div className="ms-2 d-flex">
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
                </div>
            ))}
        </div>
    );
}
