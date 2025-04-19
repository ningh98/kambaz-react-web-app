/* eslint-disable @typescript-eslint/no-explicit-any */
import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import { FaAlignJustify } from "react-icons/fa";
import PeopleTable from "./People/Table";
import { useState, useEffect } from "react";
import * as client from "./client"
import Quizzes from "./Quizzes";
import QuizEditor from "./Quizzes/Editor";
import Questions from "./Quizzes/Questions";
import QuizPreview from "./Quizzes/QuizPreview";
import QuizDetail from "./Quizzes/QuizDetail";

export default function Courses({ courses }: { courses: any[]; }) {
  const { cid } = useParams();
  const [users, setUser] = useState<any>({});
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();
  
  const findUsersForCourse = async () => {
    const users = await client.findUsersForCourse(cid as string);
    setUser(users);
  }

  useEffect(() => {
    findUsersForCourse();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name} &gt; {pathname.split("/")[4]}
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation />
        </div>
        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />
            <Route path="Quizzes" element={<Quizzes />}/>
            <Route path="Quizzes/new" element={<QuizEditor />} />
            <Route path="Quizzes/:qid" element={<QuizDetail />} />
            
            <Route path="Quizzes/:qid/Edit" element={<QuizEditor />}>
                <Route path="Questions" element={<Questions />}/>
              </Route>
            <Route path="Quizzes/:qid/preview" element={<QuizPreview />} />
            <Route path="People" element={<PeopleTable users={users}/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
