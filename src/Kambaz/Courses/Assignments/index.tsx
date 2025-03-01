/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BsGripVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FaCaretDown } from "react-icons/fa";
import { LuNotebookPen } from "react-icons/lu";
import { useParams } from "react-router";
import AssignmentControlButtons from "./AssignmentControlButtons";
import EachAssignmentControlButtons from "./EachAssignmentControlButtons";
import AssignmentsControls from "./AssignmentsControls";
import { useDispatch, useSelector } from "react-redux";
import { setAssignments } from "./reducer";
import { useEffect } from "react";
import * as courseClient from "../client";


// Helper function to format the date
// From ChatGpt
function formatDate(dateString: string) {
  const date = new Date(dateString); // Parse the date string into a Date object
  const options: Intl.DateTimeFormatOptions = {
    month: "short", // Short month (e.g., "May")
    day: "numeric", // Day of the month (e.g., "6")
    hour: "numeric", // Hour (e.g., "12")
    minute: "numeric", // Minute (e.g., "00")
    hour12: true, // Use 12-hour clock (e.g., "am" or "pm")
  };

  return new Intl.DateTimeFormat("en-US", options).format(date); // Format the date
}


export default function Assignments() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const fetchAssignments = async () => {
    const assignments = await courseClient.findAssignmentsForCourse(cid as string);
    dispatch(setAssignments(assignments));
  }
  useEffect(() => {
    fetchAssignments();
  }, []);
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  return (
    <div id="wd-assignments">
      <div id="input-container" className="d-flex justify-content-between align-items-center mt-2">
        <div className="d-flex align-items-center position-relative">
          <CiSearch id="input-img" className="me-2 mb-1  position-absolute"/>
          <input placeholder="Search..." id="wd-search-assignment" style={{ height: "calc(2.375rem + 2px)" }}/>
        </div>
        
        {currentUser?.role === "FACULTY" && <AssignmentsControls />}
      </div>

      <br />
      <br />
      <br />
      <br />
      
      
      <ul id="wd-assignments-list" className="list-group rounded-0">
        <li className="wd-assignment-list list-group-item p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-1 fs-3" />
            <FaCaretDown className="me-1 fs-5" />
            ASSIGNMENTS
            <AssignmentControlButtons />
          </div>
          <ul className="wd-assignments list-group rounded-0">
            {assignments
              .filter((assignment: any) => assignment.course === cid)
              .map((assignment: any) => (
                <li className="wd-assignment list-group-item p-3 ps-1 d-flex ">
              <div className="me-3 d-flex align-items-center">
              <BsGripVertical className="me-1 fs-3" />
              <LuNotebookPen />
              </div>
              <div className="flex-grow-1">
              <a
                href={`#/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                className="wd-assignment-link"
                >
                {assignment.title}
              </a>
              <br />
              Multiple Modules |<b> Not available until</b> {formatDate(assignment?.availableDate)} |{" "}
              <br />
              <b>Due</b> {formatDate(assignment?.dueDate)} | {assignment.points} pts
              </div>
              <div className="d-flex align-items-center">
              {currentUser?.role === "FACULTY" && <EachAssignmentControlButtons assignment={assignment}/>}
              </div>
            </li>
              ))}


            
          </ul>

        </li>
        
        
      </ul>
    </div>
  );
}

