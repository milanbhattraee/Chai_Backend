import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/db.js";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { app } from "./app.js";


dotenv.config({
  path: "./env",
});


app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 7000, () => {
      console.log(`server is running on port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("database connection failed:", error);
  });

/*
import express from "express";
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("errror",(error)=>{
        console.error("Error: ",error);
        throw error;
    })

    app.listen(process.env.PORT,()=>{
        console.log(`app is listening on port ${process.env.PORT}`);
    })

  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
})();
*/
