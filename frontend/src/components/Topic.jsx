import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ReactMarkdown from 'react-markdown'
import { connect } from 'react-redux'
import './Topic.css'

const markdownRenderers = {
  link: ({ children, href, ...otherProps }) => {
    // add rel and target for external links so we don't leak information :)
    const externalLinkProps = /^https?:\/\//i.test(href)
      ? { rel: 'nofollow noreferrer noopener', target: '_blank' }
      : {}

    return (
      <a {...otherProps} href={href} {...externalLinkProps}>
        {children}
      </a>
    )
  }
}

const Markdown = ({ children }) => (
  <ReactMarkdown renderers={markdownRenderers}>{children}</ReactMarkdown>
)

const Topic = ({ content, isEditable, onPageChange, isAdmin, copyToConfiguration, summer, dates }) => {
  const ipRights = content.ipRights === 'nonopen' ? 'The customer retains the intellectual property rights to the project.' : 'Software is published under a open source license'

  return (
    <div className="single-topic-container">
      <div className="block">
        <Typography variant="h5" id="title">
          {content.title}
        </Typography>
      </div>
      <div className="block">
        <p className="title" style={{ paddingBottom: 7 }}>Customer</p>
        <Typography variant="body1">{content.customerName}</Typography>
      </div>
      {content.organisation &&(
        <div className="block">
          <p className="title" style={{ paddingBottom: 7 }}>Organisation type</p>
          <Typography variant="body1">{content.organisation}</Typography>
        </div>
      )}
      <div className="block">
        <p className="title" style={{ paddingBottom: 7 }}>Contact email</p>
        <Typography variant="body1">{content.email}</Typography>
      </div>
      {summer && content.summerDates &&(
        <div className="block">
          <p className="title">Suitable timing</p>
          <ul>
            {content.summerDates.short && <li>the early summer project {dates.short}</li>}
            {content.summerDates.long && <li>the whole summer project {dates.long}</li>}
          </ul>
        </div>
      )}
      <div className="block">
        <p className="title" style={{ paddingBottom: 7 }}>Intellectual property rights</p>
        <Typography variant="body1">{ipRights}</Typography>
      </div>

      <div className="block">
        <p className="title">Description</p>
        <Markdown>{content.description}</Markdown>
      </div>
      <div className="block">
        <p className="title">Implementation environment</p>
        <Markdown>{content.environment}</Markdown>
      </div>
      <div className="block">
        <p className="title">Special requests</p>
        {content.specialRequests ?
          <Markdown>{content.specialRequests}</Markdown> :
          <div style={{ paddingTop: 7 }}>-</div>
        }
      </div>
      <div className="block">
        <p className="title">Additional information</p>
        {content.additionalInfo ?
          <Markdown>{content.additionalInfo}</Markdown> :
          <div style={{ paddingTop: 7 }}>-</div>
        }
      </div>
      {isEditable && (
        <div className="topic-edit-button">
          <Button variant="contained" color="primary" onClick={onPageChange}>
            Edit
          </Button>
        </div>
      )}
      {isAdmin && (
        <div className="topic-edit-button">
          <Button variant="contained" color="default" onClick={copyToConfiguration}>
            Copy to most recent configuration
          </Button>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    summer: state.registrationManagement.summerProject,
    dates: state.registrationManagement.summerDates
  }
}


const ConnectedTopic = connect(
  mapStateToProps,
  null
)(Topic)


export default ConnectedTopic
