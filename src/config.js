const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://localhost:27017/GTravellers')

connect.then(()=>{
    console.log("Database connection successfully!");
}).catch(()=>{
    console.log("Database CANNOT be connected");
})

// create schema
const LoginSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});

const collection = new mongoose.model("users", LoginSchema);
module.exports = collection;