import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'

import { templatesShape } from './commonPropTypes'
import EmailTemplate from './EmailTemplate'

const topicAcceptRejectReplacements = ['{{topicName}}']
const customerReviewLinkReplacements = ['{{topicName}}', '{{secretLink}}']

const EmailTemplatesForm = ({ initialTemplates, disabled, onSave }) => {
  const [templates, setTemplates] = useState(initialTemplates)

  // Edit templates in local state and update redux state only when admin
  // commits changes with Save.
  // Use effect below to make sure useState updates if the templates in redux
  // state were to change.
  useEffect(() => {
    setTemplates(initialTemplates)
  }, [initialTemplates])

  const createHandleTemplateEdited = (templateName) => (editedTemplate) => {
    setTemplates({
      ...templates,
      [templateName]: editedTemplate
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    onSave(templates)
  }

  const { topicAccepted, topicRejected, customerReviewLink } = templates

  return (
    <form className="email-templates-form" onSubmit={handleSubmit}>
      <div>
        <EmailTemplate
          name="Topic proposal accepted"
          template={topicAccepted}
          availableReplacements={topicAcceptRejectReplacements}
          onTemplateEdited={createHandleTemplateEdited('topicAccepted')}
        />
        <EmailTemplate
          name="Topic proposal rejected"
          template={topicRejected}
          availableReplacements={topicAcceptRejectReplacements}
          onTemplateEdited={createHandleTemplateEdited('topicRejected')}
        />
        <EmailTemplate
          name="Customer review link"
          template={customerReviewLink}
          availableReplacements={customerReviewLinkReplacements}
          onTemplateEdited={createHandleTemplateEdited('customerReviewLink')}
        />
      </div>
      <hr />
      <Button
        disabled={disabled}
        className="email-templates-form__submit-button"
        type="submit"
        variant="contained"
        color="primary"
      >
        Save
      </Button>
    </form>
  )
}

EmailTemplatesForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  initialTemplates: templatesShape.isRequired,
  disabled: PropTypes.bool
}

export default EmailTemplatesForm
