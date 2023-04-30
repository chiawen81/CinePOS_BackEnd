import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    newName: {
        type: String,
        required: false,
    },
    staffId: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    resetKey: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: false
    },
    status: {
        type: Number,
        required: false
    },
    createdAt: {
        type: String,
        required: false
    }
});

var User = mongoose.model('User', userSchema);

export default User;