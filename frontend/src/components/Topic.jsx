import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ReactMarkdown from 'react-markdown'
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

const Topic = ({ content, isEditable, onPageChange, isAdmin, copyToConfiguration }) => {
  return (
    <div className="single-topic-container">
      <div className="block">
        <Typography variant="h5" id="title">
          {content.title}
        </Typography>
      </div>
      <div className="block">
        <p className="title">Customer</p>
        <Typography variant="body1">{content.customerName}</Typography>
      </div>
      <div className="block">
        <p className="title">Contact email</p>
        <Typography variant="body1">{content.email}</Typography>
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
        <Markdown>
          {content.specialRequests ? content.specialRequests : '-'}
        </Markdown>
      </div>
      <div className="block">
        <p className="title">Additional information</p>
        <Markdown>
          {content.additionalInfo ? content.additionalInfo : '-'}
        </Markdown>
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

export default Topic
