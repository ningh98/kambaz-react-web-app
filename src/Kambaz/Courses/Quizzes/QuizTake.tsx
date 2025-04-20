/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './QuizPreview.css';

// Answer type definition
interface UserAnswers {
  [questionId: string]: {
    selectedOption?: number;
    textAnswer?: string;
    isCorrect?: boolean;
  };
}

export default function QuizTake() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const quiz = quizzes.find((q: any) => q._id === qid);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const [currentStep, setCurrentStep] = useState<'taking' | 'results'>('taking');
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState({ earned: 0, total: 0, percentage: 0 });
  const [startTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Initialize user answers and timer
  useEffect(() => {
    if (quiz && quiz.questions) {
      const initialAnswers: UserAnswers = {};
      quiz.questions.forEach((question: any) => {
        initialAnswers[question._id] = {};
      });
      setUserAnswers(initialAnswers);
      
      // Set up timer if quiz has time limit
      if (quiz.timeLimit) {
        setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
      }
    }
  }, [quiz]);

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && !quizSubmitted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !quizSubmitted) {
      // Auto-submit when time runs out
      handleSubmitQuiz();
    }
  }, [timeRemaining, quizSubmitted]);

  // Anti-cheating: Add event listener for page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !quizSubmitted && quiz?.preventTabSwitching) {
        // Could implement a warning or counter here
        console.log("Tab switching detected during quiz");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [quizSubmitted, quiz]);

  // If quiz not found, show error message
  if (!quiz) {
    return (
      <div className="alert alert-danger">
        Quiz not found. Please go back to the quiz list.
      </div>
    );
  }

  // Format time remaining as MM:SS
  const formatTimeRemaining = () => {
    if (timeRemaining === null) return "No time limit";
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle multiple choice answer selection
  const handleMultipleChoiceAnswer = (questionId: string, optionIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: {
        ...userAnswers[questionId],
        selectedOption: optionIndex
      }
    });
  };

  // Handle true/false answer selection
  const handleTrueFalseAnswer = (questionId: string, isTrue: boolean) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: {
        ...userAnswers[questionId],
        selectedOption: isTrue ? 0 : 1
      }
    });
  };

  // Handle fill in the blank answer input
  const handleFillInBlankAnswer = (questionId: string, text: string) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: {
        ...userAnswers[questionId],
        textAnswer: text
      }
    });
  };

  // Submit quiz and grade it
  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmissionError(null);
    
    let earnedPoints = 0;
    let totalPoints = 0;
    
    const gradedAnswers = { ...userAnswers };
    
    quiz.questions.forEach((question: any) => {
      totalPoints += question.points;
      let isCorrect = false;
      
      if (question.questionType === 'Multiple Choice') {
        const userSelectedOption = userAnswers[question._id]?.selectedOption;
        if (userSelectedOption !== undefined) {
          isCorrect = question.options && question.options[userSelectedOption]?.isCorrect === true;
          if (isCorrect) {
            earnedPoints += question.points;
          }
        }
      } else if (question.questionType === 'True/False') {
        const userSelectedOption = userAnswers[question._id]?.selectedOption;
        if (userSelectedOption !== undefined) {
          isCorrect = (userSelectedOption === 0 && question.isTrueCorrect === true) || 
                     (userSelectedOption === 1 && question.isTrueCorrect === false);
          if (isCorrect) {
            earnedPoints += question.points;
          }
        }
      } else if (question.questionType === 'Fill in the Blank') {
        const userTextAnswer = userAnswers[question._id]?.textAnswer?.trim().toLowerCase();
        if (userTextAnswer) {
          isCorrect = question.blankAnswers && question.blankAnswers.some(
            (answer: any) => {
              if (answer.caseSensitive) {
                return answer.text === userAnswers[question._id]?.textAnswer?.trim();
              }
              return answer.text.toLowerCase() === userTextAnswer;
            }
          );
          if (isCorrect) {
            earnedPoints += question.points;
          }
        }
      }
      
      gradedAnswers[question._id] = {
        ...gradedAnswers[question._id],
        isCorrect
      };
    });
    
    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    
    setUserAnswers(gradedAnswers);
    setScore({ earned: earnedPoints, total: totalPoints, percentage });
    
    try {
      // Save quiz submission to database
      const quizSubmission = {
        quizId: qid,
        courseId: cid,
        studentId: currentUser._id,
        answers: gradedAnswers,
        score: {
          earned: earnedPoints,
          total: totalPoints,
          percentage
        },
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString(),
        timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000) // in seconds
      };
      
      await axios.post(`${process.env.REACT_APP_API_BASE}/api/quizzes/${qid}/submissions`, quizSubmission);
      
      setQuizSubmitted(true);
      setCurrentStep('results');
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setSubmissionError("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Render multiple choice question
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

  // Render true/false question
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

  // Render fill in the blank question
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

  // Render question
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

  // Render quiz taking page
  const renderTakingPage = () => {
    return (
      <div className="quiz-preview-container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>{quiz.title}</h2>
          {timeRemaining !== null && (
            <div className={`time-remaining ${timeRemaining < 60 ? 'text-danger' : ''}`}>
              <strong>Time Remaining:</strong> {formatTimeRemaining()}
            </div>
          )}
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
        
        {submissionError && (
          <div className="alert alert-danger mb-4">
            {submissionError}
          </div>
        )}
        
        <div className="d-flex justify-content-between mt-4 mb-5">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
          >
            Cancel Quiz
          </button>
          <button 
            className="btn btn-success"
            onClick={handleSubmitQuiz}
            disabled={quizSubmitted || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    );
  };

  // Render results page
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
            onClick={() => setCurrentStep('taking')}
          >
            Review Answers
          </button>
          <button 
            className="btn btn-success"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          >
            Return to Quizzes
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid py-4">
      {currentStep === 'taking' ? renderTakingPage() : renderResultsPage()}
    </div>
  );
}