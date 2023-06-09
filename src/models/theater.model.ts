import mongoose = require('mongoose');
import { Schema } from 'mongoose';

const theaterSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    default: null
  },
  type: Number,
  totalCapacity: {
    type: Number,
    required: true
  },
  wheelChairCapacity: {
    type: Number,
    default: 0
  },
  row: {
    type: Number,
    required: true
  },
  col: {
    type: Number,
    required: true
  },
  rowLabel: {
    type: [String],
    default: []
  },
  colLabel: {
    type: [String],
    default: []
  },
  seatMap: {
    type: [String],
    required: true,
    // validate: [(arr) => arr.length === this.row * (this.col + 1), 'Seat map size does not match with row and col values.']
  },
  status: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
},
{
  versionKey: false
}
);

// module.exports = mongoose.model('Theater', theaterSchema);
const Theater = mongoose.model('Theater', theaterSchema);

export default Theater;
