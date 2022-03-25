const mongoose = require('mongoose');
const { Schema } = mongoose;

const HistorySchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    gameType: {
      type: String,
      required: true,
    },

    digitType: {
      type: String,
      required: true,
    },

    resultNumbers: {
      type: Object,
      default: {},
    },

    numbers: {
      type: String,
      required: true,
    },

    multiple: {
      type: Number,
      required: true,
    },

    betAmount: {
      type: Number,
      required: true,
    },

    winningAmount: {
      type: Number,
      required: true,
    },

    processed: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

HistorySchema.set('toJSON', {
  virtuals: true,
});

const History = mongoose.model('history', HistorySchema);

module.exports = History;
