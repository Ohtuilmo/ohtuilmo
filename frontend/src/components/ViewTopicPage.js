import React from 'react'
import { connect } from 'react-redux'
import Topic from './Topic'
import TopicEditPage from './TopicEditPage'
import viewTopicPageActions from '../reducers/actions/viewTopicPageActions'
import topicService from '../services/topic'
import * as notificationActions from '../reducers/actions/notificationActions'
import './ViewTopicPage.css'

class ViewTopicPage extends React.Component {
  async componentDidMount() {
    const id = this.props.match.params.id
    try {
      const topic = await topicService.getOne(id)
      this.props.setTopic(topic)
      if ((this.props.user && this.props.user.user.admin) || isNaN(id)) {
        this.props.setEditable(true)
      }
    } catch (e) {
      console.log(e)
    }
  }

  changePage = () => {
    this.props.setEditMode(true)
  }

  copyToConfiguration = async () => {
    // eslint-disable-next-line
    const ok = confirm('sure?')
    console.log(this.props.topic.id )
    if ( ok ) {
      try {
        // eslint-disable-next-line
        const createdTopic = await topicService.copy(this.props.topic.id)
        this.props.setSuccess('Topic proposal copied succesfully!', 10000)
      } catch (e) {
        console.log('error happened', e.response)
        this.props.setError('Some error happened', 3000)
      }
    }
  }

  render() {
    //only try to render topic contents when state has been set
    if (!this.props.topic) {
      return <div />
    }
    return (
      <div className="topic-view-page-container">
        {this.props.isOnEditMode ? (
          <TopicEditPage
            topic={this.props.topic.content}
            id={this.props.match.params.id}
          />
        ) : (
          <Topic
            content={this.props.topic.content}
            isEditable={this.props.isEditable}
            isAdmin={this.props.user && this.props.user.user.admin}
            onPageChange={this.changePage}
            copyToConfiguration={this.copyToConfiguration}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    topic: state.viewTopicPage.topic,
    isEditable: state.viewTopicPage.isEditable,
    isOnEditMode: state.viewTopicPage.isOnEditMode,
    user: state.user
  }
}

const mapDispatchToProps = {
  ...viewTopicPageActions,
  setSuccess: notificationActions.setSuccess,
}

const ConnectedViewTopicPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewTopicPage)

export default ConnectedViewTopicPage
