import { environment } from './../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Note } from './notes.model';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

export interface NoteResponseData {
  success: boolean,
  data: {
    message?: string,
    _id?: string,
    lastEdited?: Date,
    notes?: Note[]
  }
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) { }

  private notes: Note[] = [];
  notesChanged = new Subject<Note[]>();

  addNote(note: Note) {

    let userData: { _id: string; email: string; } = JSON.parse(localStorage.getItem('userData'));
    return this.http.post<NoteResponseData>(environment.herokuServerUrl + "note",
      {
        userID: userData._id,
        ...note
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.notes.push(new Note(resData.data._id, note.title, note.description, resData.data.lastEdited));
          this.notesChanged.next(this.notes.slice());
        })
      );
  }

  getUserNotes() {
    let userData: { _id: string; email: string; } = JSON.parse(localStorage.getItem('userData'));
    return this.http.get<NoteResponseData>(
      environment.herokuServerUrl + 'notes',
      {
        params: {
          userID: userData._id
        }
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.notes = resData.data.notes;
          this.notesChanged.next(this.notes.slice());
        })
      );
  }

  updateNote(noteIndex: number, noteParams: any) {
    let userData: { _id: string; email: string; } = JSON.parse(localStorage.getItem('userData'));
    return this.http.patch<NoteResponseData>(environment.herokuServerUrl + "note",
      {
        userID: userData._id,
        ...noteParams
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.notes[noteIndex] = new Note(noteParams.noteID, noteParams.title, noteParams.description, resData.data.lastEdited);
          this.notesChanged.next(this.notes.slice());
        })
      );
  }

  deleteNote(noteIndex: number, noteID: string) {
    let userData: { _id: string; email: string; } = JSON.parse(localStorage.getItem('userData'));
    return this.http.delete<NoteResponseData>(environment.herokuServerUrl + "note",
      {
        params: {
          userID: userData._id,
          noteID: noteID
        }
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.notes.splice(noteIndex, 1);
          this.notesChanged.next(this.notes.slice());
        })
      );
  }

  private handleError(errorRes: HttpErrorResponse) {

    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.data) {
      return throwError(errorMessage);
    }
    errorMessage = errorRes.error.data.message;
    return throwError(errorMessage);
  }
}
