import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            required: [true, '票券編號必填'],
        },
        seatId: {
            type: String,
            required: [true, '場次座位ID必填'],
        },
        movieId: {
            type: String,
            required: [true, '電影ID必填'],
        },
        scheduleId: {
            type: String,
            required: [true, '場次ID必填'],
        },
        paymentMethod: {
            type: Number,
            required: [true, '付款方法必填'],
        },
        amount: {
            type: Number,
            required: [true, '訂單總金額必填'],
        },
        status: {
            type: String,
            required: [true, '訂單狀態必填'],
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

var Order = mongoose.model('Order', ordersSchema);

export default Order;