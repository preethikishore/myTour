
/*eslint-env node*/
const express = require('express');
const router = express.Router();
const {signUp,login,forgetPassword,resetPassword} = require('../Controller/authController');
const {getAllUser,createUser,getUser,updateUser} = require('../Controller/userController');
//User Route
router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgetpassword', forgetPassword);
router.patch('/resetpassword/:token', resetPassword);

//Tour Route
router.route('/').
get(getAllUser).
post(createUser);

router.route('/:id').
get(getUser).
patch(updateUser);

module.exports = router;