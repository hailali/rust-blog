export function isUserAuthenticated() {
    return sessionStorage.getItem('exp') !== null &&
    sessionStorage.getItem('token') !== null &&
    parseInt(sessionStorage.getItem('exp')) > Math.floor(Date.now() / 1000)
}

/**
 * Logout action
 * Clear all the data stored in the session storage object
 */
export function logOut() {
    sessionStorage.clear()
}
