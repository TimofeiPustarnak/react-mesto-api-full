const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ProhibitionError = require('../errors/ProhibitionError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))

    .catch(() => {
      throw new ValidationError(
        'Переданы некорректные данные при создании карточки.',
      );
    })

    .catch(next);
};

// module.exports.deleteCard = (req, res, next) => {
//   Card.findByIdAndRemove(req.params.id)
//     .orFail(() => {
//       throw new NotFoundError("Данные не найдены");
//     })
//     .then((card) => {
//       if (card.owner.toString() === req.user._id) {
//         Card.findByIdAndRemove(req.params.cardId)
//           .then(() => {
//             res.send({ data: card });
//           })
//           .catch(next);
//       } else {
//         throw new ProhibitionError("Вы не можете удалить чужую карточку");
//       }
//     })

//     .catch(next);
// };

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('Данные не найдены');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ProhibitionError('Вы не можете удалить чужую карточку');
      }
      Card.findByIdAndRemove(req.params.id)
        .then(() => {
          res.send({ data: card });
        })
        .catch(next);
    })

    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findOneAndUpdate(
    { _id: req.params.id },
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Данные не найдены');
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(() => {
      throw new NotFoundError(
        'Переданы некорректные данные для постановке лайка.',
      );
    })

    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Данные не найдены');
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(() => {
      throw new NotFoundError('Переданы некорректные данные для снятии лайка.');
    })

    .catch(next);
};
