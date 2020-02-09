'use strict';
import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import { routes } from './routes/notesRoute'
const app = express();
const PORT = process.env.PORT || 8080;

const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: 300000,
    connectTimeoutMS: 30000
};

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
        console.log(`Successfully Connected to DB!`);
    } catch (err) {
        console.log(`Error Connecting to DB!\n${err}`);
    }
}
connectToDB();

app.set("json spaces", 0);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

routes(app);

app.listen(PORT, function () {
    console.log(`Node Server is Listening on Port ${PORT}`);
});
