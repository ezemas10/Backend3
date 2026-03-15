import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

import mocksRouter from "./routes/mocks.router.js";


import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT||8080;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME
    });
    console.log("DB online...!!!");
  } 
  catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const options={
    definition: {
        openapi: "3.0.0", 
        info: {
            title: "API Adoptme Users", 
            version: "1.0.0", 
            description: "Documentacion API Adoptme Users"
        },
        servers: [
          {
            url: 'http://localhost:8081',
          },
        ],
    },
    apis: ["./src/docs/*.yaml"],
}

const spec=swaggerJSDoc(options)


app.use("/documentacion", swaggerUI.serve, swaggerUI.setup(spec))


app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

app.use("/api/mocks", mocksRouter);

app.get("/", (req, res) => {
  
    res.status(200).send("ok");

})


connectDB()


export const server = app.listen(PORT, ()=> {console.log(`http://localhost:${PORT} Server running on port ${PORT}`)})


