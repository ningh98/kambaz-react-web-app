/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import QuestionEditor from './questionEditor'

export default function Questions() {
  const [question, setQuestion] = useState({})

  const fetchQuestions = async () => {

  }

  const createQuestion = async () => {

  }

  return (
    <div>
        <div className='d-flex justify-content-center'>
            <button id='wd-add-question-btn' className='btn btn-lg btn-secondary mt-3' 
            data-bs-toggle="modal" data-bs-target="#wd-add-question-dialog">+ New Question</button>
            <QuestionEditor />
        </div>
        <br />
        <hr />
        <button type="button" className="btn btn-lg btn-danger me-1 float-end">Save</button>
        <button type="button" className="btn btn-lg btn-secondary me-1 float-end">Cancel</button>
      
    </div>
  )
}
