// String like event in event dispatch design patern

export enum ACTIONS {
    USER_LOGIN = 'user_login',
    USER_LOGOUT = 'user_logout'
}

export const USER_LOGIN_ACTION = {
    type: ACTIONS.USER_LOGIN
}

export const USER_LOGOUT_ACTION = {
    type: ACTIONS.USER_LOGOUT
}

// Component
//  --> send action
//      --> action call the reducer
//          --> the reducer send  the new state
//              --> the new state is sent to the UI components

