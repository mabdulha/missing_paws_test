const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const Owner = require("../../models/owners");
const mongoose = require("mongoose");

const _ = require("lodash");
let server;
let mongod;
let db;
let validID;
let conn;

describe("Owners", () => {
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
      await Owner.deleteMany({});
      let owner = new Owner();
      owner.firstname = "Mozeeb";
      owner.lastname = "Abdulha";
      owner.phoneNum = "0897456321";
      owner.email = "ma@gmail.com"
      await owner.save();
      owner = new Owner();
      owner.firstname = "Jack";
      owner.lastname = "Dolan";
      owner.phoneNum = "0836598741";
      owner.email = "jd@gmail.com"
      await owner.save();
      owner = await Owner.findOne({
        firstname: "Mozeeb"
      });
      validID = owner._id;
    } catch (error) {
      console.log(error);
    }
  });
  //TODO
});