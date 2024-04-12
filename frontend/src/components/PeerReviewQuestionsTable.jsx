import React from 'react'
import PropTypes from 'prop-types'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'

import { peerReviewQuestionShape } from './common/sharedPropTypes'

const PeerReviewQuestionsTableRow = ({
  type,
  header,
  description,
  options
}) => (
  <TableRow className="registration-questions-table-row">
    <TableCell component="th" scope="row">
      {header}
    </TableCell>
    <TableCell>{description}</TableCell>
    <TableCell>{type}</TableCell>
    <TableCell>{JSON.stringify(options)}</TableCell>
  </TableRow>
)

const RegistrationQuestionsTable = ({ questions }) => (
  <Table className="registration-questions-table">
    <TableHead>
      <TableRow>
        <TableCell>Header</TableCell>
        <TableCell>Description</TableCell>
        <TableCell>Type</TableCell>
        <TableCell align="right">Options</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {questions.map(({ type, header, description, options }) => (
        <PeerReviewQuestionsTableRow
          key={header}
          type={type}
          header={header}
          description={description}
          options={options}
        />
      ))}
    </TableBody>
  </Table>
)

RegistrationQuestionsTable.propTypes = {
  questions: PropTypes.arrayOf(peerReviewQuestionShape)
}

export default RegistrationQuestionsTable
