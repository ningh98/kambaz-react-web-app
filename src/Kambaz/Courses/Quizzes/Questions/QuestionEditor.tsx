/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import "./QuestionEditor.css"
import MultipleChoiceAnswers from "./MultipleChoiceAnswers"
import TrueFalseAnswers from "./TrueFalseAnswers"
import FillInBlankAnswers from "./FillInBlankAnswers"

// 定义问题类型接口
interface Option {
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

interface BlankAnswer {
  text: string;
  feedback?: string;
}

interface Question {
  _id?: string;
  title: string;
  questionText: string;
  questionType: 'Multiple Choice' | 'True/False' | 'Fill in the Blank';
  points: number;
  options?: Option[];
  isTrueCorrect?: boolean;
  blankAnswers?: BlankAnswer[];
  isRequired: boolean;
  feedback?: string;
  isEditing?: boolean;
}

interface QuestionEditorProps {
  question?: Question;
  onSave?: (question: Question) => void;
  isNew?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function QuestionEditor({ 
  question, 
  onSave, 
  isNew = true, 
  isOpen = false,
  onClose
}: QuestionEditorProps = {}) {
    const [title, setTitle] = useState<string>('New Question');
    const [questionText, setQuestionText] = useState<string>('');
    const [questionType, setQuestionType] = useState<string>("multipleChoice");
    const [points, setPoints] = useState<number>(1);
    const [isRequired, setIsRequired] = useState<boolean>(true);
    const [feedback, setFeedback] = useState<string>('');
    
    const [answers, setAnswers] = useState<string[]>([]);
    const [answer, setAnswer] = useState<string>('');
    const [correctIndex, setCorrectIndex] = useState<number | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const [preventBlur, setPreventBlur] = useState<boolean>(false);
    
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    
    // 当接收到问题数据时，初始化编辑器状态
    useEffect(() => {
        if (question) {
            setTitle(question.title || 'New Question');
            setQuestionText(question.questionText || '');
            setPoints(question.points || 1);
            setIsRequired(question.isRequired !== false);
            setFeedback(question.feedback || '');
            
            // 设置问题类型
            if (question.questionType === 'Multiple Choice') {
                setQuestionType("multipleChoice");
                // 设置选项
                if (question.options && question.options.length > 0) {
                    setAnswers(question.options.map(opt => opt.text));
                    const correctOptionIndex = question.options.findIndex(opt => opt.isCorrect);
                    setCorrectIndex(correctOptionIndex >= 0 ? correctOptionIndex : null);
                } else {
                    setAnswers([]);
                    setCorrectIndex(null);
                }
            } else if (question.questionType === 'True/False') {
                setQuestionType("trueFalse");
                setAnswers(["True", "False"]);
                setCorrectIndex(question.isTrueCorrect ? 0 : 1);
            } else if (question.questionType === 'Fill in the Blank') {
                setQuestionType("fillInBlank");
                // 设置填空答案
                if (question.blankAnswers && question.blankAnswers.length > 0) {
                    setAnswers(question.blankAnswers.map(ans => ans.text));
                } else {
                    setAnswers([]);
                }
                setCorrectIndex(null);
            }
        } else {
            // 默认值
            setTitle('New Question');
            setQuestionText('');
            setQuestionType("multipleChoice");
            setPoints(1);
            setIsRequired(true);
            setFeedback('');
            setAnswers([]);
            setCorrectIndex(null);
        }
    }, [question]);

    // 添加答案
    const addAnswer = () => {
        if (answer.trim()) {
            setAnswers([...answers, answer.trim()]);
            setAnswer('');
        }
    };

    // 处理问题类型变更
    const handleQuestionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value;
        setQuestionType(type);
        
        if (type === "trueFalse") {
            setAnswers(["True", "False"]);
            setCorrectIndex(0); // 默认 True 为正确答案
        } else if (type === "fillInBlank") {
            setAnswers([]);
            setCorrectIndex(null);
        } else {
            // 多选题至少需要两个选项
            if (answers.length < 2) {
                setAnswers(['', '']);
            }
            setCorrectIndex(null);
        }
    };

    // 渲染答案部分
    const renderAnswersSection = () => {
        switch (questionType) {
            case "trueFalse":
                return <TrueFalseAnswers
                    answers={answers}
                    correctIndex={correctIndex}
                    handleCorrectChange={handleCorrectChange}
                />;
            case "multipleChoice":
                return <MultipleChoiceAnswers
                    answers={answers}
                    setAnswers={setAnswers}
                    correctIndex={correctIndex}
                    handleCorrectChange={handleCorrectChange}
                    focusedIndex={focusedIndex}
                    setFocusedIndex={setFocusedIndex}
                    preventBlur={preventBlur}
                    setPreventBlur={setPreventBlur}
                />;
            case "fillInBlank":
                return <FillInBlankAnswers
                    answers={answers}
                    setAnswers={setAnswers}
                    focusedIndex={focusedIndex}
                    setFocusedIndex={setFocusedIndex}
                    preventBlur={preventBlur}
                />;
            default:
                return <MultipleChoiceAnswers
                    answers={answers}
                    setAnswers={setAnswers}
                    correctIndex={correctIndex}
                    handleCorrectChange={handleCorrectChange}
                    focusedIndex={focusedIndex}
                    setFocusedIndex={setFocusedIndex}
                    preventBlur={preventBlur}
                    setPreventBlur={setPreventBlur}
                />;
        }
    };

    // 设置正确答案
    const handleCorrectChange = (index: number) => {
        setCorrectIndex(index);
    };

