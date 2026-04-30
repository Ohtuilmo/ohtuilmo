import React from 'react'
import PropTypes from 'prop-types'

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'

import { registrationQuestionShape } from './common/sharedPropTypes'

const RegistrationQuestionsTableRow = ({ question, type }) => (
  <TableRow hover className="registration-questions-table-row">
    <TableCell component="th" scope="row">
      {question}
    </TableCell>
    <TableCell align="right" style={{ width: '100px' }}>
      {type}
    </TableCell>
  </TableRow>
)

RegistrationQuestionsTableRow.propTypes = {
  question: PropTypes.string.isRequired,
  type: PropTypes.string,
}

const RegistrationQuestionsTable = ({ questions }) => (
  <Table className="registration-questions-table">
    <TableHead>
      <TableRow hover>
        <TableCell>Question</TableCell>
        <TableCell align="right" style={{ width: '100px' }}>
          Type
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {questions.map(({ question, type }) => (
        <RegistrationQuestionsTableRow
          key={question}
          question={question}
          type={type}
        />
      ))}
    </TableBody>
  </Table>
)

RegistrationQuestionsTable.propTypes = {
  questions: PropTypes.arrayOf(registrationQuestionShape),
}

export default RegistrationQuestionsTable
