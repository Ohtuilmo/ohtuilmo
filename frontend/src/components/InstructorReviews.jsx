import React, { useEffect, useState } from 'react'
import instructorReview from '../services/instructorReview'

const Answer = ({ answer }) => {
  const [visible, setVisible] = useState(false)

  const withId = (id) => answer.answers.find(a => a.id === id)


  const double = answer.answers.filter(a => a.header === 'Prosessin kehittäminen').length === 2

  const tech = 1
  const process = 6
  const adapt = 11
  const group = double ? 21 : 16
  const customer = double ? 26 : 21
  const overall = double ? 31 : 26

  const style = {
    border: '1px solid black',
    padding: '5px',
    margin: '5px'
  }

  if (!visible) {
    return (
      <div style={style}>
        <h3 onClick={() => setVisible(!visible)}>{answer.name.first_names} {answer.name.last_name} {withId(overall).answer}</h3>
      </div>
    )
  }

  return (
    <div style={style}>
      <h3 onClick={() => setVisible(!visible)}>{answer.name.first_names} {answer.name.last_name}</h3>

      <h4>Tekninen kontribuutio</h4>
      {withId(tech).answer}
      <p>
        <em>
          {withId(tech+1).answer}
        </em>
      </p>
      <p>
        {withId(tech+2).answer}
      </p>
      <strong>
        arvosana {withId(tech+3).answer}
      </strong>

      <h4>Prosessin noudattaminen</h4>
      {withId(process).answer}
      <p>
        <em>
          {withId(process+1).answer}
        </em>
      </p>
      <p>
        {withId(process+2).answer}
      </p>
      <strong>
        arvosana {withId(process+3).answer}
      </strong>

      <h4>Prosessin kehittäminen</h4>
      {withId(adapt).answer}
      <p>
        <em>
          {withId(adapt+1).answer}
        </em>
      </p>
      <p>
        {withId(adapt+2).answer}
      </p>
      <strong>
        arvosana {withId(adapt+3).answer}
      </strong>

      <h4>Ryhmätyöskentely</h4>
      {withId(group).answer}
      <p>
        <em>
          {withId(group+1).answer}
        </em>
      </p>
      <p>
        {withId(group+2).answer}
      </p>
      <strong>
        arvosana {withId(group+3).answer}
      </strong>

      <h4>Asiakasyöskentely</h4>
      {withId(customer).answer}
      <p>
        <em>
          {withId(customer + 1).answer}
        </em>
      </p>
      <p>
        {withId(customer + 2).answer}
      </p>
      <strong>
        arvosana {withId(customer + 3).answer}
      </strong>

      <h4>Koko projekti ({answer.name.first_names} {answer.name.last_name})</h4>
      <strong>
        arvosana {withId(overall).answer}
      </strong>
    </div>
  )
}

const Review = ({ review }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <h2 onClick={() => setVisible(!visible)}>{review.group_name}</h2>
      {visible && review.answer_sheet.map((answer, i) => <Answer key={i} answer={answer} />)}
    </div>
  )
}

const InstructorReviews = () => {
  const [reviews, setReviews] = useState([])
  useEffect(() => {
    instructorReview.getAll().then(data => {
      setReviews(data.reviews)
    })
  }, [])

  return (
    <div>
      <h1>Grades given by instructors</h1>
      {reviews.reverse().map(data => <Review key={data.id} review={data.answer_sheet}/>)}
    </div>
  )
}

export default InstructorReviews
