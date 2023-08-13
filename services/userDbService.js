const User = require("../models/userModel");


const createUser = async (email , password , full_name , phone_number) => {//TODO: make sure only a privileged user is able to create a flight.
    const newUser = new User({email , password , full_name ,phone_number});
    return await newUser.save();
};


const getUsers = async numOfUsers => await User.find({});//TODO: in future, add a limiter for pagination purposes.the name of the paramater: numOfUsers
const findUserByMail = async email => await User.findOne({email});

const userLoginByEmail = async dbEmail => await User.userLoginByEmail(dbEmail);


const deleteUser = async userEmail => {
    const userToDeleted = await User.findByEmail(userEmail);
    if(!userEmail){
        return null;//Maybe throwing an error is better?
    }
    await userToDeleted.deleteOne();
    return userToDeleted;
};

module.exports = {
    createUser,
    getUsers,
    findUserByMail,
    userLoginByEmail,
    deleteUser
};
