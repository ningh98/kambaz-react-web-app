import { Link } from "react-router-dom";
export default function Signin() {
  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input placeholder="username" id="wd-username" className="form-control mb-2" /> 
      <input placeholder="password" type="password" id="wd-password" className="form-control mb-2" />
      <Link  to="/Kambaz/Dashboard" id="wd-signin-btn"  className="btn btn-primary w-100"> Sign in </Link>
      <Link  to="/Kambaz/Account/Signup"  id="wd-signup-link">Sign up</Link>
    </div>
);}
