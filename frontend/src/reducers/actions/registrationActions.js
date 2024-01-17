import registrationService from '../../services/registration'

const clearRegistrations = () => {
  return {
    type: 'CLEAR_REGISTRATIONS'
  }
}

const fetchRegistrations = () => {
  return async (dispatch) => {
    const registrations = await registrationService.getOwn()
    if (registrations) {
      dispatch({
        type: 'SET_REGISTRATIONS',
        payload: registrations
      })
    } else {
      dispatch({
        type: 'CLEAR_REGISTRATIONS'
      })
    }
  }
}

export default { clearRegistrations, fetchRegistrations }
