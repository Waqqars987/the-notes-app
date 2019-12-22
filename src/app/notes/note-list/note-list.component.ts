import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Note } from '../notes.model';
import { NotesService } from '../notes.service';
import { MessageComponent } from 'src/app/shared/message/message.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit, OnDestroy {

  isLoading = false;
  notes: Note[];
  subscription: Subscription;

  constructor(private notesService: NotesService, private dialog: MatDialog, ) { }

  ngOnInit() {

    this.isLoading = true;

    this.subscription = this.notesService.notesChanged.subscribe(
      (notes: Note[]) => {
        this.notes = notes;
      }
    );

    this.notesService.getUserNotes().subscribe(
      (resData) => {
        this.isLoading = false;
        this.notes = resData.data.notes;
      },
      (errorMessage) => {
        this.isLoading = false;
        this.dialog.open(MessageComponent,
          { data: { error: false, message: errorMessage } }
        );
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}