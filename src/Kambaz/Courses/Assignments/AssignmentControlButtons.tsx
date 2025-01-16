import { IoEllipsisVertical } from "react-icons/io5";

import { BsPlus } from "react-icons/bs";
import PercentageCapsule from "./PercentageCapsule";
export default function AssignmentControlButtons() {
  return (
    <div className="float-end">
      <PercentageCapsule />
      <BsPlus className="fs-3"/>
      <IoEllipsisVertical className="fs-4" />
    </div>
);}
