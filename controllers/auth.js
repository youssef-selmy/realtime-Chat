const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const createToken = require('../utils/createToken');
const User = require('../models/userModel');

// @desc    Signup
// @route   POST /api/auth/signup
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const user = await User.create({ name, email, password });
  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});

// @desc    Login
// @route   POST /api/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  const token = createToken(user._id);
  // delete user._doc.password;
  res.status(200).json({ data: user, token });
});
