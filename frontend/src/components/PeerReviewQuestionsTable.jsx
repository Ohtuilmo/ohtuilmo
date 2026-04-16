import React from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'

import { peerReviewQuestionShape } from './common/sharedPropTypes'

const PeerReviewQuestionsTableRow = ({
  type,
  header,
  description,
  options,
}) => (
  <TableRow hover className="registration-questions-table-row">
    <TableCell component="th" scope="row">
      {header}
    </TableCell>
    <TableCell>{description}</TableCell>
    <TableCell>{type}</TableCell>
    <TableCell>{options ? JSON.stringify(options) : ''}</TableCell>
  </TableRow>
)

const RegistrationQuestionsTable = ({ questions }) => (
  <Table className="registration-questions-table">
    <TableHead>
      <TableRow hover>
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
  questions: PropTypes.arrayOf(peerReviewQuestionShape),
}

export default RegistrationQuestionsTable
