const initialState = {
    username: "",
    password: ""
}

const loginPageReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_USERNAME':
            return  {
                ...state,
                username: action.payload
            }
        case 'UPDATE_PASSWORD':
            return {
                ...state,
                password: action.payload
            }
        case 'CLEAR_FORM':
            return {
                username: '',
                password: ''
            }
    }
    return state
}

export default loginPageReducer