import React from 'react'

export default function Questions() {
  return (
    <div>
        <div className='d-flex justify-content-center'>
            <button type='button' className='btn btn-lg btn-secondary mt-3'>+ New Question</button>
        </div>
        <br />
        <hr />
        <button type="button" className="btn btn-lg btn-danger me-1 float-end">Save</button>
        <button type="button" className="btn btn-lg btn-secondary me-1 float-end">Cancel</button>
      
    </div>
  )
}
