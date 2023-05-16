import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
        required: true,
        select: false
    },
    typeId: {
        type: Number,
        required: true,
        enum: [1, 2, 3],
        select: false
    },
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
});

var Option = mongoose.model('Option', optionSchema);

export default Option;