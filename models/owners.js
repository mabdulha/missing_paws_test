
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
        unique: true,
        // Got this from stack overflow https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
        // To validate email address the user inputs
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    }
}, {
    collection: "owners"
})

mongoose.set("useCreateIndex", true)

module.exports = mongoose.model("Owner", OwnerSchema)