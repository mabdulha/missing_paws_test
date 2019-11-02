/* eslint-disable no-console */
/*eslint no-unused-vars: "off" */
const chai = require("chai")
const expect = chai.expect
const request = require("supertest")
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer
const Pet = require("../../models/pets")
const mongoose = require("mongoose")

const _ = require("lodash")
let server
let mongod
let db
let validID
let conn

describe("Pets", () => {
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
            await conn.dropDatabase()
        } catch (error) {
            console.log(error)
        }
    })

    beforeEach(async () => {
        try {
            await Pet.deleteMany({})
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
            pet = await Pet.findOne({
                name: "Tweety"
            })
            validID = pet._id
        } catch (error) {
            console.log(error)
        }
    })
    describe("GET /pets", () => {
        it("should GET all the pets", done => {
            request(server)
                .get("/pets")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array")
                        expect(res.body.length).to.equal(2)
                        let result = _.map(res.body, pet => {
                            return {
                                name: pet.name,
                                type: pet.type,
                                species: pet.species,
                                gender: pet.gender,
                                colour: pet.colour,
                                size: pet.size,
                                age: pet.age,
                                lastSeenAddress: pet.lastSeenAddress,
                                missing: pet.missing,
                                ownerID: pet.ownerID
                            }
                        })
                        expect(result).to.deep.include({
                            name: "Charlie",
                            type: "Dog",
                            species: "Pitbull",
                            gender: "Male",
                            colour: "black",
                            size: "2 meters",
                            age: "5 years",
                            lastSeenAddress: "12 Walking Street, Waterford",
                            missing: true,
                            ownerID: "5db4bbff17b11a286ca06200"
                        })
                        expect(result).to.deep.include({
                            name: "Tweety",
                            type: "Bird",
                            species: "Canary",
                            gender: "Female",
                            colour: "Yellow",
                            size: "0.2 meters",
                            age: "10 years",
                            lastSeenAddress: "5 High Street, Kilkenny",
                            missing: false,
                            ownerID: "5db4bbff17b11a286ca061ff"
                        })
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
        })
    })
    describe("GET /pets/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching pet", done => {
                request(server)
                    .get(`/pets/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property("name", "Tweety")
                        expect(res.body[0]).to.have.property("type", "Bird")
                        done(err)
                    })
            })
        })
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/pets/123")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(404)
                    .end((err, res) => {
                        expect(res.body.message).include("Pet not found")
                        done(err)
                    })
            })
        })
    })
    describe("Post /pets", () => {
        it("should return a confirmation message and update the database", () => {
            const pet = {
                name: "Harry",
                type: "Turtle",
                species: "Hawksbill Sea Turtle",
                gender: "Female",
                colour: "Brown",
                size: "4 meters",
                age: "15 years",
                lastSeenAddress: "5 Parliament Street, Kilkenny",
                missing: true,
                ownerID: validID
            }
            return request(server)
                .post(`/owners/${validID}/pets`)
                .send(pet)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equal("Pet Added to database")
                    validID = res.body.data._id
                })
        })
        after(() => {
            return request(server)
                .get(`/pets/${validID}`)
                .expect(200)
                .then(res => {
                    expect(res.body[0]).to.have.property("name", "Harry")
                    expect(res.body[0]).to.have.property("gender", "Female")
                })
        })
    })
    describe("PUT /pets/:id/view", () => {
        describe("when the id is valid", () => {
            it("should return a message and the view should increase by 1", () => {
                return request(server)
                    .put(`/pets/${validID}/view`)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.include({
                            message: "View incremented successfully"
                        })
                        expect(res.body.data).to.have.property("views", 6)
                    })
            })
            after(() => {
                return request(server)
                    .get(`/pets/${validID}`)
                    .set("Application", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body[0]).to.have.property("views", 6)
                    })
            })
        })
    })
    describe("when the id is invalid", () => {
        it("should returnn a 404 as id does not exist", () => {
            return request(server)
                .put("/pets/123654/view")
                .expect(404)
        })
    })
    describe("Delete /pets/:id", () => {
        describe("when the id is valid", () => {
            it("should return a message when the pet is deleted", () => {
                return request(server)
                    .delete(`/pets/${validID}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.include({
                            message: "Pet successfully deleted"
                        })
                    })
            })
        })
    })
    describe("when the id is invalid", () => {
        it("should return a message when pet can not be found", () => {
            request(server)
                .delete("/pets/123456")
                .expect(404)
                .then(res => {
                    expect(res.body).to.include({
                        message: "Pet not deleted"
                    })
                })
        })
    })
    describe("Put /pets/:id/status", () => {
        describe("when the id is invalid", () => {
            it("should update the missing status", () => {
                return request(server)
                    .put(`/pets/${validID}/status`)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.include({
                            message: "Status updated successfully"
                        })
                        expect(res.body.data).to.have.property("missing", true)
                    })
            })
            after(() => {
                return request(server)
                    .get(`/pets/${validID}`)
                    .set("Application", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body[0]).to.have.property("missing", true)
                    })
            })
        })
    })
    describe("when the id is invalid", () => {
        it("should returnn a 404 as id does not exist", () => {
            return request(server)
                .put("/pets/123654/view")
                .expect(404)
        })
    })
    describe("GET /pets/views", () => {
        it("should return the total number of views across all pets", () => {
            request(server)
                .get("/pets/views")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property("totalViews", 7)
                })
        })
    })
    describe("GET /pets/total", () => {
        it("should return total amount of all the pets", done => {
            request(server)
                .get("/pets/total")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property("totalPets", 2)
                    done(err)
                })
        })
    })
    describe("GET /pets/totalmissing", () => {
        it("should return total amount of all the missing pets", done => {
            request(server)
                .get("/pets/totalmissing")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property("totalMissing", 1)
                    done(err)
                })
        })
    })
    describe("GET /pets/totalfound", () => {
        it("should return total amount of all the found pets", done => {
            request(server)
                .get("/pets/totalfound")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property("totalFound", 1)
                    done(err)
                })
        })
    })
    describe("GET '/pets/missing", () => {
        it("should return all the missing pets", done => {
            request(server)
                .get("/pets/missing")
                .set("Accept", "applicatioon/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array")
                        expect(res.body.length).to.equal(1)
                        let result = _.map(res.body, pet => {
                            return {
                                name: pet.name,
                                type: pet.type,
                                species: pet.species,
                                gender: pet.gender,
                                colour: pet.colour,
                                size: pet.size,
                                age: pet.age,
                                lastSeenAddress: pet.lastSeenAddress,
                                missing: pet.missing,
                                ownerID: pet.ownerID
                            }
                        })
                        expect(result).to.deep.include({
                            name: "Charlie",
                            type: "Dog",
                            species: "Pitbull",
                            gender: "Male",
                            colour: "black",
                            size: "2 meters",
                            age: "5 years",
                            lastSeenAddress: "12 Walking Street, Waterford",
                            missing: true,
                            ownerID: "5db4bbff17b11a286ca06200"
                        })
                        done(err)
                    } catch (e) {
                        done(e)
                    }
                })
        })
    })
    describe("GET '/pets/found", () => {
        it("should return all the found pets", done => {
            request(server)
                .get("/pets/found")
                .set("Accept", "applicatioon/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array")
                        expect(res.body.length).to.equal(1)
                        let result = _.map(res.body, pet => {
                            return {
                                name: pet.name,
                                type: pet.type,
                                species: pet.species,
                                gender: pet.gender,
                                colour: pet.colour,
                                size: pet.size,
                                age: pet.age,
                                lastSeenAddress: pet.lastSeenAddress,
                                missing: pet.missing,
                                ownerID: pet.ownerID
                            }
                        })
                        expect(result).to.deep.include({
                            name: "Tweety",
                            type: "Bird",
                            species: "Canary",
                            gender: "Female",
                            colour: "Yellow",
                            size: "0.2 meters",
                            age: "10 years",
                            lastSeenAddress: "5 High Street, Kilkenny",
                            missing: false,
                            ownerID: "5db4bbff17b11a286ca061ff"
                        })
                        done(err)
                    } catch (e) {
                        done(e)
                    }
                })
        })
    })
    describe("GET /pets/search", () => {
        it("should return the queried pet", done => {
            request(server)
                .get("/pets/search")
                .send({
                    "key": "firstname",
                    "query": "Char"
                })
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array")
                        expect(res.body.length).to.equal(1)
                        let result = _.map(res.body, pet => {
                            return {
                                name: pet.name,
                                type: pet.type,
                                species: pet.species,
                                gender: pet.gender,
                                colour: pet.colour,
                                size: pet.size,
                                age: pet.age,
                                lastSeenAddress: pet.lastSeenAddress,
                                missing: pet.missing,
                                ownerID: pet.ownerID
                            }
                        })
                        expect(result).to.deep.include({
                            name: "Charlie",
                            type: "Dog",
                            species: "Pitbull",
                            gender: "Male",
                            colour: "black",
                            size: "2 meters",
                            age: "5 years",
                            lastSeenAddress: "12 Walking Street, Waterford",
                            missing: true,
                            ownerID: "5db4bbff17b11a286ca06200"
                        })
                        done(err)
                    } catch (e) {
                        done(e)
                    }
                })
        })
        it("should return error message if nothing is found", done => {
            request(server)
                .get("/pets/search")
                .send({
                    "key": "firstname",
                    "query": "xtcyvgubhinjo"
                })
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.include({
                            message: "No results found for this search term"
                        })
                        done(err)
                    } catch (e) {
                        done(e)
                    }
                })
        })
        it("should return an error message if the query is blank", done => {
            request(server)
                .get("/pets/search")
                .send({
                    "key": "firstname",
                    "query": ""
                })
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.include({
                            message: "Please enter a query to search"
                        })
                        done(err)
                    } catch (e) {
                        done(e)
                    }
                })
        })
    })
})