// /* eslint-disable no-console */
// /*eslint no-unused-vars: "off" */
// import chai from "chai"
// const expect = chai.expect
// import request from "supertest"
// import { MongoClient } from "mongodb"
// const dotenv = require("dotenv")
// dotenv.config()

// const _ = require("lodash")

// let server, db, client, collection, validID

// describe("Relationship", () => {
//     before(async () => {
//         try {
//             mongod = new MongoMemoryServer({
//                 instance: {
//                     port: 27017,
//                     dbPath: "./test/database",
//                     dbName: "petsdb" // by default generate random dbName
//                 }
//             })
//             url = await mongod.getConnectionString()
//             connection = await MongoClient.connect(url, {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true
//             })
//             db = connection.db(await mongod.getDbName())
//             // Must wait for DB setup to complete BEFORE starting the API server
//             server = require("../../../bin/www")
//         } catch (error) {
//             console.log(error)
//         }
//     })

//     after(async () => {
//         try {
//             await connection.close()
//             await mongod.stop()
//             await server.close()
//         } catch (error) {
//             console.log(error)
//         }
//     })

//     beforeEach(async () => {
//         try {
//             await Owner.deleteMany({})
//             await Pet.deleteMany({})
//             let owner = new Owner()
//             owner.firstname = "Mozeeb"
//             owner.lastname = "Abdulha"
//             owner.phoneNum = "0897456321"
//             owner.email = "ma@gmail.com"
//             await owner.save()
//             owner = new Owner()
//             owner.firstname = "Jack"
//             owner.lastname = "Dolan"
//             owner.phoneNum = "0836598741"
//             owner.email = "jd@gmail.com"
//             await owner.save()
//             owner = await Owner.findOne({
//                 firstname: "Mozeeb"
//             })
//             ownerValidID = owner._id
//             let pet = new Pet()
//             pet.name = "Charlie"
//             pet.type = "Dog"
//             pet.species = "Pitbull"
//             pet.gender = "Male"
//             pet.colour = "black"
//             pet.size = "2 meters"
//             pet.age = "5 years",
//             pet.lastSeenAddress = "12 Walking Street, Waterford"
//             pet.views = 2
//             pet.missing = true
//             pet.ownerID = ownerValidID
//             await pet.save()
//             pet = new Pet()
//             pet.name = "Tweety"
//             pet.type = "Bird"
//             pet.species = "Canary"
//             pet.gender = "Female"
//             pet.colour = "Yellow"
//             pet.size = "0.2 meters"
//             pet.age = "10 years",
//             pet.lastSeenAddress = "5 High Street, Kilkenny"
//             pet.views = 5
//             pet.missing = false
//             pet.ownerID = ownerValidID
//             await pet.save()
//             pet = await Pet.findOne({
//                 name: "Tweety"
//             })
//             petValidID = pet._id
//         } catch (error) {
//             console.log(error)
//         }
//     })
//     describe("GET /owners/:id/pets", () => {
//         describe("when the id is valid", () => {
//             it("should return the owners pets", done => {
//                 request(server)
//                     .get(`/owners/${ownerValidID}/pets`)
//                     .set("Accept", "application/json")
//                     .expect("Content-Type", /json/)
//                     .expect(200)
//                     .end((err, res) => {
//                         try {
//                             expect(res.body.length).to.equal(2)
//                             let result = _.map(res.body, pet => {
//                                 return {
//                                     name: pet.name,
//                                     type: pet.type,
//                                     species: pet.species,
//                                     gender: pet.gender,
//                                     colour: pet.colour,
//                                     size: pet.size,
//                                     age: pet.age,
//                                     lastSeenAddress: pet.lastSeenAddress,
//                                 }
//                             })
//                             expect(result).to.deep.include({
//                                 name: "Tweety",
//                                 type: "Bird",
//                                 species: "Canary",
//                                 gender: "Female",
//                                 colour: "Yellow",
//                                 size: "0.2 meters",
//                                 age: "10 years",
//                                 lastSeenAddress: "5 High Street, Kilkenny",
//                             })
//                             done(err)
//                         } catch (e) {
//                             done(e)
//                         }
//                     })
//             })
//         })
//         describe("when the id is invalid", () => {
//             it("should return a 404 and a message for invalid owner id", () => {
//                 return request(server)
//                     .put("/owners/9999999/update")
//                     .expect(404)
//                     .expect({
//                         message: "Cannot find owner associated with that id"
//                     })
//             })
//         })
//     })
//     describe("GET /owners/:id/pets/total", () => {
//         it("should return total number of pets foor the owner passed in params", done => {
//             request(server)
//                 .get(`/owners/${ownerValidID}/pets/total`)
//                 .set("Accept", "application/json")
//                 .expect("Content-Type", /json/)
//                 .expect(200)
//                 .end((err, res) => {
//                     expect(res.body).to.have.property("total", 2)
//                     done(err)
//                 })
//         })
//     })
//     describe("when the id is invalid", () => {
//         it("should return a 404 and a message for invalid owner id", () => {
//             return request(server)
//                 .put("/owners/9999999/update")
//                 .expect(404)
//                 .expect({
//                     message: "Cannot find owner associated with that id"
//                 })
//         })
//     })
//     describe("POST /owners/:id/pets", () => {
//         it("should return a confirm message and update the database", () => {
//             const pet = {
//                 name: "Darkie",
//                 type: "Cat",
//                 species: "Persian Cat",
//                 gender: "Female",
//                 colour: "Black-Brown",
//                 size: "1 meter",
//                 age: "1 years",
//                 lastSeenAddress: "5 Green View, New Ross",
//                 ownerID: ownerValidID
//             }
//             return request(server)
//                 .post(`/owners/${ownerValidID}/pets`)
//                 .send(pet)
//                 .expect(200)
//                 .then(res => {
//                     expect(res.body.message).equal("Pet Added to database")
//                     petValidID = res.body.data._id
//                 })
//         })
//         after(() => {
//             return request(server)
//                 .get(`/pets/${petValidID}`)
//                 .expect(200)
//                 .then(res => {
//                     expect(res.body[0]).to.have.property("name", "Darkie")
//                     expect(res.body[0]).to.have.property("type", "Cat")
//                     expect(res.body[0]).to.have.property("ownerID", `${ownerValidID}`)
//                 })
//         })
//     })
//     describe("when the id is invalid", () => {
//         it("should return a 404 and a message for invalid owner id", () => {
//             return request(server)
//                 .put("/owners/9999999/update")
//                 .expect(404)
//                 .expect({
//                     message: "Cannot find owner associated with that id"
//                 })
//         })
//     })
// })