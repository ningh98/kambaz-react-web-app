import { useState } from "react"
import "./QuestionEditor.css"
import MultipleChoiceAnswers from "./MultipleChoiceAnswers"
import TrueFalseAnswers from "./TrueFalseAnswers"
import FillInBlankAnswers from "./FillInBlankAnswers"

export default function QuestionEditor() {
    const [answers, setAnswers] = useState<string[]>([])
    const [answer, setAnswer] = useState('')
    const [correctIndex, setCorrectIndex] = useState<number | null>(null)
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
    const [preventBlur, setPreventBlur] = useState(false);
    const [questionType, setQuestionType] = useState("multipleChoice");


    const addAnswer = () => {
        
        setAnswers([...answers, answer])
        setAnswer('')
        
    }

    const handleQuestionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value;
        setQuestionType(type);
        if (type === "trueFalse") {
          setAnswers(["True", "False"]);
          setCorrectIndex(null);
        } 
        else if (type === "fillInBlank") {
            setAnswers([]);
            setCorrectIndex(null);
        }
        else {
          setAnswers([]);
          setCorrectIndex(null);
        }
      };
    const renderAnsersSection = () => {
        switch (questionType){
            case "trueFalse":
                return <TrueFalseAnswers
                answers={answers}
                correctIndex={correctIndex}
                handleCorrectChange={handleCorrectChange}
                />
            case "multipleChoice":
                return <MultipleChoiceAnswers
                answers={answers}
                setAnswers={setAnswers}
                correctIndex={correctIndex}
                handleCorrectChange={handleCorrectChange}
                focusedIndex={focusedIndex}
                setFocusedIndex={setFocusedIndex}
                preventBlur={preventBlur}
                setPreventBlur={setPreventBlur}
                />
            case "fillInBlank":
                return <FillInBlankAnswers
                answers={answers}
                setAnswers={setAnswers}
                focusedIndex={focusedIndex}
                setFocusedIndex={setFocusedIndex}
                preventBlur={preventBlur}
                // setPreventBlur={setPreventBlur}
              />
            default:
                return  <MultipleChoiceAnswers
                answers={answers}
                setAnswers={setAnswers}
                correctIndex={correctIndex}
                handleCorrectChange={handleCorrectChange}
                focusedIndex={focusedIndex}
                setFocusedIndex={setFocusedIndex}
                preventBlur={preventBlur}
                setPreventBlur={setPreventBlur}
              />
        }
    }

    const handleCorrectChange = (index: number) => {
        setCorrectIndex(index)
    }
  return (
    <div id="wd-add-question-dialog" className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header d-flex">
                <input type="text" className="form-control me-2" />
            
                <select className="form-select me-3" id="wd-select-quiz-type"
                value={questionType}
                onChange={handleQuestionTypeChange}>
                    <option value="multipleChoice">Multiple choice</option>
                    <option value="trueFalse">True/false</option>
                    <option value="fillInBlank">Fill in the blank</option>
                </select>
                <span className="ms-3">pts:</span>
                <input type="text" className="form-control form-control-sm" style={{ width: '60px' }}/>

                
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <div id="wd-question-editor-question section">
                    <p>Enter your question and multiple answers, then select the one correct answer.</p>
                    <label htmlFor="wd-question-text" className="form-label" style={{ fontWeight: "bold" }}>Question:</label>
                    <textarea className="form-control" id="wd-question-text" rows={3} placeholder="Enter your question here..."></textarea>
                </div>
                <div id="wd-question-editor-answers-section">
                    <label htmlFor="" className="form-label" style={{ fontWeight: "bold" }}>Answers:</label>
                    {renderAnsersSection()}
                    
                    {questionType !== "trueFalse" && (
                        <button onClick={addAnswer} className="float-end">+ Add Another Answer</button>
                    )}
                    
                </div>
                
              </div>
              <div className="modal-footer justify-content-start">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel </button>
                <button  type="button" data-bs-dismiss="modal" className="btn btn-danger">
                  Update Question</button>
              </div>
            </div>
          </div>
    </div>
  )
}
