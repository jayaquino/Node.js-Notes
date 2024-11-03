const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.param('id', (request, response, next, value) => {
  console.log(`User id is : ${value}`);
  next();
});

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post(
  '/forgotPassword',
  authController.forgotPassword
);
router.patch(
  '/resetPassword/:token',
  authController.resetPassword
);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.protect,
  authController.updatePassword
);

// Protects the routes ONLY after this point. Middleware runs in sequence.
router.use(authController.protect);

router.get(
  '/me',
  userController.getMe,
  userController.getUser
);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// Protect these routes, only admin role
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
