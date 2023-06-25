const userDbService = require('../services/userDbService');

const getUser = async (req,res) =>{
    let {email,password} = req.body;
    const user = await userDbService.getUser(email,password)
    res.json(user);
}    

const createUser = async (req,res) => {
    let {email,password} = req.body;
    const newUser = await userDbService.createUser(email,password);
    res.json(newUser);
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



    