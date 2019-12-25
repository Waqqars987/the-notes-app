'use strict';
import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import { routes } from './src/routes/notesRoute'
const app = express();
const PORT = process.env.PORT || 8080;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_CONNECTION, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: 300000,
    connectTimeoutMS: 30000
});

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