import React from 'react'
import PropTypes from 'prop-types'

import TextField from '@material-ui/core/TextField'

import './EmailTemplate.css'
import { templateShape } from './commonPropTypes'
import { classes } from '../util'

const TemplateTextField = ({ className, ...props }) => (
  <TextField
    className={classes('template-text-field', className)}
    fullWidth
    multiline
    rows={10}
    margin="normal"
    variant="outlined"
    {...props}
  />
)

const EmailTemplate = ({
  name,
  availableReplacements,
  template,
  onTemplateEdited,
  className
}) => {
  const { finnish, english } = template

  const createHandleTemplateEdited = (language) => (e) => {
    const newTemplate = {
      ...template,
      [language]: e.target.value
    }
    onTemplateEdited(newTemplate)
  }

  const helperText = (
    <span>
      Available parameters:{' '}
      <span className="email-template__replacements">
        {availableReplacements.join(', ')}
      </span>
    </span>
  )

  return (
    <div
      className={classes('email-template', className)}
      data-cy-template={name}
    >
      <h3 className="email-template__title">{name}</h3>
      <div className="email-template__fields">
        <TemplateTextField
          label="Finnish"
          value={finnish}
          onChange={createHandleTemplateEdited('finnish')}
          helperText={helperText}
          className="email-template__field email-template__field--finnish"
        />
        <TemplateTextField
          label="English"
          value={english}
          onChange={createHandleTemplateEdited('english')}
          helperText={helperText}
          className="email-template__field email-template__field--english"
        />
      </div>
    </div>
  )
}

EmailTemplate.propTypes = {
  name: PropTypes.string.isRequired,
  template: templateShape.isRequired,
  availableReplacements: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTemplateEdited: PropTypes.func.isRequired
}

export default EmailTemplate
