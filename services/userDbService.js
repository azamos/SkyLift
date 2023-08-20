const User = require("../models/userModel");



const createUser = async (email , password , full_name , phone_number) => {//TODO: make sure only a privileged user is able to create a flight.
    const newUser = new User({email , password , full_name ,phone_number});
    return await newUser.save();
};

/* READ - LIST */
const getUsers = async numOfUsers => await User.find({});//TODO: in future, add a limiter for pagination purposes.the name of the paramater: numOfUsers

/* READ - single entry */
const findUserByMail = async email =>{
    const exist = await User.findOne({email})
    if(exist!=null){
        return exist;
    } 
    return null;
}
/* UPDATE */
const updateUser = async (email,data) => {
    const x= await User.findOne({email});
    if(!x){
        res.send({error:'user not found'});
        return
    }
    Object.keys(data).forEach(key=>x[key]=data[key])
    await x.save();
    return x;
}



/* DELETE */
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
    deleteUser,
    updateUser
};
