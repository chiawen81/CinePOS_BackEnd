import mongoose from "mongoose";
const ticketTypeSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: [true, '票種名稱必填'],
        },
        price: {
            type: Number,
            required: [true, '票價必填'],
            min: 0
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
        collection: 'ticketTypes',
        versionKey: false
    }
);

var TicketTypes = mongoose.model('ticketTypes', ticketTypeSchema);

export default TicketTypes;