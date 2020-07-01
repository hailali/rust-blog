import {isUserAuthenticated} from "../component/UserUtils";
import {USER_LOGIN_ACTION, USER_LOGOUT_ACTION, ACTIONS} from "./actions";

let initialState = {
    isUserAuthenticated : isUserAuthenticated()
}

// return the new states according to the previous state given in the first paramer
export function rootReducer(state = initialState, action) {

    switch (action.type)
    {
        case ACTIONS.USER_LOGIN:
            console.log("ACTION USER_LOGIN_ACTION")
            return {isUserAuthenticated : true}
        case ACTIONS.USER_LOGOUT:
            console.log("ACTION USER_LOGOUT_ACTION")
            return {isUserAuthenticated : false}
        default:
            console.log(action);
            return state;
            // throw Error(`Unknown action type "${action.type}". Expected one of "${ACTIONS.USER_LOGOUT}" or "${ACTIONS.USER_LOGOUT}"`)
    }
}
