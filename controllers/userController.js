const catchAsync = require('../utilities/catchAsync');
const User = require('../models/userModel');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users
    }
  });
});

exports.getUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route not defind'
  });
};

exports.createUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route not defind'
  });
};

exports.updateUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route not defind'
  });
};

exports.deleteUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route not defind'
  });
};
