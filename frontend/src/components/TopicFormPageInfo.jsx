import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { Typography } from '@material-ui/core'
import topicFormPageActions from '../reducers/actions/topicFormPageActions'
import './TopicFormPageInfo.css'

const TopicFormPageInfo = ({ topicOpen, topicMessage, updateShowInfo, toggle }) => {
  const allowCretion = topicOpen && toggle

  return (
    <div className="topic-form-page-info">
      <div>
        {/* Not actually dangerous since html is imported from a static source */}
        <Typography dangerouslySetInnerHTML={{ __html: info }} />
      </div>
      {allowCretion && (
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
      {!allowCretion && (
        <div className="topic-form-page-info-message">{topicMessage}</div>
      )}
      <span style={{ margin: 10,  color: 'white' }} onClick={() => updateShowInfo(false)}>.</span>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    toggle: state && state.login && state.login.user && state.login.user.user && state.login.user.user.username === 'mluukkai',
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
    <h2>Asiakkaaksi projektiin / Become a customer in the project</h2>

    <div>
      Lisää tietoa projektin <a href="https://www.helsinki.fi/fi/innovaatiot-ja-yhteistyo/innovaatiot-ja-yrittajyys/yritysyhteistyo-ja-kumppanuudet/hyodynna-opiskelijoiden-osaamista/software-engineering-project">sivuilla</a>.
      For more info, see the project <a href="https://www.helsinki.fi/en/innovations-and-cooperation/innovations-and-entrepreneurship/business-collaboration-and-partnership/benefit-expertise-our-students/software-engineering-project">page</a>.
    </div>
  </div>
`
