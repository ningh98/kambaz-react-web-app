
interface TrueFalseAnswersProps {
    answers: string[];
    correctIndex: number | null;
    handleCorrectChange: (index: number) => void;
  }
export default function TrueFalseAnswers({
    answers,
    correctIndex,
    handleCorrectChange,
}: TrueFalseAnswersProps) {
  return (
    <>
        <ul>
            {answers.map((ans, index) => (
              <li key={index} className="list-group-item">
                <div className="d-flex justify-content-between ms-5 mb-3 pb-5">
                  <div className="d-flex align-items-center" style={{ width: "75%" }}>
                    <input
                      type="checkbox"
                      checked={correctIndex === index}
                      onChange={() => handleCorrectChange(index)}
                      className="me-2"
                      
                    />
                    <span style={{ color: correctIndex === index ? "green" : "inherit" }}>
                        {ans}
                    </span>
                  </div>
                  
                </div>
              </li>
            ))}
          </ul>
    </>
  )
}
