/* eslint-disable no-console */
/*eslint no-unused-vars: "off" */
import chai from "chai"
const expect = chai.expect
import request from "supertest"
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer
import Owner from "../../models/owners"
import Pet from "../../models/pets"
import mongoose from "mongoose"

import _ from "lodash"
let server
let mongod
let ownerValidID
let petValidID
let conn
let db

describe("Relationship", () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database",
                    dbName: "missing_paws_test_db" // by default generate random dbName
                }
            })
            // Async Trick - this ensures the database is created before 
            // we try to connect to it or start the server
            await mongod.getConnectionString()

            conn = mongoose.createConnection("mongodb://localhost:27017/missing_paws_test_db", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            server = require("../../bin/www")
            db = mongoose.connection
        } catch (error) {
            console.log(error)
        }
    })

    after(async () => {
        try {
            // was having alot of trouble with this solution found here
            // https://mongoosejs.com/docs/api.html#connection_Connection-dropDatabase
            //  await conn.dropDatabase();
        } catch (error) {
            console.log(error)
        }
    })

    beforeEach(async () => {
        try {
            await Owner.deleteMany({})
            await Pet.deleteMany({})
            let owner = new Owner()
            owner.firstname = "Mozeeb"
            owner.lastname = "Abdulha"
            owner.phoneNum = "0897456321"
            owner.email = "ma@gmail.com"
            await owner.save()
            owner = new Owner()
            owner.firstname = "Jack"
            owner.lastname = "Dolan"
            owner.phoneNum = "0836598741"
            owner.email = "jd@gmail.com"
            await owner.save()
            let pet = new Pet()
            pet.name = "Charlie"
            pet.type = "Dog"
            pet.species = "Pitbull"
            pet.gender = "Male"
            pet.colour = "black"
            pet.size = "2 meters"
            pet.age = "5 years",
            pet.lastSeenAddress = "12 Walking Street, Waterford"
            pet.views = 2
            pet.missing = true
            pet.ownerID = "5db4bbff17b11a286ca06200"
            await pet.save()
            pet = new Pet()
            pet.name = "Tweety"
            pet.type = "Bird"
            pet.species = "Canary"
            pet.gender = "Female"
            pet.colour = "Yellow"
            pet.size = "0.2 meters"
            pet.age = "10 years",
            pet.lastSeenAddress = "5 High Street, Kilkenny"
            pet.views = 5
            pet.missing = false
            pet.ownerID = "5db4bbff17b11a286ca061ff"
            await pet.save()
            owner = await Owner.findOne({
                firstname: "Mozeeb"
            })
            ownerValidID = owner._id
            pet = await Pet.findOne({
                name: "Tweety"
            })
            petValidID = pet._id
        } catch (error) {
            console.log(error)
        }
    })
})