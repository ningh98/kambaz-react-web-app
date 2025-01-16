import { Link } from "react-router-dom";
import { useLocation } from "react-router";
export default function TOC() {
  const { pathname } = useLocation();
  return (
    <ul className="nav nav-pills">
      <li className="nav-item">
        <a
          href="https://github.com/ningh98/kambaz-react-web-app"
          id="wd-github"
          className="nav-link"
        >
          My Github repository
        </a>
      </li>
      <li className="nav-item">
        <Link to="/Labs" className="nav-link">
          Labs
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/Labs/Lab1"
          className={`nav-link ${pathname.includes("Lab1") ? "active" : ""}`}
        >
          Lab 1
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/Labs/Lab2"
          className={`nav-link ${pathname.includes("Lab2") ? "active" : ""}`}
        >
          Lab 2
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/Labs/Lab3"
          className={`nav-link ${pathname.includes("Lab3") ? "active" : ""}`}
        >
          Lab 3
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/Kambaz/Dashboard" className="nav-link">
          Kambaz
        </Link>
      </li>
    </ul>
  );
}
