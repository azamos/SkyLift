const tokenDbService = require('./tokenDbService');
//Basic email regex detection.
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const emailSyntaxIsValid = email_address => EMAIL_REGEX.test(email_address);


function valid_field_names(modelFieldsObject,newFields){
    const modelFields = Object.keys(modelFieldsObject);
    Object.keys(newFields).forEach(field => {
        if(!(field in modelFields)){
            return false;
        }
    });
    return true;
}

module.exports = {emailSyntaxIsValid,valid_field_names};