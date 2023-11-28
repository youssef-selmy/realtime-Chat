const express = require('express');
const {
  signupValidator,
  loginValidator,
} = require('../utils/authValidators');

const {
  signup,
  login,
 
} = require('../controllers/auth');

const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);


module.exports = router;
