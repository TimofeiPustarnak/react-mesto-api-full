const router = require('express').Router();
const {
  validateId,
  validateUserInfo,
  validateUserAvatar,
} = require('../middlewares/validation');
const {
  getUsers,
  getUserById,
  patchUser,
  patchAvatar,
  getUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', validateId, getUserById);
router.patch('/users/me', validateUserInfo, patchUser);
router.get('/users/me', getUser);
router.patch('/users/me/avatar', validateUserAvatar, patchAvatar);

module.exports = router;
