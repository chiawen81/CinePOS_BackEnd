import mongoose from "mongoose";

const ticketsSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: false
        },
        movieId: {
            type: String,
            required: [true, '電影ID必填'],
        },
        seatId: {
            type: String,
            required: [true, '座位ID必填'],
        },
        price: {
            type: String,
            required: [true, '票價必填'],
        },
        paymentMethod: {
            type: Number,
            required: [true, '付款方法必填'],
        },
        isRefund: {
            type: Boolean,
            required: [true, '是否退票必填'],
        },
        refundMethod: {
            type: Number,
            required: false
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
        collection: 'tickets',
        versionKey: false
    }
);

var Ticket = mongoose.model('Ticket', ticketsSchema);

export default Ticket;