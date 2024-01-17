import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Paper from '@material-ui/core/Paper'

import emailTemplatesActions from '../../reducers/actions/emailTemplatesActions'
import * as notificationActions from '../../reducers/actions/notificationActions'

import './EmailTemplatesPage.css'
import { templatesShape } from './commonPropTypes'
import EmailTemplatesForm from './EmailTemplatesForm'
import LoadingCover from '../common/LoadingCover'

class EmailTemplatesPage extends React.Component {
  async componentDidMount() {
    try {
      await this.props.fetchEmailTemplates()
    } catch (e) {
      console.error(e)
      this.props.setError('Failed to fetch email templates')
    }
  }

  handleTemplatesSave = async (newTemplates) => {
    try {
      await this.props.updateEmailTemplates(newTemplates)
      this.props.setSuccess('Email templates saved!')
    } catch (e) {
      this.props.setError('Failed to update email templates')
    }
  }

  render() {
    const { templates, isLoading } = this.props

    return (
      <div className="email-templates-page">
        <h1>Configure email templates</h1>
        <Paper className="email-templates-page__container" elevation={1}>
          {isLoading && (
            <LoadingCover className="email-templates-page__loading-cover" />
          )}
          <EmailTemplatesForm
            initialTemplates={templates}
            disabled={isLoading}
            onSave={this.handleTemplatesSave}
          />
        </Paper>
      </div>
    )
  }
}

EmailTemplatesPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  fetchEmailTemplates: PropTypes.func.isRequired,
  updateEmailTemplates: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  setSuccess: PropTypes.func.isRequired,
  templates: templatesShape,
  isLoading: PropTypes.bool
}

const mapStateToProps = (state) => ({
  templates: state.emailTemplates.templates,
  isLoading: state.emailTemplates.isLoading
})

const mapDispatchToProps = {
  fetchEmailTemplates: emailTemplatesActions.fetchEmailTemplates,
  updateEmailTemplates: emailTemplatesActions.updateEmailTemplates,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EmailTemplatesPage)
)
