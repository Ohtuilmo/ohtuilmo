const updateIsLoading = (isLoading) => {
  return {
    type: 'UPDATE_IS_LOADING',
    payload: isLoading
  }
}

export default { updateIsLoading }