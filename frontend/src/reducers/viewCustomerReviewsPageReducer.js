const initialState = {
  reviewData: [],
  reviewFetched: false,
  isInitializing: false,
  configurationId: ''
}

const viewCustomerReviewsPageReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'VIEW_CUSTOMER_REVIEWS_INITIALIZE_REVIEW_DATA':
    return {
      ...state,
      reviewData: action.payload,
      isInitializing: false,
      reviewFetched: true
    }
  case 'VIEW_CUSTOMER_REVIEWS_SET_LOADING':
    return {
      ...state,
      isInitializing: action.payload
    }
  case 'SET_VIEW_CUSTOMER_REVIEWS_CONFIGURATION':
    return {
      ...state,
      configurationId: action.payload
    }
  default:
    return state
  }
}

export default viewCustomerReviewsPageReducer
