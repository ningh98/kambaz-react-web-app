
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";

import { useLocation } from "react-router";
import { Link, Outlet } from "react-router-dom";



export default function QuizEditor() {
    const { cid } = useParams();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({
        _id: "",
        title: "New Quiz",
        instructions: "New Quiz Instructions",
        quizType: "gradedQuiz",
        points: 100,
        assignmentsGroup: "quizzes",
        shuffleAnswers: true,
        timeLimit: 20,
        multiplyAttempts: false,
        numberOfAttempts: 1,
        showCorrectAnswers: false,
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionAfterAnswer: false,
        dueDate: "",
        availableDate: "",
        until: "",
        course: cid,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setQuiz({ ...quiz, [e.target.name]: e.target.value})
      }
    
      const handleSave = async () => {
        // if (!validate()) return;
    
        // if (isNewAssignment) {
        //   // Create a new assignment
        //   await addNewAssignment();
          
        // } else {
        //   await updateAssignmentOnServer(assignment);
        // }
        
    
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      };

  return (
    <div id="wd-quizzes-editor">
        <div id="wd-quiz-status" className="d-flex justify-content-end">
            <span className="me-2">Points</span>
            <span className="me-2">0</span>
            <span className="me-2">Not Publish</span>
        </div>
        <div id="wd-quiz-tabs">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <Link to="" className={`nav-link ${pathname.includes("Question") ? "text-danger" : "active"}`}>Detail</Link>
                </li>
                <li className="nav-item">
                    <Link to="Questions" className={`nav-link  ${pathname.includes("Question") ? "active" : "text-danger"}`}>Question</Link>
                </li>
            </ul>
        </div>
       <Outlet/>

       {!pathname.includes("Question") && (
       <div id="wd-quiz-editor-details">
        <div id="wd-quiz-name" className="mb-3">
            <input name="title" value={quiz?.title} className="form-control mt-3" onChange={handleChange}/>
        </div>

        <div>
            <label htmlFor="instructions" className="d-block">Quiz instructions:</label>
            <textarea name="instructions" value={quiz?.instructions} id="wd-quiz-instructions" className="form-control" onChange={handleChange}></textarea>
        </div>

        <div className="row mt-3">
            <div className="col-4 text-end">
                <label htmlFor="wd-quiz-type" className="mt-2">Quiz Type</label>
            </div>
            <div className="col-8">
                <select className="form-select" id="wd-quiz-type">
                <option value="gradedQuiz">Graded Quiz</option>
                <option value="practiceQuizzes"> Practice Quiz</option>
                <option value="gradedSurvey">Graded Survey</option>
                <option value="ungradedSurvey">Ungraded Survey</option>
            </select>
            </div>
        </div>

        <div className="row mt-3">
            <div className="col-4 text-end">
                <label htmlFor="wd-points">Points</label>
            </div>
            <div className="col-8">
                <input name="points" id="wd-quiz-points" className="form-control" value={quiz?.points} onChange={handleChange}/> 
                
            </div>
        </div>

        <div className="row mt-3">
            <div className="col-4 text-end">
                <label htmlFor="wd-assign-group">Assignment Group</label>
            </div>
            <div className="col-8">
                <select className="form-select" id="wd-assign-group">
                    <option value="quizzes">QUIZZES</option>
                    <option value="assignments">ASSIGNMENTS</option>
                    <option value="exams">EXAMS</option>
                    <option value="project">PROJECT</option>
                </select>
            </div>
        </div>

        <div className="row mt-3">
            <div className="col-5 offset-4">
                <p style={{ fontWeight: "bold" }}>Options:</p>
            </div>
            <div className="col-5 offset-4 mt-2">
              <input type="checkbox" id="wd-shuffle-answers" />
              <label htmlFor="wd-shuffle-answers" className="ms-2">Shuffle Anwswers</label>
            </div>
            <div className="col-5 offset-4 mt-2">
              <input type="checkbox" checked id="wd-time-limit" />
              <label htmlFor="wd-time-limit" className="ms-2">Time Limit</label>
              <input type="form-control" className="offset-3 w-25" onChange={handleChange} />
              <span className="ms-2">Minutes</span>
            </div>
            <div className="col-5 offset-4 mt-3 border border-2">
              <input type="checkbox" id="wd-multiple-attempts" />
              <label htmlFor="wd-multiple-attempts" className="ms-2">Allow Multiple Attempts</label>
            </div>
            <div className="col-5 offset-4 mt-3">
              <input type="checkbox" id="wd-show-correct-answers" />
              <label htmlFor="wd-show-correct-answers" className="ms-2">Show Correct Answers</label>
            </div>
            <div className="col-5 offset-4 mt-2">
              <label htmlFor="wd-access-code" className="ms-2 me-3 ">Access Code: </label>
              <input type="form-control" id="wd-access-code" />
            </div>
            <div className="col-5 offset-4 mt-2">
              <input type="checkbox" id="wd-one-question-at-a-time" />
              <label htmlFor="wd-one-question-at-a-time" className="ms-2">One Question at a Time</label>
            </div>
            <div className="col-5 offset-4 mt-2">
              <input type="checkbox" id="wd-webcam-required" />
              <label htmlFor="wd-webcam-required" className="ms-2">Webcam Required</label>
            </div>
            <div className="col-5 offset-4 mt-2">
              <input type="checkbox" id="wd-lock-questions-after-answering" />
              <label htmlFor="wd-lock-questions-after-answering" className="ms-2">Lock Questions After Answering</label>
            </div>

        </div>
        <div className="row mt-3">
        <div className="col-4 text-end">
            <label>Assign</label>

        </div>
        <div className="col-8 mb-5">
                <div className="form-control">
                <div className="mb-3">
                <label htmlFor="wd-assign-to">Assign to</label>
                <input id="wd-assign-to" value="Everyone"  className="form-control"/>
                </div>
                <div className="mb-3">
                <label htmlFor="wd-due-date">Due</label>
                <input name="dueDate" type="date" id="wd-due-date" value={quiz?.dueDate.substring(0, 10) || ""} className="form-control" onChange={handleChange}/>
                </div>
                <div className="row mb-3">
                    <div className="col-6">
                    <label htmlFor="">Available from</label>
                    <input name="availableDate" type="date" id="wd-available-from" className="form-control" value={quiz?.availableDate.substring(0, 10) || ""} onChange={handleChange}/>
                    </div>
                    <div className="col-6">
                    <label htmlFor="">Until</label>
                    <input name="until" type="date" id="wd-available-until"className="form-control" value={quiz?.until.substring(0, 10) || ""} onChange={handleChange}/>
                    </div>
                </div>
                
                
                </div>
            </div>
        </div>
        
        
        <hr />
            <div>
                <button type="button" onClick={handleSave} className="btn btn-lg btn-danger me-1 float-end">Save</button>
                <button type="button" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}className="btn btn-lg btn-secondary me-1 float-end">Cancel</button>
            </div>

       </div>
       
       )}
    </div>
  )
}
