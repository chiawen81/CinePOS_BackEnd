import { Schema } from 'mongoose';
import mongoose = require('mongoose');
import Movie from './moviesModels';
import Theater from './theater.model';


const timetableSchema = new mongoose.Schema({
  movieId: { type: Schema.Types.ObjectId, ref: Movie },
  theaterId: { type: Schema.Types.ObjectId, ref: Theater },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

const Timetable = mongoose.model('Timetable', timetableSchema);

export default Timetable;