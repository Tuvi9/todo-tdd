const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(
            "mongodb+srv://guyy:DemonSlayer6921@todo-tdd.nsl1c4w.mongodb.net/?retryWrites=true&w=majority&appName=todo-tdd",
            { useNewUrlParser: true }
            );
    } catch (err) {
        console.error('Error connecting to mongodb');
        console.error(err);
    }
}

module.exports = { connect };