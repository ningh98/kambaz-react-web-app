/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router"


export default function QuizDetail() {
    const { cid, qid } = useParams()
    const navigate = useNavigate()
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const existingQuiz = quizzes.find((quiz: { _id: string | undefined; }) => quiz._id === qid)

    // 检查用户是否有权限编辑测验
    const canEdit = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

    const base = `/Kambaz/Courses/${cid}/Quizzes/${qid}`

    function formatDate(dateString: string) {
        const date = new Date(dateString); // Parse the date string into a Date object
        const options: Intl.DateTimeFormatOptions = {
          month: "short", // Short month (e.g., "May")
          day: "numeric", // Day of the month (e.g., "6")
          hour: "numeric", // Hour (e.g., "12")
          minute: "numeric", // Minute (e.g., "00")
          hour12: true, // Use 12-hour clock (e.g., "am" or "pm")
        };
      
        return new Intl.DateTimeFormat("en-US", options).format(date); // Format the date
      }
  return (
    <>
    <div className="d-flex justify-content-center">
      <nav className="mb-3">
        {canEdit && (
          <>
            <button
              onClick={() => navigate(`${base}/edit`)}
              className="btn btn-outline-primary me-1"
            >
              Edit
            </button>
            <button
              onClick={() => navigate(`${base}/preview`)}
              className="btn btn-outline-primary me-1"
            >
              Preview
            </button>
          </>
        )}
        
        {/* 为学生用户添加 Start Quiz 按钮 */}
        {!canEdit && existingQuiz?.published && (
          <button
            onClick={() => navigate(`${base}/take`)}
            className="btn btn-success me-1"
          >
            Start Quiz
          </button>
        )}
      </nav>

      
    </div>
    <div id="wd-quiz-detail" className="border border-1 border-secondary ms-5 me-5 p-2">
        <h2 id="wd-quiz-detail-title" className="pb-2">{existingQuiz?.title}</h2>
        <div className="row align-items-center">
            <span className="col-4 text-end fw-bold">Quiz Type</span>
            <span className="col-7 text-start">{existingQuiz?.quizType}</span>

            <span className="col-4 text-end fw-bold">Points</span>
            <span className="col-7 text-start">{existingQuiz?.points}</span>

            <span className="col-4 text-end fw-bold">Assignment Group</span>
            <span className="col-7 text-start">{existingQuiz?.assignmentGroup}</span>

            <span className="col-4 text-end fw-bold">Shuffle Answers</span>
            <span className="col-7 text-start">{existingQuiz?.shuffleAnswers ? "Yes" : "No"}</span>

            <span className="col-4 text-end fw-bold">Time Limit</span>
            <span className="col-7 text-start">{existingQuiz?.timeLimit}</span>

            <span className="col-4 text-end fw-bold">Multiply Attempts</span>
            <span className="col-7 text-start">{existingQuiz?.multipleAttempts ? "Yes" : "No"}</span>

            <span className="col-4 text-end fw-bold">Number Of Attempts</span>
            <span className="col-7 text-start">{existingQuiz?.attemptsAllowed}</span>

            <span className="col-4 text-end fw-bold">Show Correct Answers</span>
            <span className="col-7 text-start">{existingQuiz?.showCorrectAnswers ? "Yes" : "No"}</span>

            <span className="col-4 text-end fw-bold">One Question At A Time </span>
            <span className="col-7 text-start">{existingQuiz?.oneQuestionAtATime ? "Yes" : "No"}</span>

            <span className="col-4 text-end fw-bold">Webcam Required </span>
            <span className="col-7 text-start">{existingQuiz?.webcamRequired ? "Yes" : "No"}</span>

            <span className="col-4 text-end fw-bold">Lock Question After Answer</span>
            <span className="col-7 text-start">{existingQuiz?.lockQuestionsAfterAnswering ? "Yes" : "No"}</span>
            <div className="mt-3 row">
                <span className="col-2 text-end fw-bold">Due</span>
                <span className="col-2 text-end fw-bold">For</span>
                <span className="col-3 text-end fw-bold">Available From</span>
                <span className="col-3 text-end fw-bold">Unitl</span>
                <hr />
                <span className="col-2 text-end">{formatDate(existingQuiz?.dueDate)}</span>
                <span className="col-2 text-end">Everyone</span>
                <span className="col-3 text-end">{formatDate(existingQuiz?.availableDate)}</span>
                <span className="col-3 text-end">{formatDate(existingQuiz?.untilDate)}</span>
                <hr />

            
            </div>
            
        </div>
    </div>
    </>
    
  )
}
