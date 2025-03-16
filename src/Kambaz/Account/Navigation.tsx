/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const active = (path: string) => (pathname.includes(path) ? "active" : "");

  const { pathname } = useLocation();
  
  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) =>(
      <Link 
        key={link}
        to={`/Kambaz/Account/${link}`}
        className = {`list-group-item text-danger border border-0
                      ${active(link)}`}>
       {link}
      </Link>
      ))}
      
      {currentUser && currentUser.role === "ADMIN" && (
       <Link to={`/Kambaz/Account/Users`} className={`list-group-item border border-0 ${active("Users")}`}> Users </Link> )}
    </div>
);}
