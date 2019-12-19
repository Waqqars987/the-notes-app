'use strict';
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
        console.error(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL Register(?,?)`;
    connection.query(sql, [email, password], (error, results, fields) => {
        if (error) {
            return res.status(406).send(new Response(false, { message: "Could Not Register User, Email might be already registered!" }));
        }
        else {
            res.send(new Response(true, { message: "User Registered Successfully!" }));
        }
    });
    connection.end();
};

export const loginUser = (req, res) => {

    res.setHeader('Content-type', 'application/json');
    try {
        var email = isFieldAcceptable("email", req.query.email).toLowerCase();
        var password = isFieldAcceptable("password", req.query.password);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL Login(?,?)`;
    connection.query(sql, [email, password], (error, results, fields) => {
        if (error) {
            return res.status(500).send(new Response(false, { message: error.message }));
        }
        else if (results[0].length === 0) {
            return res.status(404).send(new Response(false, { message: "Incorrect Email ID or Password!" }));
        }
        else {
            res.send(new Response(true, results[0][0]));
        }
    });
    connection.end();
};

export const addNote = (req, res) => {

    res.setHeader('Content-type', 'application/json');
    try {
        var userID = isFieldAcceptable("User ID", req.body.userID);
        var title = isFieldAcceptable("Title", req.body.title);
        var description = isFieldAcceptable("Description", req.body.description);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL AddNote(?,?,?)`;
    connection.query(sql, [userID, title, description], (error, results, fields) => {
        if (error) {
            return res.status(500).send(new Response(false, { message: "Could Not Add Note!" }));
        }
        else {
            res.send(new Response(true, { message: "Note Added Successfully!" }));
        }
    });
    connection.end();
};

export const updateNote = (req, res) => {

    res.setHeader('Content-type', 'application/json');
    try {
        var noteID = isFieldAcceptable("Note ID", req.body.noteID);
        var title = isFieldAcceptable("Title", req.body.title);
        var description = isFieldAcceptable("Description", req.body.description);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL UpdateNote(?,?,?)`;
    connection.query(sql, [noteID, title, description], (error, results, fields) => {
        if (error) {
            return res.status(500).send(new Response(false, { message: "Could Not Update Note!" }));
        }
        else if (results.affectedRows === 0) {
            return res.status(404).send(new Response(false, { message: "Note Does Not Exist!" }));
        }
        else {
            res.send(new Response(true, { message: "Note Updated Successfully!" }));
        }
    });
    connection.end();
};

export const deleteNote = (req, res) => {

    res.setHeader('Content-type', 'application/json');
    try {
        var noteID = isFieldAcceptable("Note ID", req.body.noteID);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL DeleteNote(?)`;
    connection.query(sql, [noteID], (error, results, fields) => {
        if (error) {
            return res.status(500).send(new Response(false, { message: "Could Not Delete Note!" }));
        }
        else if (results.affectedRows === 0) {
            return res.status(404).send(new Response(false, { message: "Note Does Not Exist!" }));
        }
        else {
            res.send(new Response(true, { message: "Note Deleted Successfully!" }));
        }
    });
    connection.end();
};

export const viewNote = (req, res) => {

    res.setHeader('Content-type', 'application/json');
    try {
        var noteID = isFieldAcceptable("Note ID", req.query.noteID);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL ViewNote(?)`;
    connection.query(sql, [noteID], (error, results, fields) => {
        if (error) {
            return res.status(500).send(new Response(false, { message: error.message }));
        }
        else if (results[0].length === 0) {
            return res.status(404).send(new Response(false, { message: "Incorrect Note ID!" }));

        }
        else {
            res.send(new Response(true, results[0][0]));
        }
    });
    connection.end();
};

export const viewUserNotes = (req, res) => {

    res.setHeader('Content-type', 'application/json');
    try {
        var userID = isFieldAcceptable("User ID", req.query.userID);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    let connection = mysql.createConnection(dbConfig);
    let sql = `CALL ViewUserNotes(?)`;
    connection.query(sql, [userID], (error, results, fields) => {
        if (error) {
            return res.status(500).send(new Response(false, { message: error.message }));
        }
        else if (results[0].length === 0) {
            return res.status(404).send(new Response(false, { message: "No Notes Found for the given User ID!" }));
        }
        else {
            res.send(new Response(true, results[0]));
        }
    });
    connection.end();
};