/* eslint-disable @typescript-eslint/no-explicit-any */
import { CiSearch } from "react-icons/ci";
import QuizzesControls from "./QuizzesControls";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCaretDown } from "react-icons/fa";


export default function Quizzes() {

    // implement fetchQuizzes from server side
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cid } = useParams();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fetchQuizzes = async () => {

    }

    
    const { currentUser } = useSelector((state: any) => state.accountReducer);
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
              
            </ul>
            

        </li>
      </ul>
    </div>
  )
}
