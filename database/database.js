import dotenv from "dotenv"
dotenv.config();
import mongoose from "mongoose"

// connetcting to MongoDB database
try {
    const connection = mongoose.connection;
    connection.once("open", () => {
      console.log("MongoDB datebase connection established successfully.");
    });
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useUnifiedTopology: true,
    });
    console.log("connected to database");
  } catch (err) {
    console.log(err);
  }
