import { SET_SERVINGS, CHANGE_ADD_ON } from '../actions/types'

const initialState = {}

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SERVINGS:
            return {
                ...state,
                items: action.payload
            }
        case CHANGE_ADD_ON:
            return {
                ...state,
                item: action.payload
            }
        default:
            return state
    }
}