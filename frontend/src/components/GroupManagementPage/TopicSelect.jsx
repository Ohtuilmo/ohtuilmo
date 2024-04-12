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
  return (
    <Select
      className={className}
      value={groupTopicID}
      onChange={(e) => onTopicSelectChange(e.target.value)}
    >
      {topics
        .filter(
          (topic) => topic.active && topic.configuration_id === groupConfig
        )
        .map((topic) => (
          <MenuItem key={topic.id} value={topic.id} className="topic-menu-item">
            {topic.content.title}
          </MenuItem>
        ))}
    </Select>
  )
}

const mapStateToProps = (state) => {
  return {
    groupConfig: state.groupPage.groupConfigurationID
  }
}

const ConnectedTopicSelect = connect(mapStateToProps)(TopicSelect)

export default ConnectedTopicSelect
