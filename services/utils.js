const tokenDbService = require('./tokenDbService');

const is_authorized = async (token_id,email = null) =>{
    const token = await tokenDbService.getToken(token_id);
    if(!token || token.expired){
        return false;
    }
    return email && token.user == email || token.authorization == 'admin';
}

module.exports = {is_authorized};