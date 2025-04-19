/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from "react-redux";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { deleteQuiz} from "./reducer";
import * as quizClient from "../client";
import { IoEllipsisVertical } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DeleteModal from "./DeleteModal";



export default function EachQuizControlButtons({quiz}: { quiz: any }) {
    const dispatch = useDispatch();
    
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    

    
    const handleDelete = async (quizId: string) => {
        await quizClient.deleteQuiz(quizId)
        dispatch(deleteQuiz(quiz._id));
        setShowDelete(false);
        setOpenMenu(false);
      };

    const handleEdit = () => {
        navigate(`/Kambaz/courses/${quiz.course}/quizzes/${quiz._id}/edit`);
        setOpenMenu(false);
      
    }

    const handlePublishToggle = async () => {

    }
  return (
    <div>
        <GreenCheckmark />
        <IoEllipsisVertical className="fs-4"
        onClick={() => setOpenMenu(o => !o)} />
        {openMenu && (
        <ul
          className="dropdown-menu show position-absolute"
          style={{ top: "100%", right: 0, zIndex: 1000 }}
        >
          <li>
            <button className="dropdown-item" onClick={handleEdit}>
              Edit
            </button>
          </li>
          <li>
            <button
              className="dropdown-item text-danger"
              onClick={() => setShowDelete(true)}
            >
              Delete
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={handlePublishToggle}>
              {quiz.published ? "Unpublish" : "Publish"}
            </button>
          </li>
        </ul>
      )}
      <DeleteModal
        show={showDelete}
        title="Delete Quiz"
        message={`Are you sure you want to delete "${quiz.title}"?`}
        onCancel={() => setShowDelete(false)}
        onConfirm={() => handleDelete(quiz._id)}
      />
    </div>
  )
}
