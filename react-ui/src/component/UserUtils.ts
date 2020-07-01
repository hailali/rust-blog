export function isUserAuthenticated() {
    return sessionStorage.getItem('exp') !== null &&
    sessionStorage.getItem('token') !== null &&
    parseInt(<string>sessionStorage.getItem('exp')) > Math.floor(Date.now() / 1000)
}

/**
 * Logout action
 * Clear all the data stored in the session storage object
 */
export function userLogOut() {
    sessionStorage.clear()
}


export function getUserToken() {
    let token = sessionStorage.getItem('token')
    if (null !== token) {
        return token
    }

    return "";
}
