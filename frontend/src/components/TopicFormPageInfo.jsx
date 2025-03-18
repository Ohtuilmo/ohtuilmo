import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { Typography } from '@material-ui/core'
import topicFormPageActions from '../reducers/actions/topicFormPageActions'
import './TopicFormPageInfo.css'

const TopicFormPageInfo = ({ topicOpen, topicMessage, updateShowInfo }) => {
  return (
    <div className="topic-form-page-info">
      {!topicOpen && (
        <div className="topic-form-page-info-message">{topicMessage}</div>
      )}

      <div>
        {/* Not actually dangerous since html is imported from a static source */}
        <Typography dangerouslySetInnerHTML={{ __html: info }} />
      </div>
      {topicOpen && (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            window.scrollTo(0, 0)
            updateShowInfo(false)
          }}
        >
          Create Topic
        </Button>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    topicOpen: state.registrationManagement.topicRegistrationOpen,
    topicMessage: state.registrationManagement.topicRegistrationMessage
  }
}

const mapDispatchToProps = {
  ...topicFormPageActions
}

const ConnectedTopicFormPageInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicFormPageInfo)

export default ConnectedTopicFormPageInfo

const info = `
  <div style="margin-bottom: 20px;">
    <h2>Asiakkaaksi ohjelmistoprojektiin / Become a customer in Software engineering project</h2>

    <div>
      Lisää tietoa projektin <a href="https://www.helsinki.fi/fi/innovaatiot-ja-yhteistyo/innovaatiot-ja-yrittajyys/yritysyhteistyo-ja-kumppanuudet/hyodynna-opiskelijoiden-osaamista/software-engineering-project">sivuilla</a>.
      For more info, see the project <a href="https://www.helsinki.fi/en/innovations-and-cooperation/innovations-and-entrepreneurship/business-collaboration-and-partnership/benefit-expertise-our-students/software-engineering-project">page</a>.
    </div>
  </div>
`
