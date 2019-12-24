import { MatDialog, MatSnackBar } from '@angular/material';
import { Note } from './../../notes.model';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NotesService } from '../../notes.service';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { MessageComponent } from 'src/app/shared/message/message.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-note-item',
  templateUrl: './note-item.component.html',
  styleUrls: ['./note-item.component.css']
})
export class NoteItemComponent implements OnInit {

  @Input() note: Note;
  @Input() noteIndex: number;
  @ViewChild('updateNoteRef', { static: false }) updateNoteForm: NgForm;
  isEditMode = false;
  isSaving = false;

  constructor(private dialog: MatDialog, private notesService: NotesService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  onEdit() {
    this.isEditMode = true;
  }

  onSave() {
    if (this.updateNoteForm.invalid) {
      this.dialog.open(MessageComponent,
        { data: { error: true, message: "You are missing required inputs!" } }
      );
      return;
    }
    this.isSaving = true;
    this.notesService.updateNote(this.noteIndex,
      { noteID: this.note._id, title: this.note.title, description: this.note.description })
      .subscribe(
        resData => {
          this.isSaving = false;
          this.snackBar.open(resData.data.message, null,
            { duration: 2000, panelClass: ['mat-toolbar', 'mat-primary'] });
        },
        (errorMessage) => {
          this.isSaving = false;
          this.dialog.open(MessageComponent,
            { data: { error: false, message: errorMessage } }
          );
        });
  }

  onDelete() {
    let dialogRef = this.dialog.open(AlertComponent, {
      data:
      {
        confirmationMessage: "Continue to delete?",
        affirmative: "No",
        negative: "Yes"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (JSON.parse(result)) {
        this.notesService.deleteNote(this.noteIndex, this.note._id).subscribe(
          resData => {
            this.snackBar.open(resData.data.message, null,
              { duration: 2000, panelClass: ['mat-toolbar', 'mat-primary'] });
          },
          errorMessage => {
            this.dialog.open(MessageComponent,
              { data: { error: false, message: errorMessage } }
            );
          }
        )
      }
    });
  }

  onCancel() {
    this.isEditMode = false;
  }

}
