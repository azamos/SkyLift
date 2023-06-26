const userDbService = require('../services/userDbService');
const bcrypt = require('bcrypt');
const salt_rounds = 12;

const filtered_user = raw_user =>{
    const { email, display_name  } = raw_user;
    const sanitized_user = {email,display_name};
    return sanitized_user;
}

const getUser = async (req,res) =>{
    let {email,password} = req.body;
    const raw_user = await userDbService.getUser(email);
    if(raw_user!=null){
        let cmp_res = await bcrypt.compare(password,raw_user.password);
        if(cmp_res){
            const sanitized_user = filtered_user(raw_user);
            res.json(sanitized_user);
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
    const userExist = await userDbService.getUser(email);
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
        const sanitized_user = filtered_user(newUser);
        res.json(sanitized_user);
    }
    else{
        res.send({error:"ERROR: can't create user"});
    }
};

const getUsers = async (req,res) => {
    const usersArr = await userDbService.getUsers();
    res.json(usersArr);
};

const getUserByEmail = async(req,res) => {
    const {email} = req.params;
    const userIdentified = await userDbService.getUserByEmail(email);
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

module.exports = {getUser,createUser};



    