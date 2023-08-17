const tokenDbService = require('./tokenDbService');
const bcrypt = require('bcrypt');
//Basic email regex detection.
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const emailSyntaxIsValid = email_address => EMAIL_REGEX.test(email_address);

const is_authorized = async (key,email = null) =>{
    let token_id = `${key}${process.env.SECRET}`;
    const token = await tokenDbService.getToken(token_id);
    if(!token || token.expired){
        console.log('bad boolean')
        return false;
    }
    return email && token.user == email || token.authorization == 'admin';
}

module.exports = {is_authorized,emailSyntaxIsValid};