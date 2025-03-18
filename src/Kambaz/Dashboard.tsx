/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";



export default function Dashboard( {
  courses, course, setCourse, addNewCourse,
  deleteCourse, updateCourse, enrolling, setEnrolling, updateEnrollment }: {
  courses: any[]; course: any; setCourse: (course: any) => void;
  addNewCourse: () => void; deleteCourse: (course: any) => void;
  updateCourse: () => void; enrolling: boolean; setEnrolling: (enrolling: boolean) => void;
  updateEnrollment: (courseId: string, enrolled: boolean) => void;
  })
 {

  const { currentUser } = useSelector((state: any) => state.accountReducer);



  
  


  
  




 

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <div id="wd-dashboard-enrollment">
      <button onClick={() => setEnrolling(!enrolling)} className="float-end btn btn-primary" >
          {enrolling ? "My Courses" : "All Courses"}
        </button>
      </div>
      <div id="wd-add-update-courses" className={currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN"
        ? "" : "d-none"}>
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
         enrolling 
         ?
        `Published Courses (${courses.length})`
        :
        `Enrolled Courses (${courses.length})`
        }
        </h2> <hr />
      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {        
            courses.map((course) => (
              

          <div key={course._id} className="wd-dashboard-course col" style={{ width: "300px"}}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                to={`/Kambaz/Courses/${course._id}/Home`}
                className="wd-dashboard-course-link text-decoration-none text-dark"
                onClick={(e) => {
                  if (enrolling && !course.enrolled) {
                    e.preventDefault();
                    
                    alert("You must enroll before accessing this course.");
                  }
                }} 
              >
                <img src="/images/reactjs.webp" width="100%" height={160} />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title text-nowrap ">
                    {enrolling && (
                    <button 
                    onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        updateEnrollment(course._id, !course.enrolled);
                      }}
                    className={`btn ${ course.enrolled ? "btn-danger" : "btn-success" } float-end`} >
                      {course.enrolled ? "Unenroll" : "Enroll"}
                    </button>
                  )}
                    {course.name}
                  </h5>
                  <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 100 }}>
                    {course.description}
                  </p>
                  <button className="btn btn-primary"> Go </button>
                  

                  <button onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            deleteCourse(course._id);
                          }} className={currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN" 
                            ? "btn btn-danger float-end" : "d-none"}
                              id="wd-delete-course-click">
                    Delete
                  </button>
                  <button id="wd-edit-course-click"
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className={currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN"
                          ? "btn btn-warning me-2 float-end" : "d-none"} >
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


