'use strict';
import {
    registerUser,
    loginUser,
    addNote,
    updateNote,
    deleteNote,
    viewNote,
    viewUserNotes
} from '../controllers/notesController'

export const routes = (app) => {

    app.route('/user')
        //register a new user
        .post(registerUser)
        //login an existing user
        .get(loginUser)

    app.route('/note')
        //add a new note
        .post(addNote)
        //update an existing note
        .patch(updateNote)
        //delete an existing note
        .delete(deleteNote)
        //view an existing note
        .get(viewNote)

    app.route('/notes')
        //view all notes for a given user
        .get(viewUserNotes)

}