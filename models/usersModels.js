const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

// app.get("/test", (req, res) => {
//   res.writeHead(200, headers);
//   res.write(JSON.stringify({
//     message: "test work!",
//     method: "get",
//   })
//   );
//   res.end();
// });