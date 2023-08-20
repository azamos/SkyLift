const locationRouter = require('express').Router();
const locationController = require('../controllers/locationController');

locationRouter.get('/:partial_string',locationController.getPartialMatch);
locationRouter.get('/',locationController.getLocationsList);
locationRouter.post('/',locationController.createLocation);

module.exports = locationRouter;