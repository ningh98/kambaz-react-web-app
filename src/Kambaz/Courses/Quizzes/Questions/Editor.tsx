/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import "./QuestionEditor.css"
import MultipleChoiceAnswers from "./MultipleChoiceAnswers"
import TrueFalseAnswers from "./TrueFalseAnswers"
import FillInBlankAnswers from "./FillInBlankAnswers"
import { updateQuiz } from "../reducer"
import * as quizClient from "../../client"

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

export default function QuestionEditor() {
    const { cid, qid, questionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const quiz = useSelector((state: any) => 
        state.quizzesReducer.quizzes.find((q: any) => q._id === qid)
    );
    
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
    const [isNew, setIsNew] = useState<boolean>(true);
    
    // 初始化编辑器状态
    useEffect(() => {
        if (questionId && quiz && quiz.questions) {
            // 编辑现有问题
            const question = quiz.questions.find((q: Question) => q._id === questionId);
            if (question) {
                setIsNew(false);
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
                        setAnswers(question.options.map((opt: Option) => opt.text));
                        const correctOptionIndex = question.options.findIndex((opt: Option) => opt.isCorrect);
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
                        setAnswers(question.blankAnswers.map((ans: BlankAnswer) => ans.text));
                    } else {
                        setAnswers([]);
                    }
                    setCorrectIndex(null);
                }
            }
        } else {
            // 新建问题
            setIsNew(true);
            setTitle('New Question');
            setQuestionText('');
            setQuestionType("multipleChoice");
            setPoints(1);
            setIsRequired(true);
            setFeedback('');
            setAnswers(['', '']);
            setCorrectIndex(null);
        }
    }, [cid, qid, questionId, quiz]);

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
            newErrors.title = 'Question title cannot be empty';
        }
        
        if (!questionText.trim()) {
            newErrors.questionText = 'Question content cannot be empty';
        }
        
        if (questionType === "multipleChoice") {
            // 检查是否有空选项
            if (answers.some(ans => !ans.trim())) {
                newErrors.answers = 'All options must have content';
            }
            
            // 检查是否选择了正确答案
            if (correctIndex === null) {
                newErrors.correctAnswer = 'Please select a correct answer';
            }
        } else if (questionType === "fillInBlank") {
            // 检查是否有空答案
            if (answers.length === 0 || answers.some(ans => !ans.trim())) {
                newErrors.answers = 'At least one valid answer is required';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 取消编辑，返回问题列表
    const handleCancel = () => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Edit/Questions`);
    };

    // 保存问题
    const handleSave = async () => {
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
            _id: questionId,
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
        } else if (questionType === "trueFalse") {
            updatedQuestion.isTrueCorrect = correctIndex === 0;
        } else if (questionType === "fillInBlank") {
            updatedQuestion.blankAnswers = answers.map(text => ({ text }));
        }
        
        // 更新 quiz 中的 questions
        if (!quiz) {
            console.error("Cannot save question: quiz not found");
            return;
        }
        
        // 创建一个深拷贝而不是浅拷贝
        let updatedQuiz = JSON.parse(JSON.stringify(quiz));
        
        // 确保 questions 是一个新数组
        if (!updatedQuiz.questions) {
            updatedQuiz.questions = [];
        } else {
            // 确保 questions 是一个新数组，而不是原数组的引用
            updatedQuiz.questions = [...updatedQuiz.questions];
        }
        
        if (isNew) {
            // 添加新问题
            updatedQuiz.questions.push(updatedQuestion);
        } else {
            // 更新现有问题
            updatedQuiz.questions = updatedQuiz.questions.map((q: Question) => 
                q._id === questionId ? updatedQuestion : q
            );
        }
        
        // 保存到服务器
        try {
            console.log("Saving question to server...", updatedQuiz);
            const response = await quizClient.updateQuiz(updatedQuiz);
            console.log("Save successful, server response:", response);
            dispatch(updateQuiz(response));
            // 返回问题列表
            navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Edit/Questions`);
        } catch (error) {
            console.error("Failed to save question:", error);
        }
    };

    // 渲染组件
    return (
        <div className="question-editor-page">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h3>{isNew ? 'Add New Question' : 'Edit Question'}</h3>
                </div>
                <div className="card-body">
                    <div className="mb-3 d-flex">
                        <div className="flex-grow-1 me-2">
                            <label htmlFor="question-title" className="form-label">Question Title</label>
                            <input 
                                type="text" 
                                id="question-title"
                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                placeholder="Question Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                        </div>
                        
                        <div className="me-2" style={{ width: '200px' }}>
                            <label htmlFor="question-type" className="form-label">Question Type</label>
                            <select 
                                id="question-type"
                                className="form-select" 
                                value={questionType}
                                onChange={handleQuestionTypeChange}
                            >
                                <option value="multipleChoice">Multiple choice</option>
                                <option value="trueFalse">True/false</option>
                                <option value="fillInBlank">Fill in the blank</option>
                            </select>
                        </div>
                        
                        <div style={{ width: '100px' }}>
                            <label htmlFor="question-points" className="form-label">Points</label>
                            <input 
                                type="number" 
                                id="question-points"
                                className="form-control" 
                                min="0"
                                value={points}
                                onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="question-text" className="form-label">Question Content</label>
                        <textarea 
                            className={`form-control ${errors.questionText ? 'is-invalid' : ''}`}
                            id="question-text" 
                            rows={3} 
                            placeholder="Enter your question here..."
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                        ></textarea>
                        {errors.questionText && <div className="invalid-feedback">{errors.questionText}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Answer Options</label>
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
                    
                    <div className="mb-3">
                        <label htmlFor="question-feedback" className="form-label">Feedback (Optional)</label>
                        <textarea
                            className="form-control"
                            id="question-feedback"
                            rows={2}
                            placeholder="Enter feedback for this question..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        ></textarea>
                    </div>
                    
                    <div className="mb-3 form-check">
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
                <div className="card-footer d-flex justify-content-between">
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={handleCancel}
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
        </div>
    );
}