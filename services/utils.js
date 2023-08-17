const tokenDbService = require('./tokenDbService');
const bcrypt = require('bcrypt');

const is_authorized = async (key,email = null) =>{
    let token_id = `${key}${process.env.SECRET}`;
    console.log('createdToken in is_authorized');
    console.log(token_id);
    const token = await tokenDbService.getToken(token_id);
    console.log(token);
    if(!token || token.expired){
        console.log('bad boolean')
        return false;
    }
    console.log('good olean')
    console.log(email)
    console.log(token.user)
    console.log(token.authorization)
    return email && token.user == email || token.authorization == 'admin';
}

module.exports = {is_authorized};