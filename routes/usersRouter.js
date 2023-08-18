const usersRouter = require('express').Router();
const {
    userLogin,
    createUser,
    getUserData,
    getUsersList,
    updateUser,
    deleteUser
 } = require('../controllers/userController');

usersRouter.post('/checkuser',userLogin);
usersRouter.post('/getUserData',getUserData);
usersRouter.post('/',createUser);
usersRouter.get('/usersList',getUsersList);
usersRouter.post('/update',updateUser);
usersRouter.post('/delete',deleteUser);
module.exports = usersRouter;