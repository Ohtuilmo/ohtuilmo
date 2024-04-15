import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import * as notificationActions from '../reducers/actions/notificationActions'

import './InstructorPage.css'

//Services
import peerReviewService from '../services/peerReview'
import instructorPageActions from '../reducers/actions/instructorPageActions'

const GroupDetails = ({ myGroup }) => {
  if (!myGroup) {
    return (
      <div>
        <h2>There are currently no students in your group.</h2>
      </div>
    )
  } else {
    return (
      <div>
        {myGroup.map((member, index) => {
          return (
            <p key={index}>
              {index + 1}. {member}
            </p>
          )
        })}
      </div>
    )
  }
}

const Answers = ({ answers, currentConfiguration, currentGroupID }) => {
  answers = answers.filter(
    (group) => group.group.configurationId === currentConfiguration
  )

  return (
    <div>
      {answers.map((projectGroup, index) => {
        return (
          <div key={index}>
            <hr />
            <br />
            <h1>{projectGroup.group.name}</h1>
            <h3>Instructor: {projectGroup.group.instructorName}</h3>
            <GroupDetails myGroup={projectGroup.group.studentNames} />

            {projectGroup.round1Answers.length > 0 ? (
              <div>
                <h2>Peer review answers from the first round.</h2>
                <GroupAnswers
                  answers={projectGroup.round1Answers}
                  students={projectGroup.group.studentNames}
                />
              </div>
            ) : (
              <h2>
                This group hasn't answered to the first peer review round yet.
              </h2>
            )}

            {projectGroup.round2Answers.length > 0 ? (
              <div>
                <h2>Peer review answers from the second round.</h2>
                <GroupAnswers
                  answers={projectGroup.round2Answers}
                  students={projectGroup.group.studentNames}
                />
              </div>
            ) : (
              <h2>
                This group hasn't answered to the second peer review round yet.
              </h2>
            )}

            <br />
          </div>
        )
      })}
    </div>
  )
}

const getQuestions = (answers) => {
  // The same questions are found in every answer, so just grab the answers
  // from the first one
  return answers[0].answer_sheet.map((question) => {
    return {
      type: question.type,
      questionHeader: question.questionHeader,
    }
  })
}

const Question = ({ title, children }) => (
  <div>
    <h3>{title}</h3>
    {children}
  </div>
)

const GroupAnswers = ({ answers, students }) => {
  return (
    <div>
      {getQuestions(answers).map((question, index) => {
        if (question.type === 'text' || question.type === 'number') {
          return (
            <Question key={index} title={question.questionHeader}>
              <TextNumberAnswer answers={answers} questionNumber={index} />
            </Question>
          )
        } else if (question.type === 'radio') {
          return (
            <Question key={index} title={question.questionHeader}>
              <RadioAnswer
                answers={answers}
                questionNumber={index}
                students={students}
              />
            </Question>
          )
        } else {
          return null
        }
      })}
    </div>
  )
}

const TextNumberAnswer = ({ answers, questionNumber }) => {
  return (
    <div>
      {answers.map((member, index) => {
        return (
          <div key={index}>
            <p>{member.student.last_name}</p>
            <p>{member.answer_sheet[questionNumber].answer}</p>
          </div>
        )
      })}
    </div>
  )
}

