const chai = require("chai")
const expect = chai.expect
const request = require("supertest")
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer
const Owner = require("../../models/owners")
const mongoose = require("mongoose")

const _ = require("lodash")
let server
let mongod
let validID
// eslint-disable-next-line no-unused-vars
let conn
// eslint-disable-next-line no-unused-vars
let db

describe("Owners", () => {
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
            owner = await Owner.findOne({
                firstname: "Mozeeb"
            })
            validID = owner._id
        } catch (error) {
            console.log(error)
        }
    })
    describe("GET /owners", () => {
        it("should GET all the owners", done => {
            request(server)
                .get("/owners")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array")
                        expect(res.body.length).to.equal(2)
                        let result = _.map(res.body, owner => {
                            return {
                                firstname: owner.firstname,
                                lastname: owner.lastname,
                                phoneNum: owner.phoneNum,
                                email: owner.email
                            }
                        })
                        expect(result).to.deep.include({
                            firstname: "Mozeeb",
                            lastname: "Abdulha",
                            phoneNum: "0897456321",
                            email: "ma@gmail.com"
                        })
                        expect(result).to.deep.include({
                            firstname: "Jack",
                            lastname: "Dolan",
                            phoneNum: "0836598741",
                            email: "jd@gmail.com"
                        })
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
        })
    })
    describe("GET /owners/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching owner", done => {
                request(server)
                    .get(`/owners/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property("firstname", "Mozeeb")
                        expect(res.body[0]).to.have.property("lastname", "Abdulha")
                        done(err)
                    })
            })
        })
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/owners/123")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(404)
                    .end((err, res) => {
                        expect(res.body.message).include("Owner not found")
                        done(err)
                    })
            })
        })
    })
    describe("Post /owners", () => {
        it("should return a confirm message and update the database", () => {
            const owner = {
                firstname: "Mike",
                lastname: "Doyle",
                phoneNum: "0123654789",
                email: "md@gmail.com"
            }
            return request(server)
                .post("/owners")
                .send(owner)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equal("Owner added to database")
                    validID = res.body.data._id
                })
        })
        after(() => {
            return request(server)
                .get(`/owners/${validID}`)
                .expect(200)
                .then(res => {
                    expect(res.body[0]).to.have.property("firstname", "Mike")
                    expect(res.body[0]).to.have.property("email", "md@gmail.com")
                })
        })
    })
    describe("Delete /owners/:id", () => {
        describe("when the id is valid", () => {
            it("should return a message when the owner is deleted", () => {
                return request(server)
                    .delete(`/owners/${validID}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.include({
                            message: "Owner successfully deleted"
                        })
                    })
            })
        })
    })
    describe("when the id is invalid", () => {
        it("should return a message when owner can not be found", () => {
            request(server)
                .delete("/owners/123456")
                .expect(404)
                .then(res => {
                    expect(res.body).to.include({
                        message: "Owner not deleted"
                    })
                })
        })
    })
    describe("PUT /owners/:id/update", () => {
        describe("when the id is valid", () => {
            it("should return a message and update owner details", () => {
                return request(server)
                    .put(`/owners/${validID}/update`)
                    .send({
                        firstname: "Bob"
                    })
                    .send({
                        email: "bob@gmail.com"
                    })
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "Owner updated successfully"
                        })
                        expect(resp.body.data).to.include({
                            firstname: "Bob",
                            email: "bob@gmail.com"
                        })
                    })
            })
            after(() => {
                return request(server)
                    .get(`/owners/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body[0]).to.include({
                            firstname: "Bob",
                            email: "bob@gmail.com"
                        })
                    })
            })
        })
        describe("when the id is invalid", () => {
            it("should return a 404 and a message for invalid owner id", () => {
                return request(server)
                    .put("/owners/9999999/update")
                    .expect(404)
                    .expect({
                        message: "Cannot find owner associated with that id"
                    })
            })
        })
    })
    /*describe("GET /owners/:id/pets", () => {
        describe("when the id is valid", () => {
            it("should return the owners pets", done => {
                request(server)
                    .get(`owners/${validID}/pets`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property("name", "Charlie")
                        expect(res.body[0]).to.have.property("species", "Pitbull")
                        done(err)
                    })
            })
        })
        describe("when the id is invalid", () => {
            it("should return a 404 and a message for invalid owner id", () => {
                return request(server)
                    .put("/owners/9999999/update")
                    .expect(404)
                    .expect({
                        message: "Cannot find owner associated with that id"
                    })
            })
        })
    })*/
    describe("GET /owners/search", () => {
        it("should return the queried owner", done => {
            request(server)
                .get("/owners/search")
                .send({
                    "key": "firstname",
                    "query": "Moz"
                })
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array")
                        expect(res.body.length).to.equal(1)
                        let result = _.map(res.body, owner => {
                            return {
                                firstname: owner.firstname,
                                lastname: owner.lastname,
                                phoneNum: owner.phoneNum,
                                email: owner.email
                            }
                        })
                        expect(result).to.deep.include({
                            firstname: "Mozeeb",
                            lastname: "Abdulha",
                            phoneNum: "0897456321",
                            email: "ma@gmail.com"
                        })
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
        })
        it("should return error message if nothing is found", done => {
            request(server)
                .get("/owners/search")
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
                .get("/owners/search")
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
    describe("GET /owners/total", () => {
        it("should return total amount of all the owners", done => {
            request(server)
                .get("/owners/total")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.property("totalOwners", 2)
                    done(err)
                })
        })
    })
})