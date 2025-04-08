

export default function QuizPreview() {
  return (
    <div>
      <h2>Quiz title</h2>
      <p>Started: Nov 29 at 8:19am</p>
      <h3>Quiz Instructions</h3>
      <hr />

      <div className="border p3 mb-3">
        {/* Question Header */}
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="ms-2">Question 1</h4>
          <span className="me-2">point</span>
        </div>
        <p className="ms-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae obcaecati ipsam, vitae at quo voluptate soluta! Corrupti exercitationem blanditiis quas!</p>


      </div>
    </div>
  )
}
