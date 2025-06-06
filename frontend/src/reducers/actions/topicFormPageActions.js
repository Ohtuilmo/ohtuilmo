const updateTitle = (title) => {
  return {
    type: 'UPDATE_TITLE',
    payload: title
  }
}

const updateCustomerName = (customerName) => {
  return {
    type: 'UPDATE_CUSTOMER_NAME',
    payload: customerName
  }
}

const updateOrganisation = (organisation) => {
  return {
    type: 'UPDATE_ORGANISATION_TYPE',
    payload: organisation
  }
}

const updateIp = (rights) => {
  console.log(rights)
  return {
    type: 'UPDATE_IP_RIGHTS',
    payload: rights
  }
}

const updateEmail = (email) => {
  return {
    type: 'UPDATE_EMAIL',
    payload: email
  }
}

const updateDescription = (description) => {
  return {
    type: 'UPDATE_DESCRIPTION',
    payload: description
  }
}

const updateEnvironment = (environment) => {
  return {
    type: 'UPDATE_ENVIRONMENT',
    payload: environment
  }
}

const updateSpecialRequests = (specialRequests) => {
  return {
    type: 'UPDATE_SPECIAL_REQUESTS',
    payload: specialRequests
  }
}

const updateAdditionalInfo = (additionalInfo) => {
  return {
    type: 'UPDATE_ADDITIONAL_INFO',
    payload: additionalInfo
  }
}

const updateDates = (dates) => {
  return {
    type: 'UPDATE_DATES',
    payload: dates
  }
}

const clearForm = () => {
  return {
    type: 'CLEAR_FORM'
  }
}

const setCurrentTopic = (topic) => {
  return {
    type: 'SET_CURRENT_TOPIC',
    payload: topic
  }
}

const updatePreview = (preview) => {
  return {
    type: 'UPDATE_PREVIEW',
    payload: preview
  }
}

const setSaved = (status) => {
  return {
    type: 'SET_SAVED',
    payload: status
  }
}

const updateSecretId = (secretId) => {
  return {
    type: 'UPDATE_SECRETID',
    payload: secretId
  }
}

const updateShowInfo = (showInfo) => {
  return {
    type: 'UPDATE_SHOWINFO',
    payload: showInfo
  }
}

export default {
  updateTitle,
  updateCustomerName,
  updateEmail,
  updateOrganisation,
  updateDates,
  updateIp,
  updateDescription,
  updateEnvironment,
  updateSpecialRequests,
  updateAdditionalInfo,
  clearForm,
  updatePreview,
  setSaved,
  updateSecretId,
  setCurrentTopic,
  updateShowInfo
}
