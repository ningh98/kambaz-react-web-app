/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as db from "../Database";
export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signin = () => {
    const user = db.users.find(
      (u: any) => u.username === credentials.username && u.password === credentials.password);
    if (!user) return;
    dispatch(setCurrentUser(user));
    navigate("/Kambaz/Dashboard");
  };

  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input defaultValue={credentials.username}
             onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
             placeholder="username" id="wd-username" className="form-control mb-2" /> 
      <input defaultValue={credentials.password}
             onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
             placeholder="password" type="password" id="wd-password" className="form-control mb-2" />
      <button  onClick={signin} id="wd-signin-btn"  className="btn btn-primary w-100"> Sign in </button>
      <Link  to="/Kambaz/Account/Signup"  id="wd-signup-link">Sign up</Link>
    </div>
);}
