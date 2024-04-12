import React from 'react'
import PropTypes from 'prop-types'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'

import { registrationQuestionShape } from './common/sharedPropTypes'

const RegistrationQuestionsTableRow = ({ question, type }) => (
  <TableRow className="registration-questions-table-row">
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
  type: PropTypes.string
}

const RegistrationQuestionsTable = ({ questions }) => (
  <Table className="registration-questions-table">
    <TableHead>
      <TableRow>
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
  questions: PropTypes.arrayOf(registrationQuestionShape)
}

export default RegistrationQuestionsTable
