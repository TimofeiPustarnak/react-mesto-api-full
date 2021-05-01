const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  link: {
    type: String,
    link: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
});

module.exports = mongoose.model('card', cardSchema);
