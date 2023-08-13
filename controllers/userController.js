const userDbService = require('../services/userDbService');
const tokenDbService = require('../services/tokenDbService');
const utils = require('../services/utils');
const { is_authorized } = utils;
const bcrypt = require('bcrypt');
const salt_rounds = 12;

/* internal function, must NOT export. */
const filtered_user = raw_user => {
    const { email, display_name } = raw_user;
    const sanitized_user = { email, display_name };
    return sanitized_user;
}

/* for authorized users only: either the user himself, or an admin. */
const getUserData = async (req, res) => {
    if (req.headers && req.headers.authorization) {
        let { email } = req.body;
        const authorizedFlag = await is_authorized(req.headers.authorization, email);
        if (authorizedFlag) {
            const user_data = await userDbService.findUserByMail(email);
            if (user_data) {
                user_data.password = null;
                res.json(user_data);
                return;
            }
            res.send({ error: 'user not found' });
            return;
        }
    }
    res.send({ error: 'unauthorized user' });
}
//TODO: continue
const userLogin = async (req, res) => {
    let { email, password } = req.body;
    /* if there is an authorization header attached, it means that a user
    is already logged in, or have an expired token, in the browser.
    Thus I must invalidate the previous token if it is valid, otherwise, nothing? */
    if (req.headers && req.headers.authorization) {
        let token_id = req.headers.authorization;
        const token = await tokenDbService.getToken(token_id);
        if (token) {
            if (token.user != email) {
                await tokenDbService.expireToken(token_id);
            }
            else {
                res.send({ error: 'user is already logged in' });
                return;
            }
        }
    }
    const raw_user = await userDbService.findUserByMail(email);
    let name = raw_user.full_name;
    if(raw_user!=null){
        let cmp_res = await bcrypt.compare(password,raw_user.password);
        if(cmp_res){
        //     const sanitized_user = filtered_user(raw_user);
        //     res.json(sanitized_user);
            let token = await bcrypt.hash(`${password}${Date.now}`,salt_rounds);
            await tokenDbService.createToken(token,email,raw_user.isAdmin ? 'admin':'user');
            res.json({token,email,name});
            return;
        }
        else {
            res.send({ error: "Wrong Password" });
        }
    }
    else {
        res.send({ error: "User Not Found" });
    }
}

const logOff = async (req, res) => {
    if (req.headers && req.headers.authorization) {
        const token = await tokenDbService.getToken(req.headers.authorization);
        if (token && token.expired == false) {
            tokenDbService.expireToken(token._id);
        }
    }
}

const createUser = async (req,res) => {
    let {email,password,full_name,phone_number} = req.body;
    const userExist = await userDbService.findUserByMail(email);
    if (userExist) {
        res.send({ error: "a User with this email already exist. Send a recovery email?" });
        return;
    }
    await logOff(req, res);
    let hashed_pass = await bcrypt.hash(password, salt_rounds);
    if (hashed_pass == null) {
        res.send({ error: "bcrypt hash failed" });
        return;
    }
    const newUser = await userDbService.createUser(email , hashed_pass , full_name , phone_number);
    if(newUser != {}){
        let token = await bcrypt.hash(`${password}${Date.now}`,salt_rounds);
        await tokenDbService.createToken(token,email);
        res.json({token,email});
        return;
    }
    else {
        res.send({ error: "ERROR: can't create user" });
    }
};

const getUsersList = async (req, res) => {
    if (req.headers && req.headers.authorization) {
        const authorizedFlag = await is_authorized(req.headers.authorization, email);
        if(!authorizedFlag){
            res.send({error:'unauthorized request. If you are allowed to view this, login again'});
            return;
        }
        else{
            const usersArr = await userDbService.getUsers();
            res.json(usersArr);}
            return;
    }
    res.send({error:'missing authorization'})
};


const userLoginByEmail = async (req, res) => {
    const { email } = req.params;
    const userIdentified = await userDbService.userLoginByEmail(email);
    if (!userIdentified) {
        res.send(`failed to find flight with id = ${email} to be retrieved from the database.`);
    }
    res.send(userIdentified);
};

const updateUserData = async (req, res) => {//will reach here with a get request, so extract data from req.params
    const { email, newData } = req.params;
    const userToBeUpdated = await userDbService.updateUserData(email, newData);
    if (!userToBeUpdated) {
        res.send(`failed to find flight with id = ${email} to be updated.`)
    }
    res.json(userToBeUpdated);
};

const deleteUser = async (req, res) => await userDbService.deleteUser(req.params.id);

module.exports = { userLogin, createUser, getUserData, getUsersList };



