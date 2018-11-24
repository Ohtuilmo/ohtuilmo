import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import topicFormPageActions from '../reducers/actions/topicFormPageActions'
import notificationActions from '../reducers/actions/notificationActions'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import topicService from '../services/topic'
import Topic from './Topic'
import TopicForm from './TopicForm'
import './TopicFormPage.css'

class TopicFormPage extends React.Component {
  submitForm = async (event) => {
    event.preventDefault()
    try {
      const content = { content: this.props.content }
      const createdTopic = await topicService.create(content)

      this.props.setSuccess('Topic proposal submitted succesfully!')
      setTimeout(() => {
        this.props.clearNotifications()
      }, 3000)
      this.props.clearForm()

      this.props.updateSecretId(createdTopic.secret_id)
      this.props.setSaved(true)
    } catch (e) {
      console.log('error happened', e.response)
      this.props.setError('Some error happened')
      setTimeout(() => {
        this.props.clearNotifications()
      }, 3000)
    }
  }

  render() {
    if (this.props.isSaved === true) {
      return (
        <Redirect
          to={process.env.PUBLIC_URL + '/topics/' + this.props.secretId}
        />
      )
    }

    return (
      <div className="topic-submit-page-container">
        <div className="topic-form-container">
          {this.props.preview ? (
            <div>
              <Topic content={this.props.content} />
              <FormControlLabel
                control={
                  <Switch
                    checked={this.props.preview}
                    onClick={() => this.props.updatePreview(false)}
                  />
                }
                label="Preview topic proposal"
              />
            </div>
          ) : (
            <div>
              <h1>Give your proposal</h1>
              <p>Projektin kuvaus voi olla myös suomeksi.</p>
              <TopicForm
                content={this.props.content}
                onSubmit={this.submitForm}
                submitButtonText="submit proposal"
                isEditForm={false}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={this.props.preview}
                    onChange={() => this.props.updatePreview(true)}
                  />
                }
                label="Preview topic proposal"
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    content: state.topicFormPage.content,
    preview: state.topicFormPage.preview,
    isSaved: state.topicFormPage.isSaved,
    secretId: state.topicFormPage.secretId
  }
}

const mapDispatchToProps = {
  ...topicFormPageActions,
  ...notificationActions
}

const ConnectedTopicFormPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicFormPage)

export default ConnectedTopicFormPage
