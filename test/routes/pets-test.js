const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const Pet = require("../../models/pets");
const mongoose = require("mongoose");

const _ = require("lodash");
let server;
let mongod;
let db;
let validID;
let conn;

describe("Pets", () => {
  before(async () => {
    try {
      mongod = new MongoMemoryServer({
        instance: {
          port: 27017,
          dbPath: "./test/database",
          dbName: "missing_paws_test_db" // by default generate random dbName
        }
      });
      // Async Trick - this ensures the database is created before 
      // we try to connect to it or start the server
      await mongod.getConnectionString();

      conn = mongoose.createConnection("mongodb://localhost:27017/missing_paws_test_db", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      server = require("../../bin/www");
      db = mongoose.connection;
    } catch (error) {
      console.log(error);
    }
  });

  after(async () => {
    try {
      // was having alot of trouble with this solution found here
      // https://mongoosejs.com/docs/api.html#connection_Connection-dropDatabase
      await conn.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });

  beforeEach(async () => {
    try {
      await Pet.deleteMany({});
      let pet = new Pet();
      pet.name = "Charlie";
      pet.type = "Dog";
      pet.species = "Pitbull";
      pet.gender = "Male";
      pet.colour = "black";
      pet.size = "2 meters";
      pet.age = "5 years",
        pet.lastSeenAddress = "12 Walking Street, Waterford";
      pet.missing = true;
      pet.ownerID = "5db4bbff17b11a286ca06200";
      await pet.save();
      pet = new Pet();
      pet.name = "Tweety";
      pet.type = "Bird";
      pet.species = "Canary";
      pet.gender = "Female";
      pet.colour = "Yellow";
      pet.size = "0.2 meters";
      pet.age = "10 years",
        pet.lastSeenAddress = "5 High Street, Kilkenny";
      pet.missing = false;
      pet.ownerID = "5db4bbff17b11a286ca061ff";
      await pet.save();
      pet = await Pet.findOne({
        name: "Tweety"
      });
      validID = pet._id;
    } catch (error) {
      console.log(error);
    }
  });
  //TODO
});