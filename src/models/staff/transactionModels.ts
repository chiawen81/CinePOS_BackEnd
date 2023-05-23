import { Decimal128 } from "mongodb";
import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema(
    {
        customerid: {
            type: String,
            required: [true, '顧客id必填']

        },
        paymentMethod: {
            type: String,
            required: [true, '付款方式必填'],
            
        },
        amount:{
            type: Decimal128,
            required: [true, '交易總金額']
        },
        status:{
            type: Number,
            min: 0
        },
        paymentTime: {
            type: Date, 
            default: Date.now,
            select: false,
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
        collection: 'Transaction',
        versionKey: false
    }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;