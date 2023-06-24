import mongoose, { Schema } from "mongoose";
import Movie from './moviesModels';
import timetableSchema from './timetable.model';
import Seat from "./seats.model";
import Ticket from "./ticketModels";
import TicketType from "./ticketTypeModels";

const ordersSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: false,
        unique: true
    },
    ticketList: [{
        ticketId: {
            type: Schema.Types.ObjectId,
            ref: Ticket,
            required: [true, '票券編號必填'],
        },
        seatId: {
            type: Schema.Types.ObjectId,
            ref: Seat,
            required: [true, '場次座位ID必填'],
        },
        movieId: {
            type: Schema.Types.ObjectId,
            ref: Movie,
            required: [true, '電影ID必填'],
        },
        scheduleId: {
            type: Schema.Types.ObjectId,
            ref: timetableSchema,
            required: [true, '場次ID必填2'],
        },
        price: {
            type: Number,
            required: [true, '票券價格必填'],
        },
        ticketTypeId: {
            type: Schema.Types.ObjectId,
            ref: TicketType,
            required: [true, '票券類型ID必填'],
        }
    }],
    paymentMethod: {
        type: Number,
        required: [true, '付款方法必填'],
        enum: [1, 2],
    },
    amount: {
        type: Number,
        required: [true, '訂單總金額必填'],
    },
    status: {
        type: Number,
        required: [true, '訂單狀態必填'],
        enum: [-1, 0, 1, 2, 3],
        default: 0
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
        collection: 'orders',
        versionKey: false
    }
);
const Order = mongoose.model('Order', ordersSchema);

export default Order;