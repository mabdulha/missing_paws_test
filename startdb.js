const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer
const dotenv = require("dotenv")
dotenv.config()
async function foo() {
    const mongod = new MongoMemoryServer({
        instance: {
            port: 27017, // by default choose any free port
            // eslint-disable-next-line no-undef
            dbName: process.env.MONGO_DB_NAME, //// by default generate random dbName
            dbPath: "./test/database"
        }
    })
    // eslint-disable-next-line no-console
    console.log(await mongod.getConnectionString()  )
}

foo()