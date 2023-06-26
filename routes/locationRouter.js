const locationRouter = require('express').Router();
const locationController = require('../controllers/locationController');

locationRouter.get('/:partial_string',locationController.getPartialMatch);
locationRouter.get('/',(req,res)=>res.send("in locations router"))
locationRouter.post('/',locationController.createLocation);

module.exports = locationRouter;