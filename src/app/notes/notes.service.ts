import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Note } from './notes.model';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface NoteResponseData {
  success: boolean,
  data: {
    message: string,
    _id?: string,
    lastEdited?: Date
  }
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) { }

  private notes: Note[] = [];
  
  addNote(note: Note) {

    let userData: { _id: string; email: string; } = JSON.parse(localStorage.getItem('userData'));
    //this.notes.push(new Note())
    this.http.post<NoteResponseData>("http://localhost:3000/note",
      {
        _id: userData._id,
        ...note
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          console.log(resData)
          console.log({...resData,...note})
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
