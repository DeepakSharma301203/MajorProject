const mongoose = require("mongoose");
const Schema= mongoose.Schema;
const passportLocalsMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
    },
});

userSchema.plugin(passportLocalsMongoose);

module.exports = mongoose.model("User", userSchema);