export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <div id="wd-assignment-name" className="mb-3">
        <label htmlFor="wd-name" className="form-label">Assignment Name</label>
        <input id="wd-name" className="form-control" value="A1 - ENV + HTML" />
      </div>

      <textarea id="wd-description" className="form-control" rows={10}>
        The assignment is available online Submit a link to the landing page of
      </textarea>

      <div className="row mt-3">
        <div className="col-4 text-end">
          <label htmlFor="wd-points">Points</label>
        </div>
        <div className="col-8">
         <input id="wd-points" className="form-control" value={100} />
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
              <input type="date" id="wd-due-date" value="2024-05-13" className="form-control"/>
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label htmlFor="">Available from</label>
                  <input type="date" id="wd-available-from" className="form-control" value="2024-05-06" />
                </div>
                <div className="col-6">
                  <label htmlFor="">Until</label>
                  <input type="date" id="wd-available-until"className="form-control" value="2024-05-20" />
                </div>
              </div>
              
              
            </div>
        </div>

      </div>

      <hr />
      <button type="button" className="btn btn-lg btn-danger me-1 float-end">Save</button>
      <button type="button" className="btn btn-lg btn-secondary me-1 float-end">Cancel</button>



    </div>
      
  );
}
