const userDbService = require('../services/userDbService');
const tokenDbService = require('../services/tokenDbService');
const flightDbService = require('../services/flightDbService');
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

async function getUsersFlights(user_mail){
    const user = await userDbService.findUserByMail(user_mail);
    const past_flights = await flightDbService.getFlightsByIdArr(user.past_flights);
    const cart = await flightDbService.getFlightsByIdArr(user.cart);
    const future_flights = await flightDbService.getFlightsByIdArr(user.future_flights);
    user.password = null;
    return {
        user,past_flights,cart,future_flights
    }
}

/* for authorized users only: either the user himself, or an admin. */
const getUserData = async (req, res) => {
    if (req.cookies && req.cookies.token) {
        let { email } = req.body;
        const authorizedFlag = await is_authorized(req.cookies.token,email);
        if (authorizedFlag) {
            const user_data = await userDbService.findUserByMail(email);
            if (user_data) {
                const monstrosity = await getUsersFlights(email);
                console.log(monstrosity)
                res.json(monstrosity);
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
    if (req.cookies && req.cookies.token) {
        let token_id = req.cookies.token;
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
    if (raw_user != null) {
        let cmp_res = await bcrypt.compare(password, raw_user.password);
        if (cmp_res) {
            let key = await bcrypt.hash(`${password}${Date.now}`, salt_rounds);
            /* Generates public key for user */
            let token_id = `${key}${process.env.SECRET}`;
            await tokenDbService.createToken(token_id, email, raw_user.isAdmin ? 'admin' : 'user');
            res.cookie('token', key, {
                httpOnly: true,
                sameSite: 'strict'
            }).json({ token:key, email, name });
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
    if (req.cookies && req.cookies.token) {
        const token = await tokenDbService.getToken(req.cookies.token);
        if (token && token.expired == false) {
            tokenDbService.expireToken(token._id);
        }
    }
}

const createUser = async (req, res) => {
    let { email, password, full_name, phone_number } = req.body;
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
    const newUser = await userDbService.createUser(email, hashed_pass, full_name, phone_number);
    if (newUser != {}) {
        let key = await bcrypt.hash(`${password}${Date.now}`, salt_rounds);
        /* Generates public key for user */
        //let token_id = await bcrypt.hash(`${key}${process.env.SECRET}`,salt_rounds);
        /* bcrypt will generate a different hash for the same values, thus the above did not work */
        let token_id = `${key}${process.env.SECRET}`;
        await tokenDbService.createToken(token_id, email);
        res.cookie('token', key, {
            httpOnly: true,
            sameSite:'strict'
        }).json({ token:key, email });
        return;
    }
    else {
        res.send({ error: "ERROR: can't create user" });
    }
};

const getUsersList = async (req, res) => {
    if (req.cookies && req.cookies.token) {
        const authorizedFlag = await is_authorized(req.cookies.token, email);
        if (!authorizedFlag) {
            res.send({ error: 'unauthorized request. If you are allowed to view this, login again' });
            return;
        }
        else {
            const usersArr = await userDbService.getUsers();
            res.json(usersArr);
        }
        return;
    }
    res.send({ error: 'missing authorization' })
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

module.exports = { userLogin, createUser, getUserData, getUsersList};



