const locationDbService = require('../services/locationDbService');


const getLocationsList = async (req, res) => {
    const result = await locationDbService.locationList();
    if (!result) {
        res.send({ error: 'something went wrong while fetching locationList' });
        return;
    }
    res.json(result);
}

/* Creating locations: only admins are allowed */
const createLocation = async (req, res) => {
    const { cityName, country, airport } = req.body;
    if (!(cityName && country && airport)) {
        res.status(400).send({ error: 'missing paramaters' });
        return;
    }
    const new_location = await locationDbService.createLocation(cityName, country, airport);
    res.json(new_location);
    return;
};

const getPartialMatch = async (req, res) => {
    const { partial_string } = req.params;
    const auto_complete_arr = await locationDbService.returnPartialMatch(partial_string);
    if (!auto_complete_arr || auto_complete_arr == []) {
        res.json({ error: "no match" });
        return;
    }
    res.json(auto_complete_arr);
};

const updateLocationData = async (req, res) =>
    res.send(await locationDbService.updateLocation(req.body.cityName, req.body.data));

const deleteLocation = async (req, res) => {
    const { airport, cityName, country } = req.body;
    const op_succeeded = await locationDbService.deleteLocation();
    res.send({success:op_succeeded});
}

module.exports = { createLocation, getPartialMatch, updateLocationData, getLocationsList,deleteLocation };