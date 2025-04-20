/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from "react-redux";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { deleteQuiz, updateQuiz } from "./reducer";
import * as quizClient from "../client";
import { IoEllipsisVertical } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import { FaBan } from "react-icons/fa";



export default function EachQuizControlButtons({quiz}: { quiz: any }) {
    const dispatch = useDispatch();
    
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [isPublished, setIsPublished] = useState(quiz.published);

    

    
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
      try {
        // 更新本地状态，立即反映在 UI 上
        setIsPublished(!isPublished);
        
        // 创建更新后的测验对象
        const updatedQuiz = {
          ...quiz,
          published: !isPublished
        };
        
        // 调用 API 更新测验
        const response = await quizClient.updateQuiz(updatedQuiz);
        
        // 更新 Redux 状态
        dispatch(updateQuiz(response));
        
        // 关闭菜单
        setOpenMenu(false);
      } catch (error) {
        // 如果出错，恢复原来的状态
        setIsPublished(isPublished);
        console.error("Failed to publish/unpublish quiz:", error);
      }
    }
  return (
    <div>
        {isPublished ? (
          <GreenCheckmark onClick={handlePublishToggle} style={{ cursor: 'pointer' }} />
        ) : (
          <FaBan className="text-danger me-2" onClick={handlePublishToggle} style={{ cursor: 'pointer' }} />
        )}
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
              {isPublished ? "Unpublish" : "Publish"}
            </button>
          </li>
          <li>
            <button className="dropdown-item">
              Copy to...
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
