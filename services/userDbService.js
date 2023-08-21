const User = require("../models/userModel");
const flightDbService = require("./flightDbService");;


const createUser = async (email, password, full_name, phone_number) => {//TODO: make sure only a privileged user is able to create a flight.
    const newUser = new User({ email, password, full_name, phone_number });
    return await newUser.save();
};

/* READ - LIST */
const getUsers = async numOfUsers => await User.find({});//TODO: in future, add a limiter for pagination purposes.the name of the paramater: numOfUsers

/* READ - single entry */
const findUserByMail = async email => {
    const exist = await User.findOne({ email })
    if (exist != null) {
        return exist;
    }
    return null;
}
/* UPDATE */
const updateUser = async (email, data) => {
    const x = await User.findOne({ email });
    if (!x) {
        res.send({ error: 'user not found' });
        return
    }
    Object.keys(data).forEach(key => x[key] = data[key])
    await x.save();
    return x;
}

/* private function for now */
const deleteUser_removeFromFlightArray = async (userEmail, flightArr, seatType = 'economy') => {
    if (flightArr.length == 0) {
        console.log(`Not flights ids in the given flightArray`);
        return true;
    }
    const flightInstancesArray = await flightDbService.getFlightsByIdArr(flightArr);
    if (!flightInstancesArray) {
        console.error(`failed to retrieve flights from DB with method getFlightsByIdArr`);
        return false;
    }
    const seatsArrayName = seatType == "economy" ? "economyPassengers" : "bussinessPassengers";
    flightInstancesArray.forEach(async flightInstance => {
        const userIndexInArray = flightInstance[seatsArrayName].indexOf(userEmail);
        if (userIndexInArray < 0) {
            console.error(`DEV:user ${userEmail} is NOT in flight ${flightInstance._id} ${seatsArrayName} list.`);
            return false;
        }
        flightInstance[seatsArrayName].splice(userIndexInArray, 1);
        const res = await flightInstance.save();//Bypassing calling the update method from flightDBService, which will retrieve the instance again.
        if (!res) {
            console.error(`DEV: failed to update flight ${flightInstance._id}`);
            return false;
        }
    })
    return true;
}
/* DELETE */
const deleteUser = async userEmail => {
    const userToDeleted = await findUserByMail(userEmail);
    if (!userToDeleted) {
        return null;//Maybe throwing an error is better?
    }
    if (await deleteUser_removeFromFlightArray(userEmail, userToDeleted.cart)
        && await deleteUser_removeFromFlightArray(userEmail, userToDeleted.past_flights)
        && await deleteUser_removeFromFlightArray(userEmail, userToDeleted.future_flights)){
            const deletionResult = await userToDeleted.deleteOne();
            if(!deletionResult){
                console.error(`DEV: failed to delete user for some reason`);
                res.send({error:'failed to delete user'});
                return;
            }
            return deletionResult;
        }
        
    res.send({error:'FAILED TO DELETE USER'});
};

module.exports = {
    createUser,
    getUsers,
    findUserByMail,
    deleteUser,
    updateUser
};
