import { FaPlus } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";
import { Link } from "react-router";


export default function QuizzesControls() {
    
  return (
    <div className="d-flex justify-content-end">
        <Link to={"new"} id="wd-add-quiz" className="btn btn-lg btn-danger me-1"><FaPlus className="position-relative me-2" style={{ bottom: "1px"}}/>Quiz</Link>
        <button id="wd-context-menu" className="btn btn-lg btn-secondary"><IoEllipsisVertical className="fs-4" /></button>
    </div>

  )
}
