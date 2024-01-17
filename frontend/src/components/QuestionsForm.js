import React from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const QuestionsFrom = props => {
  return (
    <div>
      <h1>{props.title}</h1>
      <div>
        <Select
          value={
            props.selected_question_set.old_name !== ''
              ? props.selected_question_set.old_name
              : 'new_is_selected'
          }
          onChange={event =>
            props.updateSelectedQuestionSet(event.target.value)
          }
        >
          <MenuItem value="" disabled>
            <em>Pick a question set</em>
          </MenuItem>
          {props.question_sets.map(question_set => (
            <MenuItem key={question_set.id} value={question_set.name}>
              {question_set.name}
            </MenuItem>
          ))}
          <MenuItem value="new_is_selected">New</MenuItem>
        </Select>
      </div>
      <div>
        <TextField
          fullWidth
          required
          label="Name"
          margin="normal"
          value={props.selected_question_set.name}
          onChange={e => props.updateSelectedQuestionSetName(e.target.value)}
        />
      </div>
      <div>
        <div>
          <TextField
            fullWidth
            required
            label="Questions"
            margin="normal"
            multiline
            rows={5}
            value={props.selected_question_set.questions}
            onChange={e =>
              props.updateSelectedQuestionSetQuestions(e.target.value)
            }
          />
        </div>
        <div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={props.submitNewQuestionSet}
          >
            Create new question set
          </Button>
          {props.selected_question_set.old_name === '' ? null : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={props.editOldQuestionSet}
            >
              Edit {props.selected_question_set.old_name} question set
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionsFrom
