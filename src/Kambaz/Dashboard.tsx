import { Link } from "react-router-dom";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link
            to="/Kambaz/Courses/1234/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/reactjs.webp" width={200} height={150} />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer{" "}
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link
            to="/Kambaz/Courses/1234/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/python.jpeg" width={200} height={150} />
            <div>
              <h5> CS1235 Python </h5>
              <p className="wd-dashboard-course-title">
                Python software developer{" "}
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          {" "}
          <Link
            to="/Kambaz/Courses/1234/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/java.png" width={200} height={150} />
            <div>
              <h5> CS1236 Java </h5>
              <p className="wd-dashboard-course-title">
                Java software developer{" "}
              </p>
              <button> Go </button>
            </div>
          </Link>{" "}
        </div>
        <div className="wd-dashboard-course">
          {" "}
          <Link
            to="/Kambaz/Courses/1234/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/c.png" width={200} height={150} />
            <div>
              <h5> CS1237 C </h5>
              <p className="wd-dashboard-course-title">
                C software developer{" "}
              </p>
              <button> Go </button>
            </div>
          </Link>{" "}
        </div>
        <div className="wd-dashboard-course">
          {" "}
          <Link
            to="/Kambaz/Courses/1234/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/c++.png" width={200} height={150} />
            <div>
              <h5> CS1238 C++ </h5>
              <p className="wd-dashboard-course-title">
                C++ software developer{" "}
              </p>
              <button> Go </button>
            </div>
          </Link>{" "}
        </div>
        <div className="wd-dashboard-course">
          {" "}
          <Link
            to="/Kambaz/Courses/1234/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/math.jpeg" width={200} height={150} />
            <div>
              <h5> CS1239 Math </h5>
              <p className="wd-dashboard-course-title">
                Introduction of Math{" "}
              </p>
              <button> Go </button>
            </div>
          </Link>{" "}
        </div>
        <div className="wd-dashboard-course">
          {" "}
          <Link
            to="/Kambaz/Courses/1234/Home"
            className="wd-dashboard-course-link"
          >
            <img src="/images/art.jpeg" width={200} height={150} />
            <div>
              <h5> CS1222 Art </h5>
              <p className="wd-dashboard-course-title">
                Introduction of Art{" "}
              </p>
              <button> Go </button>
            </div>
          </Link>{" "}
        </div>
      </div>
    </div>
  );
}
