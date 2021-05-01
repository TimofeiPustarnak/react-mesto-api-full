const router = require('express').Router();
const { validateId, validateCard } = require('../middlewares/validation');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.put('/cards/:id/likes', validateId, likeCard);
router.delete('/cards/:id/likes', validateId, dislikeCard);
router.post('/cards', validateCard, createCard);
router.get('/cards', getCards);
router.delete('/cards/:id', validateId, deleteCard);

module.exports = router;
