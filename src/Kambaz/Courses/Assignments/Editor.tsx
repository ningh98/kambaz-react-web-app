export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label> <br />
      <br />
      <input id="wd-name" value="A1 - ENV + HTML" />
      <br />
      <br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of
      </textarea>
      <br />
      <table>
        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
            <input id="wd-points" value={100} />
          </td>
        </tr>
        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-group">Assignment Group</label>
          </td>
          <td>
            <select name="assignmentGroup" id="wd-group">
              <option value="assignments">ASSIGNMENTS</option>
              <option value="quizzes">QUIZZES</option>
              <option value="exams">EXAMS</option>
              <option value="project">PROJECT</option>
            </select>
          </td>
        </tr>
        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-display-grade-as">Display Grade as</label>
          </td>
          <td>
            <select name="displayGrade" id="wd-display-grade-as">
              <option value="percentage">Percentage</option>
              <option value="letter">Letter</option>
              <option value="pass/fail">Pass/Fail</option>
            </select>
          </td>
        </tr>
        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-submission-type">Submission Type</label>
          </td>
          <td>
            <select name="submissionType" id="wd-submission-type">
              <option value="online">Online</option>
              <option value="In-person">In-person</option>
            </select>
          </td>
        </tr>
        <br />
        <tr>
          <td align="right" valign="top"></td>
          <td>Online Entry Option</td>
        </tr>
        <tr>
          <td></td>
          <input type="checkbox" id="wd-text-entry" />
          <label htmlFor="wd-text-entry">Text Entry</label>
        </tr>
        <tr>
          <td></td>
          <input type="checkbox" id="wd-website-url" />
          <label htmlFor="wd-website-url	">Website URL</label>
        </tr>
        <tr>
          <td></td>
          <input type="checkbox" id="wd-media-recordings" />
          <label htmlFor="wd-media-recordings">Media Recordings</label>
        </tr>
        <tr>
          <td></td>
          <input type="checkbox" id="wd-student-annotation" />
          <label htmlFor="wd-student-annotation">Student Annotation</label>
        </tr>
        <tr>
          <td></td>
          <input type="checkbox" id="wd-file-upload" />
          <label htmlFor="wd-file-upload">File Uploads</label>
        </tr>
        <br />
        <tr>
          <td align="right" valign="top">
            Assign
          </td>
          <td>
            <label htmlFor="wd-assign-to">Assign to</label>
          </td>
        </tr>
        <tr>
            <td></td>
        <td><input id="wd-assign-to" value="Everyone" /></td>
        </tr>
        <br />
        <tr>
            <td></td>
            <td>
                <label htmlFor="wd-due-date">Due</label>
            </td>
        </tr>
        <tr>
            <td></td>
            <td><input type="date" id="wd-due-date" value="2024-05-13"/></td>
        </tr>
        <br />
        <tr>
            <td></td>
            <td><label htmlFor="">Available from</label></td>
            <td><label htmlFor="">Until</label></td>
        </tr>
        <tr>
            <td></td>
            <td><input type="date" id="wd-available-from" value="2024-05-06" /></td>
            <td><input type="date" id="wd-available-until" value="2024-05-20" /></td>
        </tr>
        <tr>
            <td><hr /></td>
            <td><hr /></td>
            <td><hr /></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td align="right" valign="top">
                <button type="button">Cancel</button>
                <button type="button">Save</button>
            </td>
        </tr>
      </table>
    </div>
  );
}
