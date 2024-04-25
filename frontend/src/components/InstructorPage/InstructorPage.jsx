import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import * as notificationActions from '../../reducers/actions/notificationActions'

import './InstructorPage.css'
import StudentViewGroupAnswers from './StudentViewGroupAnswers'

//Services
import peerReviewService from '../../services/peerReview'
import instructorPageActions from '../../reducers/actions/instructorPageActions'

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

const Answers = ({ answers, currentConfiguration, currentGroupID, viewMode }) => {
  answers = answers.filter(
    (group) => group.group.configurationId === currentConfiguration
  )

  return (
    <div>
      {answers.map((projectGroup, index) => {
        if (currentGroupID === projectGroup.group.id || currentGroupID === '0') {
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
                  {viewMode === 'students' ? (
                    <StudentViewGroupAnswers answers={projectGroup.round1Answers} />
                  ) : (
                    <GroupAnswers
                      answers={projectGroup.round1Answers}
                      students={projectGroup.group.studentNames}
                    />
                  )}
                </div>
              ) : (
                <h2>
                  This group has not answered to the first peer review round yet.
                </h2>
              )}

              {projectGroup.round2Answers.length > 0 ? (
                <div>
                  <h2>Peer review answers from the second round.</h2>
                  {viewMode === 'students' ? (
                    <StudentViewGroupAnswers answers={projectGroup.round2Answers} />
                  ) : (
                    <GroupAnswers
                      answers={projectGroup.round2Answers}
                      students={projectGroup.group.studentNames}
                    />
                  )}
                </div>
              ) : (
                <h2>
                  This group has not answered to the second peer review round yet.
                </h2>
              )}

              <br />
            </div>
          )}
        else {
          return (<div key='empty-div'></div>)
        }
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
        } else if (question.type === 'peerReview') {
          return (
            <Question key={index} title={question.questionHeader}>
              <PeerReviewAnswer answers={answers} questionNumber={index} />
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

const PeerReviewAnswer = ({ answers, questionNumber }) => {
  return (
    <div>
      {answers.map((member, index) => {
        const peers = member && member.answer_sheet && member.answer_sheet[questionNumber] ? member.answer_sheet[questionNumber].peers : null
        return (
          <div key={`${member}-${index}`}>
            <p>{member.student.last_name}</p>
            {peers && Object.entries(peers).map(
              ([peer, review]) => (
                <p key={peer}>
                  {peer}: {review}
                </p>
              )
            )}
          </div>
        )
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
            <th colSpan={peers.length} className="radio-infoheader">
              Reviewers
            </th>
            <th />
          </tr>
          <tr className="radio-row">
            <th />
            <PeerHeaders peers={peers} />
            <th className="radio-header">Average (without own grading)</th>
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

const PeerRows = ({ member, answers, questionNumber, numberOfPeers }) => {
  const allPeersRatings = new Array(numberOfPeers).fill({ rating: '-', isSelf: false })

  answers.forEach((answer, index) => {
    const peerFullName = `${answer.student.first_names} ${answer.student.last_name}`
    if (answer.answer_sheet[questionNumber].peers[member] !== undefined) {
      allPeersRatings[index] = {
        rating: answer.answer_sheet[questionNumber].peers[member],
        isSelf: peerFullName === member
      }
    }
  })

  const validRatings = allPeersRatings
    .filter(ratingInfo => ratingInfo.rating !== '-' && !ratingInfo.isSelf)
    .map(ratingInfo => ratingInfo.rating)

  const averageRating = validRatings.length > 0
    ? (sum(validRatings) / validRatings.length).toFixed(2)
    : 'N/A'

  return (
    <React.Fragment>
      {allPeersRatings.map((ratingInfo, index) => (
        <td className="radio-button" key={`peer-row-${index}`}>
          {typeof ratingInfo.rating === 'number' ? ratingInfo.rating.toFixed(2) : ratingInfo.rating}
        </td>
      ))}
      <td className="radio-button">{averageRating}</td>
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
      style= {{ margin: 20 }}
    >
      Download as JSON
    </Button>
  )
}

const SelectViewButton = ({ viewMode, setViewMode }) => {
  const toggleView = () => {
    setViewMode(viewMode === 'questions' ? 'students' : 'questions')
  }

  return (
    <Button
      onClick={toggleView}
      variant="contained"
      color="primary"
    >
      View answers by {viewMode === 'questions' ? 'Students' : 'Questions'}
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

  const [viewMode, setViewMode] = useState('questions')

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
      <SelectViewButton
        viewMode={viewMode}
        setViewMode={setViewMode}
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
      <Answers answers={answers} currentConfiguration={currentConfiguration} currentGroupID={currentGroupID} viewMode={viewMode}/>
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
