import React from 'react'
import { connect } from 'react-redux'

import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

const TopicSelect = ({
  topics,
  onTopicSelectChange,
  groupTopicID,
  className,
  groupConfig
}) => {

  const filteredTopics = topics.filter(topic => {
    const isSelected = (emails) => {
      if (!emails || emails.length===0) {
        return false
      }

      return emails.map(email => email.email.type).includes('topicAccepted')
    }

    return topic.active && topic.configuration_id === groupConfig && isSelected(topic.sentEmails)
  })

  return (
    <Select
      className={className}
      value={groupTopicID}
      onChange={(e) => onTopicSelectChange(e.target.value)}
    >
      {filteredTopics
        .map((topic) => (
          <MenuItem key={topic.id} value={topic.id} className="topic-menu-item">
            {topic.content.title}
          </MenuItem>
        ))}
    </Select>
  )
}

const mapStateToProps = (state) => {
  const id =  state.groupPage.groupConfigurationID
  const ids = state.configurationPage.configurations.map(config => config.id)
  return {
    groupConfig: id ? id : Math.max(...ids),
  }
}

const ConnectedTopicSelect = connect(mapStateToProps)(TopicSelect)

export default ConnectedTopicSelect
