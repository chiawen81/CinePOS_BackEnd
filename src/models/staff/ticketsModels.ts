import { Decimal128 } from "mongodb";
import mongoose from "mongoose";
const ticketsSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: [true, '訂單id必填']

        },
        seatId: {
            type: String,
            required: [true, '座位id必填']

        },
        amount:{
            type: Decimal128,
            required: [true, '票價必填']
        },
        isRefund:{
            type: Boolean,
            default: false
        },
        refundMethod:{
            type: String,
            required: [true, '退費方式必填']
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
        collection: 'Transactions',
        versionKey: false
    }
);

var Tickets = mongoose.model('transactions', ticketsSchema);

export default Tickets;