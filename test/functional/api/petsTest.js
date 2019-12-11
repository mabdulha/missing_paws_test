/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import chai from "chai"
const expect = chai.expect
import request from "supertest"
import { MongoClient } from "mongodb"
const dotenv = require("dotenv")
dotenv.config()

const _ = require("lodash")

let server, db, client, collection, validID

describe("Petss", () => {
    before(async () => {
        try {
            // eslint-disable-next-line no-undef
            client = await MongoClient.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            // eslint-disable-next-line no-undef
            db = client.db(process.env.MONGO_DB)
            collection = db.collection("pets")
            server = require("../../../bin/www")
        } catch (error) {
            console.log(error)
        }
    })
    beforeEach(async () => {
        try {
            await collection.deleteMany({})
            await collection.insertOne({
                name: "Charlie",
                type: "Dog",
                species: "Pitbull",
                gender: "Male",
                colour: "black",
                size: 2,
                age: "5 years",
                lastSeenAddress: "12 Walking Street, Waterford",
                views: 2,
                missing: true,
                ownerID: "5db4bbff17b11a286ca06200"
            })
            await collection.insertOne({
                name: "Tweety",
                type: "Bird",
                species: "Canary",
                gender: "Female",
                colour: "Yellow",
                size: 5,
                age: "10 years",
                lastSeenAddress: "5 High Street, Kilkenny",
                views: 5,
                missing: false,
                ownerID: "5db4bbff17b11a286ca061ff"
            })
            const pet = await collection.findOne({ name: "Tweety" })
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
                                type: pet.type
                            }
                        })
                        expect(result).to.deep.include({
                            name: "Charlie",
                            type: "Dog",
                        })
                        expect(result).to.deep.include({
                            name: "Tweety",
                            type: "Bird",
                        })
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
        })
    })
    // describe("GET /pets/:id", () => {
    //     describe("when the id is valid", () => {
    //         it("should return the matching pet", done => {
    //             request(server)
    //                 .get(`/pets/${validID}`)
    //                 .set("Accept", "application/json")
    //                 .expect("Content-Type", /json/)
    //                 .expect(200)
    //                 .end((err, res) => {
    //                     expect(res.body[0]).to.have.property("name", "Charlie")
    //                     expect(res.body[0]).to.have.property("type", "Dog")
    //                     done(err)
    //                 })
    //         })
    //     })
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
    // })
    // describe("PUT /pets/:id/view", () => {
    //     describe("when the id is valid", () => {
    //         it("should return a message and the view should increase by 1", () => {
    //             return request(server)
    //                 .put(`/pets/${validID}/view`)
    //                 .expect(200)
    //                 .then(res => {
    //                     expect(res.body).to.include({
    //                         message: "View incremented successfully"
    //                     })
    //                     expect(res.body.data).to.have.property("views", 6)
    //                 })
    //         })
    //         after(() => {
    //             return request(server)
    //                 .get(`/pets/${validID}`)
    //                 .set("Application", "application/json")
    //                 .expect("Content-Type", /json/)
    //                 .expect(200)
    //                 .then(res => {
    //                     expect(res.body[0]).to.have.property("views", 6)
    //                 })
    //         })
    //     })
    // })
    // describe("when the id is invalid", () => {
    //     it("should returnn a 404 as id does not exist", () => {
    //         return request(server)
    //             .put("/pets/123654/view")
    //             .expect(404)
    //     })
    // })
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
    // describe("Put /pets/:id/status", () => {
    //     describe("when the id is invalid", () => {
    //         it("should update the missing status", () => {
    //             return request(server)
    //                 .put(`/pets/${validID}/status`)
    //                 .expect(200)
    //                 .then(res => {
    //                     expect(res.body).to.include({
    //                         message: "Status updated successfully"
    //                     })
    //                     expect(res.body.data).to.have.property("missing", true)
    //                 })
    //         })
    //         after(() => {
    //             return request(server)
    //                 .get(`/pets/${validID}`)
    //                 .set("Application", "application/json")
    //                 .expect("Content-Type", /json/)
    //                 .expect(200)
    //                 .then(res => {
    //                     expect(res.body[0]).to.have.property("missing", true)
    //                 })
    //         })
    //     })
    // })
    // describe("when the id is invalid", () => {
    //     it("should returnn a 404 as id does not exist", () => {
    //         return request(server)
    //             .put("/pets/123654/view")
    //             .expect(404)
    //     })
    // })
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
                                type: pet.type
                            }
                        })
                        expect(result).to.deep.include({
                            name: "Charlie",
                            type: "Dog"
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
                                type: pet.type
                            }
                        })
                        expect(result).to.deep.include({
                            name: "Tweety",
                            type: "Bird"
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
                                type: pet.type
                            }
                        })
                        expect(result).to.deep.include({
                            name: "Charlie",
                            type: "Dog"
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