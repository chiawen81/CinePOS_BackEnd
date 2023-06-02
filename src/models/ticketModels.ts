import { Schema } from 'mongoose';
import mongoose = require('mongoose');
import Movie from "./moviesModels";
import Seat from "./seats.model";

const ticketsSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,   // 此處不可關聯到order model，因為order model會關聯到ticket model，會造成循環關聯
            required: false
        },
        movieId: {
            type: Schema.Types.ObjectId,
            ref: Movie,
            required: [true, '電影ID必填'],
        },
        seatId: {
            type: Schema.Types.ObjectId,
            ref: Seat,
            required: [true, '座位ID必填'],
        },
        price: {
            type: Number,
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

const Ticket = mongoose.model('Ticket', ticketsSchema);

export default Ticket;