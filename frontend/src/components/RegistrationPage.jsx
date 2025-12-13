import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactDragList from 'react-drag-list'
// MUI
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
// services
import topicService from '../services/topic'
import userService from '../services/user'
import registrationService from '../services/registration'
import configurationService from '../services/configuration'
// components
import LoadingSpinner from './common/LoadingSpinner'
import CourseMaterial from './common/CourseMaterial'
import TopicDialog from './TopicDialog'
import UserDetails from './UserDetails'
import './RegistrationPage.css'
// Actions
import registrationPageActions from '../reducers/actions/registrationPageActions'
import * as notificationActions from '../reducers/actions/notificationActions'
import registrationActions from '../reducers/actions/registrationActions'
import registrationmanagementActions from '../reducers/actions/registrationManagementActions'

const Prerequisites = ({ checkbox1, checkbox2, onToggle1, onToggle2 }) => {
  return (
    <div
      style={{
        fontWeight: 'bold',
        marginBottom: 30,
        border: 'solid',
        padding: 20,
        borderRadius: 10,
      }}

    >
      <div style={{ marginBottom: '10px' }}>
        Projektin <a href='https://github.com/HY-TKTL/TKT20007-Ohjelmistotuotantoprojekti/blob/master/README.md#arvosteluperusteet'>
        arvosteluperusteissa</a> erääksi kriteeriksi mainitaan työmäärä ja tasainen työskentely. Vaatimuksena on noin 200 tuntia työtä koko kurssin aikana, mikä on noin 15 tuntia viikossa.
      </div>
      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '10px' }}>
        <input
          type="checkbox"
          checked={checkbox1}
          onChange={onToggle1}
          style={{ marginRight: '8px' }}
        />
        olen tutustunut projektin arvosteluperusteisiin
      </label>
      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={checkbox2}
          onChange={onToggle2}
          style={{ marginRight: '8px' }}
        />
        sitoudun työskentelemään koko projektin ajan tasaisesti
      </label>
    </div>
  )
}

class RegistrationPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checkbox1: false,
      checkbox2: false
    }
  }

  async componentDidMount() {
    /**
     * If user goes straight to /register, registrationmanagement needs to be fetched first.
     */
    if (!this.props.registrationManagementFetched) {
      await this.fetchRegistrationManagement()
    }
    this.fetchOwnregistrations()
    this.fetchTopics()
    this.fetchQuestions()
    this.props.updateEmail(this.props.user.user.email)
  }

  async fetchRegistrationManagement() {
    try {
      await this.props.fetchRegistrationManagement()
    } catch (e) {
      console.log('error happened', e)
      this.props.setError(
        'Error fetching registration management configuration',
        5000
      )
    }
  }

  async fetchOwnregistrations() {
    try {
      await this.props.fetchRegistrations()
    } catch (e) {
      console.log('error happened', e.response)
      this.props.setError(
        'Error fetching own registration... try reloading the page',
        3000
      )
    }
  }

  async fetchQuestions() {
    try {
      const { projectConf } = this.props
      const response = await configurationService.getById(projectConf)
      let questions = response.registration_question_set.questions
      questions = questions ? questions : []
      this.props.updateQuestions(questions)
    } catch (e) {
      console.log('error happened', e.response)
      this.props.setError('Error fetching questions', 3000)
    }
  }

  async fetchTopics() {
    try {
      const fetchedTopics = await topicService
        .getAllActive()
        .then(function (defs) {
          return defs
        })

      this.props.updateTopics(fetchedTopics)
    } catch (e) {
      console.log('error happened', e.response)
      this.props.setError('Error fetching topics', 3000)
    }
  }

  handleUpdate = (evt, updated) => {
    this.props.updateTopics(updated)
  }

  updateUser = async () => {
    const user = {
      student_number: this.props.user.student_number,
      email: { email: this.props.email },
    }
    try {
      const response = await userService.update(user)
      var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
      loggedInUser['user'] = response.user
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
    } catch (e) {
      console.log('error happened', e.response)
      this.props.setError('Error updating user', 3000)
    }
  }

  toggleCheckbox1 = () => {
    this.setState({ checkbox1: !this.state.checkbox1 })
  }

  toggleCheckbox2 = () => {
    this.setState({ checkbox2: !this.state.checkbox2 })
  }

  submitRegistration = async (e) => {
    e.preventDefault()

    if (!this.state.checkbox1 || !this.state.checkbox2) {
      this.props.setError('Please check both boxes to enable submission', 3000)
      return
    }

    const answer = window.confirm(
      'Are you sure that you have ordered topics according to your preference and that you have done all the prerequisite courses (Ohjelmistotuotanto ja kaksi aineopintotojen harjoitustyötä) by the start of the project?'
    )
    if (!answer) return

    try {
      await this.updateUser()
      await registrationService.create({
        questions: this.props.questions,
        preferred_topics: this.props.topics,
      })
      this.props.setSuccess('Registration submitted', 15000)
      this.props.history.push('/')
    } catch (e) {
      console.log(e)
      if (e.response.data.error === 'student already registered') {
        this.props.setError(
          'You have already registered for this course',
          15000
        )
      } else if (e.response.data.error === 'missing email') {
        this.props.setError('Email is missing', 5000)
      } else {
        this.props.setError('Error happened', 5000)
      }
    }
  }

  render() {
    const { ownRegistrations, projectOpen, user, projectConf } = this.props

    if (
      ownRegistrations.length > 0 &&
      ownRegistrations.find(
        (registration) => registration.configuration_id === projectConf
      )
    ) {
      return <h2>You have already registered to current project.</h2>
    }

    if (!projectOpen) {
      return <h2>Registration is not currently open.</h2>
    }

    if (!user) {
      return <LoadingSpinner />
    }

    const questions = this.props.questions.map((item, idx) => (
      <Card style={{ marginBottom: '10px' }} key={idx}>
        <CardContent>
          <p>{item.question}</p>
          {item.type === 'scale' ? (
            <div>
              <Select
                value={
                  this.props.questions[idx].answer === undefined
                    ? -1
                    : this.props.questions[idx].answer
                }
                onChange={(event) =>
                  this.props.updateQuestionAnswer(event.target.value, idx)
                }
              >
                <MenuItem value={-1} disabled>
                  <em>Pick a number</em>
                </MenuItem>
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </div>
          ) : null}
          {item.type === 'text' ? (
            <Input
              value={this.props.questions[idx].answer}
              onChange={(event) =>
                this.props.updateQuestionAnswer(event.target.value, idx)
              }
              placeholder="Answer"
              fullWidth
              multiline
              rowsMax="3"
              required
            />
          ) : null}
        </CardContent>
      </Card>
    ))

    const indexes = this.props.topics.map((item, idx) => (
      <Card key={idx} className="dragndrop-index">
        {idx + 1}
      </Card>
    ))

    return (
      <div>
        <div
          style={{
            fontWeight: 'bold',
            color: 'green',
            marginBottom: 20,
          }}
        >
          {this.props.projectInfo}
        </div>
        <form onSubmit={this.submitRegistration}>
          <div className="section registration-form">
            <CourseMaterial />
            <br />
            <div
              style={{
                fontWeight: 'bold',
                marginBottom: 20,
                border: 'solid',
                padding: 10,
                borderRadius: 10,
              }}
            >
              Huomaa, että projektiin osallistuminen edellyttää että kaikki
              esitietona olevat opintojaksot eli kurssit Ohjelmistotuotanto ja Tietokannat ja Web-ohjelmointi sekä
              yksi seuraavista (Aineopintojen harjoitustyö: Ohjelmistotekniikka, Aineopintojen harjoitustyö: Algoritmit ja
              teköäly, Aineopintojen harjoitustyö: Tietorakenteet ja algoritmit,
              Aineopintojen harjoitustyö: Tietoliikenne, Full stack
              -websovelluskehitys) on suoritettu
              tai palautettu arvosteltavaksi projektin alkuun mennessä.
            </div>
            <h2 className="landingpage-header">User details</h2>
            <UserDetails />
            <p>Please fill your email</p>
            <div>
              <TextField
                type="email"
                required
                label="Email"
                margin="normal"
                style={{ width: '250px', marginTop: 0 }}
                value={this.props.email}
                onChange={(e) => this.props.updateEmail(e.target.value)}
              />
            </div>
            <h2>Topics</h2>
            <div
              style={{
                fontWeight: 'bold',
                marginBottom: 20,
                border: 'solid',
                padding: 10,
                borderRadius: 10,
              }}
            >
              Set the order of the list of topics according to your preference
              (1 = favorite) by dragging and dropping, click to expand details
            </div>
            <div className="dragndrop-container">
              <div className="dragndrop-indexes-container">{indexes}</div>
              <ReactDragList
                className="dragndrop-list"
                handles={false}
                dataSource={this.props.topics}
                onUpdate={this.handleUpdate}
                rowKey="id"
                row={(topic) => (
                  <TopicDialog topic={topic} key={topic.content.title} />
                )}
              />
            </div>
          </div>
          <div className="section">
            <h2>Details</h2>
            <p>Please answer all questions</p>
            {questions}
          </div>

          <Prerequisites 
            checkbox1={this.state.checkbox1} 
            checkbox2={this.state.checkbox2}
            onToggle1={this.toggleCheckbox1} 
            onToggle2={this.toggleCheckbox2}
          />

          <Button
            type="submit"
            variant="outlined"
            style={{ backgroundColor: 'white' }}
            disabled={!this.state.checkbox1 || !this.state.checkbox2}
          >
            Submit your registration
          </Button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.login.user,
    topics: state.registrationPage.topics,
    questions: state.registrationPage.questions,
    email: state.registrationPage.email,
    projectConf: state.registrationManagement.projectRegistrationConf,
    projectOpen: state.registrationManagement.projectRegistrationOpen,
    projectInfo: state.registrationManagement.projectRegistrationInfo,
    ownRegistrations: state.registrations,
    registrationManagementFetched:
      state.registrationManagement.registrationManagementFetched,
  }
}

const mapDispatchToProps = {
  ...registrationPageActions,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
  fetchRegistrations: registrationActions.fetchRegistrations,
  fetchRegistrationManagement:
    registrationmanagementActions.fetchRegistrationManagement,
}

const ConnectedRegistrationPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationPage)

export default withRouter(ConnectedRegistrationPage)
