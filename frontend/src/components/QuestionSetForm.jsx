import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import './QuestionSetForm.css'

const validateQuestionsJson = (str) => {
  try {
    const obj = JSON.parse(str)
    if (!Array.isArray(obj)) {
      return { ok: false, error: 'Questions should be an array' }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Field contains invalid JSON' }
  }
}

const QuestionSetForm = ({
  initialName,
  initialQuestionsJson,
  onSubmit,
  controls
}) => {
  const [name, setName] = useState(initialName || '')
  const [questionsJson, setQuestionsJson] = useState(initialQuestionsJson || '')
  const [questionsError, setQuestionsError] = useState('')

  const clearQuestionsError = () => {
    if (questionsError !== '') {
      setQuestionsError('')
    }
  }

  const handleNameChange = (e) => setName(e.target.value)

  const handleQuestionsChange = (e) => {
    setQuestionsJson(e.target.value)
    clearQuestionsError()
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    const { ok, error } = validateQuestionsJson(questionsJson)
    if (!ok) {
      setQuestionsError(error)
      return
    }

    onSubmit(name, questionsJson)
    setName('')
    setQuestionsJson('')
  }

  return (
    <form className="question-set-form" onSubmit={handleFormSubmit}>
      <TextField
        inputProps={{
          className: 'question-set-form__name'
        }}
        fullWidth
        required
        label="Name"
        margin="normal"
        value={name}
        onChange={handleNameChange}
      />
      <TextField
        error={!!questionsError}
        inputProps={{
          style: {
            fontFamily:
              'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
            fontSize: '0.9em'
          },
          className: 'question-set-form__questions'
        }}
        fullWidth
        required
        label="Questions (JSON)"
        helperText={questionsError || ''}
        margin="normal"
        multiline
        rows={10}
        value={questionsJson}
        onChange={handleQuestionsChange}
      />
      {controls}
    </form>
  )
}

export default QuestionSetForm
