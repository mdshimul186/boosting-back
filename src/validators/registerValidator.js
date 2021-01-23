const validator = require('validator')
const registerValidator = ( email, password,confirmPassword ,accountType,userName) => {
    error = {}
    

    if(!userName){
        error.userName = 'Please provide username'
    }
    if(!accountType){
        error.accountType = 'Please provide account type'
    }

    if(!email){
        error.email ='Please provide your email'
    }else if(!validator.isEmail(email)){
         error.email = 'Please provide your valid email'
    }
    if(!password){
        error.password = 'Please provide a password'
    }else if(password.length < 6){
        error.password = 'password should not be less then six'
    }
    if (!confirmPassword) {
        error.confirmPassword = 'Please provide a confirm password'
    }else if(password !== confirmPassword){
        error.confirmPassword = 'Confirm password didn\'t match'
    }

    return {
        error,
        isError : Object.keys(error).length == 0
    }
}

module.exports = registerValidator