    // 验证表单
    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};
        
        if (!title.trim()) {
            newErrors.title = '问题标题不能为空';
        }
        
        if (!questionText.trim()) {
            newErrors.questionText = '问题内容不能为空';
        }
        
        if (questionType === "multipleChoice") {
            // 检查是否有空选项
            if (answers.some(ans => !ans.trim())) {
                newErrors.answers = '所有选项都必须有内容';
            }
            
            // 检查是否选择了正确答案
            if (correctIndex === null) {
                newErrors.correctAnswer = '请选择一个正确答案';
            }
        } else if (questionType === "fillInBlank") {
            // 检查是否有空答案
            if (answers.length === 0 || answers.some(ans => !ans.trim())) {
                newErrors.answers = '至少需要一个有效答案';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 关闭模态框
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    // 保存问题
    const handleSave = () => {
        if (!validateForm()) {
            return;
        }
        
        // 构建问题对象
        let questionTypeFormatted: 'Multiple Choice' | 'True/False' | 'Fill in the Blank';
        
        if (questionType === "multipleChoice") {
            questionTypeFormatted = 'Multiple Choice';
        } else if (questionType === "trueFalse") {
            questionTypeFormatted = 'True/False';
        } else {
            questionTypeFormatted = 'Fill in the Blank';
        }
        
        const updatedQuestion: Question = {
            ...question,
            title,
            questionText,
            questionType: questionTypeFormatted,
            points,
            isRequired,
            feedback
        };
        
        // 根据问题类型设置特定字段
        if (questionType === "multipleChoice") {
            updatedQuestion.options = answers.map((text, index) => ({
                text,
                isCorrect: index === correctIndex
            }));
            delete updatedQuestion.isTrueCorrect;
            delete updatedQuestion.blankAnswers;
        } else if (questionType === "trueFalse") {
            updatedQuestion.isTrueCorrect = correctIndex === 0;
            delete updatedQuestion.options;
            delete updatedQuestion.blankAnswers;
        } else if (questionType === "fillInBlank") {
            updatedQuestion.blankAnswers = answers.map(text => ({ text }));
            delete updatedQuestion.options;
            delete updatedQuestion.isTrueCorrect;
        }
        
        // 调用保存回调
        if (onSave) {
            onSave(updatedQuestion);
        }
        
        // 关闭模态框
        handleClose();
        
        // 重置表单
        if (isNew) {
            setTitle('New Question');
            setQuestionText('');
            setPoints(1);
            setIsRequired(true);
            setFeedback('');
            setQuestionType("multipleChoice");
            setAnswers([]);
            setCorrectIndex(null);
        }
    };

    // 渲染组件
    return (
        <div className="modal-content" style={{ display: isOpen ? 'block' : 'none' }}>
            <div className="modal-header d-flex">
                <input 
                    type="text" 
                    className={`form-control me-2 ${errors.title ? 'is-invalid' : ''}`}
                    placeholder="Question Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                
                <select 
                    className="form-select me-3" 
                    id="wd-select-quiz-type"
                    value={questionType}
                    onChange={handleQuestionTypeChange}
                >
                    <option value="multipleChoice">Multiple choice</option>
                    <option value="trueFalse">True/false</option>
                    <option value="fillInBlank">Fill in the blank</option>
                </select>
                
                <span className="ms-3">pts:</span>
                <input 
                    type="number" 
                    className="form-control form-control-sm" 
                    style={{ width: '60px' }}
                    min="0"
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                />
                
                <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            
            <div className="modal-body">
                <div id="wd-question-editor-question-section">
                    <p>Enter your question and multiple answers, then select the one correct answer.</p>
                    <label htmlFor="wd-question-text" className="form-label" style={{ fontWeight: "bold" }}>Question:</label>
                    <textarea 
                        className={`form-control ${errors.questionText ? 'is-invalid' : ''}`}
                        id="wd-question-text" 
                        rows={3} 
                        placeholder="Enter your question here..."
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                    ></textarea>
                    {errors.questionText && <div className="invalid-feedback">{errors.questionText}</div>}
                </div>
                
                <div id="wd-question-editor-answers-section" className="mt-3">
                    <label className="form-label" style={{ fontWeight: "bold" }}>Answers:</label>
                    {errors.answers && <div className="alert alert-danger">{errors.answers}</div>}
                    {errors.correctAnswer && <div className="alert alert-danger">{errors.correctAnswer}</div>}
                    
                    {renderAnswersSection()}
                    
                    {questionType !== "trueFalse" && (
                        <div className="d-flex mt-3">
                            <input 
                                type="text" 
                                className="form-control me-2"
                                placeholder="New answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addAnswer()}
                            />
                            <button 
                                type="button" 
                                className="btn btn-outline-primary"
                                onClick={addAnswer}
                            >
                                + Add Answer
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="mt-3">
                    <label htmlFor="question-feedback" className="form-label" style={{ fontWeight: "bold" }}>Feedback (Optional):</label>
                    <textarea
                        className="form-control"
                        id="question-feedback"
                        rows={2}
                        placeholder="Enter feedback for this question..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    ></textarea>
                </div>
                
                <div className="form-check mt-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="question-required"
                        checked={isRequired}
                        onChange={(e) => setIsRequired(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="question-required">
                        This question is required
                    </label>
                </div>
            </div>
            
            <div className="modal-footer justify-content-between">
                <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleClose}
                >
                    Cancel
                </button>
                <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleSave}
                >
                    {isNew ? 'Add Question' : 'Update Question'}
                </button>
            </div>
        </div>
    );
}
