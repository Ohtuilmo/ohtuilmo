import groupManagementService from '../../services/groupManagement'

const initializeMyGroup = () => {
  return async (dispatch) => {
    const myGroup = await groupManagementService.getByStudent()
    if (myGroup) {
      dispatch({
        type: 'INITIALIZE_MYGROUP',
        payload: myGroup
      })
    } else {
      dispatch({
        type: 'CLEAR_GROUP'
      })
    }
  }
}

export default { initializeMyGroup }
