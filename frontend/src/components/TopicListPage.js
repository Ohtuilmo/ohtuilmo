import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Switch from '@material-ui/core/Switch'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Icon from '@material-ui/icons/Input'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import orange from '@material-ui/core/colors/orange'

import emailService from '../services/email'
import { formatDate } from '../utils/functions'
import topicListPageActions from '../reducers/actions/topicListPageActions'
import * as notificationActions from '../reducers/actions/notificationActions'
import configurationPageActions from '../reducers/actions/configurationPageActions'

import LoadingCover from './common/LoadingCover'
import './TopicListPage.css'

const redGreenTheme = createMuiTheme({
  palette: {
    primary: green,
    secondary: red
  }
})

const orangeTheme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: orange
  }
})

const ThemedButton = ({ theme, ...props }) => (
  <MuiThemeProvider theme={theme}>
    <Button {...props} />
  </MuiThemeProvider>
)

const GreenButton = (props) => (
  <ThemedButton {...props} theme={redGreenTheme} color="primary" />
)
const RedButton = (props) => (
  <ThemedButton {...props} theme={redGreenTheme} color="secondary" />
)
const OrangeButton = (props) => (
  <ThemedButton {...props} theme={orangeTheme} color="primary" />
)

const FinnishFlag = (props) => (
  <img alt="Flag of Finland" {...props} src={`${process.env.PUBLIC_URL}/img/fi.svg`} />
)

const BritishFlag = (props) => (
  <img alt="Flag of Great Britain" {...props} src={`${process.env.PUBLIC_URL}/img/gb.svg`} />
)

const AcceptButton = (props) => (
  <GreenButton
    {...props}
    style={{
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    }}
    variant="outlined"
    size="small"
  />
)

const RejectButton = (props) => (
  <RedButton
    {...props}
    style={{
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    }}
    variant="outlined"
    size="small"
  />
)

