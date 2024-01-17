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

const ProjectRegistrationSettings = ({
  projectOpen,
  projectConf,
  projectMessage,
  projectInfo,
  updateProjectOpen,
  updateProjectConf,
  updateProjectMessage,
  updateProjectInfo,
  configurationMenuItems
}) => {
  return (
    <Card style={{ marginBottom: '10px' }}>
      <CardContent>
        <h4>Student registration</h4>
        <FormControlLabel
          control={
            <Switch
              checked={projectOpen}
              onChange={() => updateProjectOpen(!projectOpen)}
            />
          }
          label="Student registration open"
        />
        <p />
        <FormControl>
          <Select
            value={projectConf ? projectConf : -1}
            onChange={(event) => {
              updateProjectConf(event.target.value)
            }}
          >
            {configurationMenuItems()}
          </Select>
          <FormHelperText>
            Active configuration for project registration
          </FormHelperText>
        </FormControl>

        <TextField
          fullWidth
          label="Registration status message"
          margin="normal"
          value={projectMessage}
          onChange={(e) => updateProjectMessage(e.target.value)}
          required={!projectOpen}
        />
        <TextField
          fullWidth
          label="Registration page info message"
          margin="normal"
          value={projectInfo}
          onChange={(e) => updateProjectInfo(e.target.value)}
        />
      </CardContent>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    projectConf: state.registrationManagement.projectRegistrationConf,
    projectOpen: state.registrationManagement.projectRegistrationOpen,
    projectMessage: state.registrationManagement.projectRegistrationMessage,
    projectInfo: state.registrationManagement.projectRegistrationInfo
  }
}

const mapDispatchToProps = {
  updateProjectOpen:
    registrationManagementActions.updateProjectRegistrationOpen,
  updateProjectConf:
    registrationManagementActions.updateProjectRegistrationConf,
  updateProjectMessage:
    registrationManagementActions.updateProjectRegistrationMessage,
  updateProjectInfo: registrationManagementActions.updateProjectRegistrationInfo
}

const ConnectedProjectRegistrationSettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectRegistrationSettings)

export default ConnectedProjectRegistrationSettings
