import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ProjectRegistrationSettings from './ProjectRegistrationSettings'
import TopicRegistrationSettings from './TopicRegistrationSettings'
import PeerReviewSettings from './PeerReviewSettings'

// MUI
import { MenuItem, Button } from '@material-ui/core'

// Actions
import appActions from '../../reducers/actions/appActions'
import * as notificationActions from '../../reducers/actions/notificationActions'
import configurationPageActions from '../../reducers/actions/configurationPageActions'

// Services
import registrationManagementService from '../../services/registrationManagement'

const RegistrationManagement = (props) => {
  useEffect(() => {
    props.fetchConfigurations()
  }, [])

  const saveConfiguration = async (event) => {
    event.preventDefault()

    const {
      peerReviewConf,
      peerReviewOpen,
      peerReviewRound,
      projectConf,
      projectOpen,
      projectMessage,
      topicConf,
      topicOpen,
      topicMessage,
      projectInfo,
      updateIsLoading,
      setSuccess,
      setError,
      summerProject,
      summerDates
    } = props

    updateIsLoading(true)

    try {
      await registrationManagementService.create({
        registrationManagement: {
          peer_review_conf: peerReviewConf,
          peer_review_open: peerReviewOpen,
          peer_review_round: peerReviewRound,
          summer_project: summerProject,
          summer_dates: summerDates,
          project_registration_conf: projectConf,
          project_registration_open: projectOpen,
          project_registration_message: projectMessage,
          project_registration_info: projectInfo,
          topic_registration_conf: topicConf,
          topic_registration_open: topicOpen,
          topic_registration_message: topicMessage,
        },
      })
      setSuccess('Saving configuration succesful!', 3000)
      updateIsLoading(false)
    } catch (e) {
      console.log('error happened', e.response)
      updateIsLoading(false)
      if (e.response.status === 400) {
        setError(e.response.data.error, 3000)
      }
    }
  }

  const configurationMenuItems = () => {
    const { configurations } = props
    return []
      .concat(
        <MenuItem value={-1} key={-1} disabled>
          <em>Pick one</em>
        </MenuItem>
      )
      .concat(
        configurations.map((configuration) => (
          <MenuItem value={configuration.id} key={configuration.id}>
            {configuration.name}
          </MenuItem>
        ))
      )
  }

  return (
    <div className="registrationManagement-container">
      <h3>Registration and review management</h3>
      <form
        className="registration-management-form"
        onSubmit={saveConfiguration}
      >
        <p>Control state of registrations and reviews</p>

        <ProjectRegistrationSettings
          configurationMenuItems={configurationMenuItems}
        />

        <TopicRegistrationSettings
          configurationMenuItems={configurationMenuItems}
        />

        <PeerReviewSettings configurationMenuItems={configurationMenuItems} />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          data-cy="save-configuration-submit"
        >
          Save Configuration
        </Button>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    peerReviewConf: state.registrationManagement.peerReviewConf,
    peerReviewOpen: state.registrationManagement.peerReviewOpen,
    peerReviewRound: state.registrationManagement.peerReviewRound,
    projectConf: state.registrationManagement.projectRegistrationConf,
    projectOpen: state.registrationManagement.projectRegistrationOpen,
    projectMessage: state.registrationManagement.projectRegistrationMessage,
    projectInfo: state.registrationManagement.projectRegistrationInfo,
    topicConf: state.registrationManagement.topicRegistrationConf,
    topicOpen: state.registrationManagement.topicRegistrationOpen,
    topicMessage: state.registrationManagement.topicRegistrationMessage,
    configurations: state.configurationPage.configurations,
    summerProject: state.registrationManagement.summerProject,
    summerDates: state.registrationManagement.summerDates,
  }
}

const mapDispatchToProps = {
  updateIsLoading: appActions.updateIsLoading,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
  fetchConfigurations: configurationPageActions.fetchConfigurations,
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RegistrationManagement)
)
