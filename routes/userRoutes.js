const express = require('express');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const authController = require('../controllers/authController');

const router = express.Router();

router.param('id', (request, response, next, value) => {
  console.log(`User id is : ${value}`);
  next();
});

router.post('/signup', authController.signup);

router.route('/').get(getAllUsers).post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
