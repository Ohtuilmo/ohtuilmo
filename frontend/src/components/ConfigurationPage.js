import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import './TopicFormPage.css'

// MUI
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Divider from '@material-ui/core/Divider'

// Service
import configurationService from '../services/configuration'
import registrationQuestionSetService from '../services/registrationQuestionSet'
import reviewQuestionSetService from '../services/peerReviewQuestionSet'
import customerReviewQuestionService from '../services/customerReviewQuestionSet'
// Actions
import configurationPageActions from '../reducers/actions/configurationPageActions'
import * as notificationActions from '../reducers/actions/notificationActions'
import questionsFormPageActions from '../reducers/actions/questionsFormPageActions'

import RegistrationQuestionsTable from './RegistrationQuestionsTable'
import PeerReviewQuestionsTable from './PeerReviewQuestionsTable'

const ConfigurationPage = (props) => {
  useEffect(() => {
    setQuestions()
  }, [])

  const setQuestions = async () => {
    try {
      const registrationQuestions = await registrationQuestionSetService.getAll()
      props.setRegistrationQuestions(registrationQuestions)

      const reviewQuestions = await reviewQuestionSetService.getAll()
      props.setReviewQuestions(reviewQuestions)

      const customerReviewQuestions = await customerReviewQuestionService.getAll()
      props.setCustomerReviewQuestions(customerReviewQuestions)
    } catch (e) {
      console.log('error happened', e)
      props.setError('Error fetching question sets', 5000)
    }
  }

  const handleConfigurationChange = (event) => {
    if (event.target.value === 'new') {
      props.selectNewConfig()
      props.updateNewStatus(true)
    } else {
      props.updateSelectedConfig(event.target.value)
      props.updateConfigForm(event.target.value)
      props.updateNewStatus(false)
    }
  }

  const handleQuestionSetChange = (event) => {
    if (event.target.name === 'registration') {
      props.updateSelectedRegistrationQuestions(event.target.value)
    } else if (event.target.name === 'review1') {
      props.updateSelectedReviewQuestions1(event.target.value)
    } else if (event.target.name === 'review2') {
      props.updateSelectedReviewQuestions2(event.target.value)
    } else if (event.target.name === 'customer-review') {
      props.updateSelectedCustomerReviewQuestions(event.target.value)
    }
  }

  const saveNewConfig = async (event) => {
    event.preventDefault()
    const configuration = { ...props.form }
    try {
      const response = await configurationService.create(configuration)
      props.setConfigurations([
        ...props.configurations,
        response.configuration
      ])
      props.updateSelectedConfig(response.configuration)
      props.updateNewStatus(false)
      props.setSuccess('New configuration saved', 5000)
    } catch (e) {
      console.log(e)
      props.setError('Error saving new configuration', 5000)
    }
  }

  const updateConfig = async (event) => {
    event.preventDefault()
    try {
      const configuration = { ...props.form }
      const response = await configurationService.update(
        configuration,
        props.selectedConfig.id
      )
      props.updateConfigurations(response.configuration)
      props.updateSelectedConfig(response.configuration)
      props.updateConfigForm(response.configuration)
      props.setSuccess('Configuration updated', 5000)
    } catch (e) {
      console.log(e)
      props.setError('Error saving edits to configuration', 5000)
    }
  }

  const goToAddRegistrationQuestions = () => {
    props.history.push('/administration/registration-questions')
  }

  const goToAddReviewQuestions = () => {
    props.history.push('/administration/peer-review-questions')
  }

  const goToAddCustomerReviewQuestions = () => {
    props.history.push('/administration/customer-review-questions')
  }

  return <div className="admin-page-container">
    <h3>Change configuration</h3>
    <Select
      value={props.selectedConfig ? props.selectedConfig : 'new'}
      onChange={handleConfigurationChange}
    >
      {props.configurations.map((item) => (
        <MenuItem key={item.id} value={item}>
          {item.name}
        </MenuItem>
      ))}
      <MenuItem value="new">New</MenuItem>
    </Select>
    <div>
      <TextField
        label="Nimi"
        required
        margin="normal"
        value={props.form.name}
        onChange={(e) => props.updateConfigName(e.target.value)}
      />
    </div>
    <h3>Questions</h3>
    <div style={{ paddingBottom: 10 }}>
      <ExpansionPanel data-cy="expansion-registration-questions">
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <p>Registration questions</p>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Divider />
            {props.selectedRegister && (
              <RegistrationQuestionsTable
                questions={props.selectedRegister.questions}
              />
            )}
          </div>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Select
            name="registration"
            value={
              props.selectedRegister
                ? props.selectedRegister
                : 'default'
            }
            onChange={handleQuestionSetChange}
          >
            <MenuItem value="default" disabled>
              Pick registration questions
            </MenuItem>
            {props.allRegistrationQuestions.map((item) => (
              <MenuItem key={item.id} value={item}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            style={{ marginRight: '10px', height: '40px' }}
            color="primary"
            variant="contained"
            onClick={goToAddRegistrationQuestions}
          >
            Configure
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
      <ExpansionPanel data-cy="expansion-review-questions-1">
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <p>Peer review questions 1</p>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Divider />
            {props.selectedReview1 && (
              <PeerReviewQuestionsTable
                questions={props.selectedReview1.questions}
              />
            )}
          </div>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Select
            data-cy="select-review-questions-1"
            name="review1"
            value={
              props.selectedReview1
                ? props.selectedReview1
                : 'default'
            }
            onChange={handleQuestionSetChange}
          >
            <MenuItem value="default" disabled>
              Pick review 1 questions
            </MenuItem>
            {props.allReviewQuestions.map((item) => (
              <MenuItem
                key={item.id}
                value={item}
                data-cy="menu-item-review-questions-1"
              >
                {item.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            style={{ marginRight: '10px', height: '40px' }}
            color="primary"
            variant="contained"
            onClick={goToAddReviewQuestions}
          >
            Configure
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
      <ExpansionPanel data-cy="expansion-review-questions-2">
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <p>Peer review questions 2</p>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Divider />
            {props.selectedReview2 && (
              <PeerReviewQuestionsTable
                questions={props.selectedReview2.questions}
              />
            )}
          </div>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Select
            name="review2"
            value={
              props.selectedReview2
                ? props.selectedReview2
                : 'default'
            }
            onChange={handleQuestionSetChange}
          >
            <MenuItem value="default" disabled>
              Pick review 2 questions
            </MenuItem>
            {props.allReviewQuestions.map((item) => (
              <MenuItem key={item.id} value={item}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            style={{ marginRight: '10px', height: '40px' }}
            color="primary"
            variant="contained"
            onClick={goToAddReviewQuestions}
          >
            Configure
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
      <ExpansionPanel data-cy="expansion-customer-review-questions">
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <p>Customer review questions</p>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Divider />
            {props.selectedCustomerReview && (
              <PeerReviewQuestionsTable
                questions={props.selectedCustomerReview.questions}
              />
            )}
          </div>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Select
            name="customer-review"
            value={
              props.selectedCustomerReview
                ? props.selectedCustomerReview
                : 'default'
            }
            onChange={handleQuestionSetChange}
          >
            <MenuItem value="default" disabled>
              Pick customer review questions
            </MenuItem>
            {props.allCustomerReviewQuestions.map((item) => (
              <MenuItem key={item.id} value={item}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            style={{ marginRight: '10px', height: '40px' }}
            color="primary"
            variant="contained"
            onClick={goToAddCustomerReviewQuestions}
          >
            Configure
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </div>
    <Button
      color="primary"
      variant="contained"
      onClick={props.isNew ? saveNewConfig : updateConfig}
    >
      Save
    </Button>
  </div>
}

const mapStateToProps = (state) => ({
  configurations: state.configurationPage.configurations,
  selectedConfig: state.configurationPage.selectedConfig,
  allRegistrationQuestions: state.configurationPage.allRegistrationQuestions,
  allReviewQuestions: state.configurationPage.allReviewQuestions,
  allCustomerReviewQuestions: state.configurationPage.allCustomerReviewQuestions,
  selectedRegister: state.configurationPage.selectedRegister,
  selectedReview1: state.configurationPage.selectedReview1,
  selectedReview2: state.configurationPage.selectedReview2,
  selectedCustomerReview: state.configurationPage.selectedCustomerReview,
  form: state.configurationPage.form,
  isNew: state.configurationPage.isNew
})

const mapDispatchToProps = {
  ...configurationPageActions,
  ...questionsFormPageActions,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
  fetchConfigurations: configurationPageActions.fetchConfigurations
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigurationPage))
