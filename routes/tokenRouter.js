const tokenRouter = require('express').Router();
const requireAuthorization = require('../middleware/authorization');
const {    tokenUpdateControl,
    tokenDeleteControl,
    tokenListControl,
    tokenSearchControl} = require('../controllers/tokenController');
tokenRouter.use('/',requireAuthorization);
tokenRouter.get('/tokenList',tokenListControl);
tokenRouter.post('/updateToken',tokenUpdateControl);
tokenRouter.post('/deleteToken',tokenDeleteControl);
tokenRouter.post('/getTokenById',tokenSearchControl);

module.exports = tokenRouter;