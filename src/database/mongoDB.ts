import mongoose from "mongoose";
import dotenv from "dotenv";
import { ServerApiVersion } from "mongodb";

dotenv.config();

type MongoDBType = string | undefined;
const MONGODB_KEY: MongoDBType = process.env.MONGODB_KEY;

interface connectTypes {}

const mongoDbConnection = async () => {
  if (MONGODB_KEY === undefined) {
    console.log("mongoose key not set");
  } else {
    console.log("connected to the database");
    mongoose.set("strictQuery", true);
    return await mongoose.connect(MONGODB_KEY, <connectTypes>{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
  }
};

export default mongoDbConnection;
