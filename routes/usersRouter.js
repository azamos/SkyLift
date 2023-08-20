const usersRouter = require('express').Router();
const {
    userLogin,
    createUser,
    getUserData,
    getUsersList,
    updateUser,
    deleteUser,
    signOut,
    deleteFlightFromAllUsers
 } = require('../controllers/userController');

usersRouter.post('/checkuser',userLogin);
usersRouter.post('/getUserData',getUserData);
usersRouter.post('/deleteFlightFromAllUsers',deleteFlightFromAllUsers);
usersRouter.post('/',createUser);
usersRouter.get('/usersList',getUsersList);
usersRouter.post('/update',updateUser);
usersRouter.post('/delete',deleteUser);
usersRouter.get('/signout',signOut);
module.exports = usersRouter;