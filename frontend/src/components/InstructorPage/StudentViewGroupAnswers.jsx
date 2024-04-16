import React from 'react'

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
      <table>
        <thead>
          <tr>
            <th>Student</th>
            {allPeers.map(peer => <th key={peer}>{peer}</th>)}
            <th>Average</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{studentName}</td>
            {allPeers.map((peer, peerIndex) => (
              <td key={peerIndex}>{calculatePeerRating(studentName, peer, answers)}</td>
            ))}
            <td>{calculateAverageRating(studentName, answers, allPeers.length)}</td>
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

const calculateAverageRating = (member, answers, totalPeers) => {
  const ratings = answers.map(answer => answer.peers[member]).filter(rating => rating !== undefined)
  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  return (sum / totalPeers).toFixed(2)
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
            } else {
              return (
                <div key={questionIndex}>
                  <h4>{question.questionHeader}</h4>
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
