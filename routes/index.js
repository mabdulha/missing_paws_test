let mongoose = require("mongoose")
var express = require("express")
var router = express.Router()

var mongodbUri = "mongodb+srv://moz:mozuser@missing-pets-cluster-rydzh.mongodb.net/missing_pets_test_db?retryWrites=true&w=majority"

mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.set("useFindAndModify", false)

let db = mongoose.connection

db.on("error", function (err) {
    console.log("Unable to Connect to [ " + db.name + " ]", err)
})

db.once("open", function () {
    console.log("Successfully Connected to [ " + db.name + " ]")
})

/* GET home page. */
router.get("/", function (req, res) {
    res.render("index", {
        title: "Missing Paws - Web App"
    })
})

module.exports = router