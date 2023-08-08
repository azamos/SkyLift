const userDbService = require('../services/userDbService');
const tokenDbService = require('../services/tokenDbService');
const bcrypt = require('bcrypt');
const salt_rounds = 12;

/* internal function, must NOT export. */
const filtered_user = raw_user =>{
    const { email, display_name  } = raw_user;
    const sanitized_user = {email,display_name};
    return sanitized_user;
}

/* for authorized users only: either the user himself, or an admin. */
const getUserData = async (req,res) => {
    if(!(req.headers && req.headers.authorization)){
        res.send("error: unauthorized user");
        return;        
    }
    let id = req.headers.authorization;
    const token = await tokenDbService.getToken(id);
    let {email} = req.body;
    if(token.user == email ||token.authorization == 'Admin'){
        const user_data = await userDbService.findUserByMail(email);
        if(user){
            delete user.password;
            res.json(user);
            return;
        }
        res.send('user not found');
        return;
    }
}

const userLogin = async (req,res) =>{
    let {email,password} = req.body;
    const raw_user = await userDbService.findUserByMail(email);
    if(raw_user!=null){
        let cmp_res = await bcrypt.compare(password,raw_user.password);
        if(cmp_res){
        //     const sanitized_user = filtered_user(raw_user);
        //     res.json(sanitized_user);
            let token = await bcrypt.hash(`${password}${Date.now}`,salt_rounds);
            await tokenDbService.createToken(token,email,raw_user.isAdmin ? 'admin':'user');
            res.json({token,email});
            return;
        }
        else{
            res.send({error:"Wrong Password"});
        }
    }
    else{
        res.send({error:"User Not Found"});
    }
}    

const createUser = async (req,res) => {
    let {email,password} = req.body;
    const userExist = await userDbService.findUserByMail(email);
    if(userExist){
        res.send({error:"a User with this email already exist. Send a recovery email?"});
        return;
    }
    let hashed_pass = await bcrypt.hash(password,salt_rounds);
    if(hashed_pass==null){
        res.send({error:"bcrypt hash failed"});
        return;
    }
    const newUser = await userDbService.createUser(email,hashed_pass);
    if(newUser != {}){
        let token = await bcrypt.hash(`${password}${Date.now}`,salt_rounds);
        await tokenDbService.createToken(token,email);
        res.json({token,email});
        return;
    }
    else{
        res.send({error:"ERROR: can't create user"});
    }
};

/* again with the authorization check. Maybe export to function: authorize? */
const getUsers = async (req,res) => {
    const usersArr = await userDbService.getUsers();
    res.json(usersArr);
};

const userLoginByEmail = async(req,res) => {
    const {email} = req.params;
    const userIdentified = await userDbService.userLoginByEmail(email);
    if(!userIdentified){
        res.send(`failed to find flight with id = ${email} to be retrieved from the database.`);
    }
    res.send(userIdentified);
};

const updateUserData = async(req,res) => {//will reach here with a get request, so extract data from req.params
    const { email,newData } = req.params;
    const userToBeUpdated = await userDbService.updateUserData(email,newData);
    if(!userToBeUpdated){
        res.send(`failed to find flight with id = ${email} to be updated.`)
    }
    res.json(userToBeUpdated);
};

const deleteUser = async (req,res) => await userDbService.deleteUser(req.params.id);

module.exports = {userLogin,createUser,getUserData};



    