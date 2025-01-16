import { Link } from "react-router-dom";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                to="/Kambaz/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img src="/images/reactjs.webp" width="100%" height={160} />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    {" "}
                    CS1234 React JS{" "}
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    Full Stack software developer
                  </p>
                  <button className="btn btn-primary"> Go </button>
                </div>
              </Link>
            </div>
          </div>
          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                to="/Kambaz/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img
                  src="/images/python.jpeg"
                  width={274}
                  height={160}
                  className="border"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    {" "}
                    CS1235 Python{" "}
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    Python software developer
                  </p>
                  <button className="btn btn-primary"> Go </button>
                </div>
              </Link>
            </div>
          </div>
          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                to="/Kambaz/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img
                  src="/images/java.png"
                  width={274}
                  height={160}
                  className="border"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    {" "}
                    CS1236 Java{" "}
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    Java software developer
                  </p>
                  <button className="btn btn-primary"> Go </button>
                </div>
              </Link>
            </div>
          </div>
          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                to="/Kambaz/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img
                  src="/images/c.png"
                  width={274}
                  height={160}
                  className="border"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    {" "}
                    CS1237 C{" "}
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    C software developer
                  </p>
                  <button className="btn btn-primary"> Go </button>
                </div>
              </Link>
            </div>
          </div>
          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                to="/Kambaz/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img
                  src="/images/c++.png"
                  width={274}
                  height={160}
                  className="border"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    {" "}
                    CS1238 C++{" "}
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    C++ software developer
                  </p>
                  <button className="btn btn-primary"> Go </button>
                </div>
              </Link>
            </div>
          </div>
          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                to="/Kambaz/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img
                  src="/images/math.jpeg"
                  width={274}
                  height={160}
                  className="border"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    {" "}
                    CS1239 Math{" "}
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    Introduction of Math
                  </p>
                  <button className="btn btn-primary"> Go </button>
                </div>
              </Link>
            </div>
          </div>
          <div className="wd-dashboard-course col" style={{ width: "300px" }}>
            <div className="card rounded-3 overflow-hidden">
              <Link
                to="/Kambaz/Courses/1234/Home"
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <img
                  src="/images/art.jpeg"
                  width={274}
                  height={160}
                  className="border"
                />
                <div className="card-body">
                  <h5 className="wd-dashboard-course-title card-title">
                    {" "}
                    CS1222 Art{" "}
                  </h5>
                  <p className="wd-dashboard-course-title card-text">
                    Introduction of Art
                  </p>
                  <button className="btn btn-primary"> Go </button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
