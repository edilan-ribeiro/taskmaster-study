import mongoose from 'mongoose';

const uri = process.env.DATABASE_CONNECTION

let activeConnection = false

async function dbConnection() {
    if(activeConnection) return mongoose;

    try {
        await mongoose.connect(uri|| "")
        console.log("Database connected")
        activeConnection = true
    } catch(err) {
        console.error("Error connecting to database: ", err)
    }
}


export default dbConnection