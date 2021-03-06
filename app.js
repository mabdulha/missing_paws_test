/* eslint-disable no-undef */
/*eslint no-unused-vars: "off" */
let createError = require("http-errors")
let express = require("express")
let path = require("path")
let cookieParser = require("cookie-parser")
let logger = require("morgan")

let indexRouter = require("./routes/index")
let usersRouter = require("./routes/users")
const owners = require("./routes/owners")
const pets = require("./routes/pets")
const cors = require("cors")

let app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({
    extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
if (process.env.NODE_ENV !== "test") {  
    app.use(logger("dev"))
}
  
app.use("/", indexRouter)
app.use("/users", usersRouter)

// routes for pets
app.get("/pets", pets.findAll)
app.get("/pets/totalfound", pets.findTotalNumberOfFoundPets)
app.get("/pets/totalmissing", pets.findTotalNumberOfMissingPets)
app.get("/pets/found", pets.findAllFoundPets)
app.get("/pets/missing", pets.findAllMissingPets)
app.get("/pets/search", pets.searchPet)
app.get("/pets/total", pets.findTotalNumberOfPets)
app.get("/pets/views", pets.findTotalViews)
app.get("/pets/:id", pets.findOne)

app.post("/pets", pets.addPet)

app.put("/pets/:id/view", pets.incrementViews)
app.put("/pets/:id/status", pets.updateMissingStatus)
app.put("/pets/:id/update", pets.updatePet)

app.delete("/pets/:id", pets.deletePet)

// routes for owners
app.get("/owners", owners.findAll)
app.get("/owners/:id/pets", owners.findPetsAssociatedWithOwner)
app.get("/owners/search", owners.searchOwner)
app.get("/owners/total", owners.findTotalNumberOfOwners)
app.get("/owners/:id/pets/total", owners.findNumberOfPetsPerOwner)
app.get("/owners/:id", owners.findOne)

app.post("/owners/register", owners.addOwner)
app.post("/owners/login", owners.login)

app.put("/owners/:id/update", owners.updateOwner)

app.delete("/owners/:id", owners.deleteOwner)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render("error")
})

module.exports = app