const CustomerReviewEmailButton = ({ text, onSendRequested }) => {
  const [clickedButtonEl, setClickedButtonEl] = useState(null)
  const isMenuOpen = Boolean(clickedButtonEl)

  const handleButtonClick = (e) => {
    // use currentTarget instead of target because the click
    // will otherwise most likely register the <span> inside the button
    setClickedButtonEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setClickedButtonEl(null)
  }

  const createHandleLanguageClicked = (messageLanguage) => () => {
    // get value before setting the element null (closing the menu)
    const messageType = clickedButtonEl.value
    handleMenuClose()
    // call callback only after closing menu
    onSendRequested({ messageType, messageLanguage })
  }

  return (
    <>
      <OrangeButton
        data-cy="send-customer-review-link-email"
        value="customerReviewLink"
        variant="outlined"
        size="small"
        onClick={handleButtonClick}
      >
        {text}
      </OrangeButton>

      <Menu
        data-cy="email-language-menu"
        anchorEl={clickedButtonEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem disabled>Choose email language</MenuItem>
        <MenuItem
          data-cy-send-mail-lang="finnish"
          onClick={createHandleLanguageClicked('finnish')}
        >
          <ListItemIcon>
            <FinnishFlag width="16px" />
          </ListItemIcon>
          <ListItemText>Finnish</ListItemText>
        </MenuItem>
        <MenuItem
          data-cy-send-mail-lang="english"
          onClick={createHandleLanguageClicked('english')}
        >
          <ListItemIcon>
            <BritishFlag width="16px" />
          </ListItemIcon>
          <ListItemText>English</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

/**
 * @typedef {{ messageType: string, messageLanguage: string }} EmailInfo
 * @param {{ onSendRequested: (info: EmailInfo) => void, acceptText?: string, rejectText?: string }} props
 */
const AcceptRejectEmailButtons = ({
  acceptText = 'Accept',
  rejectText = 'Reject',
  onSendRequested
}) => {
  const [clickedButtonEl, setClickedButtonEl] = useState(null)
  const isMenuOpen = Boolean(clickedButtonEl)

  const handleButtonClick = (e) => {
    // use currentTarget instead of target because the click
    // will otherwise most likely register the <span> inside the button
    setClickedButtonEl(e.currentTarget)
  }

  const handleMenuClose = () => {
    setClickedButtonEl(null)
  }

  const createHandleLanguageClicked = (messageLanguage) => () => {
    // get value before setting the element null (closing the menu)
    const messageType = clickedButtonEl.value
    handleMenuClose()
    // call callback only after closing menu
    onSendRequested({ messageType, messageLanguage })
  }

  return (
    <>
      <AcceptButton
        data-cy="send-accept-mail"
        value="topicAccepted"
        onClick={handleButtonClick}
      >
        {acceptText}
      </AcceptButton>
      <RejectButton
        data-cy="send-reject-mail"
        value="topicRejected"
        onClick={handleButtonClick}
      >
        {rejectText}
      </RejectButton>

      <Menu
        data-cy="email-language-menu"
        anchorEl={clickedButtonEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem disabled>Choose email language</MenuItem>
        <MenuItem
          data-cy-send-mail-lang="finnish"
          onClick={createHandleLanguageClicked('finnish')}
        >
          <ListItemIcon>
            <FinnishFlag width="16px" />
          </ListItemIcon>
          <ListItemText>Finnish</ListItemText>
        </MenuItem>
        <MenuItem
          data-cy-send-mail-lang="english"
          onClick={createHandleLanguageClicked('english')}
        >
          <ListItemIcon>
            <BritishFlag width="16px" />
          </ListItemIcon>
          <ListItemText>English</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

AcceptRejectEmailButtons.propTypes = {
  onSendRequested: PropTypes.func.isRequired,
  acceptText: PropTypes.string,
  rejectText: PropTypes.string
}

const TopicDetailsLink = ({ topicId, ...props }) => (
  <Link {...props} to={`/topics/${topicId}`} />
)

const isTopicAcceptedMail = (sentMail) =>
  sentMail.email.type === 'topicAccepted'
const isTopicRejectedMail = (sentMail) =>
  sentMail.email.type === 'topicRejected'
const isCustomerReviewMail = (sentMail) =>
  sentMail.email.type === 'customerReviewLink'

/**
 * @param {{ topic: any, onEmailSendRequested: (info: EmailInfo) => void, onActiveToggle: () => void }} props
 */
const TopicTableRow = ({ topic, onEmailSendRequested, onActiveToggle }) => {
  const hasAcceptMailBeenSent = topic.sentEmails.some(isTopicAcceptedMail)
  const hasRejectMailBeenSent = topic.sentEmails.some(isTopicRejectedMail)
  const hasCustomerReviewMailBeenSent = topic.sentEmails.some(
    isCustomerReviewMail
  )

  return (
    <TableRow
      className="topic-table-row"
      data-cy-topic-name={topic.content.title}
    >
      <TableCell padding="dense">
        <p className="topic-table-row__topic-title">
          <TopicDetailsLink topicId={topic.id}>
            {topic.content.title}
          </TopicDetailsLink>
          <Link to={`/topics/${topic.secret_id}`} style={{ 'padding': 10 }} >
            <Icon />
          </Link>
        </p>
        <p className="topic-table-row__customer">
          {`${topic.content.customerName} (${topic.content.email})`}
        </p>
        <p className="topic-table-row__submit-date">
          Submitted {formatDate(topic.createdAt)}
        </p>
      </TableCell>
      <TableCell padding="none">
        {topic.hasReviewed ? (
          'Submitted'
        ) : (
          <CustomerReviewEmailButton
            text={hasCustomerReviewMailBeenSent ? 'Send reminder' : 'Send link'}
            onSendRequested={onEmailSendRequested}
          />
        )}
      </TableCell>
      <TableCell padding="none">
        <AcceptRejectEmailButtons
          acceptText={hasAcceptMailBeenSent ? 'Resend Accept' : 'Accept'}
          rejectText={hasRejectMailBeenSent ? 'Resend Reject' : 'Reject'}
          onSendRequested={onEmailSendRequested}
        />
      </TableCell>
      <TableCell padding="checkbox" numeric>
        <Switch
          inputProps={{ 'data-cy': 'toggle-active' }}
          checked={topic.active}
          onClick={onActiveToggle}
        />
      </TableCell>
    </TableRow>
  )
}

TopicTableRow.propTypes = {
  topic: PropTypes.object.isRequired,
  onEmailSendRequested: PropTypes.func.isRequired,
  onActiveToggle: PropTypes.func.isRequired
}

const TopicTableHead = () => (
  <TableHead>
    <TableRow>
      <TableCell padding="dense">Topic</TableCell>
      <TableCell padding="none">Customer review</TableCell>
      <TableCell padding="none">Send accept/reject email</TableCell>
      <TableCell numeric>Active</TableCell>
    </TableRow>
  </TableHead>
)

/**
 * @typedef {{ topic: any } & EmailInfo} TopicEmailInfo
 * @param {{ topics: any[], onEmailSendRequested: (info: TopicEmailInfo) => void, onActiveToggle: (topic: any) => void }} props
 */
const TopicTable = ({ topics, onEmailSendRequested, onActiveToggle }) => {
  return (
    <Table>
      <TopicTableHead />
      <TableBody>
        {topics.map((topic) => (
          <TopicTableRow
            key={topic.id}
            topic={topic}
            onEmailSendRequested={(emailInfo) =>
              onEmailSendRequested({ ...emailInfo, topic })
            }
            onActiveToggle={() => onActiveToggle(topic)}
          />
        ))}
      </TableBody>
    </Table>
  )
}

TopicTable.propTypes = {
  topics: PropTypes.array,
  onEmailSendRequested: PropTypes.func.isRequired,
  onActiveToggle: PropTypes.func.isRequired
}

const activeFirstThenByTitle = (topicA, topicB) => {
  if (topicA.active === topicB.active) {
    return `${topicA.content.title}`.localeCompare(`${topicB.content.title}`)
  }
  return +topicB.active - +topicA.active
}

const isAxiosError = (e) => !!e.response

const getApiError = (e) => {
  return isAxiosError(e) && e.response.data && e.response.data.error
}

class TopicListPage extends React.Component {
  async componentDidMount() {
    try {
      await this.props.fetchTopics()
    } catch (e) {
      console.log('error happened', e.response)
      this.props.setError('An error occurred while loading data!', 3000)
    }
    if (this.props.configurations.length === 0) {
      await this.props.fetchConfigurations()
    }
  }

  handleActiveChange = (topic) => async (event) => {
    event.preventDefault()
    try {
      const newActiveState = !topic.active
      await this.props.setTopicActive(topic, newActiveState)

      const activeDescription = newActiveState ? 'active' : 'inactive'
      this.props.setSuccess(
        `Topic '${topic.content.title}' has been set ${activeDescription}.`,
        3000
      )
    } catch (e) {
      console.log('error happened', e.response)
      this.props.setError('Some error happened', 3000)
    }
  }

  handleActiveToggle = async (topic) => {
    try {
      const newActiveState = !topic.active
      await this.props.setTopicActive(topic, newActiveState)

      const activeDescription = newActiveState ? 'active' : 'inactive'
      this.props.setSuccess(
        `Topic '${topic.content.title}' has been set ${activeDescription}.`,
        3000
      )
    } catch (e) {
      console.log('error happened', e.response)
      this.props.setError('Some error happened', 3000)
    }
  }

  showTopic = (topic) => {
    const filter = this.props.filter
    if (filter !== 0) {
      return topic.configuration_id === filter
    } else {
      return true
    }
  }

  confirmEmailPreview = async (messageType, messageLanguage, topicId) => {
    try {
      const preview = await emailService.previewCustomerEmail({
        messageType,
        messageLanguage,
        topicId
      })
      const confirmMessage = [
        'Send the following email?',
        '',
        `Subject: ${preview.subject}`,
        `To: ${preview.to}`,
        '---',
        preview.email
      ].join('\n')

      return window.confirm(confirmMessage)
    } catch (e) {
      console.error(e)
      if (isAxiosError(e)) {
        console.error(e.response.data)
      }
      const errorMsg = getApiError(e) || 'server error, see console for details'
      this.props.setError(
        `Failed to generate preview. See console for details. Error: ${errorMsg}`,
        10000
      )
      return false
    }
  }

  handleEmailSendRequested = async ({
    topic,
    messageType,
    messageLanguage
  }) => {
    const userConfirmedPreview = await this.confirmEmailPreview(
      messageType,
      messageLanguage,
      topic.id
    )

    if (!userConfirmedPreview) {
      return
    }

    try {
      await this.props.sendCustomerEmail(topic.id, messageType, messageLanguage)
      this.props.setSuccess('Email sent!')
    } catch (e) {
      console.error(e)
      if (isAxiosError(e)) {
        console.error(e.response.data)
      }
      const errorMsg = getApiError(e) || 'server error, see console for details'
      this.props.setError(
        `Failed to send email. See console for details. Error: '${errorMsg}'`,
        10000
      )
    }
  }

  render() {
    const { filter, topics, isLoading } = this.props

    const configurationMenuItems = () => {
      const { configurations } = this.props
      return []
        .concat(
          <MenuItem value={0} key={0}>
            All configurations
          </MenuItem>
        )
        .concat(
          configurations.map((configuration) => (
            <MenuItem value={configuration.id} key={configuration.id}>
              {configuration.name}
            </MenuItem>
          ))
        )
    }

    const shownTopics = topics
      .filter(this.showTopic)
      .sort(activeFirstThenByTitle)

    return (
      <div className="topics-container">
        {isLoading && (
          <LoadingCover className="topics-container__loading-cover" />
        )}

        <Select
          value={filter}
          onChange={(event) => this.props.updateFilter(event.target.value)}
        >
          {configurationMenuItems()}
        </Select>

        <TopicTable
          topics={shownTopics}
          onEmailSendRequested={this.handleEmailSendRequested}
          onActiveToggle={this.handleActiveToggle}
        />
      </div>
    )
  }
}

TopicListPage.propTypes = {
  filter: PropTypes.number.isRequired,
  topics: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  fetchTopics: PropTypes.func.isRequired,
  setTopicActive: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  setSuccess: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const { topicListPage } = state
  return {
    topics: topicListPage.topics,
    // don't show loading cover for update loadings; active state changes are
    // done in quick succession and their "loading" doesn't affect page usage
    isLoading: topicListPage.isTopicsLoading,
    filter: topicListPage.filter,
    configurations: state.configurationPage.configurations
  }
}

const mapDispatchToProps = {
  fetchTopics: topicListPageActions.fetchTopics,
  updateFilter: topicListPageActions.updateFilter,
  setTopicActive: topicListPageActions.setTopicActive,
  sendCustomerEmail: topicListPageActions.sendCustomerEmail,
  setError: notificationActions.setError,
  setSuccess: notificationActions.setSuccess,
  fetchConfigurations: configurationPageActions.fetchConfigurations
}

const ConnectedTopicListPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicListPage)

export default withRouter(ConnectedTopicListPage)
