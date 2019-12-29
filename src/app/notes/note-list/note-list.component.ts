import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Note } from '../notes.model';
import { NotesService } from '../notes.service';
import { MessageComponent } from 'src/app/shared/message/message.component';
import { MatDialog, PageEvent } from '@angular/material';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit, OnDestroy {

  isLoading = false;
  notes: Note[] = [];
  totalNotes: number;
  notesPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];
  subscription: Subscription;

  constructor(private notesService: NotesService, private dialog: MatDialog) { }

  ngOnInit() {

    this.subscription = this.notesService.notesChanged.subscribe(
      (notesData: { notes: Note[], notesCount: number }) => {
        this.notes = notesData.notes;
        this.totalNotes = notesData.notesCount;
      });

    this.fetchNotes();
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.notesPerPage = pageData.pageSize;
    this.fetchNotes();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private fetchNotes() {
    this.isLoading = true;
    this.notesService.getUserNotes(this.notesPerPage, this.currentPage).subscribe(
      (resData) => {
        this.isLoading = false;
        this.notes = resData.data.notes;
        this.totalNotes = resData.data.maxNotes;
      },
      (errorMessage) => {
        this.isLoading = false;
        this.dialog.open(MessageComponent,
          { data: { error: false, message: errorMessage } }
        );
      });
  }
}