const locationDbService = require('../services/locationDbService');
const utils = require('../services/utils');
const { is_authorized } = utils;

/* Creating locations: only admins are allowed */
const createLocation = async (req, res) => {
    if(req.cookies && req.cookies.token){
        const authorizedFlag = await is_authorized(req.cookies.token);
        if(authorizedFlag){
            const { cityName, country } = req.body;
            const new_location = await locationDbService.createLocation(cityName, country);
            res.json(new_location);
            return;
        }
    }
    res.send({error: "unauthorized user"});
};

const getPartialMatch = async (req, res) => {
    const { partial_string } = req.params;
    //console.log(partial_string);
    const auto_complete_arr = await locationDbService.returnPartialMatch(partial_string);
    if(!auto_complete_arr||auto_complete_arr==[]){
        res.json({error:"no match"});
        return;
    }
    res.json(auto_complete_arr);
};

module.exports = { createLocation, getPartialMatch };