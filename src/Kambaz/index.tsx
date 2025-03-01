/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Routes, Route, Navigate } from "react-router";
import "./style.css"
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import * as userClient from "./Account/client";
import * as courseClient from "./Courses/client";
import { useEffect, useState } from "react";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setEnrollments } from "./Courses/Enrollments/reducer";
export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [course, setCourse]= useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-9-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description"
  });
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();

  const fetchCourses = async () => {
    try {
      const courses = await userClient.findMyCourses();
      const enrollments = await userClient.findEnrollmentsForUser()
      setCourses(courses);
      dispatch(setEnrollments(enrollments));
    } catch (error) {
      console.error(error);
    }
  };

  const displayAllCourses = async () => {
    try {
      const courses = await courseClient.fetchAllCourses(); 
      setAllCourses(courses);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchCourses();
  }, [currentUser]);

  const addNewCourse = async () => {
    const newCourse = await userClient.createCourse(course);
    setCourses([...courses, newCourse]);
  }
  const deleteCourse = async (courseId: string) => {
    
    await courseClient.deleteCourse(courseId);
    setCourses(courses.filter((course) => course._id !== courseId))
  }
  const updateCourse = async () => {
    await courseClient.updateCourse(course);
    setCourses(
      courses.map((c) => {
        if (c._id === course._id) {
          return course;
        } else {
          return c;
        }
      })
    );
  };
  return (
    <Session>
    <div id="wd-kambaz">
            <KambazNavigation />
          <div className="wd-main-content-offset p-3">
            <Routes>
              <Route path="/" element={<Navigate to="Account" />} />
              <Route path="/Account/*" element={<Account />} />
              <Route path="/Dashboard" element={
                <ProtectedRoute>
                <Dashboard
                  courses={courses}
                  allCourses={allCourses}
                  course={course}
                  setCourse={setCourse}
                  addNewCourse={addNewCourse}
                  deleteCourse={deleteCourse}
                  updateCourse={updateCourse}
                  displayAllCourses={displayAllCourses}
                  fetchCourses={fetchCourses}/>
                </ProtectedRoute>
              } />
                
              <Route path="/Courses/:cid/*" element={
                <ProtectedRoute>
                  <Courses courses={courses}/>
                </ProtectedRoute>} />
              <Route path="/Calendar" element={<h1>Calendar</h1>} />
              <Route path="/Inbox" element={<h1>Inbox</h1>} />
            </Routes>
          </div>
    </div>
    </Session>
  );
}
