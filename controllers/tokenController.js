const { 
    getToken,
    expireToken,
    tokenList,
    deleteToken,
    updateToken } = require('../services/tokenDbService'); 
const Token = require('../models/tokenModel');


const tokenUpdateControl = async (req,res)=>{
    const {token_id,payload} = req.body;
    /* manual check: all fields are valid
    a simple check if field names are a match.
    Should be good enough for this project for now.
    In the future, add sanitation packages.*/
    try{
        const paths = Token.schema.paths;
        Object.keys(payload).forEach(key=>{
            if(!(key in paths)){
                res.send({error:'error:sent invalid field name'});
                return;
            }
        })
        if(await updateToken(token_id,payload)){// if managed to update
            res.send({msg:'updated token document...'});
            return;
        }
        res.send({error:'failed to update document...'});
        return;
    }
    catch(e){
        res.send({error:'bad payload'});
        return;
    }
}
const tokenDeleteControl = async (req,res)=>{
    /*Note: In reality, you should not delete tokens. They allow to track who done what,
    in case of some unlawful action taken by an emploee. They should not be deleted,
    only expired. */
    const {token_id} = req.body;
    if(await deleteToken(token_id)){
        res.send({msg:`Token ${token_id} deleted succesfully. Though, why would you want to do that?`});
    }
    else{
        res.send({error:'could not delete token for whatever reason. check if it is still in the list'});
    }
}
const tokenListControl = async (req,res)=> await tokenList();

const tokenSearchControl = async (req,res)=> await getToken(req.body.token_id);

module.exports = {
    tokenUpdateControl,
    tokenDeleteControl,
    tokenListControl,
    tokenSearchControl
}