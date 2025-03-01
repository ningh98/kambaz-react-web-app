/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { enrollCourse, unenrollCourse } from "./Courses/Enrollments/reducer";
import { useDispatch } from "react-redux";
import * as userClient from "./Account/client";


export default function Dashboard( {
  courses, allCourses, course, setCourse, addNewCourse,
  deleteCourse, updateCourse, displayAllCourses, fetchCourses }: {
  courses: any[]; allCourses: any[]; course: any; setCourse: (course: any) => void;
  addNewCourse: () => void; deleteCourse: (course: any) => void;
  updateCourse: () => void; displayAllCourses: () => void; fetchCourses: () => void;
  })
 {

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  const [showAllCourse, setShowAllCourse] = useState(false);
  const dispatch = useDispatch();
  
  

 
  const toggleEnrollmentView = async() => {
    setShowAllCourse(!showAllCourse);
    // console.log("currentUser._id = ", currentUser._id);
    // console.log("enrollments = ", enrollments);
    if (!showAllCourse) {
      await displayAllCourses();
    } else {
      await fetchCourses()
    }
  };
 
  const displayCourses = showAllCourse ? allCourses : courses;

  
  
  const isEnrolled = ( courseId: string) => {
    return enrollments.some((e: any) => e.user === currentUser._id && e.course === courseId);
  };

  const handleEnrollCourse = async(course: string) => {
    const enrolledIn = await userClient.enrollUserInCourse(course);
    dispatch(enrollCourse(enrolledIn));
    // console.log(enrolledIn)
    // console.log("enrollments = ", enrollments);
    await fetchCourses();
  }

  const handleUnenroll = async (course: string) => {
    const unEnrolled = await userClient.unenrollUserInCourse(course);
    dispatch(unenrollCourse(unEnrolled));
    // console.log(unEnrolled)
    // console.log("enrollments = ", enrollments);
    await fetchCourses();
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <div id="wd-dashboard-enrollment">
        <button className={currentUser?.role === "STUDENT" ? "btn btn-primary float-end" : "d-none"}
                    id="wd-add-new-course-click"
                    onClick={toggleEnrollmentView} > Enrollments </button>
      </div>
      <div id="wd-add-update-courses" className={currentUser?.role !== "FACULTY" ? "d-none" : ""}>
        <h5>New Course
            
            <button className="btn btn-primary float-end"
                    id="wd-add-new-course-click"
                    onClick={addNewCourse} > Add </button>
            <button className="btn btn-warning float-end me-2"
                    onClick={updateCourse} 
                    id="wd-update-course-click"> Update </button>
        </h5><br />
        <input    value={course.name} className="form-control mb-2"
                  onChange={(e) => setCourse({ ...course, name: e.target.value })} />
        <textarea value={course.description} className="form-control"
                  onChange={(e) => setCourse({ ...course, description: e.target.value})}/>
        <hr />
      </div>
      
      <h2 id="wd-dashboard-published">
        {
         showAllCourse 
         ?
        `Published Courses (${allCourses.length})`
        :
        `Enrolled Courses (${courses.length})`
        }
        </h2> <hr />
      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {        
            displayCourses.map((course) => (
              

          <div key={course._id} className="wd-dashboard-course col" style={{ width: "300px"}}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                to={`/Kambaz/Courses/${course._id}/Home`}
                className="wd-dashboard-course-link text-decoration-none text-dark"
                onClick={(e) => {
                  if (!isEnrolled(course._id)) {
                    e.preventDefault();
                    
                    alert("You must enroll before accessing this course.");
                  }
                }} 
              >
                <img src="/images/reactjs.webp" width="100%" height={160} />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title text-nowrap ">
                    {course.name}
                  </h5>
                  <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 100 }}>
                    {course.description}
                  </p>
                  <button className="btn btn-primary"> Go </button>
                  {
                   !showAllCourse
                   ?(
                    currentUser?.role === "STUDENT" && <button className="btn btn-danger float-end" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleUnenroll(course._id);
                    }}> UnEnroll </button>
                   ) : (currentUser?.role === "STUDENT" && 
                    isEnrolled(course._id) ? 
                    (<button className="btn btn-danger float-end" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleUnenroll(course._id);
                      }}> UnEnroll </button>) 
                    : (<button className="btn btn-success float-end" 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleEnrollCourse(course._id);
                      }}> Enroll </button>))
                    
                   
                  }

                  <button onClick={(event) => {
                            event.preventDefault();
                            deleteCourse(course._id);
                          }} className={currentUser?.role === "FACULTY" ? "btn btn-danger float-end" : "d-none"}
                              id="wd-delete-course-click">
                    Delete
                  </button>
                  <button id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className={currentUser?.role === "FACULTY" ? "btn btn-warning me-2 float-end" : "d-none"} >
                    Edit
                  </button>
                  

                </div>
              </Link>
            </div>
          </div>

          ))}
          
        </div>
      </div>
    </div>
  );
}


