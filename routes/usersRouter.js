const usersRouter = require('express').Router();
const {
    getUser
 } = require('../controllers/userController');

usersRouter.route('/:email/:password')
    .get(getUser)
module.exports = usersRouter;