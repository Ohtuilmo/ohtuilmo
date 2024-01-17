import React from 'react'
import { connect } from 'react-redux'

import Button from '@material-ui/core/Button'

import topicFormPageActions from '../reducers/actions/topicFormPageActions'
import * as notificationActions from '../reducers/actions/notificationActions'
import viewTopicPageActions from '../reducers/actions/viewTopicPageActions'
import topicService from '../services/topic'
import TopicForm from './TopicForm'
import Topic from './Topic'

class TopicEditPage extends React.Component {
  componentDidMount() {
    if (this.props.topic) {
      this.props.setCurrentTopic(this.props.topic)
    } else {
      this.props.setError('Could not edit topic')
      this.props.setEditMode(false)
    }
  }

  submitForm = async (event) => {
    event.preventDefault()
    const topic = {
      id: this.props.id,
      content: this.props.content
    }
    try {
      await topicService.update(topic)
      this.props.setSuccess('Topic updated succesfully!', 3000)
      this.props.setEditMode(false)
      this.props.setTopicContent(this.props.content)
    } catch (e) {
      console.log(e)
      if (e.response) {
        if (e.response.status === 401) {
          this.props.setError(
            'You do not have permission to edit this topic',
            3000
          )
        } else {
          this.props.setError(
            'Some error happened',
            3000
          )
        }
      }
      this.props.setEditMode(false)
    }
  }

  render() {
    return (
      <div>
        {this.props.preview ? (
          <div>
            <Topic content={this.props.content} />
            <div className="preview-button">
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.props.updatePreview(false)}
              >
                Back to edit
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h1>Edit topic proposal</h1>
            <TopicForm
              content={this.props.content}
              onSubmit={this.submitForm}
              submitButtonText="Save"
              isEditForm={true}
              onCancel={() => this.props.setEditMode(false)}
            />
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    content: state.topicFormPage.content,
    preview: state.topicFormPage.preview
  }
}

const mapDispatchToProps = {
  ...topicFormPageActions,
  ...viewTopicPageActions,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess
}

const ConnectedTopicEditPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicEditPage)

export default ConnectedTopicEditPage
