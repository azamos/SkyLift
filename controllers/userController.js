const userDbService = require('../services/userDbService');

const createUser = async (req,res) => {
    const newUser = await userDbService.createUser(req.body.data);
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



    