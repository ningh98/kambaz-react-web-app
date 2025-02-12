import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router";

export default function AssignmentsControls() {
    
  return (
    <div>
        <Link to={"new"} id="wd-add-assignment" className="btn btn-lg btn-danger me-1 float-end"><FaPlus className="position-relative me-2" style={{ bottom: "1px" }} /> Assignment</Link>
        <button id="wd-add-assignment-group" className="btn btn-lg me-1 float-end btn-secondary"><FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />Group</button>
    </div>
  )
}
