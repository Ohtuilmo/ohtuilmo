import React from 'react'
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

class ConfigurationPage extends React.Component {
  async componentDidMount() {
    this.setQuestions()
    if (this.props.configurations.length === 0) {
      await this.props.fetchConfigurations()
    }
  }

  setQuestions = async () => {
    try {
      const registrationQuestions = await registrationQuestionSetService.getAll()
      this.props.setRegistrationQuestions(registrationQuestions)

      const reviewQuestions = await reviewQuestionSetService.getAll()
      this.props.setReviewQuestions(reviewQuestions)

      const customerReviewQuestions = await customerReviewQuestionService.getAll()
      this.props.setCustomerReviewQuestions(customerReviewQuestions)
    } catch (e) {
      console.log('error happened', e)
      this.props.setError('Error fetching question sets', 5000)
    }
  }

  handleConfigurationChange = (event) => {
    if (event.target.value === 'new') {
      this.props.selectNewConfig()
      this.props.updateNewStatus(true)
    } else {
      this.props.updateSelectedConfig(event.target.value)
      this.props.updateConfigForm(event.target.value)
      this.props.updateNewStatus(false)
    }
  }

  handleQuestionSetChange = (event) => {
    if (event.target.name === 'registration') {
      this.props.updateSelectedRegistrationQuestions(event.target.value)
    } else if (event.target.name === 'review1') {
      this.props.updateSelectedReviewQuestions1(event.target.value)
    } else if (event.target.name === 'review2') {
      this.props.updateSelectedReviewQuestions2(event.target.value)
    } else if (event.target.name === 'customer-review') {
      this.props.updateSelectedCustomerReviewQuestions(event.target.value)
    }
  }

  saveNewConfig = async (event) => {
    event.preventDefault()
    const configuration = { ...this.props.form }
    try {
      const response = await configurationService.create(configuration)
      this.props.setConfigurations([
        ...this.props.configurations,
        response.configuration
      ])
      this.props.updateSelectedConfig(response.configuration)
      this.props.updateNewStatus(false)
      this.props.setSuccess('New configuration saved', 5000)
    } catch (e) {
      console.log(e)
      this.props.setError('Error saving new configuration', 5000)
    }
  }

  updateConfig = async (event) => {
    event.preventDefault()
    try {
      const configuration = { ...this.props.form }
      const response = await configurationService.update(
        configuration,
        this.props.selectedConfig.id
      )
      this.props.updateConfigurations(response.configuration)
      this.props.updateSelectedConfig(response.configuration)
      this.props.updateConfigForm(response.configuration)
      this.props.setSuccess('Configuration updated', 5000)
    } catch (e) {
      console.log(e)
      this.props.setError('Error saving edits to configuration', 5000)
    }
  }

  goToAddRegistrationQuestions = () => {
    this.props.history.push('/administration/registration-questions')
  }

  goToAddReviewQuestions = () => {
    this.props.history.push('/administration/peer-review-questions')
  }

  goToAddCustomerReviewQuestions = () => {
    this.props.history.push('/administration/customer-review-questions')
  }

  render() {
    return (
      <div className="admin-page-container">
        <h3>Change configuration</h3>
        <Select
          value={this.props.selectedConfig ? this.props.selectedConfig : 'new'}
          onChange={this.handleConfigurationChange}
        >
          {this.props.configurations.map((item) => (
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
            value={this.props.form.name}
            onChange={(e) => this.props.updateConfigName(e.target.value)}
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
                {this.props.selectedRegister && (
                  <RegistrationQuestionsTable
                    questions={this.props.selectedRegister.questions}
                  />
                )}
              </div>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Select
                name="registration"
                value={
                  this.props.selectedRegister
                    ? this.props.selectedRegister
                    : 'default'
                }
                onChange={this.handleQuestionSetChange}
              >
                <MenuItem value="default" disabled>
                  Pick registration questions
                </MenuItem>
                {this.props.allRegistrationQuestions.map((item) => (
                  <MenuItem key={item.id} value={item}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                style={{ marginRight: '10px', height: '40px' }}
                color="primary"
                variant="contained"
                onClick={this.goToAddRegistrationQuestions}
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
                {this.props.selectedReview1 && (
                  <PeerReviewQuestionsTable
                    questions={this.props.selectedReview1.questions}
                  />
                )}
              </div>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Select
                data-cy="select-review-questions-1"
                name="review1"
                value={
                  this.props.selectedReview1
                    ? this.props.selectedReview1
                    : 'default'
                }
                onChange={this.handleQuestionSetChange}
              >
                <MenuItem value="default" disabled>
                  Pick review 1 questions
                </MenuItem>
                {this.props.allReviewQuestions.map((item) => (
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
                onClick={this.goToAddReviewQuestions}
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
                {this.props.selectedReview2 && (
                  <PeerReviewQuestionsTable
                    questions={this.props.selectedReview2.questions}
                  />
                )}
              </div>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Select
                name="review2"
                value={
                  this.props.selectedReview2
                    ? this.props.selectedReview2
                    : 'default'
                }
                onChange={this.handleQuestionSetChange}
              >
                <MenuItem value="default" disabled>
                  Pick review 2 questions
                </MenuItem>
                {this.props.allReviewQuestions.map((item) => (
                  <MenuItem key={item.id} value={item}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                style={{ marginRight: '10px', height: '40px' }}
                color="primary"
                variant="contained"
                onClick={this.goToAddReviewQuestions}
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
                {this.props.selectedCustomerReview && (
                  <PeerReviewQuestionsTable
                    questions={this.props.selectedCustomerReview.questions}
                  />
                )}
              </div>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Select
                name="customer-review"
                value={
                  this.props.selectedCustomerReview
                    ? this.props.selectedCustomerReview
                    : 'default'
                }
                onChange={this.handleQuestionSetChange}
              >
                <MenuItem value="default" disabled>
                  Pick customer review questions
                </MenuItem>
                {this.props.allCustomerReviewQuestions.map((item) => (
                  <MenuItem key={item.id} value={item}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                style={{ marginRight: '10px', height: '40px' }}
                color="primary"
                variant="contained"
                onClick={this.goToAddCustomerReviewQuestions}
              >
                Configure
              </Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        </div>
        <Button
          color="primary"
          variant="contained"
          onClick={this.props.isNew ? this.saveNewConfig : this.updateConfig}
        >
          Save
        </Button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    configurations,
    selectedConfig,
    allRegistrationQuestions,
    allReviewQuestions,
    allCustomerReviewQuestions,
    selectedRegister,
    selectedReview1,
    selectedReview2,
    selectedCustomerReview,
    form,
    isNew
  } = state.configurationPage

  return {
    configurations,
    selectedConfig,
    allRegistrationQuestions,
    allReviewQuestions,
    allCustomerReviewQuestions,
    selectedRegister,
    selectedReview1,
    selectedReview2,
    selectedCustomerReview,
    form,
    isNew
  }
}

const mapDispatchToProps = {
  ...configurationPageActions,
  ...questionsFormPageActions,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
  fetchConfigurations: configurationPageActions.fetchConfigurations
}

const ConnectedconfigurationPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigurationPage)

export default withRouter(ConnectedconfigurationPage)
