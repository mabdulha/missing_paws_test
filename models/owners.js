let mongoose = require("mongoose")

let OwnerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phoneNum: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, {
    collection: "owners"
})

mongoose.set("useCreateIndex", true)

module.exports = mongoose.model("Owner", OwnerSchema)