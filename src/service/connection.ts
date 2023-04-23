import mongoose from 'mongoose';
const dotenv = require('dotenv');


dotenv.config({ path: './config.env' });
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(
    process.env.DATABASE, options as any).then(() => {
        console.log('MongoDB Atlas connected');
    }).catch(err => {
        console.log('MongoDB Atlas connection error:', err);
    });