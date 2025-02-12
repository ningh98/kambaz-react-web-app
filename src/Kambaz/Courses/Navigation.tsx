import { Link, useLocation, useParams } from "react-router-dom";
export default function CourseNavigation() {
  const { pathname } = useLocation();
  const { cid } = useParams();
  const path = `/Kambaz/Courses/${cid}`;
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
  
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link, index) => (
        <Link key={`${cid}-${link}-${index}`} to={`${path}/${link}`} className={`list-group-item border border-0 ${pathname.includes(link) ? "active" : "text-danger"}`}>
          {link}
        </Link>
      )
      )
      }
      
    </div>
  );
}



