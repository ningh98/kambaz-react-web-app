/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addAssignment, updateAssignment } from "./reducer";
import { useState } from "react";
import * as courseClient from "../client";



export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const isNewAssignment = aid === "new";
  const existingAssignment = assignments.find((assignment: { _id: string | undefined; }) => assignment._id === aid);
  const [assignment, setAssignment] = useState(existingAssignment ||{
    _id: "",
    title: "New Assignment",
    description: "New Assignment Description",
    points: 100,
    dueDate: "",
    availableDate: "",
    until: "",
    course: cid, 
  });

  const addNewAssignment = async () => {
    if (!cid) return;
    const newAssignment = { ...assignment }
    const createdAssignment = await courseClient.createAssignmentForCourse(cid, newAssignment);
    dispatch(addAssignment(createdAssignment));

  }
  const updateAssignmentOnServer = async (assignment: any) => {
    const updatedAssignment = await courseClient.updateAssignment(assignment);
    dispatch(updateAssignment(updatedAssignment));
  }



  const validate = () => {

    if (!assignment.title.trim()) {
      alert("Please enter a title for the assignment.");
      return false;
    }
    if (!assignment.description.trim()) {
      alert("Please enter the description for the assignment.");
      return false;
    }
    if (!assignment.points) {
      alert("Please enter the points for the assignment.");
      return false;
    }
    if (!assignment.dueDate) {
      alert("Please select a due date.");
      return false;
    }
    if (!assignment.availableDate) {
      alert("Please select a available from date.");
      return false;
    }
    if (!assignment.until) {
      alert("Please select a available until date.");
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value})
  }

  const handleSave = async () => {
    if (!validate()) return;

    if (isNewAssignment) {
      // Create a new assignment
      await addNewAssignment();
      
    } else {
      await updateAssignmentOnServer(assignment);
    }
    

    navigate(`/Kambaz/Courses/${cid}/Assignments`);
  };

  return (
    <div id="wd-assignments-editor">
      <div id="wd-assignment-name" className="mb-3">
        <label htmlFor="wd-name" className="form-label">Assignment Name</label>
        <input name="title" id="wd-name" className="form-control" value= {assignment?.title} onChange={handleChange}/>
      </div>

      <textarea name="description" id="wd-description" className="form-control" rows={10} value={assignment?.description} onChange={handleChange}/>
      

      <div className="row mt-3">
        <div className="col-4 text-end">
          <label htmlFor="wd-points">Points</label>
        </div>
        <div className="col-8">
         <input name="points" id="wd-points" className="form-control" value={assignment?.points} onChange={handleChange}/>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-4 text-end">
          <label htmlFor="wd-group">Assignment Group</label>
        </div>
        <div className="col-8">
          <select className="assignmentGroup form-select" id="wd-group">
              <option value="assignments">ASSIGNMENTS</option>
              <option value="quizzes">QUIZZES</option>
              <option value="exams">EXAMS</option>
              <option value="project">PROJECT</option>
          </select>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-4 text-end">
          <label htmlFor="wd-group">Display Grade as</label>
        </div>
        <div className="col-8">
          <select className="displayGrade form-select" id="wd-display-grade-as">
              <option value="percentage">Percentage</option>
              <option value="letter">Letter</option>
              <option value="pass/fail">Pass/Fail</option>
          </select>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-4 text-end">
          <label htmlFor="wd-group">Submission Type</label>
        </div>
        
        <div className="col-8">
          <div className="form-control">
              <select className="submissionType form-select" id="wd-submission-type">
                <option value="online">Online</option>
                <option value="In-person">In-person</option>
              </select>
              <p className="mt-3">Online Entry Options</p>
              <div className="mb-3">
              <input type="checkbox" id="wd-text-entry" />
              <label htmlFor="wd-text-entry" className="ms-2">Text Entry</label>
              </div>
              <div className="mb-3">
              <input type="checkbox" id="wd-website-url" />
              <label htmlFor="wd-website-url" className="ms-2">Website URL</label>
              </div>
              <div className="mb-3">
              <input type="checkbox" id="wd-media-recordings" />
              <label htmlFor="wd-media-recordings" className="ms-2">Media Recordings</label>
              </div>
              <div className="mb-3">
              <input type="checkbox" id="wd-student-annotation" />
              <label htmlFor="wd-student-annotation" className="ms-2">Student Annotation</label>
              </div>
              <div className="mb-3">
              <input type="checkbox" id="wd-file-upload" />
              <label htmlFor="wd-file-upload" className="ms-2">File Uploads</label>
              </div>

          </div>
        </div>


      </div>

      <div className="row mt-3">
        <div className="col-4 text-end">
            <label>Assign</label>

        </div>
        <div className="col-8 mb-5">
            <div className="form-control">
              <div className="mb-3">
              <label htmlFor="wd-assign-to">Assign to</label>
              <input id="wd-assign-to" value="Everyone"  className="form-control"/>
              </div>
              <div className="mb-3">
              <label htmlFor="wd-due-date">Due</label>
              <input name="dueDate" type="date" id="wd-due-date" value={assignment?.dueDate.substring(0, 10) || ""} className="form-control" onChange={handleChange}/>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label htmlFor="">Available from</label>
                  <input name="availableDate" type="date" id="wd-available-from" className="form-control" value={assignment?.availableDate.substring(0, 10) || ""} onChange={handleChange}/>
                </div>
                <div className="col-6">
                  <label htmlFor="">Until</label>
                  <input name="until" type="date" id="wd-available-until"className="form-control" value={assignment?.until.substring(0, 10) || ""} onChange={handleChange}/>
                </div>
              </div>
              
              
            </div>
        </div>

      </div>

      <hr />
      <div>
      <button type="button" onClick={handleSave} className="btn btn-lg btn-danger me-1 float-end">Save</button>
      <button type="button" onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments`)}className="btn btn-lg btn-secondary me-1 float-end">Cancel</button>
      </div>


    </div>
      
  );
}

