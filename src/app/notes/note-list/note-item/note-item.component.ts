import { MatDialog, MatSnackBar } from '@angular/material';
import { Note } from './../../notes.model';
import { Component, OnInit, Input } from '@angular/core';
import { NotesService } from '../../notes.service';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { MessageComponent } from 'src/app/shared/message/message.component';

@Component({
  selector: 'app-note-item',
  templateUrl: './note-item.component.html',
  styleUrls: ['./note-item.component.css']
})
export class NoteItemComponent implements OnInit {

  @Input() note: Note;
  @Input() noteIndex: number;
  isEditMode = false;

  constructor(private dialog: MatDialog, private notesService: NotesService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  onEdit() {
    this.isEditMode = true;
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
            this.snackBar.open(resData.data.message, null, { duration: 2000, panelClass: ['mat-toolbar', 'mat-primary'] });
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
