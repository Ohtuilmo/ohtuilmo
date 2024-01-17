const initialState = {
  configurations: [],
  selectedConfig: null,
  allRegistrationQuestions: [],
  allReviewQuestions: [],
  allCustomerReviewQuestions: [],
  selectedRegister: null,
  selectedReview1: null,
  selectedReview2: null,
  selectedCustomerReview: null,
  form: {
    name: '',
    content: '',
    registration_question_set_id: null,
    review_question_set_1_id: null,
    review_question_set_2_id: null,
    customer_review_question_set_id: null
  },
  isNew: true
}

const configurationPageReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_CONFIGURATIONS':
    return {
      ...state,
      configurations: action.payload
    }
  case 'UPDATE_CONFIGURATIONS':
    return {
      ...state,
      configurations: state.configurations.map((config) =>
        config.id === action.payload.id ? action.payload : config
      )
    }
  case 'UPDATE_SELECTED_CONFIG':
    return {
      ...state,
      selectedConfig: action.payload
    }
  case 'SET_REGISTRATION_QUESTIONS':
    return {
      ...state,
      allRegistrationQuestions: action.payload
    }
  case 'SET_REVIEW_QUESTIONS':
    return {
      ...state,
      allReviewQuestions: action.payload
    }
  case 'SET_CUSTOMER_REVIEW_QUESTIONS':
    return {
      ...state,
      allCustomerReviewQuestions: action.payload
    }
  case 'UPDATE_SELECTED_REGISTRATION_QUESTIONS':
    return {
      ...state,
      selectedRegister: action.payload,
      form: {
        ...state.form,
        registration_question_set_id: action.payload.id
      }
    }
  case 'UPDATE_SELECTED_REVIEW_QUESTIONS_1':
    return {
      ...state,
      selectedReview1: action.payload,
      form: {
        ...state.form,
        review_question_set_1_id: action.payload.id
      }
    }
  case 'UPDATE_SELECTED_REVIEW_QUESTIONS_2':
    return {
      ...state,
      selectedReview2: action.payload,
      form: {
        ...state.form,
        review_question_set_2_id: action.payload.id
      }
    }
  case 'UPDATE_SELECTED_CUSTOMER_REVIEW_QUESTIONS':
    return {
      ...state,
      selectedCustomerReview: action.payload,
      form: {
        ...state.form,
        customer_review_question_set_id: action.payload.id
      }
    }
  case 'SELECT_NEW_CONFIG':
    return {
      ...state,
      selectedConfig: null,
      selectedRegister: null,
      selectedReview1: null,
      selectedReview2: null,
      selectedCustomerReview: null,
      form: {
        name: '',
        content: '',
        registration_question_set_id: null,
        review_question_set_1_id: null,
        review_question_set_2_id: null,
        customer_review_question_set_id: null
      }
    }
  case 'UPDATE_CONFIG_FORM':
    return {
      ...state,
      selectedRegister: action.payload.registration_question_set,
      selectedReview1: action.payload.review_question_set_1,
      selectedReview2: action.payload.review_question_set_2,
      selectedCustomerReview: action.payload.customer_review_question_set,
      form: {
        name: action.payload.name,
        content: action.payload.content,
        registration_question_set_id:
          action.payload.registration_question_set_id,
        review_question_set_1_id: action.payload.review_question_set_1_id,
        review_question_set_2_id: action.payload.review_question_set_2_id,
        customer_review_question_set_id:
          action.payload.customer_review_question_set_id
      }
    }
  case 'UPDATE_CONFIG_NAME':
    return {
      ...state,
      form: {
        ...state.form,
        name: action.payload
      }
    }
  case 'UPDATE_NEW_STATUS':
    return {
      ...state,
      isNew: action.payload
    }
  default:
  }
  return state
}

export default configurationPageReducer