const RadioAnswer = ({ answers, questionNumber, students }) => {
  const peers = answers.map((member) => {
    return member.student.first_names + ' ' + member.student.last_name
  })
  students.forEach((s) => {
    if (!peers.includes(s)) {
      peers.push(s)
    }
  })

  return (
    <div>
      <table className="radio-button-table">
        <thead>
          <tr className="radio-inforow">
            <th />
            <th colspan={peers.length} className="radio-infoheader">
              Reviewers
            </th>
            <th />
          </tr>
          <tr className="radio-row">
            <th />
            <PeerHeaders peers={peers} />
            <th className="radio-header">Mean</th>
          </tr>
        </thead>
        <tbody>
          {peers.map((member, index) => {
            return (
              <tr key={index}>
                <th className="peer-header">
                  <p>{member}</p>
                </th>
                <PeerRows
                  member={member}
                  answers={answers}
                  questionNumber={questionNumber}
                  numberOfPeers={peers.length}
                />
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const PeerHeaders = ({ peers }) => {
  return peers.map((option, optionId) => {
    return (
      <th className="radio-header" key={optionId}>
        {option}
      </th>
    )
  })
}

const sum = (arr) => arr.reduce((sum, value) => sum + value, 0)
const average = (arr) => sum(arr) / arr.length

const PeerRows = ({ member, answers, questionNumber, numberOfPeers }) => {
  const otherPeersRatingOfMember = answers
    .map((peersSubmission) => peersSubmission.answer_sheet)
    .map((peersAnswerSheet) => peersAnswerSheet[questionNumber].peers[member])

  const missing = []
  for (let i = 0; i < numberOfPeers - answers.length; i++) {
    missing.push(i)
  }

  const averageRating = average(otherPeersRatingOfMember)

  return (
    <React.Fragment>
      {otherPeersRatingOfMember.map((rating, index) => (
        <td className="radio-button" key={`peer-row-${index}`}>
          {rating}
        </td>
      ))}

      {missing.map((_, index) => (
        <td className="radio-button" key={`peer-row-${index}`}>
          -
        </td>
      ))}

      <td className="radio-button">{averageRating.toFixed(2)}</td>
    </React.Fragment>
  )
}

const DownloadButton = ({ jsonData, fileName }) => {
  const data = `text/json;charset=utf-8,${encodeURIComponent(jsonData)}`
  const href = `data:${data}`

  return (
    <Button
      component="a"
      href={href}
      download={fileName}
      variant="contained"
      color="primary"
    >
      Download as JSON
    </Button>
  )
}

const ConfigurationSelectWrapper = ({ label, children }) => (
  <div style={{ padding: 20 }}>
    <Typography variant="caption">{label}</Typography>
    {children}
  </div>
)

const ConfigurationSelect = ({
  currentConfiguration,
  setCurrentConfiguration,
  configurations,
  setCurrentGroupID
}) => {
  return (
    <Select
      data-cy="configuration-selector"
      value={currentConfiguration}
      onChange={(e) => {
        setCurrentConfiguration(e.target.value)
        setCurrentGroupID('0')
      }}
    >
      {configurations.map((configuration) => (
        <MenuItem
          key={configuration.id}
          className="configuration-menu-item"
          value={configuration.id}
        >
          {configuration.name}
        </MenuItem>
      ))}
    </Select>
  )
}

const GroupSelectWrapper = ({ label, children }) => (
  <div style={{ padding: 20 }}>
    <Typography variant='caption'>{label}</Typography>
    {children}
  </div>
)

const GroupSelect = ({ currentGroupID, setCurrentGroupID, allGroupsInConfig }) => {
  return (
    <Select
      data-cy='group-selector'
      value={currentGroupID}
      onChange={(e) => setCurrentGroupID(e.target.value)}
    >
      <MenuItem
        key={0}
        className='all-groups-menu-item'
        value={'0'}
      >
        All groups
      </MenuItem>
      {allGroupsInConfig.map((group) => (
        <MenuItem
          key={group.id}
          className='specified-group-menu-item'
          value={group.id}
        >
          {group.name}
        </MenuItem>
      ))}
    </Select>
  )
}

const getUniqueConfigurations = (groups) => {
  const uniqueLookup = groups.reduce((configurations, group) => {
    return {
      ...configurations,
      [group.configurationId]: {
        name: group.configurationName,
        id: group.configurationId,
      },
    }
  }, {})

  return Object.values(uniqueLookup)
}

const InstructorPage = (props) => {
  const {
    answers,
    currentConfiguration,
    configurations,
    currentGroupID,
    groups,
    setAnswers,
    setConfigurations,
    setCurrentConfiguration,
    setGroups,
    setCurrentGroupID,
    setError,
  } = props

  useEffect(() => {
    const fetchData = async () => {
      try {
        const peerReviewData = await peerReviewService.getAnswersByInstructor()
        const groupsData = peerReviewData.map((data) => data.group)
        const uniqueConfigurations = getUniqueConfigurations(groupsData)

        setAnswers(peerReviewData)
        setConfigurations(uniqueConfigurations.reverse())
        setCurrentConfiguration(uniqueConfigurations[0].id)
        setGroups(groupsData)
        setCurrentGroupID('0')
      } catch (err) {
        console.error('error happened', err, err.response)
        setError('Something is wrong... try reloading the page')
      }
    }

    fetchData()
  }, [setAnswers, setConfigurations, setCurrentConfiguration, setError, setGroups, setCurrentGroupID])

  if (!answers || !currentConfiguration || !groups || !currentGroupID) {
    return <div className="instructor-container">Loading</div>
  }

  return (
    <div className="instructor-container">
      <DownloadButton
        jsonData={JSON.stringify(answers)}
        fileName="peerReviews.json"
      />
      <div className="selector-container">
        <ConfigurationSelectWrapper label="Select configuration">
          <ConfigurationSelect
            currentConfiguration={currentConfiguration}
            setCurrentConfiguration={setCurrentConfiguration}
            configurations={configurations}
            setCurrentGroupID={setCurrentGroupID}
          />
        </ConfigurationSelectWrapper>
        <GroupSelectWrapper label="Select displayed group">
          <GroupSelect
            currentGroupID={currentGroupID}
            setCurrentGroupID={setCurrentGroupID}
            allGroupsInConfig={groups.filter(group => group.configurationId === currentConfiguration)}
          />
        </GroupSelectWrapper>
      </div>
      <Answers answers={answers} currentConfiguration={currentConfiguration} currentGroupID={currentGroupID}/>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    configurations: state.instructorPage.configurations,
    currentConfiguration: state.instructorPage.currentConfiguration,
    answers: state.instructorPage.answers,
    groups: state.instructorPage.groups,
    currentGroupID: state.instructorPage.currentGroupID
  }
}

const mapDispatchToProps = {
  setConfigurations: instructorPageActions.setConfigurations,
  setCurrentConfiguration: instructorPageActions.setCurrentConfiguration,
  setAnswers: instructorPageActions.setAnswers,
  setError: notificationActions.setError,
  setGroups: instructorPageActions.setGroups,
  setCurrentGroupID: instructorPageActions.setCurrentGroupID
}

const ConnectedInstructorPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(InstructorPage)

export default withRouter(ConnectedInstructorPage)
