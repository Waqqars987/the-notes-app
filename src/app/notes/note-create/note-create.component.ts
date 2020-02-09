import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageComponent } from 'src/app/shared/message/message.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotesService } from '../notes.service';

@Component({
  selector: 'app-note-create',
  templateUrl: './note-create.component.html',
  styleUrls: ['./note-create.component.css']
})
export class NoteCreateComponent implements OnInit {

  isSaving = false;
  @ViewChild('noteRef') noteForm: NgForm;

  constructor(private dialog: MatDialog, private notesService: NotesService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  addNote(noteForm: NgForm) {
    if (noteForm.invalid) {
      this.dialog.open(MessageComponent,
        { data: { error: true, message: "You are missing required inputs!" } }
      );
      return;
    }
    this.isSaving = true;
    this.notesService.addNote(noteForm.value).subscribe(
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
      this.onClear();
  }

  onClear() {
    this.noteForm.resetForm();
  }
}
