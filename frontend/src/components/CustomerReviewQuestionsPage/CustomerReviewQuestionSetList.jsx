import React from 'react'
import EditableCustomerReviewQuestionSet from './EditableCustomerReviewQuestionSet'
import './CustomerReviewQuestionSetList.css'

const compareQuestionSetCreatedAtDesc = (a, b) =>
  b.createdAt.localeCompare(a.createdAt)

const RegistrationQuestionSetList = ({ questionSets, onQuestionSetUpdate }) => {
  const byCreatedAtDesc = [...questionSets].sort(
    compareQuestionSetCreatedAtDesc
  )

  return (
    <ul className="customer-review-question-set-list">
      {byCreatedAtDesc.map((set) => (
        <EditableCustomerReviewQuestionSet
          key={set.id}
          questionSet={set}
          onEditSave={onQuestionSetUpdate}
        />
      ))}
    </ul>
  )
}

export default RegistrationQuestionSetList
