/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import QuestionEditor from './QuestionEditor'
import { updateQuiz } from '../reducer'
import * as quizClient from '../../client'

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

export default function Questions() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const location = useLocation();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState<boolean>(false);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  // 从服务器获取最新的 quiz 数据
  const fetchQuizData = async () => {
    if (!cid || !qid) return;
    
    try {
      console.log("正在从服务器获取最新的 quiz 数据...");
      // 使用 findQuizzesForCourse 函数获取所有 quizzes，然后找到当前的 quiz
      const quizzes = await quizClient.findQuizzesForCourse(cid);
      console.log("获取到所有 quizzes:", quizzes);
      
      const quiz = quizzes.find((q: any) => q._id === qid);
      console.log("当前 quiz:", quiz);
      
      if (quiz) {
        // 更新 Redux 状态
        dispatch(updateQuiz(quiz));
        
        // 更新本地状态
        setCurrentQuiz(quiz);
        if (quiz.questions && Array.isArray(quiz.questions)) {
          setQuestions(quiz.questions);
          // 计算总分
          const total = quiz.questions.reduce((sum: number, q: Question) => sum + (q.points || 0), 0);
          setTotalPoints(total);
        } else {
          setQuestions([]);
          setTotalPoints(0);
        }
      }
    } catch (error) {
      console.error("获取 quiz 数据失败:", error);
    }
  };

  // 获取当前测验和问题列表
  useEffect(() => {
    if (qid) {
      // 首先从 Redux 状态中获取数据
      if (quizzes && quizzes.length > 0) {
        const quiz = quizzes.find((q: any) => q._id === qid);
        if (quiz) {
          setCurrentQuiz(quiz);
          if (quiz.questions && Array.isArray(quiz.questions)) {
            setQuestions(quiz.questions);
            // 计算总分
            const total = quiz.questions.reduce((sum: number, q: Question) => sum + (q.points || 0), 0);
            setTotalPoints(total);
          } else {
            setQuestions([]);
            setTotalPoints(0);
          }
        }
      }
      
      // 然后从服务器获取最新数据
      fetchQuizData();
    }
  }, [qid, location.pathname]); // 添加 location.pathname 作为依赖，这样当路由变化时会重新获取数据

  // 打开问题编辑器 - 新建问题
  const handleAddQuestion = () => {
    console.log("Navigating to add question page");
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Edit/Questions/new`);
  };

  // 打开问题编辑器 - 编辑现有问题
  const handleEditQuestion = (question: Question) => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Edit/Questions/${question._id}/edit`);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentQuestion(null);
  };

  // 保存问题
  const handleSaveQuestion = async (question: Question) => {
    let updatedQuestions: Question[];
    
    if (isNewQuestion) {
      // 添加新问题
      updatedQuestions = [...questions, question];
    } else {
      // 更新现有问题
      updatedQuestions = questions.map((q, index) => 
        index === (currentQuestion as any).index ? question : q
      );
    }
    
    setQuestions(updatedQuestions);
    
    // 更新测验
    if (currentQuiz) {
      const updatedQuiz = {
        ...currentQuiz,
        questions: updatedQuestions,
        points: updatedQuestions.reduce((sum, q) => sum + (q.points || 0), 0)
      };
      
      try {
        // 调用 API 更新测验
        const response = await quizClient.updateQuiz(updatedQuiz);
        // 更新 Redux 状态
        dispatch(updateQuiz(response));
        // 更新本地状态
        setCurrentQuiz(response);
        setTotalPoints(response.points);
      } catch (error) {
        console.error('Failed to update quiz with new questions:', error);
      }
    }
    
    setIsEditing(false);
    setCurrentQuestion(null);
    setShowModal(false); // 关闭模态框
  };

  // 删除问题
  const handleDeleteQuestion = async (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
      
      // 更新测验
      if (currentQuiz) {
        const updatedQuiz = {
          ...currentQuiz,
          questions: updatedQuestions,
          points: updatedQuestions.reduce((sum, q) => sum + (q.points || 0), 0)
        };
        
        try {
          // 调用 API 更新测验
          const response = await quizClient.updateQuiz(updatedQuiz);
          // 更新 Redux 状态
          dispatch(updateQuiz(response));
          // 更新本地状态
          setCurrentQuiz(response);
          setTotalPoints(response.points);
        } catch (error) {
          console.error('Failed to update quiz after deleting question:', error);
        }
      }
    }
  };

  // 上移问题
  const handleMoveQuestionUp = async (index: number) => {
    if (index > 0) {
      const updatedQuestions = [...questions];
      const temp = updatedQuestions[index];
      updatedQuestions[index] = updatedQuestions[index - 1];
      updatedQuestions[index - 1] = temp;
      
      setQuestions(updatedQuestions);
      
      // 更新测验
      if (currentQuiz) {
        const updatedQuiz = {
          ...currentQuiz,
          questions: updatedQuestions
        };
        
        try {
          // 调用 API 更新测验
          const response = await quizClient.updateQuiz(updatedQuiz);
          // 更新 Redux 状态
          dispatch(updateQuiz(response));
          // 更新本地状态
          setCurrentQuiz(response);
        } catch (error) {
          console.error('Failed to update quiz after reordering questions:', error);
        }
      }
    }
  };

  // 下移问题
  const handleMoveQuestionDown = async (index: number) => {
    if (index < questions.length - 1) {
      const updatedQuestions = [...questions];
      const temp = updatedQuestions[index];
      updatedQuestions[index] = updatedQuestions[index + 1];
      updatedQuestions[index + 1] = temp;
      
      setQuestions(updatedQuestions);
      
      // 更新测验
      if (currentQuiz) {
        const updatedQuiz = {
          ...currentQuiz,
          questions: updatedQuestions
        };
        
        try {
          // 调用 API 更新测验
          const response = await quizClient.updateQuiz(updatedQuiz);
          // 更新 Redux 状态
          dispatch(updateQuiz(response));
          // 更新本地状态
          setCurrentQuiz(response);
        } catch (error) {
          console.error('Failed to update quiz after reordering questions:', error);
        }
      }
    }
  };

  // 保存所有更改
  const handleSaveAll = async () => {
    if (currentQuiz) {
      try {
        // 调用 API 更新测验
        const response = await quizClient.updateQuiz(currentQuiz);
        // 更新 Redux 状态
        dispatch(updateQuiz(response));
        alert('Quiz saved successfully!');
      } catch (error) {
        console.error('Failed to save quiz:', error);
        alert('Failed to save quiz. Please try again.');
      }
    }
  };

  // 取消所有更改
  const handleCancel = () => {
    // 重新加载测验数据
    if (qid && quizzes) {
      const quiz = quizzes.find((q: any) => q._id === qid);
      if (quiz) {
        setCurrentQuiz(quiz);
        if (quiz.questions) {
          setQuestions(quiz.questions);
          const total = quiz.questions.reduce((sum: number, q: Question) => sum + (q.points || 0), 0);
          setTotalPoints(total);
        } else {
          setQuestions([]);
          setTotalPoints(0);
        }
      }
    }
  };

  // 渲染问题类型
  const renderQuestionType = (question: Question) => {
    switch (question.questionType) {
      case 'Multiple Choice':
        return 'Multiple Choice';
      case 'True/False':
        return 'True/False';
      case 'Fill in the Blank':
        return 'Fill in the Blank';
      default:
        return 'Unknown Type';
    }
  };

  return (
    <div className="questions-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Questions <span className="badge bg-secondary">{questions.length}</span></h3>
        <div>
          <span className="me-3">Total Points: {totalPoints}</span>
          <button 
            id="wd-add-question-btn" 
            className="btn btn-primary" 
            onClick={handleAddQuestion}
          >
            + New Question
          </button>
        </div>
      </div>
      
      {questions.length === 0 ? (
        <div className="alert alert-info text-center">
          <p>This quiz has no questions yet. Click the "New Question" button to add your first question.</p>
        </div>
      ) : (
        <div className="question-list">
          {questions.map((question, index) => (
            <div key={index} className="card mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <span className="badge bg-primary me-2">Q{index + 1}</span>
                  <span className="badge bg-secondary me-2">{renderQuestionType(question)}</span>
                  <span className="badge bg-info">{question.points} {question.points === 1 ? 'point' : 'points'}</span>
                </div>
                <div className="btn-group">
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={() => handleMoveQuestionUp(index)}
                    disabled={index === 0}
                  >
                    <FaArrowUp />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={() => handleMoveQuestionDown(index)}
                    disabled={index === questions.length - 1}
                  >
                    <FaArrowDown />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-primary" 
                    onClick={() => handleEditQuestion(question)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => handleDeleteQuestion(index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title">{question.title}</h5>
                <p className="card-text">{question.questionText}</p>
                
                {question.questionType === 'Multiple Choice' && question.options && (
                  <ul className="list-group">
                    {question.options.map((option, optionIndex) => (
                      <li key={optionIndex} className={`list-group-item ${option.isCorrect ? 'list-group-item-success' : ''}`}>
                        {option.text} {option.isCorrect && <span className="badge bg-success">Correct</span>}
                      </li>
                    ))}
                  </ul>
                )}
                
                {question.questionType === 'True/False' && (
                  <div className="true-false-display">
                    <p>Correct answer: <strong>{question.isTrueCorrect ? 'True' : 'False'}</strong></p>
                  </div>
                )}
                
                {question.questionType === 'Fill in the Blank' && question.blankAnswers && (
                  <div className="blank-answers-display">
                    <p>Accepted answers:</p>
                    <ul className="list-group">
                      {question.blankAnswers.map((answer, answerIndex) => (
                        <li key={answerIndex} className="list-group-item">{answer.text}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 d-flex justify-content-end">
        <button 
          type="button" 
          className="btn btn-secondary me-2" 
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={handleSaveAll}
        >
          Save
        </button>
      </div>
      
      {/* 直接在组件中渲染模态框，使用内联样式 */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            zIndex: 10000
          }}>
            <QuestionEditor 
              question={currentQuestion}
              onSave={handleSaveQuestion}
              isNew={isNewQuestion}
              isOpen={showModal}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  )
}
