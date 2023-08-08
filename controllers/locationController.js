const locationDbService = require('../services/locationDbService');

/* Creating locations: only admins are allowed */
const createLocation = async (req, res) => {
    if(req.headers.authorization && req.headers.authorization == 'Admin'){
        const { cityName, country } = req.body;
        const new_location = await locationDbService.createLocation(cityName, country);
        res.json(new_location);
        return;
    }
    res.send("error: unauthorized users");
};

const getPartialMatch = async (req, res) => {
    const { partial_string } = req.params;
    console.log(partial_string);
    const auto_complete_arr = await locationDbService.returnPartialMatch(partial_string);
    if(!auto_complete_arr||auto_complete_arr==[]){
        res.json({error:"no match"});
        return;
    }
    res.json(auto_complete_arr);
};

module.exports = { createLocation, getPartialMatch };