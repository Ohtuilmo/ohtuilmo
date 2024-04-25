import React from 'react'
import './InstructorPage.css'

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
    <div>
      <h4>{questionHeader}</h4>
      <table className="radio-button-table">
        <thead>
          <tr className="radio-inforow">
            <th />
            <th colSpan={allPeers.length} className="radio-infoheader">Reviewers</th>
            <th />
          </tr>
          <tr className="radio-row">
            <th />
            {allPeers.map(peer => <th key={peer} className="radio-header">{peer}</th>)}
            <th className="radio-header">Average (without own grading)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="peer-header">
            <td>{studentName}</td>
            {allPeers.map((peer, peerIndex) => (
              <td key={peerIndex} className="radio-button">{calculatePeerRating(studentName, peer, answers)}</td>
            ))}
            <td className="radio-button">{calculateAverageRating(studentName, answers)}</td>
          </tr>
        </tbody>
      </table>
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
    <div>
      {answers.map((studentAnswer, answerIndex) => (
        <div key={answerIndex}>
          <h2>{studentAnswer.student.first_names} {studentAnswer.student.last_name}</h2>
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
                <div key={questionIndex}>
                  <h3>{question.questionHeader}</h3>
                  {question &&
                    Object.entries(question.peers).map(([peer, review]) => (
                      <p key={peer}>
                        {peer}: {review}
                      </p>
                    ))}
                </div>
              )
            } else {
              return (
                <div key={questionIndex}>
                  <h3>{question.questionHeader}</h3>
                  <p>{question.answer}</p>
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
