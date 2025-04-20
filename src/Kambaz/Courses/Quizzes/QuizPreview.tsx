/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './QuizPreview.css';

// 答案类型定义
interface UserAnswers {
  [questionId: string]: {
    selectedOption?: number;
    textAnswer?: string;
    isCorrect?: boolean;
  };
}

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const quiz = quizzes.find((q: any) => q._id === qid);
  
  const [currentStep, setCurrentStep] = useState<'preview' | 'results'>('preview');
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState({ earned: 0, total: 0, percentage: 0 });
  const [startTime] = useState(new Date());

  // 初始化用户答案
  useEffect(() => {
    if (quiz && quiz.questions) {
      const initialAnswers: UserAnswers = {};
      quiz.questions.forEach((question: any) => {
        initialAnswers[question._id] = {};
      });
      setUserAnswers(initialAnswers);
    }
  }, [quiz]);

  // 如果没有找到测验，显示错误信息
  if (!quiz) {
    return (
      <div className="alert alert-danger">
        Quiz not found. Please go back to the quiz list.
      </div>
    );
  }

  // 处理多选题答案选择
  const handleMultipleChoiceAnswer = (questionId: string, optionIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: {
        ...userAnswers[questionId],
        selectedOption: optionIndex
      }
    });
  };

  // 处理判断题答案选择
  const handleTrueFalseAnswer = (questionId: string, isTrue: boolean) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: {
        ...userAnswers[questionId],
        selectedOption: isTrue ? 0 : 1
      }
    });
  };

  // 处理填空题答案输入
  const handleFillInBlankAnswer = (questionId: string, text: string) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: {
        ...userAnswers[questionId],
        textAnswer: text
      }
    });
  };

  // 提交测验并评分
  const handleSubmitQuiz = () => {
    let earnedPoints = 0;
    let totalPoints = 0;
    
    const gradedAnswers = { ...userAnswers };
    
    quiz.questions.forEach((question: any) => {
      totalPoints += question.points;
      let isCorrect = false;
      
      if (question.questionType === 'Multiple Choice') {
        const userSelectedOption = userAnswers[question._id]?.selectedOption;
        if (userSelectedOption !== undefined) {
          // 检查选择的选项是否是正确答案
          isCorrect = question.options && question.options[userSelectedOption]?.isCorrect === true;
          if (isCorrect) {
            earnedPoints += question.points;
          }
        }
      } else if (question.questionType === 'True/False') {
        const userSelectedOption = userAnswers[question._id]?.selectedOption;
        if (userSelectedOption !== undefined) {
          // 检查是否选择了正确的 True/False 选项
          isCorrect = (userSelectedOption === 0 && question.isTrueCorrect === true) || 
                     (userSelectedOption === 1 && question.isTrueCorrect === false);
          if (isCorrect) {
            earnedPoints += question.points;
          }
        }
      } else if (question.questionType === 'Fill in the Blank') {
        const userTextAnswer = userAnswers[question._id]?.textAnswer?.trim().toLowerCase();
        if (userTextAnswer) {
          // 检查填写的答案是否匹配任何可能的正确答案
          isCorrect = question.blankAnswers && question.blankAnswers.some(
            (answer: any) => answer.text.toLowerCase() === userTextAnswer
          );
          if (isCorrect) {
            earnedPoints += question.points;
          }
        }
      }
      
      // 更新答案的正确性
      gradedAnswers[question._id] = {
        ...gradedAnswers[question._id],
        isCorrect
      };
    });
    
    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    
    setUserAnswers(gradedAnswers);
    setScore({ earned: earnedPoints, total: totalPoints, percentage });
    setQuizSubmitted(true);
    setCurrentStep('results');
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // 渲染多选题
  const renderMultipleChoiceQuestion = (question: any) => {
    return (
      <div className="question-options mt-3">
        {question.options && question.options.map((option: any, index: number) => (
          <div key={index} className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name={`question-${question._id}`}
              id={`option-${question._id}-${index}`}
              checked={userAnswers[question._id]?.selectedOption === index}
              onChange={() => handleMultipleChoiceAnswer(question._id, index)}
              disabled={quizSubmitted}
            />
            <label className="form-check-label" htmlFor={`option-${question._id}-${index}`}>
              {option.text}
            </label>
            {quizSubmitted && (
              <>
                {option.isCorrect && (
                  <span className="badge bg-success ms-2">Correct Answer</span>
                )}
                {userAnswers[question._id]?.selectedOption === index && !option.isCorrect && (
                  <span className="badge bg-danger ms-2">Your Answer</span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  // 渲染判断题
  const renderTrueFalseQuestion = (question: any) => {
    return (
      <div className="question-options mt-3">
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            name={`question-${question._id}`}
            id={`option-${question._id}-true`}
            checked={userAnswers[question._id]?.selectedOption === 0}
            onChange={() => handleTrueFalseAnswer(question._id, true)}
            disabled={quizSubmitted}
          />
          <label className="form-check-label" htmlFor={`option-${question._id}-true`}>
            True
          </label>
          {quizSubmitted && (
            <>
              {question.isTrueCorrect && (
                <span className="badge bg-success ms-2">Correct Answer</span>
              )}
              {userAnswers[question._id]?.selectedOption === 0 && !question.isTrueCorrect && (
                <span className="badge bg-danger ms-2">Your Answer</span>
              )}
            </>
          )}
        </div>
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            name={`question-${question._id}`}
            id={`option-${question._id}-false`}
            checked={userAnswers[question._id]?.selectedOption === 1}
            onChange={() => handleTrueFalseAnswer(question._id, false)}
            disabled={quizSubmitted}
          />
          <label className="form-check-label" htmlFor={`option-${question._id}-false`}>
            False
          </label>
          {quizSubmitted && (
            <>
              {!question.isTrueCorrect && (
                <span className="badge bg-success ms-2">Correct Answer</span>
              )}
              {userAnswers[question._id]?.selectedOption === 1 && question.isTrueCorrect && (
                <span className="badge bg-danger ms-2">Your Answer</span>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // 渲染填空题
  const renderFillInBlankQuestion = (question: any) => {
    return (
      <div className="question-options mt-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Your answer"
            value={userAnswers[question._id]?.textAnswer || ''}
            onChange={(e) => handleFillInBlankAnswer(question._id, e.target.value)}
            disabled={quizSubmitted}
          />
        </div>
        {quizSubmitted && (
          <div className="mt-2">
            {userAnswers[question._id]?.isCorrect ? (
              <div className="alert alert-success">
                Your answer is correct!
              </div>
            ) : (
              <div className="alert alert-danger">
                <p>Your answer is incorrect.</p>
                <p>Acceptable answers:</p>
                <ul>
                  {question.blankAnswers && question.blankAnswers.map((answer: any, index: number) => (
                    <li key={index}>{answer.text}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // 渲染问题
  const renderQuestion = (question: any, index: number) => {
    return (
      <div key={question._id} className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Question {index + 1}</h5>
          <span>{question.points} {question.points === 1 ? 'point' : 'points'}</span>
        </div>
        <div className="card-body">
          <h6 className="card-title">{question.title}</h6>
          <p className="card-text">{question.questionText}</p>
          
          {question.questionType === 'Multiple Choice' && renderMultipleChoiceQuestion(question)}
          {question.questionType === 'True/False' && renderTrueFalseQuestion(question)}
          {question.questionType === 'Fill in the Blank' && renderFillInBlankQuestion(question)}
          
          {quizSubmitted && (
            <div className="mt-3">
              {userAnswers[question._id]?.isCorrect ? (
                <div className="alert alert-success">
                  <strong>Correct!</strong> {question.feedback && <span> - {question.feedback}</span>}
                </div>
              ) : (
                <div className="alert alert-danger">
                  <strong>Incorrect!</strong> {question.feedback && <span> - {question.feedback}</span>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染预览页面
  const renderPreviewPage = () => {
    return (
      <div className="quiz-preview-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>{quiz.title}</h2>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`)}
          >
            Edit Quiz
          </button>
        </div>
        
        <div className="alert alert-info">
          <strong>Preview Mode:</strong> This is how students will see this quiz. Your answers will not be saved to the database.
        </div>
        
        <div className="card mb-4">
          <div className="card-body">
            <p><strong>Started:</strong> {formatDate(startTime)}</p>
            <p><strong>Time Limit:</strong> {quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'No time limit'}</p>
            <p><strong>Total Points:</strong> {quiz.points}</p>
            {quiz.instructions && (
              <>
                <h5>Instructions:</h5>
                <p>{quiz.instructions}</p>
              </>
            )}
          </div>
        </div>
        
        {quiz.questions && quiz.questions.map((question: any, index: number) => 
          renderQuestion(question, index)
        )}
        
        <div className="d-flex justify-content-between mt-4 mb-5">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
          >
            Cancel Preview
          </button>
          <button 
            className="btn btn-success"
            onClick={handleSubmitQuiz}
            disabled={quizSubmitted}
          >
            Submit Quiz
          </button>
        </div>
      </div>
    );
  };

  // 渲染结果页面
  const renderResultsPage = () => {
    return (
      <div className="quiz-results-container">
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">Quiz Results</h3>
          </div>
          <div className="card-body">
            <h4>{quiz.title}</h4>
            <p><strong>Started:</strong> {formatDate(startTime)}</p>
            <p><strong>Completed:</strong> {formatDate(new Date())}</p>
            <div className="score-summary text-center p-4">
              <h2>Your Score: {score.earned}/{score.total} ({score.percentage}%)</h2>
              <div className="progress">
                <div 
                  className={`progress-bar ${score.percentage >= 70 ? 'bg-success' : 'bg-danger'}`} 
                  role="progressbar" 
                  style={{ width: `${score.percentage}%` }} 
                  aria-valuenow={score.percentage} 
                  aria-valuemin={0} 
                  aria-valuemax={100}
                >
                  {score.percentage}%
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <h4>Question Details:</h4>
        {quiz.questions && quiz.questions.map((question: any, index: number) => 
          renderQuestion(question, index)
        )}
        
        <div className="d-flex justify-content-between mt-4 mb-5">
          <button 
            className="btn btn-primary"
            onClick={() => setCurrentStep('preview')}
          >
            Review Quiz
          </button>
          <button 
            className="btn btn-success"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`)}
          >
            Edit Quiz
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid py-4">
      {currentStep === 'preview' ? renderPreviewPage() : renderResultsPage()}
    </div>
  );
}
