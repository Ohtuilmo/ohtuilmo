import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import * as notificationActions from '../reducers/actions/notificationActions'

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
})

const testRows = [
  {
    id: 1,
    preferredTopics: [
      {
        topic: 'HTML #1'
      },
      {
        topic: 'JAVA #2'
      },
      {
        topic: 'PYTHON #1'
      },
      {
        topic: 'JS-PRO #99'
      },
      {
        topic: 'C #22'
      }
    ],
    questions: 'questions',
    semester: '2019'
  },
  {
    id: 2,
    preferredTopics: [
      {
        topic: 'JAVA #1'
      },
      {
        topic: 'JAVA #2'
      },
      {
        topic: 'PYTHON #1'
      },
      {
        topic: 'HTML #2'
      },
      {
        topic: 'DOCUMENTATION PRO'
      }
    ],
    questions: 'questions',
    semester: '2019'
  },
  {
    id: 3,
    preferredTopics: [
      {
        topic: 'HTML #1'
      },
      {
        topic: 'JAVA #2'
      },
      {
        topic: 'JAVA #1'
      },
      {
        topic: 'JS-PRO #99'
      },
      {
        topic: 'C #22'
      }
    ],
    questions: 'questions',
    semester: '2019'
  },
  {
    id: 4,
    preferredTopics: [
      {
        topic: 'HTML #1'
      },
      {
        topic: 'HTML #2'
      },
      {
        topic: 'HTML #3'
      },
      {
        topic: 'HTML #99'
      },
      {
        topic: 'HTML #22'
      }
    ],
    questions: 'questions',
    semester: '2019'
  }
]

class ParticipantsPage extends React.Component {
  render() {
    return (
      <div className="participants-container">
        <div>
          <Paper className="participants-paper">
            <Table className="participants-table">
              <TableHead>
                <TableRow>
                  <TableCell numeric>id</TableCell>
                  <TableCell>Preferred Topic #1</TableCell>
                  <TableCell>Preferred Topic #2</TableCell>
                  <TableCell>Preferred Topic #3</TableCell>
                  <TableCell>Preferred Topic #4</TableCell>
                  <TableCell>Preferred Topic #5</TableCell>
                  <TableCell>Questions</TableCell>
                  <TableCell>Semester</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testRows.map((row) => {
                  return (
                    <TableRow key={row.id}>
                      <TableCell numeric component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell>{row.preferredTopics[0].topic}</TableCell>
                      <TableCell>{row.preferredTopics[1].topic}</TableCell>
                      <TableCell>{row.preferredTopics[2].topic}</TableCell>
                      <TableCell>{row.preferredTopics[3].topic}</TableCell>
                      <TableCell>{row.preferredTopics[4].topic}</TableCell>
                      <TableCell>{row.questions}</TableCell>
                      <TableCell>{row.semester}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>
        <div className="export-cvs-button">
          <Button variant="outlined">Export CVS-file</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    state: state
  }
}

const mapDispatchToProps = {
  setError: notificationActions.setError
}

const ConnectedParticipantsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantsPage)

export default withRouter(withStyles(styles)(ConnectedParticipantsPage))
