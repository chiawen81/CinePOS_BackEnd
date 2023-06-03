import mongoose from "mongoose";

const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    enTitle: {
        type: String,
        required: false,
    },
    genre: {
        type: [{
            type: Number,
            enum: [1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12]
        }],
        required: true
    },
    genreName: {
        type: [{
            type: String
        }],
        required: false
    },
    runtime: {
        type: Number,
        required: true,
        min: 60,
        max: 240,
    },
    provideVersion: {
        type: [{
            type: Number
        }],
        required: true
    },
    provideVersionName: {
        type: [{
            type: String
        }],
        required: false
    },
    rate: {
        type: Number,
        enum: [0, 6, 12, 15, 18],
        required: true
    },
    rateName: {
        type: String,
        required: false
    },
    director: {
        type: String,
        required: false,
    },
    cast: {
        type: [{
            type: String
        }],
        required: false,
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: Number,
        enum: [-1, 0, 1],
        required: true
    },
    statusName: {
        type: String,
        required: false
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    trailerLink: {
        type: String,
        required: false,
        match: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.&/.?=%\-_~]*)*\/?$/i
    },
    distributor: {
        type: String,
        required: false,
    },
    posterUrl: {
        type: String,
        required: true,
        match: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.&/.?=%\-_~]*)*\/?$/i
        // 踩坑note：                                       ＾＾＾＾＾＾＾＾＾ []中間放要允許的特殊字元
        // 連結的亂碼比較多，要允許多一點的特殊字元，例如：&、=、?、%、-、_、~、.、/，否則正則驗證會失敗
    },
    createdAt: {
        type: Date,
        required: false,
        select: false,
    },
    updatedAt: {
        type: Date,
        required: false,
        select: false,
    }
}, {
    collection: 'movies',
    versionKey: false
}
);

const Movie = mongoose.model('Movie', moviesSchema);

export default Movie;