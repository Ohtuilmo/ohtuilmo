import React from 'react'
import { connect } from 'react-redux'

// MUI
import {
  FormControlLabel,
  Select,
  MenuItem,
  CardContent,
  Card,
  Switch,
  FormControl,
  FormHelperText
} from '@material-ui/core'

// Actions
import registrationManagementActions from '../../reducers/actions/registrationManagementActions'

const PeerReviewSettings = ({
  peerReviewOpen,
  peerReviewConf,
  peerReviewRound,
  updatePeerReviewOpen,
  updatePeerReviewConf,
  updatePeerReviewRound,
  configurationMenuItems
}) => {
  return (
    <Card style={{ marginBottom: '10px' }}>
      <CardContent>
        <h4>Peer review</h4>
        <FormControlLabel
          control={
            <Switch
              checked={peerReviewOpen}
              onChange={() => updatePeerReviewOpen(!peerReviewOpen)}
            />
          }
          label="Peer review open"
          data-cy="peer-review-open-switch"
        />
        <p />
        <FormControl>
          <Select
            value={peerReviewConf ? peerReviewConf : -1}
            onChange={(event) => {
              updatePeerReviewConf(event.target.value)
            }}
          >
            {configurationMenuItems()}
          </Select>
          <FormHelperText>Active configuration for peer review</FormHelperText>
        </FormControl>
        <p />
        <FormControl>
          <Select
            value={peerReviewRound ? peerReviewRound : -1}
            onChange={(event) => {
              updatePeerReviewRound(event.target.value)
            }}
          >
            <MenuItem value={-1} disabled>
              <em>Pick one</em>
            </MenuItem>
            <MenuItem value={1}>Review round 1</MenuItem>
            <MenuItem value={2}>Review round 2</MenuItem>
          </Select>
          <FormHelperText>Select review round</FormHelperText>
        </FormControl>
      </CardContent>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    peerReviewConf: state.registrationManagement.peerReviewConf,
    peerReviewOpen: state.registrationManagement.peerReviewOpen,
    peerReviewRound: state.registrationManagement.peerReviewRound
  }
}

const mapDispatchToProps = {
  updatePeerReviewConf: registrationManagementActions.updatePeerReviewConf,
  updatePeerReviewOpen: registrationManagementActions.updatePeerReviewOpen,
  updatePeerReviewRound: registrationManagementActions.updatePeerReviewRound
}

const ConnectedPeerReviewSettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(PeerReviewSettings)

export default ConnectedPeerReviewSettings
