import tagService from '../../services/tags'

const setAvailableTags = (tags) => ({
  type: 'SET_AVAILABLE_TAGS',
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
export default {
  setAvailableTags,
  resetTags,
  fetchAvailableTags
}