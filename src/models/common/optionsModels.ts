import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
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