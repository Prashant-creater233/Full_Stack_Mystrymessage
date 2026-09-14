import mongoose from "mongoose";


type ConnctionObject = {
    isConnected?: number
}

const connection: ConnctionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");  // sabse phele check krna ha ki daatbase already connect to nhi ha na
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})  // nhi ha to connect kr diya

        connection.isConnected = db.connections[0].readyState

        console.log("DB Connected Successfully");

        // console.log(db)
        // console.log(db.connections)

    } catch (error) {
        console.log("Database connection failed", error)

        process.exit(1)
    }
}

export default dbConnect;