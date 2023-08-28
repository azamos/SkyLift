const tokenDbService = require('../services/tokenDbService');
const flightDbService = require('../services/flightDbService');
const userDbService = require('../services/userDbService');

const utils = require('../services/utils');
const { valid_field_names } = utils;
const multer = require('multer');
const path = require('path');
// Configure multer to handle file uploads
const storage = multer.diskStorage({
    destination: './client/images/destination',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, fileName);
    }
});
const upload = multer({ storage: storage });

/* Authorozation checks belong in the controller. */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* only admins should be able to create new flights, no need to send email to is_authorized */
const createFlight = async (req, res) => {
    //Moved authorization checks to middleware: authorization.js
    upload.single('image')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'File upload failed.' });
        } else if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred.' });
        }

        // Construct the URL of the uploaded image based on the server's URL and the image path
        const imageUrl = `/images/destination/${req.file.filename}`;
        const newFlight = await flightDbService.createFlight({ ...req.body, imageUrl });
        res.json(newFlight);
        return;
    });

};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* everyone should get access to view any flight they wish, though only users should be able to place an order,
but this is beyond the scope of responsibility of this function, instead will be handled
by a placeOrder function or some such. */
const getFlights = async (req, res) => {
    const flightsArr = await flightDbService.getFlights();
    res.json(flightsArr);
};
/* again, no need for special authorization to get search results */
const searchFlight = async (req, res) => {
    const { destination, origin, depart, arrival } = req.body;
    console.log('inside searchFlight');
    console.log(req.body);
    if(destination==null||origin==null||destination.trim().length<3 || origin.trim().length < 3){
        console.log('cond1')
        res.send({msg:"invalid flight search paramaters"});
        return;
    }
    const filteredFlights = await flightDbService.getFlightsByFilter({
        destination,
        origin,
        depart,
        arrival
    });
    console.log(filteredFlights);
    if (!filteredFlights || filteredFlights == {}) {
        res.send({msg:"No flights matching the search paramaters."})
        return;
    }
    res.json(filteredFlights);
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* TODO: consider splitting into 2 functions. On first observation, should only be called by an admin.
However, if a customer makes an order, will trigger this function as well, since now there are fewer seats available.
Which reminds me, that we must add checks to make sure there are enough seats available for purchase,
including multiple seats per purchaser. */
const updateFlightData = async (req, res) => {//will reach here with a get request, so extract data from req.params
    const { id, newData } = req.params;
    const flightToBeUpdated = await flightDbService.updateFlightData(id, newData);
    if (!flightToBeUpdated) {
        res.send(`failed to find flight with id = ${id} to be updated.`)
    }
    res.json(flightToBeUpdated);
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const deleteFlight = async (req, res) => {
    //Moved authorization checks to middleware: authorization.js
    await flightDbService.deleteFlight(req.body.id);
    res.end();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const deleteFlightFromAllUsers = async (req, res) => {
    const { flight_id } = req.body;
    let check = false;
    const flight = await flightDbService.getFlightById(flight_id);
    if (!flight) {
        res.send({ error: 'flight not found' });
        return;
    }
    flight.economyPassengers.forEach(async passengerEmail => {
        const user = await userDbService.findUserByMail(passengerEmail);
        if (!user) {
            res.send({ error: 'Error: user does not exist' });
            return;
        }
        let { future_flights } = user;
        const flightIndex = future_flights.indexOf(flight_id);
        if (flightIndex != -1) {
            future_flights.splice(flightIndex, 1);
            await userDbService.updateUser(passengerEmail, { future_flights });
            check = true;
            return;
        }
        if (check) {
            res.send({ msg: 'flight deleted succesfuly' });
            return;
        }
        else {
            res.send({error: 'something went wrong, flight not deleted. Please try again' });
            return;
        }
    })
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const purchaseFlightSeat = async (req, res) => {
    const { flight_id, seatType } = req.body;
    if (!(req.cookies && req.cookies.token)) {
        res.send({ error: 'missing authorization' });
        return;
    }
    const token_entry = await tokenDbService.getToken(req.cookies.token + process.env.SECRET);
    let userId = token_entry.user;
    const user = await userDbService.findUserByMail(userId);
    if (!user) {
        res.send({ error: 'Error: user no longer exists' });
        return;
    }
    /* THIS IS WHAT MUST BE PASSED TO THE POST REQUEST */
    const flight = await flightDbService.getFlightById(flight_id);
    if (!flight) {
        res.send({ error: 'flight not found' });
        return;
    }
    let seatAmount = 1;//later, change it
    /* FIRST, CHECK IF USER NOT IN PASSENGER LIST AND IF THERE ARE ENOUGH AVAILABLE SEATS */
    if (seatType == 'bussiness' && !(flight.bussinessPassengers.includes(userId)) && flight.bussinessCapacity - (seatAmount - 1) > 0) {
        let { bussinessPassengers, bussinessCapacity } = flight;
        bussinessPassengers.push(userId);//NOTE: bad name. userId is actualy email, and not user._id
        bussinessCapacity -= seatAmount;
        flightDbService.updateFlightData(flight_id, { bussinessCapacity, bussinessPassengers });
        /* Now that it is registered in the database as a fact that the user(s) have a designated seat(s)
        on this specific flight, we also need to add this flight to future_flights in his database entry
        under the Users collection. And only after that succecds, we let him know it succeeded.
        If, However, the action failed, we must release the space he took on the plane, and then let him know
        something has failed, and thus he can try again. */
        const { future_flights } = user;
        future_flights.push(flight_id);
        if (await userDbService.updateUser(user.email, { future_flights })) {
            res.send({ msg: 'flight added succesfuly' })
            return;
        }
    }
    if (seatType == 'economy' && !(flight.economyPassengers.includes(userId)) && flight.economyCapacity - (seatAmount - 1) > 0) {
        let { economyPassengers, economyCapacity } = flight;
        economyPassengers.push(userId);//NOTE: bad name. userId is actualy email, and not user._id
        //However, user's email is better for checking dups, since Mongodb default _id is object,
        //and not really working against dups
        economyCapacity -= seatAmount;
        flightDbService.updateFlightData(flight_id, { economyCapacity, economyPassengers });
        /* Now that it is registered in the database as a fact that the user(s) have a designated seat(s)
        on this specific flight, we also need to add this flight to future_flights in his database entry
        under the Users collection. And only after that succecds, we let him know it succeeded.
        If, However, the action failed, we must release the space he took on the plane, and then let him know
        something has failed, and thus he can try again. */
        const { future_flights } = user;
        future_flights.push(flight_id);
        if (await userDbService.updateUser(user.email, { future_flights })) {
            res.send({ msg: 'flight added succesfuly' })
            return;
        }
    }
    res.send({ error: 'something went wrong, flight not purchased. Please try again' });
    return;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getPopularFlights = async (req, res) => {
    const flightsArr = await flightDbService.getPopularFlights();
    res.json(flightsArr);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const companiesFlightAmount = async (req,res) => res.send(await flightDbService.totalFlightsPerCompany());

module.exports = {
    deleteFlightFromAllUsers,
    createFlight,//Create
    getFlights,//Read
    searchFlight,//Read
    updateFlightData,//Update
    deleteFlight,//Delete
    getPopularFlights,
    searchFlight,
    purchaseFlightSeat,
    companiesFlightAmount
};