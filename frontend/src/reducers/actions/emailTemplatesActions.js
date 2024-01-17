import emailService from '../../services/email'

const fetchEmailTemplatesRequest = () => ({
  type: 'FETCH_EMAIL_TEMPLATES_REQUEST'
})

const fetchEmailTemplatesSuccess = (templates) => ({
  type: 'FETCH_EMAIL_TEMPLATES_SUCCESS',
  payload: templates
})

const fetchEmailTemplatesFailed = () => ({
  type: 'FETCH_EMAIL_TEMPLATES_FAILED'
})

const updateEmailTemplatesRequest = () => ({
  type: 'UPDATE_EMAIL_TEMPLATES_REQUEST'
})

const updateEmailTemplatesSuccess = (templates) => ({
  type: 'UPDATE_EMAIL_TEMPLATES_SUCCESS',
  payload: templates
})

const updateEmailTemplatesFailed = () => ({
  type: 'UPDATE_EMAIL_TEMPLATES_FAILED'
})

const fetchEmailTemplates = () => {
  return async (dispatch) => {
    dispatch(fetchEmailTemplatesRequest())
    try {
      const templates = await emailService.getTemplates()
      dispatch(fetchEmailTemplatesSuccess(templates))
    } catch (e) {
      dispatch(fetchEmailTemplatesFailed())
      // re-throw to let UI handle domain-specific error message
      throw e
    }
  }
}

const updateEmailTemplates = (templates) => {
  return async (dispatch) => {
    dispatch(updateEmailTemplatesRequest())
    try {
      const updatedTemplates = await emailService.updateTemplates(templates)
      dispatch(updateEmailTemplatesSuccess(updatedTemplates))
    } catch (e) {
      dispatch(updateEmailTemplatesFailed())
      // re-throw to let UI handle domain-specific error message
      throw e
    }
  }
}

export default { fetchEmailTemplates, updateEmailTemplates }
