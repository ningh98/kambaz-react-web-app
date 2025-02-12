/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { enrollCourse, unenrollCourse } from "./Courses/Enrollments/reducer";
import { useDispatch } from "react-redux";
export default function Dashboard( {
  courses, course, setCourse, addNewCourse,
  deleteCourse, updateCourse }: {
  courses: any[]; course: any; setCourse: (course: any) => void;
  addNewCourse: () => void; deleteCourse: (course: any) => void;
  updateCourse: () => void; })
 {

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const enrollments = useSelector((state: any) => state.enrollmentsReducer.enrollments);
  const [showAllCourse, setShowAllCourse] = useState(false);
  const dispatch = useDispatch();
  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (enr: any) => enr.user === currentUser?._id && enr.course === courseId
    );
  };
 
  const toggleEnrollmentView = () => setShowAllCourse(!showAllCourse);
  const displayCourses = showAllCourse ? courses : courses.filter((c) => isEnrolled(c._id));
  
  const handleEnroll = (course: string) => {
    dispatch(enrollCourse({ user: currentUser._id, course }));
  };

  const handleUnenroll = (course: string) => {
    dispatch(unenrollCourse({ user: currentUser._id, course }));
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
      
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
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
                  {currentUser?.role === "STUDENT" && showAllCourse && (
                    isEnrolled(course._id) ? (
                      <button className="btn btn-danger float-end" onClick={(e) => {
                        e.preventDefault();
                        handleUnenroll(course._id);
                      }}>
                        Unenroll
                      </button>
                    ) : (
                      <button className="btn btn-success float-end" onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleEnroll(course._id);
                      }}>
                        Enroll
                      </button>
                    )
                  )}
                  {currentUser?.role === "STUDENT" && !showAllCourse && <button className="btn btn-danger float-end" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleUnenroll(course._id);
                      }}> Unenroll </button>}
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


