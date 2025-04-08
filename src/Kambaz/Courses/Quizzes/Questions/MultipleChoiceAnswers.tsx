

interface MultipleChoiceAnswersProps {
    answers: string[];
    setAnswers: React.Dispatch<React.SetStateAction<string[]>>;
    correctIndex: number | null;
    handleCorrectChange: (index: number) => void;
    focusedIndex: number | null;
    setFocusedIndex: React.Dispatch<React.SetStateAction<number | null>>;
    preventBlur: boolean;
    setPreventBlur: React.Dispatch<React.SetStateAction<boolean>>;
  }
export default function MultipleChoiceAnswers(props: MultipleChoiceAnswersProps) 
{
    const {
        answers,
        setAnswers,
        correctIndex,
        handleCorrectChange,
        focusedIndex,
        setFocusedIndex,
        preventBlur,
        setPreventBlur,
      } = props;
  return (
    <>
        <ul>
                        {answers.map((ans, index) => (
                            <li key={index} className="list-group-item">
                                <div className='answer-container d-flex justify-content-between ms-5 mb-3 pb-5'>
                                    <div className="d-flex align-items-end"  style={{ width: "75%" }}>
                                        {(focusedIndex === index || correctIndex === index) && (
                                            <input type="checkbox" 
                                            checked={correctIndex === index}
                                            onChange={() => handleCorrectChange(index)}
                                                
                                            className="me-2"
                                            disabled={focusedIndex !== index}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                setPreventBlur(true);
                                              }}
                                              onMouseUp={() => {
                                                setPreventBlur(false);
                                              }}
                                            />
                                        )}
                                        
                                    
                                        <label  htmlFor={`wd-question-answer-${index}`}>
                                            {correctIndex === index ? 'Correct Answer' : 'Possible Answer'}
                                        </label>
                                        <input type="text" className="form-control ms-1 shadow-none" id={`wd-question-answer-${index}`} 
                                        style={{ maxWidth: '60%'}} 
                                        value={ans} 
                                        onChange={(e) => {
                                            const newAnswers = [...answers];
                                            newAnswers[index] = e.target.value;
                                            setAnswers(newAnswers);
                                        }}
                                        onFocus={() => setFocusedIndex(index)}
                                        onBlur={() =>{
                                            if (!preventBlur) {
                                                setFocusedIndex(null);
                                              }
                                            }
                                          }
                                        />
                                    </div>
                                    
                                    <div className="answer-actions" >
                                        <button className="btn btn-outline-secondary" type="button" id="wd-edit-answer-btn">Edit</button>
                                        <button className="btn btn-outline-secondary " type="button" id="wd-remove-answer-btn">Remove</button>
                                    </div>
                                    
                                    
                                </div>      
                                
                            </li>
                        ))}
                    </ul>
    </>
  )
}
