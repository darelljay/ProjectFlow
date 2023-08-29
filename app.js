import dotenv from "dotenv"
dotenv.config();
import express from "express";
import bodyParser  from "body-parser";
import './database.js';
import cors from "cors";
import helmet from "helmet";
import router from "./routes/route.js";
import session from 'express-session';
import MongoStore from "connect-mongo";
import authRoute from "./routes/authRoute.js";

const app = express();

// Parse the requested body 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set Route


// setting cros  
app.use(cors({
  origin: 'https://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS']
}));

// setting security headers 
app.use(helmet());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl:process.env.DB_URL})
}));
app.use("/",router);
app.use("/autherized",authRoute);
app.set("port", process.env.PORT);

app.listen(app.get('port'),()=>{  
    console.log(`server is runnig on port ${process.env.PORT}`);
});