const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utilities/appError');

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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and pw exists
  if (!email || !password) {
    next(
      new AppError('Please provide email and password', 400)
    );
  }
  // 2) Check if user exists && pw is correct

  const user = await User.findOne({ email }).select(
    '+password'
  ); // Select a field by default not selected

  console.log(user);

  // 3) If everything is ok, send token to client
  const token = '';
  res.status(200).json({
    status: 'success',
    token
  });
});
