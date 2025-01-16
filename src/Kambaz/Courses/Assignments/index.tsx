import { BsGripVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import { LuNotebookPen } from "react-icons/lu";
import AssignmentControlButtons from "./AssignmentControlButtons";
import EachAssignmentControlButtons from "./EachAssignmentControlButtons";

export default function Assignments() {
  return (
    <div id="wd-assignments">
      <div id="input-container" className="d-flex justify-content-between align-items-center mt-2">
        <div className="d-flex align-items-center position-relative">
          <CiSearch id="input-img" className="me-2 mb-1  position-absolute"/>
          <input placeholder="Search..." id="wd-search-assignment" style={{ height: "calc(2.375rem + 2px)" }}/>
        </div>
        
        <div>
          <button id="wd-add-assignment" className="btn btn-lg btn-danger me-1 float-end"><FaPlus className="position-relative me-2" style={{ bottom: "1px" }} /> Assignment</button>
          <button id="wd-add-assignment-group" className="btn btn-lg me-1 float-end btn-secondary"><FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />Group</button>
        </div>
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
            <li className="wd-assignment list-group-item p-3 ps-1 d-flex ">
              <div className="me-3 d-flex align-items-center">
              <BsGripVertical className="me-1 fs-3" />
              <LuNotebookPen />
              </div>
              <div className="flex-grow-1">
              <a
                href="#/Kambaz/Courses/1234/Assignments/123"
                className="wd-assignment-link"
                >
                A1
              </a>
              <br />
              Multiple Modules |<b> Not available until</b> May 6 at 12:00am |{" "}
              <br />
              <b>Due</b> May 13 at 11:59pm | 100 pts
              </div>
              <div className="d-flex align-items-center">
              <EachAssignmentControlButtons />
              </div>
            </li>

            <li className="wd-assignment list-group-item p-3 ps-1 d-flex">
              <div className="me-3 d-flex align-items-center">
              <BsGripVertical className="me-1 fs-3" />
              <LuNotebookPen />
              </div>
              <div className="flex-grow-1">
              <a
                href="#/Kambaz/Courses/1234/Assignments/123"
                className="wd-assignment-link"
                >
                A2
              </a>
              <br />
              Multiple Modules |<b> Not available until</b> May 13 at 12:00am |{" "}
              <br />
              <b>Due</b> May 20 at 11:59pm | 100 pts
              </div>
              <div className="d-flex align-items-center">
              <EachAssignmentControlButtons />
              </div>
            </li>

            <li className="wd-assignment list-group-item p-3 ps-1 d-flex">
              <div className="me-3 d-flex align-items-center">
              <BsGripVertical className="me-1 fs-3" />
              <LuNotebookPen />
              </div>
              <div className="flex-grow-1">
              <a
                href="#/Kambaz/Courses/1234/Assignments/123"
                className="wd-assignment-link"
                >
                A3
              </a>
              <br />
              Multiple Modules |<b> Not available until</b> May 20 at 12:00am |{" "}
              <br />
              <b>Due</b> May 27 at 11:59pm | 100 pts
              </div>
              <div className="d-flex align-items-center">
              <EachAssignmentControlButtons />
              </div>
            </li>
          </ul>

        </li>
        
        
      </ul>
    </div>
  );
}
