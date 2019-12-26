'use strict';
import mongoose from 'mongoose';
import Users from '../models/notesModel';
import { Response } from '../models/responseModel';
import { isFieldAcceptable } from '../utilities/inputValidator';
import { hashPassword, checkPassword } from '../utilities/hash';
// import { encrypt, decrypt } from '../utilities/encryption';

export const checkServer = (req, res) => {

    res.setHeader('Content-type', 'application/json');
    res.send(new Response(true, { message: "Node Server is running..." }));
};

export const registerUser = async (req, res) => {

    res.setHeader('Content-type', 'application/json');
    try {
        var email = isFieldAcceptable("email", req.body.email).toLowerCase();
        var password = await hashPassword(isFieldAcceptable("password", req.body.password));
    }
    catch (err) {
        console.error(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    const user = new Users({
        emailID: email,
        password: password
    });
    try {
        const savedUser = await user.save();
        res.send(new Response(true, { user: { _id: user._id, emailID: user.emailID } }));
    } catch (err) {
        console.error(err);
        res.status(406).send(new Response(false, { message: "Could Not Register User, Email already in use!" }));
    }
};

export const loginUser = async (req, res) => {

    res.setHeader('Content-type', 'application/json');
    try {
        var email = isFieldAcceptable("email", req.query.email).toLowerCase();
        var password = isFieldAcceptable("password", req.query.password);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    try {
        const user = await Users.findOne(
            { emailID: email },
            { emailID: true, password: true }
        );
        if (user === null) {
            return res.status(404).send(new Response(false, { message: "Incorrect Email ID!" }));
        }
        else {
            let result = await checkPassword(password, user.password);
            if (!result) {
                return res.status(401).send(new Response(false, { message: "Incorrect Password!" }));
            }
            else {
                res.send(new Response(true, { user: { _id: user._id, emailID: user.emailID } }));
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

export const addNote = async (req, res) => {

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
    try {
        const newId = new mongoose.Types.ObjectId();
        const note = {
            _id: newId,
            title: title,
            description: description,
            lastEdited: Date.now()
        };
        const result = await Users.updateOne(
            { _id: userID },
            { $push: { notes: note } }
        );
        res.send(new Response(true,
            { message: "Note Added Successfully!", _id: newId, lastEdited: note.lastEdited }));
    } catch (err) {
        console.error(err);
        res.status(400).send(new Response(false, "Could Not Add Note, check User ID!"));
    }
};

export const updateNote = async (req, res) => {

    res.setHeader('Content-type', 'application/json');
    try {
        var userID = isFieldAcceptable("User ID", req.body.userID);
        var noteID = isFieldAcceptable("Note ID", req.body.noteID);
        var title = isFieldAcceptable("Title", req.body.title);
        var description = isFieldAcceptable("Description", req.body.description);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    try {
        let lastEdited = Date.now();
        const result = await Users.updateOne(
            { "_id": userID, "notes._id": noteID },
            {
                "$set": {
                    "notes.$.title": title,
                    "notes.$.description": description,
                    "notes.$.updated": lastEdited
                }
            }
        );
        if (result.nModified > 0) {
            res.send(new Response(true,
                { message: "Note Updated Successfully!", _id: noteID, lastEdited: lastEdited }));
        }
        else {
            res.status(404).send(new Response(false, { message: "Incorrect Note/User ID!" }));
        }

    } catch (err) {
        console.log(err);
        res.status(500).send(new Response(false, "Could Not Update Note!"))
    }
};

export const deleteNote = async (req, res) => {

    res.setHeader('Content-type', 'application/json');
    try {
        var userID = isFieldAcceptable("User ID", req.query.userID);
        var noteID = isFieldAcceptable("Note ID", req.query.noteID);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    try {
        const result = await Users.updateOne(
            { '_id': userID },
            { $pull: { "notes": { "_id": noteID } } },
        );
        if (result.nModified > 0) {
            res.send(new Response(true, { message: "Note Deleted Successfully!" }))
        }
        else {
            res.status(404).send(new Response(false, { message: "Incorrect Note/User ID!" }))
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(new Response(false, "Could Not Delete Note!"))
    }
};

export const viewNote = async (req, res) => {

    res.setHeader('Content-type', 'application/json');
    try {
        var userID = isFieldAcceptable("User ID", req.query.userID);
        var noteID = isFieldAcceptable("Note ID", req.query.noteID);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    try {
        const result = await Users.findOne(
            { _id: userID },
            {
                notes:
                {
                    $elemMatch:
                    {
                        _id: noteID
                    }
                }
            }
        );
        if (result === null) {
            return res.status(404).send(new Response(false, { message: "Incorrect User ID!" }));
        }
        else if (result.notes.length === 0) {
            return res.status(404).send(new Response(false, { message: "Incorrect Note ID!" }));
        }
        else {
            res.send(new Response(true, result.notes[0]));
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

export const viewUserNotes = async (req, res) => {

    res.setHeader('Content-type', 'application/json');
    try {
        var userID = isFieldAcceptable("User ID", req.query.userID);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send(new Response(false, err.toString().split(":")[1].trim()));
    }
    try {
        const result = await Users.findOne(
            { _id: userID },
            { notes: true }
        );
        if (result === null) {
            return res.status(404).send(new Response(false, { message: "No Notes Found for the given User ID!" }));
        }
        else {
            res.send(new Response(true, { notes: result.notes }));
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};
