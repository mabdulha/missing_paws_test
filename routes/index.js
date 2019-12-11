/* eslint-disable no-console */
let mongoose = require("mongoose")
let express = require("express")
let router = express.Router()
const dotenv = require("dotenv")
dotenv.config()

// eslint-disable-next-line no-undef
let mongodbUri = process.env.MONGO_URI

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
        title: "Missing Paws - Agile Software Practice Test Version"
    })
})

module.exports = router