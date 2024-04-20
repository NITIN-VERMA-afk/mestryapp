import mongoose, { Connection } from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const conncection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (conncection.isConnected) {
    console.log("Already connected to db");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '');

    console.log(db);
    conncection.isConnected = db.connections[0].readyState;
    console.log("DB connection Sucessfully");
  } catch (error) {

    console.log("databse connection failed",error)
    process.exit(1);
  }
}

export default dbConnect;
