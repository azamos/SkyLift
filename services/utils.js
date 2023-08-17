const tokenDbService = require('./tokenDbService');
const bcrypt = require('bcrypt');

const is_authorized = async (key,email = null) =>{
    let token_id = `${key}${process.env.SECRET}`;
    const token = await tokenDbService.getToken(token_id);
    if(!token || token.expired){
        console.log('bad boolean')
        return false;
    }
    return email && token.user == email || token.authorization == 'admin';
}

module.exports = {is_authorized};