let mongoose = require('mongoose');

let PetSchema = new mongoose.Schema({
        name: {
                type: String,
                required: true
        },
        type: {
                type: String,
                required: true
        },
        species: {
                type: String,
                required: true
        },
        gender: {
                type: String,
                required: true
        },
        colour: {
                type: String,
                required: true
        },
        size: {
                type: String,
                required: true
        },
        age: {
                type: String,
                required: true
        },
        lastSeenAddress: {
                type: String,
                required: true
        },
        views: {
                type: Number,
                default: 0,
                required: true
        },
        missing: {
                type: Boolean,
                default: true
        },
        ownerID: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'owners'
        }
}, {
        collection: 'pets'
});

module.exports = mongoose.model('Pet', PetSchema);