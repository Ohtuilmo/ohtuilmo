import tagService from '../../services/tags'

const setAvailableTags = (tags) => ({
  type: 'SET_AVAILABLE_TAGS',
  payload: tags
})

const setStudentTags = (tags) => ({
  type: 'SET_STUDENT_TAGS',
  payload: tags
})

const resetTags = () => ({
  type: 'RESET_TAGS'
})

const fetchAvailableTags = () => {
  return async (dispatch) => {
    const rawTagData = await tagService.getTags()
    const availableTagData = rawTagData.map((tag) => tag.title)
    dispatch(setAvailableTags(availableTagData))
  }
}

const fetchTagsByStudent = (studentNumber) => {
  return async (dispatch) => {
    const studentTags = await tagService.getTagsByStudent(studentNumber)
    dispatch(setStudentTags(studentTags))
  }
}

export default {
  setAvailableTags,
  setStudentTags,
  resetTags,
  fetchAvailableTags,
  fetchTagsByStudent
}