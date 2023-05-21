import { Schema } from 'mongoose';
import mongoose = require('mongoose');
import Theater from './theater.model';
import Movie from './manager/moviesModels';


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