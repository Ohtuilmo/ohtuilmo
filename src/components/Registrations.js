import React, { useEffect, useState } from 'react'
import registrationService from '../services/registration'

const Registrations = () => {
  const [regs, setRegs] = useState([])
  useEffect(() => {
    registrationService.current().then(registrations => {
      setRegs(registrations)
    })
  },
  [])

  if (regs.length===0) {
    return <div>
      no registrations
    </div>
  }

  const truncate = (title) => title

  const preferred_of = (reg) => {
    if (reg.preferred_topics.length===0) return null

    return (
      reg.preferred_topics.map(t =>
        <td key={t.content.title}>
          {truncate(t.content.title)}
        </td>
      )
    )
  }

  const stats = (registrations) => {

    const votes = {}
    const topicNames = {}

    const TOPIC_COUNT = registrations[0].preferred_topics.length

    registrations[0].preferred_topics.forEach(topic => {
      topicNames[topic.id] = topic.content.title
    })

    registrations.forEach(reg => {
      for (let i = 0; i < reg.preferred_topics.length; i++) {
        const topic = reg.preferred_topics[i]
        if (!votes[topic.id]) {
          votes[topic.id] = []
        }
        votes[topic.id][i] = (votes[topic.id][i] || 0) + 1
      }
    })

    const topics = Object.keys(votes).map(key => {
      const topic = votes[key]

      let totalScore = 0
      let multiplyer = 1
      for (let i = TOPIC_COUNT - 1; i >= 0; i--) {
        if (topic[i]) {
          totalScore += multiplyer * topic[i]
        }
        multiplyer *= TOPIC_COUNT + 1
      }

      return {
        id: key,
        name: topicNames[key],
        score: totalScore,
        votes: votes[key]
      }
    })

    const byScore = (t1, t2) => t2.score - t1.score

    const padded = (name) => {
      const paddedName = name + '                                                      '
      return paddedName.slice(0, 60)
    }


    const pretty = (votes) => {
      const p = (score) =>
        (score >= 10 ? score : ' ' + score)

      let string = ''

      for (let i = 0; i < 10; i++) {
        string += p(votes[i] || 0) + ' '
      }

      return string
    }

    const lines = ['```\n']
    topics.sort(byScore).forEach(topic => {
      lines.push(`${padded(topic.name)} ${pretty(topic.votes)}\n`)
    })
    lines.push('```')

    return lines
  }

  return (
    <div>
      <h3>
        Registrations {regs.length}
      </h3>

      <pre>
        {stats(regs)}
      </pre>

      <table>
        {regs.map(reg =>
          <tr key={reg.student_number}>
            <td>
              {reg.last_name}
            </td>
            <td>
              {reg.first_names}
            </td>
            <td>
              {reg.student_number}
            </td>
            <td>
              {reg.email}
            </td>
            {preferred_of(reg)}
            <td>
              {JSON.stringify(reg.questions[1])}
            </td>
          </tr>
        )}
      </table>
    </div>
  )
}

export default Registrations
