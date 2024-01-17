const setReviewData = (reviewData) => {
  return {
    type: 'VIEW_CUSTOMER_REVIEWS_INITIALIZE_REVIEW_DATA',
    payload: reviewData
  }
}

const setLoading = (loading) => {
  return {
    type: 'VIEW_CUSTOMER_REVIEWS_SET_LOADING',
    payload: loading
  }
}

const setConfiguration = (configuration) => {
  return {
    type: 'SET_VIEW_CUSTOMER_REVIEWS_CONFIGURATION',
    payload: configuration
  }
}

export default { setReviewData, setLoading, setConfiguration }
