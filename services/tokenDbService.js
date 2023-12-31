const Token = require('../models/tokenModel');

/* After a user performs a login and is authenticated,
the server generates an Authorization token(not to be confused with authentication, the process
whereby a site visitor claiming to be a certain user, provides a username and a password, and if it matches a DB entry, is recognized as the user ).
Authorization is what type of actions said user can do: 
for example, a registered user can view all of the info stored about HIMSELF(but not other users), and search for flights,
whilst a site administrator can view the user info of ANY USER in addition to that,
and to manualy add/delete stuff from the database. */

/* this method is called by the server after the server authenticates a user, and produces a token for him.
the controller provides this method with the generated token(a string) and the authorization type('admin' or 'user')*/
const createToken = async (_id,user,authorization) => {
    const new_token = new Token({ _id,user,authorization });
    return await new_token.save();
}/* CREATE */

/* whenever an http request that requires AUTHORIZATION is made(such as viewing user's information),
this method must be called, in order to allow the server to commit the desired action if,
or return a authorization error as a  response.
For example, if a user wishes to see another user's info, he must have admin authorization.
And if a user wishes to view its own info, there is no problem with that. */
const getToken = async _id => {
    let token_entry = await Token.findOne({_id});
    if(token_entry){
        return token_entry;
    }
    return null;
}/* READ */

/*READ - LIST */
const tokenList = async ()=> await Token.find({});

/* say a user logged in, and now wishes to log on to another account of his.
The current token attached to authorization header must now become expired, since the previous account is now singed-out */
const expireToken = async _id => {
    const tokenToExpire = await Token.findOne({_id});
    if(!tokenToExpire){
        return false;
    }
    await tokenToExpire.updateOne({expired:true});
    return true;
}/* UPDATE */

const deleteToken =  async _id => {
    const tokenToDelete = await Token.findOne({_id});
    if(!tokenToDelete){
        return false;;
    }
    await tokenToDelete.deleteOne({});
    return true;
}/* DELETE */

/*expects the true token id, i.e, req.cookies.token+process.env.SECRET */
const updateToken = async (token_id,payload) => {
    try{
        const token_entry = await Token.findOne({_id: token_id});
        Object.keys(payload).forEach(fieldName => token_entry[fieldName]=payload[fieldName]);
        await token_entry.save();
        return true;
    }
    catch(e){
        return false;
    }
}

module.exports = { createToken, getToken, expireToken, tokenList, deleteToken, updateToken };