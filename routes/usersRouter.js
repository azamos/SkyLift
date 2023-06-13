const usersRouter = require('express').Router();
const {
    creatUser,
    getUsers,
    getUserByEmail,   
    updateUserData, 
    deleteUser
 } = require('../controllers/userController');

usersRouter.post('/',createUsers);
usersRouter.get('/',getUsers);
usersRouter.route('/:id')
    .get(getUserById)
    .put(updateUserData)
usersRouter.get('/:filterOBj',getUserByParamaters);
usersRouter.delete('/:id',deleteUser);

module.exports = usersRouter;