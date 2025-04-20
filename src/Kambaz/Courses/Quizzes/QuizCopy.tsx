/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as coursesClient from "../client";
//import * as quizClient from "../client";
import { FaArrowLeft } from "react-icons/fa";

export default function QuizCopy() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get all courses
        const allCourses = await coursesClient.fetchAllCourses();
        // Filter out current course
        const otherCourses = allCourses.filter((course: any) => course._id !== cid);
        setCourses(otherCourses);
        
        // Get current quiz details
        const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
        const currentQuiz = quizzes.find((q: any) => q._id === qid);
        if (currentQuiz) {
          setQuiz(currentQuiz);
          setLoading(false);
        } else {
          console.error("Quiz not found");
          navigate(`/Kambaz/Courses/${cid}/Quizzes`);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [cid, qid, navigate]);

  const handleCopy = async () => {
    if (!selectedCourseId) {
      alert("Please select a target course");
      return;
    }

    try {
      setCopying(true);
      // Create new quiz object, remove _id to create a new record
      const newQuiz = {
        ...quiz,
        _id: undefined,
        title: `${quiz.title} (Copy)`,
        course: selectedCourseId,
        published: false, // Default to unpublished
      };

      // Create new quiz
      await coursesClient.createQuizForCourse(selectedCourseId, newQuiz);
      
      // Navigate back to quiz list after successful copy
      alert("Quiz copied successfully!");
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    } catch (error) {
      console.error("Failed to copy quiz:", error);
      alert("Failed to copy quiz, please try again");
    } finally {
      setCopying(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="d-flex align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
        >
          <FaArrowLeft /> Back
        </button>
        <h2 className="mb-0">Copy Quiz</h2>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Source Quiz Information</h5>
        </div>
        <div className="card-body">
          <p><strong>Title:</strong> {quiz.title}</p>
          <p><strong>Number of Questions:</strong> {quiz.questions?.length || 0}</p>
          <p><strong>Total Points:</strong> {quiz.points}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Select Target Course</h5>
        </div>
        <div className="card-body">
          {courses.length === 0 ? (
            <p>No other courses available</p>
          ) : (
            <>
              <div className="form-group mb-4">
                <label htmlFor="courseSelect" className="form-label">Target Course:</label>
                <select 
                  id="courseSelect" 
                  className="form-select"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((course: any) => (
                    <option key={course._id} value={course._id}>
                      {course.name || course.title}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                className="btn btn-primary"
                onClick={handleCopy}
                disabled={!selectedCourseId || copying}
              >
                {copying ? "Copying..." : "Copy Quiz"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}