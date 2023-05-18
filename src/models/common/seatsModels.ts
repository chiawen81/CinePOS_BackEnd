import mongoose from "mongoose";

const SeatsSchema = new mongoose.Schema(
    {
        scheduleId: {
            type: String,
            required: [true, '場次ID必填']
        },
        seatRow: {
            type: String,
            required: [true, 'seatRow必填']
        },
        seatCol: {
            type: String,
            required: [true, 'seatCol必填']
        },
        seatName: {
            type: String,
            required: [true, 'seatName必填']
        },
        status: {
            type: Number,
            required: [true, '座位狀態必填']
        },
        createdAt: {
            type: Date, 
            default: Date.now,
            select: false,
        },
        updatedAt: {
            type: Date, 
            default: Date.now,
            select: false,
        }
    },
    {
        versionKey: false
    }
);

var Seat = mongoose.model('seats', SeatsSchema);

export default Seat;