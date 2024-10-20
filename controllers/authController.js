const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const jwt = require('jsonwebtoken');

exports.signup = catchAsync(async (req, res, next) => {
  // Only allow data that we need, user cannot manually input a role
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = jwt.sign(
    { id: newUser._id },
    'process.env.JWT_SECRET',
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});
