interface FillInBlankAnswersProps {
    answers: string[];
    setAnswers: React.Dispatch<React.SetStateAction<string[]>>;
    focusedIndex: number | null;
    setFocusedIndex: React.Dispatch<React.SetStateAction<number | null>>;
    preventBlur: boolean;
    // setPreventBlur: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FillInBlankAnswers({
    answers,
    setAnswers,
    focusedIndex,
    setFocusedIndex,
    preventBlur,
    // setPreventBlur,
  }: FillInBlankAnswersProps) {
  return (
    <ul>
      {answers.map((ans, index) => (
        <li key={index} className="list-group-item">
          <div className="answer-container d-flex justify-content-between ms-5 mb-3 pb-5">
            <div className="d-flex align-items-end" style={{ width: "75%" }}>
              
              <label htmlFor={`wd-question-answer-${index}`}>
                Possible Answer:
              </label>
              <input
                type="text"
                className="form-control ms-1 shadow-none"
                id={`wd-question-answer-${index}`}
                style={{ maxWidth: "60%" }}
                value={ans}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[index] = e.target.value;
                  setAnswers(newAnswers);
                }}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => {
                  if (!preventBlur) {
                    setFocusedIndex(null);
                  }
                }}
              />
            </div>
            {focusedIndex === index && (
              <div className="answer-actions">
                <button className="btn btn-outline-secondary" type="button">
                  Edit
                </button>
                <button className="btn btn-outline-secondary" type="button">
                  Remove
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
  
}
