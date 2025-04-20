/* eslint-disable @typescript-eslint/no-explicit-any */
import { CiSearch } from "react-icons/ci";
import QuizzesControls from "./QuizzesControls";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaCaretDown } from "react-icons/fa";
import { useEffect } from "react";
import { IoRocketOutline } from "react-icons/io5";
import * as coursesClient from "../client";
import { setQuizzes } from "./reducer";
import EachQuizControlButtons from "./EachQuizControlButtons";


export default function Quizzes() {

    // implement fetchQuizzes from server side
    
    const { cid } = useParams();
    const dispatch = useDispatch();
    const fetchQuizzes = async () => {
      console.log("➡️  about to fetch quizzes for course", cid);
      try {
        const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
        console.log("✅ fetch succeeded, quizzes:", quizzes);
        dispatch(setQuizzes(quizzes));
      } catch (err) {
        console.error("❌ fetchQuizzes error:", err);
      }
    }
    useEffect(() => {
        fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
    

    const quizAvailability = (quiz: any) => {
      const now = new Date();
      const start = new Date(quiz.availableDate);
      const end = new Date(quiz.until);
      if (now < start) {
        return `Not Available until ${start.toLocaleString()}`;
      } else if (now > end) {
        return "Closed";
      } else {
        return "Available";
      }

    }
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    
    // 根据用户角色过滤测验
    const filteredQuizzes = quizzes.filter((quiz: any) => {
      // 如果是教师或管理员，显示所有测验
      if (currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN") {
        return true;
      }
      // 如果是学生，只显示已发布的测验
      return quiz.published === true;
    });
  
  return (
    <div id="wd-quizzes">
      <div className="d-flex justify-content-between align-items-center mt-2">
        <div className="d-flex align-items-center position-relative">
          <CiSearch id="input-img" className="me-2 mb-1  position-absolute"/>
          <input placeholder="Search..." id="wd-search-quiz" style={{ height: "calc(2.375rem + 2px)" }}/>
        </div>
            {currentUser?.role === "FACULTY" && <QuizzesControls />}
            {currentUser?.role === "ADMIN" && <QuizzesControls />} 
      </div>
      <hr />


      <ul id="wd-quizzes-list" className="list-group rounded-0">
        <li className="wd-quiz-list list-group-item p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary">
                <FaCaretDown className="me-1 fs-5" />
                Quizzes
            </div>
            <ul className="wd-quizzes list-group rounded-0">
              {filteredQuizzes.length === 0 ? (
                <li className="list-group-item p-3 mb-5 fs-5 border-gray text-center">
                  <p>No quizzes available. {currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN" ? "Click the '+ Quiz' button to create a new quiz." : ""}</p>
                </li>
              ) : (
                filteredQuizzes.map((quiz: any)=>(
                  <li key={quiz._id} className="wd-quiz list-group-item p-3 mb-5 fs-5 border-gray d-flex align-items-center">
                    {/* <div className="me-3 d-flex align-items-center"> */}
                        <IoRocketOutline className="me-2 fs-3" />
                    {/* </div> */}
                    <div className="flex-grow-1">
                      <a
                        href={`#/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}
                        className="wd-quiz-link"
                        >
                        {quiz.title}
                      </a>
                      <br />
                      {quizAvailability(quiz)} |{" "} <b>Due</b> {formatDate(quiz?.dueDate)} | {quiz.points} pts | {quiz.questions?.length || 0} Questions
                    </div>
                    <div className="d-flex align-items-center">
                      {(currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN") && <EachQuizControlButtons quiz={quiz}/>}
                    </div>
                  </li>
                ))
              )}
            </ul>
            

        </li>
      </ul>
    </div>
  )
}
