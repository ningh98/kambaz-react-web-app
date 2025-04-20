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

// Quiz submission type definition
interface QuizSubmission {
  _id?: string;
  quizId: string | undefined;
  courseId: string | undefined;
  studentId: string;
  answers: UserAnswers;
  score: {
    earned: number;
    total: number;
    percentage: number;
  };
  startTime: string;
  endTime: string;
  timeSpent: number; // in seconds
  attemptNumber?: number;
}

export default function QuizTake() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const quiz = quizzes.find((q: any) => q._id === qid);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const [currentStep, setCurrentStep] = useState<'taking' | 'results' | 'history' | 'unavailable'>('taking');
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState({ earned: 0, total: 0, percentage: 0 });
  const [startTime] = useState(new Date());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  // New state variables for attempt tracking
  const [previousAttempts, setPreviousAttempts] = useState<QuizSubmission[]>([]);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [currentAttemptNumber, setCurrentAttemptNumber] = useState<number>(1);
  const [attemptLimitReached, setAttemptLimitReached] = useState<boolean>(false);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState<boolean>(true);
  const [selectedAttempt, setSelectedAttempt] = useState<QuizSubmission | null>(null);

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

  // Fetch previous attempts and check if student can take the quiz
  useEffect(() => {
    const fetchPreviousAttempts = async () => {
      if (!currentUser || !qid) return;
      
      setIsLoadingAttempts(true);
      try {
        console.log('Fetching attempts for quiz:', qid, 'and student:', currentUser._id);
        const response = await axios.get(
          `${import.meta.env.VITE_REMOTE_SERVER}/api/quizzes/${qid}/submissions/student/${currentUser._id}`
        );
        
        console.log('Response from server:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          // Sort attempts by date (newest first)
          const sortedAttempts = response.data.sort((a, b) => 
            new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
          );
          
          console.log('Sorted attempts:', sortedAttempts);
          setPreviousAttempts(sortedAttempts);
          
          // Check if quiz is available
          const now = new Date();
          const availableFrom = quiz?.availableDate ? new Date(quiz.availableDate) : null;
          const availableUntil = quiz?.untilDate ? new Date(quiz.untilDate) : null;
          
          // If quiz is not available, disable new attempts
          if ((availableFrom && now < availableFrom) || (availableUntil && now > availableUntil)) {
            console.log('Quiz is not available at this time:', {
              now,
              availableFrom,
              availableUntil
            });
            setAttemptLimitReached(true);
            setCurrentStep('unavailable');
            setIsLoadingAttempts(false);
            return;
          }
          
          // Check if student has reached the attempt limit
          if (quiz?.multipleAttempts && quiz?.attemptsAllowed) {
            const attemptsUsed = sortedAttempts.length;
            const remaining = Number(quiz.attemptsAllowed) - attemptsUsed;
            
            console.log('Quiz settings:', {
              multipleAttempts: quiz.multipleAttempts,
              attemptsAllowed: quiz.attemptsAllowed,
              attemptsUsed,
              remaining
            });
            
            setAttemptsRemaining(remaining);
            setCurrentAttemptNumber(attemptsUsed + 1);
            
            if (remaining <= 0) {
              console.log('Attempt limit reached, disabling new attempts');
              setAttemptLimitReached(true);
              // If attempts are exhausted, show the most recent attempt results
              if (sortedAttempts.length > 0) {
                setSelectedAttempt(sortedAttempts[0]);
                setCurrentStep('history');
              }
            } else {
              console.log('Attempts still available:', remaining);
              setAttemptLimitReached(false);
            }
          } else if (!quiz?.multipleAttempts && sortedAttempts.length > 0) {
            // If quiz doesn't allow multiple attempts and student has already taken it
            console.log('Quiz does not allow multiple attempts and student has already taken it');
            setAttemptLimitReached(true);
            setSelectedAttempt(sortedAttempts[0]);
            setCurrentStep('history');
          } else {
            console.log('Quiz does not allow multiple attempts or attemptsAllowed is not set:', {
              multipleAttempts: quiz?.multipleAttempts,
              attemptsAllowed: quiz?.attemptsAllowed
            });
          }
        }
      } catch (error) {
        console.error("Error fetching previous attempts:", error);
      } finally {
        setIsLoadingAttempts(false);
      }
    };
    
    fetchPreviousAttempts();
  }, [currentUser, qid, quiz]);

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
      const quizSubmission: QuizSubmission = {
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
        timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000), // in seconds
        attemptNumber: currentAttemptNumber
      };
      
      await axios.post(`${import.meta.env.VITE_REMOTE_SERVER}/api/quizzes/${qid}/submissions`, quizSubmission);
      
      // Refresh the previous attempts list
      const response = await axios.get(
        `${import.meta.env.VITE_REMOTE_SERVER}/api/quizzes/${qid}/submissions/student/${currentUser._id}`
      );
      
      if (response.data && Array.isArray(response.data)) {
        // Sort attempts by date (newest first)
        const sortedAttempts = response.data.sort((a, b) => 
          new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
        );
        
        setPreviousAttempts(sortedAttempts);
        
        // Update attempts remaining
        if (quiz?.multipleAttempts && quiz?.attemptsAllowed) {
          const attemptsUsed = sortedAttempts.length;
          const remaining = quiz.attemptsAllowed - attemptsUsed;
          
          setAttemptsRemaining(remaining);
          
          if (remaining <= 0) {
            setAttemptLimitReached(true);
          }
        }
      }
      
      setQuizSubmitted(true);
      setCurrentStep('results');
    } catch (error) {
      console.error("Error submitting quiz:", error);
      if (error.response && error.response.status === 403) {
        // 显示具体的错误消息，如"多次尝试不允许"或"已达到最大尝试次数"
        setSubmissionError(error.response.data.message || "You have reached the maximum number of attempts for this quiz.");
        
        // 更新状态，禁用新的尝试
        setAttemptLimitReached(true);
        
        // 如果有尝试历史，显示最近的尝试结果
        if (previousAttempts.length > 0) {
          setSelectedAttempt(previousAttempts[0]);
          setCurrentStep('history');
        }
      } else {
        setSubmissionError("Failed to submit quiz. Please try again.");
      }
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
            
            {quiz.multipleAttempts && (
              <>
                <p><strong>Attempt:</strong> {currentAttemptNumber} of {quiz.attemptsAllowed}</p>
                <p><strong>Attempts Remaining:</strong> {attemptsRemaining}</p>
              </>
            )}
            
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
          
          {quiz.multipleAttempts && attemptsRemaining && attemptsRemaining > 0 ? (
            <button 
              className="btn btn-warning"
              onClick={() => {
                // Reset for a new attempt
                setQuizSubmitted(false);
                setCurrentStep('taking');
                setUserAnswers({});
                setScore({ earned: 0, total: 0, percentage: 0 });
                const newStartTime = new Date();
                setStartTime(newStartTime);
                if (quiz.timeLimit) {
                  setTimeRemaining(quiz.timeLimit * 60);
                }
              }}
            >
              Take Quiz Again
            </button>
          ) : null}
          
          {previousAttempts.length > 0 && (
            <button 
              className="btn btn-info"
              onClick={() => setCurrentStep('history')}
            >
              View Attempt History
            </button>
          )}
          
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

  // Render quiz history page
  const renderHistoryPage = () => {
    if (isLoadingAttempts) {
      return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
    }
    
    if (previousAttempts.length === 0) {
      return (
        <div className="alert alert-info">
          You have not attempted this quiz yet.
        </div>
      );
    }
    
    return (
      <div className="quiz-history-container">
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">Your Quiz Attempts</h3>
          </div>
          <div className="card-body">
            <h4>{quiz.title}</h4>
            
            {quiz.multipleAttempts && (
              <div className="alert alert-info">
                <p><strong>Attempts Allowed:</strong> {quiz.attemptsAllowed}</p>
                <p><strong>Attempts Used:</strong> {previousAttempts.length}</p>
                <p><strong>Attempts Remaining:</strong> {attemptsRemaining}</p>
              </div>
            )}
            
            <div className="table-responsive mt-4">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Attempt #</th>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {previousAttempts.map((attempt: QuizSubmission, index: number) => (
                    <tr key={attempt._id || index}>
                      <td>{attempt.attemptNumber || (previousAttempts.length - index)}</td>
                      <td>{formatDate(new Date(attempt.endTime))}</td>
                      <td>
                        {/* 适应后端返回的实际数据结构 */}
                        {attempt.score && typeof attempt.score === 'object' && 'earned' in attempt.score ? (
                          <>
                            {attempt.score.earned}/{attempt.score.total} ({attempt.score.percentage}%)
                          </>
                        ) : (
                          <>
                            {attempt.score || 0}/{attempt.totalPoints || 0} ({attempt.score && attempt.totalPoints ? Math.round((attempt.score / attempt.totalPoints) * 100) : 0}%)
                          </>
                        )}
                        <div className="progress mt-1" style={{ height: '5px' }}>
                          <div 
                            className={`progress-bar ${
                              attempt.score && typeof attempt.score === 'object' && 'percentage' in attempt.score
                                ? attempt.score.percentage >= 70 ? 'bg-success' : 'bg-danger'
                                : attempt.score && attempt.totalPoints
                                  ? (attempt.score / attempt.totalPoints) * 100 >= 70 ? 'bg-success' : 'bg-danger'
                                  : 'bg-danger'
                            }`} 
                            role="progressbar" 
                            style={{ 
                              width: `${
                                attempt.score && typeof attempt.score === 'object' && 'percentage' in attempt.score
                                  ? attempt.score.percentage
                                  : attempt.score && attempt.totalPoints
                                    ? (attempt.score / attempt.totalPoints) * 100
                                    : 0
                              }%` 
                            }} 
                            aria-valuenow={
                              attempt.score && typeof attempt.score === 'object' && 'percentage' in attempt.score
                                ? attempt.score.percentage
                                : attempt.score && attempt.totalPoints
                                  ? (attempt.score / attempt.totalPoints) * 100
                                  : 0
                            } 
                            aria-valuemin={0} 
                            aria-valuemax={100}
                          ></div>
                        </div>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setSelectedAttempt(attempt);
                            
                            // 转换答案格式以适应前端期望的格式
                            const formattedAnswers: UserAnswers = {};
                            if (Array.isArray(attempt.answers)) {
                              attempt.answers.forEach((answer: any) => {
                                formattedAnswers[answer.questionId] = {
                                  selectedOption: answer.selectedOptionIndex,
                                  textAnswer: answer.blankAnswer,
                                  isCorrect: answer.isCorrect
                                };
                              });
                            }
                            setUserAnswers(formattedAnswers);
                            
                            // 转换分数格式以适应前端期望的格式
                            const formattedScore = {
                              earned: attempt.score || 0,
                              total: attempt.totalPoints || 0,
                              percentage: attempt.score && attempt.totalPoints 
                                ? Math.round((attempt.score / attempt.totalPoints) * 100) 
                                : 0
                            };
                            setScore(formattedScore);
                            
                            setQuizSubmitted(true);
                            setCurrentStep('results');
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between mt-4 mb-5">
          {!attemptLimitReached && (
            <button 
              className="btn btn-primary"
              onClick={() => {
                setQuizSubmitted(false);
                setCurrentStep('taking');
                
                // Reset answers for a new attempt
                if (quiz && quiz.questions) {
                  const initialAnswers: UserAnswers = {};
                  quiz.questions.forEach((question: any) => {
                    initialAnswers[question._id] = {};
                  });
                  setUserAnswers(initialAnswers);
                  
                  // Reset timer if quiz has time limit
                  if (quiz.timeLimit) {
                    setTimeRemaining(quiz.timeLimit * 60);
                  }
                }
              }}
            >
              Take New Attempt
            </button>
          )}
          
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

  // Render unavailable page
  const renderUnavailablePage = () => {
    return (
      <div className="quiz-unavailable-container">
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">Quiz Unavailable</h3>
          </div>
          <div className="card-body">
            <h4>{quiz.title}</h4>
            <p>This quiz is not available at this time.</p>
            <p>Please try again later.</p>
          </div>
        </div>
        
        <div className="d-flex justify-content-between mt-4 mb-5">
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

  // Add a button to view quiz history in the navigation
  const renderNavigation = () => {
    return (
      <div className="d-flex justify-content-between mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
        >
          Back to Quizzes
        </button>
        
        {previousAttempts.length > 0 && currentStep !== 'history' && (
          <button
            className="btn btn-outline-info"
            onClick={() => setCurrentStep('history')}
          >
            View Previous Attempts
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="container-fluid py-4">
      {renderNavigation()}
      
      {currentStep === 'taking' && renderTakingPage()}
      {currentStep === 'results' && renderResultsPage()}
      {currentStep === 'history' && renderHistoryPage()}
      {currentStep === 'unavailable' && renderUnavailablePage()}
    </div>
  );
}