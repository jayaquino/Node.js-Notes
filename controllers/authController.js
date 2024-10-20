const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  // Only allow data that we need, user cannot manually input a role
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});
