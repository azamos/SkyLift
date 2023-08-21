const userDbService = require('../services/userDbService');
const tokenDbService = require('../services/tokenDbService');
const flightDbService = require('../services/flightDbService');
const utils = require('../services/utils');
const { emailSyntaxIsValid } = utils;
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const salt_rounds = 12;
const cookieOptions = { httpOnly: true, sameSite: 'strict' };

/*NOTE FOR TEAM:
    This is the Controller for the Users, which handles ALL requests
    that relate to users.
    Each function here uses different operations, but all of them have similar responsibilites:
        1. Checks that whoever made a request is allowed to do so(called authorization).Note: not all requests require an authorization.
        2. Makes sure that the requests themselve are valid(for example,
            if a user registers, it will reach the function createUser I wrote bellow. In it, we make sure
            that the email is in a valid format, that the password isn't an empty string)
        3.In case everything is Kosher, the function must(according to the type of operation reqired)
        either bring some data from the DB(Data-Base), or create a new instance, delete an existing one,
        or update an instance. All of this is done by using the relevant DBservices.
        IT is important to understand: the DBservices function's responsibility IS NOT to check if the data is valid,
        and if it is an authorized request. They simply expect the correct format of parameters, and perform the required
        operation on the database.

    REMINDER:(CRUD)
        The project requirements dictate that for each entitySet/Model, we must provide the following functions:
        1. LIST: return a list of all instances(for example, return a list of all users).This is a READ operation.
        2. SEARCH users by a few paramaters(for example: email, name, some other field...).This is a READ operation.
        3.DELETE a user(we will go by email for now); This is a DELETE operation
        4.CREATE a user; This is a CREATE operation.
        5.UPDATE a user; This is a UPDATE operation.
*/


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*think of this as a private function, for now I do not want to export it.
Used to bring all the flights related to the user. */
async function getUsersFlights(user_mail) {
    const user = await userDbService.findUserByMail(user_mail);
    const past_flights = await flightDbService.getFlightsByIdArr(user.past_flights);
    const cart = await flightDbService.getFlightsByIdArr(user.cart);
    const future_flights = await flightDbService.getFlightsByIdArr(user.future_flights);
    user.password = null;
    return {
        user, past_flights, cart, future_flights
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* The function bellow is used if someone wants to view his OWN profile page,
or if an admin wishes to watch any other user's profile page(also called Account page).*/

/* for authorized users only: either the user himself, or an admin. */
/* Works fine, but try to find edge cases I might have missed */
const getUserData = async (req, res) => {
    let { email } = req.body;
    const user_data = await userDbService.findUserByMail(email);
    if (user_data) {
        const monstrosity = await getUsersFlights(email);
        res.json(monstrosity);
        return;
    }
    res.send({ error: 'something went wrong...' });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* As the name suggests, this function SHOULD be called whenever an existing user tries to call in. */
/* Works fine, but try to find edge cases I might have missed */
const userLogin = async (req, res) => {
    let { email, password } = req.body;
    if (emailSyntaxIsValid(email) == false) {
        res.send('Not a valid email input. Try again with a valid email');
        return;
    }
    if (password.trim() == "") {
        res.send('empty password');
        return;
    }

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
            res.cookie('token', key, cookieOptions).json({ email, name, isAdmin: raw_user.isAdmin });
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* FOR now, I only use this function in case a user is already logged in, and he wishes to CREATE another user.
Thus, we must discconect his previous user, and remove all relevant authorizations */
const logOff = async (req, res) => {
    if (req.cookies && req.cookies.token) {
        const token = await tokenDbService.getToken(req.cookies.token);
        if (token && token.expired == false) {
            tokenDbService.expireToken(token._id);
        }
        res.clearCookie('token', cookieOptions);
        return;
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const signOut = async (req, res) => {
    if (req.cookies && req.cookies.token) {
        const token = await tokenDbService.getToken(req.cookies.token);
        if (token && token.expired == false) {
            tokenDbService.expireToken(token._id);
        }
        res.clearCookie('token', cookieOptions);
        res.send({ msg: 'user signed off' });
        return;
    }
    res.send({ msg: 'not currently signed in user' });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Works fine, but try to find edge cases I might have missed */
const createUser = async (req, res) => {
    let { email, password, full_name, phone_number } = req.body;
    if (emailSyntaxIsValid(email) == false) {
        res.send('Not a valid email input. Try again with a valid email');
        return;
    }
    if (password.trim() == "") {
        res.send('empty password');
        return;
    }
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
        res.cookie('token', key, cookieOptions).json({ email, name: newUser.full_name, isAdmin: newUser.isAdmin });
        return;
    }
    else {
        res.send({ error: "ERROR: can't create user" });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* WORKS fine when you are logged in with an admin, as is required. */
const getUsersList = async (req, res) => {
    const usersArr = await userDbService.getUsers();
    res.json(usersArr);
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*WARNING: testing is required */
const updateUser = async (req, res) => {
    const { email, newData } = req.params;
    if (emailSyntaxIsValid(email) == false) {
        res.send('Not a valid email input. Try again with a valid email');
        return;
    }
    if (!(req.cookies && req.cookies.token)) {
        res.send({ error: 'missing authorization' })
        return;
    }
    /* TODO: WE MUST VALIDATE ALL THE DATA. for now, I simply use it as it is,
    which is very very bad.  */
    const user = await userDbService.updateUser(email, newData);
    res.send('User updated...');
    return;

};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*WARNING: testing is required */
const deleteUser = async (req, res) => {
    const { email } = req.body;
    if (emailSyntaxIsValid(email) == false) {
        res.send('Not a valid email input. Try again with a valid email');
        return;
    }
    const deleted = await userDbService.deleteUser(email);
    if (!deleted) {
        res.send({ error: "can't delete user" });
        return;
    }
    res.send({ msg: 'user deleted' });
};


module.exports = { userLogin, createUser, getUserData, getUsersList, updateUser, deleteUser, signOut };



