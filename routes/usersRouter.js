const usersRouter = require('express').Router();
const {
    getUser
 } = require('../controllers/userController');

usersRouter.get('/:email/:password',getUser)
module.exports = usersRouter;