const validator = require('validator')
const loginValidator = (emailorusername, password) => {
    error = {}


    if (!emailorusername) {
        error.emailorusername = 'Please provide your email or username'
    }
    if (!password) {
        error.password = 'Please provide a password'
    }

    return {
        error,
        isError: Object.keys(error).length == 0
    }
}

module.exports = loginValidator