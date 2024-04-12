import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { registrationQuestionSetShape } from '../common/sharedPropTypes'

import QuestionSetItem from '../QuestionSetItem'
import QuestionSetItemEditor from '../QuestionSetItemEditor'
import RegistrationQuestionsTable from '../RegistrationQuestionsTable'

const EditableRegistrationQuestionSet = ({ questionSet, onEditSave }) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleEditorSave = (name, questionsJson) => {
    const questions = JSON.parse(questionsJson)

    const updatedItem = {
      ...questionSet,
      name,
      questions
    }
    onEditSave(updatedItem)
    setIsEditing(false)
  }

  const { name, questions } = questionSet

  const renderNormalItem = () => (
    <QuestionSetItem title={name} onEditClicked={() => setIsEditing(true)}>
      <RegistrationQuestionsTable questions={questions} />
    </QuestionSetItem>
  )

  const renderEditingItem = () => (
    <QuestionSetItemEditor
      initialName={name}
      initialQuestionsJson={JSON.stringify(questions, null, 2)}
      onSave={handleEditorSave}
      onCancel={() => setIsEditing(false)}
    />
  )

  return isEditing ? renderEditingItem() : renderNormalItem()
}

EditableRegistrationQuestionSet.propTypes = {
  questionSet: registrationQuestionSetShape,
  onEditSave: PropTypes.func
}

export default EditableRegistrationQuestionSet
