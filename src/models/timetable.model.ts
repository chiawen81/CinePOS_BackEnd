const mongoose = require('mongoose');
const { Schema } = mongoose;

const timetableSchema = new Schema({
  movieId: {
    type: String,
    required: true
  },
  theaterId: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
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
});

const Timetable = mongoose.model('Timetable', timetableSchema);

export default Timetable;