import mongoose from 'mongoose';
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const databaseUrl = (process.env.NODE_ENV === 'production') ? process.env.DATABASE_REMOTE : process.env.DATABASE_LOCAL;

mongoose.connect(databaseUrl as string, options as any).then(() => {
    console.log(`MongoDB connected: ${databaseUrl}`);
}).catch(err => {
    console.log(`ERROR connecting to MongoDB: ${databaseUrl}`, err);
});