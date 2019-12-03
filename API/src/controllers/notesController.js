import mysql from 'mysql';
import config from 'config';
import { isFieldAcceptable } from '../utilities/inputValidator';
import { Response } from '../models/notesModel';
const dbConfig = config.get('dbConfig');

export const registerUser = (req, res) => {

    res.setHeader('Content-type', 'application/json');
    try {
        var email = isFieldAcceptable("email", req.body.email).toLowerCase();
        var password = isFieldAcceptable("password", req.body.password);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL Register(?,?)`;
    connection.query(sql, [email, password], (error, results, fields) => {
        if (error) {
            return res.status(400).send(new Response(false, "Email ID Already Registered!"));
        }
        else {
            res.send(new Response(true, "User Registered!"));
        }
    });
    connection.end();
};

export const loginUser = (req, res) => {

    console.log("Login API Called");
    res.setHeader('Content-type', 'application/json');
    try {
        var email = isFieldAcceptable("email", req.query.email).toLowerCase();
        var password = isFieldAcceptable("password", req.query.password);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL Login(?,?)`;
    connection.query(sql, [email, password], (error, results, fields) => {
        if (error) {
            return res.status(500).send(new Response(false, error.message));
        }
        else if (results[0].length === 0) {
            return res.status(404).send(new Response(false, "Incorrect Email ID or Password!"));
        }
        else {
            results[0][0]["userID"] = results[0][0]["user_id"];
            delete results[0][0]["user_id"];
            res.send(new Response(true, results[0][0]));
        }
    });
    connection.end();
};

export const addNote = (req, res) => {

    console.log("Add Note API Called");
    res.setHeader('Content-type', 'application/json');
    try {
        var userID = isFieldAcceptable("User ID", req.body.userID);
        var title = isFieldAcceptable("Title", req.body.title);
        var description = isFieldAcceptable("Description", req.body.description);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL AddNote(?,?,?)`;
    connection.query(sql, [userID, title, description], (error, results, fields) => {
        if (error) {
            return res.status(500).send(new Response(false, "Could Not Add Note!"));
        }
        else {
            res.send(new Response(true, "Note Added Successfully!"))
        }
    });
    connection.end();
};

export const updateNote = (req, res) => {
    console.log("Update Note API Called");
    res.setHeader('Content-type', 'application/json');
    try {
        var noteID = isFieldAcceptable("Note ID", req.body.noteID);
        var title = isFieldAcceptable("Title", req.body.title);
        var description = isFieldAcceptable("Description", req.body.description);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL UpdateNote(?,?,?)`;
    connection.query(sql, [noteID, title, description], (error, results, fields) => {
        if (error) {
            return res.status(500).send(new Response(false, "Could Not Update Note!"));
        }
        else if (results.affectedRows === 0) {
            return res.status(404).send(new Response(false, "Note Does Not Exist!"));
        }
        else {
            res.send(new Response(true, "Note Updated Successfully!"));
        }
    });
    connection.end();
};

export const deleteNote = (req, res) => {
    console.log("Delete Note API Called");
    res.setHeader('Content-type', 'application/json');
    try {
        var noteID = isFieldAcceptable("Note ID", req.body.noteID);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL DeleteNote(?)`;
    connection.query(sql, [noteID], (error, results, fields) => {
        if (error) {
            return res.status(500).send(new Response(false, "Could Not Delete Note!"));
        }
        else if (results.affectedRows === 0) {
            return res.status(404).send(new Response(false, "Note Does Not Exist!"));
        }
        else {
            res.send(new Response(true, "Note Deleted Successfully!"));
        }
    });
    connection.end();
};

export const viewNote = (req, res) => {
    console.log("View Note API Called");
    res.setHeader('Content-type', 'application/json');
    try {
        var noteID = isFieldAcceptable("Note ID", req.query.noteID);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL ViewNote(?)`;
    connection.query(sql, [noteID], (error, results, fields) => {
        if (error) {
            return res.status(500).send(new Response(false, error.message));
        }
        else if (results[0].length === 0) {
            return res.status(404).send(new Response(false, "Incorrect Note ID!"));

        }
        else {
            results[0][0]["userID"] = results[0][0]["user_id"];
            results[0][0]["noteID"] = results[0][0]["note_id"];
            results[0][0]["created"] = results[0][0]["created"].toISOString().replace("T", " ").replace("Z", "");
            results[0][0]["updated"] = (results[0][0]["updated"] !== null) ? results[0][0]["updated"].toISOString().replace("T", " ").replace("Z", "") : "N/A";
            delete results[0][0]["user_id"];
            delete results[0][0]["note_id"];
            res.send(new Response(true, results[0][0]));
        }
    });
    connection.end();
};

export const viewUserNotes = (req, res) => {

    console.log("View User Notes API Called");
    res.setHeader('Content-type', 'application/json');
    try {
        var userID = isFieldAcceptable("User ID", req.query.userID);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL ViewUserNotes(?)`;
    connection.query(sql, [userID], (error, results, fields) => {
        if (error) {
            return res.status(500).send(new Response(false, error.message));
        }
        else if (results[0].length === 0) {
            return res.status(404).send(new Response(false, "No Notes Found for the given User ID!"));
        }
        else {
            for (let index = 0; index < results[0].length; index++) {
                results[0][index]["userID"] = results[0][index]["user_id"];
                results[0][index]["noteID"] = results[0][index]["note_id"];
                results[0][index]["created"] = results[0][index]["created"].toISOString().replace("T", " ").replace("Z", "");
                results[0][index]["updated"] = (results[0][index]["updated"] !== null) ? results[0][index]["updated"].toISOString().replace("T", " ").replace("Z", "") : "N/A";
                delete results[0][index]["user_id"];
                delete results[0][index]["note_id"];
            }
            res.send(new Response(true, results[0]));
        }
    });
    connection.end();
};