import React from 'react'
import { connect } from 'react-redux'

// MUI
import {
  FormControlLabel,
  Select,
  CardContent,
  Card,
  TextField,
  Switch,
  FormControl,
  FormHelperText
} from '@material-ui/core'

// Actions
import registrationManagementActions from '../../reducers/actions/registrationManagementActions'

const TopicRegistrationSettings = ({
  summerProject,
  updateSummerProject,
  summerDates,
  updateSummerDates,
  topicOpen,
  topicConf,
  topicMessage,
  updateTopicOpen,
  updateTopicConf,
  updateTopicMessage,
  configurationMenuItems,
}) => {
  return (
    <Card style={{ marginBottom: '10px' }}>
      <CardContent>
        <h4>Topic registration</h4>
        <FormControlLabel
          control={
            <Switch
              checked={topicOpen}
              onChange={() => updateTopicOpen(!topicOpen)}
            />
          }
          label="Topic registration open"
        />
        <p />
        <FormControl>
          <Select
            value={topicConf ? topicConf : -1}
            onChange={(event) => {
              updateTopicConf(event.target.value)
            }}
          >
            {configurationMenuItems()}
          </Select>
          <FormHelperText>
            Active configuration for topic registration
          </FormHelperText>
        </FormControl>
        <TextField
          fullWidth
          label="Registration status message"
          margin="normal"
          value={topicMessage}
          onChange={(e) => updateTopicMessage(e.target.value)}
          required={!topicOpen}
        />
        <FormControlLabel
          control={
            <Switch
              checked={summerProject}
              onChange={() => updateSummerProject(!summerProject)}
            />
          }
          label="Summer project"
        />
        {summerProject && (
          <TextField
            fullWidth
            label="Short project dates"
            margin="normal"
            value={summerDates && summerDates.short}
            onChange={(e) => updateSummerDates({ ...summerDates, short: e.target.value })}
            required={!topicOpen}
          />
        )}
        <TextField
          fullWidth
          label="Long project dates"
          margin="normal"
          value={summerDates && summerDates.long}
          onChange={(e) => updateSummerDates({ ...summerDates, long: e.target.value })}
          required={!topicOpen}
        />
      </CardContent>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    topicConf: state.registrationManagement.topicRegistrationConf,
    topicOpen: state.registrationManagement.topicRegistrationOpen,
    topicMessage: state.registrationManagement.topicRegistrationMessage,
    summerProject: state.registrationManagement.summerProject,
    summerDates: state.registrationManagement.summerDates
  }
}

const mapDispatchToProps = {
  updateTopicConf: registrationManagementActions.updateTopicRegistrationConf,
  updateTopicOpen: registrationManagementActions.updateTopicRegistrationOpen,
  updateSummerProject: registrationManagementActions.updateSummerProject,
  updateSummerDates: registrationManagementActions.updateSummerDates,
  updateTopicMessage:
    registrationManagementActions.updateTopicRegistrationMessage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicRegistrationSettings)
