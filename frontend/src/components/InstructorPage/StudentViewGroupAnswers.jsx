import React from 'react'
import { extractCallingName } from '../../utils/functions'

import './InstructorPage.css'

const PeerReviewAnswer = ({ answers, questionHeader, student }) => {
  const studentName = `${extractCallingName(student.first_names)} ${student.last_name}`

  // It's so dumb to use the student's name instead of id here, but this is
  // all over the codebase so prolly requires quite a bit of work to fix.
  const otherStudentsAnswers = answers.filter(
    answer => `${extractCallingName(answer.student.first_names)} ${answer.student.last_name}` !== studentName)

  return (
    <div className='padding-left-18'>
      <h3>{questionHeader}</h3>
      <div className='padding-left-18'>
        {otherStudentsAnswers.map((answer, index) => (
          <div className='peer-review-text' key={`peer-review-${index}`}>
            <p className='bold'>{`${answer.student.first_names} ${answer.student.last_name}`} says:&nbsp;</p>
            <p>{answer.peers[studentName]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const RadioAnswer = ({ answers, questionHeader, student }) => {
  const allPeers = answers.reduce((acc, answer) => {
    const fullName = `${answer.student.first_names} ${answer.student.last_name}`
    if (!acc.includes(fullName)) {
      acc.push(fullName)
    }
    return acc
  }, [])

  const studentName = `${student.first_names} ${student.last_name}`

  return (
    <div className='padding-left-18'>
      <h3>{questionHeader}</h3>
      <div className='padding-left-18'>
        <table className="radio-button-table">
          <thead>
            <tr className="radio-inforow">
              <th />
              { allPeers.map((peer, index) => (
                <th key={`radio-infoheader-${index}`} className="radio-infoheader text-overflow-ellipsis">
                Reviewer
                </th>
              ))}
              <th />
            </tr>
            <tr className="radio-row">
              <th />
              {allPeers.map(peer => <th key={peer} className="radio-header text-overflow-ellipsis">{peer}</th>)}
              <th className="radio-header text-overflow-ellipsis">Average <p>(without self-review)</p></th>
            </tr>
          </thead>
          <tbody>
            <tr className="peer-header">
              <th><p>{studentName}</p></th>
              {allPeers.map((peer, peerIndex) => (
                <td key={peerIndex} className="radio-button">{calculatePeerRating(studentName, peer, answers)}</td>
              ))}
              <td className="radio-button">{calculateAverageRating(studentName, answers)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const calculatePeerRating = (member, peer, answers) => {
  const submission = answers.find(answer => `${answer.student.first_names} ${answer.student.last_name}` === peer)
  return submission ? submission.peers[member] : '-'
}

const calculateAverageRating = (member, answers) => {
  const ratings = answers.reduce((acc, answer) => {
    const responderFullName = `${answer.student.first_names} ${answer.student.last_name}`

    if (responderFullName !== member && answer.peers[member] !== undefined) {
      acc.push(answer.peers[member])
    }
    return acc
  }, [])

  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  return ratings.length > 0 ? (sum / ratings.length).toFixed(2) : 'N/A'
}


const StudentViewGroupAnswers = ({ answers }) => {
  return (
    <div className='padding-left-18 flex-column-72'>
      {answers.map((studentAnswer, answerIndex) => (
        <div key={answerIndex} className='flex-column-16 divider-48'>
          <h3 className='student-view-student-name'>{studentAnswer.student.first_names} {studentAnswer.student.last_name}</h3>
          {studentAnswer.answer_sheet.map((question, questionIndex) => {
            if (question.type === 'radio') {
              return (
                <RadioAnswer
                  key={questionIndex}
                  answers={answers.map(roundAnswer => ({
                    student: roundAnswer.student,
                    peers: roundAnswer.answer_sheet[questionIndex].peers
                  }))}
                  questionHeader={question.questionHeader}
                  student={studentAnswer.student}
                />
              )
            } else if (question.type === 'peerReview') {
              return (
                <PeerReviewAnswer
                  key={questionIndex}
                  answers={answers.map(roundAnswer => ({
                    student: roundAnswer.student,
                    peers: roundAnswer.answer_sheet[questionIndex].peers
                  }))}
                  questionHeader={question.questionHeader}
                  student={studentAnswer.student}
                />
              )
            } else {
              return (
                <div className='padding-left-18' key={questionIndex}>
                  <h3>{question.questionHeader}</h3>
                  <p className='padding-left-18'>{question.answer}</p>
                </div>
              )
            }
          })}
        </div>
      ))}
    </div>
  )
}

export default StudentViewGroupAnswers
