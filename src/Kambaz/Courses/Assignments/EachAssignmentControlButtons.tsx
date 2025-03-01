/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { FaTrash } from "react-icons/fa";
import DeleteModal from "./DeleteModal";
import { useDispatch } from "react-redux";
import { deleteAssignment } from "./reducer";
import * as assignmentClient from "../client"
export default function EachAssignmentControlButtons({assignment} : {assignment: any}) {
  const dispatch = useDispatch();
  const handleDelete = async (assignmentId: string) => {
    await assignmentClient.deleteAssignment(assignmentId)
    dispatch(deleteAssignment(assignment._id));
  };
  return (
    <div className="float-end">
      <FaTrash type="button" data-bs-toggle="modal" data-bs-target={`#deleteModal-${assignment._id}`} className="text-danger me-2 mb-1"/>
      <DeleteModal dialogTitle="Delete Assignment" assignmentName={assignment.title} deleteAssignment={handleDelete} assignmentId={assignment._id} modalId={`deleteModal-${assignment._id}`}/>
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />
    </div>
);}
