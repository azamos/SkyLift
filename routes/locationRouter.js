const locationRouter = require('express').Router();
const locationController = require('../controllers/locationController');
const requireAuthorization = require('../middleware/authorization');

locationRouter.get('/:partial_string',locationController.getPartialMatch);
locationRouter.get('/',requireAuthorization,locationController.getLocationsList);
locationRouter.post('/',requireAuthorization,locationController.createLocation);

module.exports = locationRouter;