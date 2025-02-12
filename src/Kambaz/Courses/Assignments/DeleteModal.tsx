export default function DeleteModal({ dialogTitle, assignmentName, deleteAssignment, assignmentId, modalId }: 
    { dialogTitle: string; assignmentName: string; deleteAssignment: (id: string) => void; assignmentId: string; modalId: string; }) {
  return (
    <div id={modalId} className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  {dialogTitle} </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <h2 className="modal-title fs-5" id="staticBackdropLabel">
                  {assignmentName} </h2>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel </button>
                <button onClick={() => deleteAssignment(assignmentId)} type="button" data-bs-dismiss="modal" className="btn btn-danger">
                  Delete </button>
              </div>
            </div>
          </div>
        </div>
  )
}

