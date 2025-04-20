/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import * as courseClient from "../client";
import { useLocation } from "react-router";
import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addQuiz, updateQuiz } from "./reducer";


export default function QuizEditor() {
    const { cid,qid } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { pathname } = useLocation();
    const isNewQuiz = !qid || qid === "new"
    const existingQuiz = quizzes.find((quiz: { _id: string | undefined; }) => quiz._id === qid)
    
    // 权限检查 - 如果不是教师或管理员，重定向到测验列表页面
    useEffect(() => {
      if (currentUser?.role !== "FACULTY" && currentUser?.role !== "ADMIN") {
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      }
    }, [currentUser, cid, navigate]);
    
    // 如果正在重定向，不渲染内容
    if (currentUser?.role !== "FACULTY" && currentUser?.role !== "ADMIN") {
      return null;
    }
    
    const [quiz, setQuiz] = useState(existingQuiz ||{
        _id: "",
        title: "New Quiz",
        instructions: "New Quiz Instructions",
        quizType: "Graded Quiz",
        points: 100,
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        timeLimit: 20,
        multipleAttempts: false,
        attemptsAllowed: 1,
        showCorrectAnswers: false,
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        dueDate: "",
        availableDate: "",
        untilDate: "",
        course: cid,
        published: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setQuiz({ ...quiz, [e.target.name]: e.target.value})
      }
    const addNewQuiz = async () => {
        if (!cid) return;
        const newQuiz = { ...quiz }
        console.log("creating quiz for course", cid, quiz);
        const createdQuiz = await courseClient.createQuizForCourse(cid, newQuiz);
        dispatch(addQuiz(createdQuiz));
    

    }

    const updateQuizOnServer = async (quiz: any) => {
        const updatedQuiz = await courseClient.updateQuiz(quiz);
        dispatch(updateQuiz(updatedQuiz));
    }
      const validate = () => {

        if (!quiz.title.trim()) {
          alert("Please enter a title for the quiz.");
          return false;
        }
        if (!quiz.instructions.trim()) {
          alert("Please enter the instructions for the quiz.");
          return false;
        }
        if (!quiz.points) {
          alert("Please enter the points for the quiz.");
          return false;
        }
        if (!quiz.dueDate) {
          alert("Please select a due date.");
          return false;
        }
        if (!quiz.availableDate) {
          alert("Please select a available from date.");
          return false;
        }
        if (!quiz.untilDate) {
          alert("Please select a available until date.");
          return false;
        }
    
        return true;
      };
      const handleSave = async () => {
        if (!validate()) return;
    
        if (isNewQuiz) {
          // Create a new quiz
          await addNewQuiz();
          
        } else {
          await updateQuizOnServer(quiz);
        }
        
    
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      };
      
      const handleSaveAndPublish = async () => {
        // 先设置为已发布
        setQuiz(prevQuiz => ({ ...prevQuiz, published: true }));
        
        if (!validate()) return;
        
        if (isNewQuiz) {
          // 创建新测验时直接使用带有 published: true 的对象
          const newQuiz = { ...quiz, published: true };
          console.log("creating published quiz for course", cid, newQuiz);
          const createdQuiz = await courseClient.createQuizForCourse(cid, newQuiz);
          dispatch(addQuiz(createdQuiz));
        } else {
          // 更新现有测验时直接使用带有 published: true 的对象
          const updatedQuiz = { ...quiz, published: true };
          const result = await courseClient.updateQuiz(updatedQuiz);
          dispatch(updateQuiz(result));
        }
        
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      };
    
    
    
      

  return (
    <div id="wd-quizzes-editor">
        <div id="wd-quiz-status" className="d-flex justify-content-end">
            <span className="me-2">Points</span>
            <span className="me-2">{quiz.points || 0}</span>
            <span className="me-2">{quiz.published ? "Published" : "Not Published"}</span>
        </div>
        <div id="wd-quiz-tabs">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <Link to="" className={`nav-link ${pathname.includes("Questions") ? "text-danger" : "active"}`}>Detail</Link>
                </li>
                {!isNewQuiz && (
                    <li className="nav-item">
                        <Link to="Questions" className={`nav-link  ${pathname.includes("Questions") ? "active" : "text-danger"}`}>Questions</Link>
                    </li>
                )}
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
                <select 
                name="quizType"
                className="form-select" id="wd-quiz-type"
                value={quiz.quizType}
                onChange={handleChange}>
                <option value="Graded Quiz">Graded Quiz</option>
                <option value="Practice Quizzes"> Practice Quiz</option>
                <option value="GradedS urvey">Graded Survey</option>
                <option value="Ungraded Survey">Ungraded Survey</option>
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
                <select 
                name="assignmentGroup"
                value={quiz.assignmentGroup}
                onChange={handleChange}
                className="form-select" id="wd-assign-group">
                    <option value="Quizzes">QUIZZES</option>
                    <option value="Assignments">ASSIGNMENTS</option>
                    <option value="Exams">EXAMS</option>
                    <option value="Project">PROJECT</option>
                </select>
            </div>
        </div>

        <div className="row mt-3">
        <div className="col-5 offset-4">
            <p style={{ fontWeight: "bold" }}>Options:</p>
        </div>
        <div className="col-5 offset-4 mt-2">
          <input name="shuffleAnswers" type="checkbox" id="wd-shuffle-answers" 
          checked={quiz.shuffleAnswers}
          onChange={e => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })} />
          <label htmlFor="wd-shuffle-answers" className="ms-2">Shuffle Anwswers</label>
        </div>
        <div className="col-5 offset-4 mt-2">
          <input type="checkbox" id="wd-time-limit" 
            checked={quiz.timeLimit > 0}
            onChange={e => setQuiz({ ...quiz, timeLimit: e.target.checked ? 20 : 0 })} />
          <label htmlFor="wd-time-limit" className="ms-2">Time Limit</label>
          <input 
            type="number" 
            name="timeLimit"
            value={quiz.timeLimit}
            className="offset-3 w-25" 
            onChange={e => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) || 0 })} />
          <span className="ms-2">Minutes</span>
        </div>
        <div className="col-5 offset-4 mt-3 border border-2">
          <input name="multipleAttempts" checked={quiz.multipleAttempts}
          onChange={e => setQuiz({ ...quiz, multipleAttempts: e.target.checked })}
          type="checkbox" id="wd-multiple-attempts" />
          <label htmlFor="wd-multiple-attempts" className="ms-2">Allow Multiple Attempts</label>
          {quiz.multipleAttempts && (
            <div className="mt-2 mb-2">
              <label htmlFor="wd-attempts-allowed" className="me-2">Allowed Attempts:</label>
              <input 
                type="number" 
                id="wd-attempts-allowed"
                name="attemptsAllowed"
                min="1"
                max="10"
                value={quiz.attemptsAllowed}
                className="w-25" 
                onChange={e => setQuiz({ ...quiz, attemptsAllowed: parseInt(e.target.value) || 1 })}
              />
            </div>
          )}
        </div>
        <div className="col-5 offset-4 mt-3">
          <input type="checkbox" id="wd-show-correct-answers"
          name="showCorrectAnswers"
          checked={quiz.showCorrectAnswers}
          onChange={e => setQuiz({ ...quiz, showCorrectAnswers: e.target.checked })} />
          <label htmlFor="wd-show-correct-answers" className="ms-2">Show Correct Answers</label>
        </div>
        <div className="col-5 offset-4 mt-2">
          <label htmlFor="wd-access-code" className="ms-2 me-3 ">Access Code: </label>
          <input 
            type="text" 
            id="wd-access-code" 
            name="accessCode"
            value={quiz.accessCode}
            onChange={handleChange} />
        </div>
        <div className="col-5 offset-4 mt-2">
          <input type="checkbox" id="wd-one-question-at-a-time"
          name="oneQuestionAtATime"
          checked={quiz.oneQuestionAtATime}
          onChange={e => setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })}
           />
          <label htmlFor="wd-one-question-at-a-time" className="ms-2">One Question at a Time</label>
        </div>
        <div className="col-5 offset-4 mt-2">
          <input type="checkbox" id="wd-webcam-required"
          name="webcamRequired"
          checked={quiz.webcamRequired}
          onChange={e => setQuiz({ ...quiz, webcamRequired: e.target.checked })} />
          <label htmlFor="wd-webcam-required" className="ms-2">Webcam Required</label>
        </div>
        <div className="col-5 offset-4 mt-2">
          <input type="checkbox" id="wd-lock-questions-after-answering"
          name="lockQuestionsAfterAnswering"
          checked={quiz.lockQuestionsAfterAnswering}
          onChange={e => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })} />
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
            <input 
              name="dueDate" 
              type="date" 
              id="wd-due-date" 
              value={quiz?.dueDate.substring(0, 10) || ""} 
              className="form-control" 
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]} 
            />
            </div>
            <div className="row mb-3">
                <div className="col-6">
                <label htmlFor="">Available from</label>
                <input 
                  name="availableDate" 
                  type="date" 
                  id="wd-available-from" 
                  className="form-control" 
                  value={quiz?.availableDate.substring(0, 10) || ""} 
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} 
                  max={quiz?.untilDate?.substring(0, 10) || quiz?.dueDate?.substring(0, 10)} 
                />
                </div>
                <div className="col-6">
                <label htmlFor="">Until</label>
                <input 
                  name="untilDate" 
                  type="date" 
                  id="wd-available-until"
                  className="form-control" 
                  value={quiz?.untilDate.substring(0, 10) || ""} 
                  onChange={handleChange}
                  min={quiz?.availableDate?.substring(0, 10) || new Date().toISOString().split('T')[0]} 
                />
                </div>
            </div>
            
            
            </div>
        </div>
    </div>
        
        
        <hr />
            <div>
                <button 
                  type="button" 
                  onClick={handleSaveAndPublish} 
                  className="btn btn-lg btn-success me-1 float-end">
                  Save & Publish
                </button>
                <button type="button" onClick={handleSave} className="btn btn-lg btn-danger me-1 float-end">Save</button>
                <button type="button" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}className="btn btn-lg btn-secondary me-1 float-end">Cancel</button>
            </div>

       </div>
       
       )}
    </div>
  )
}
