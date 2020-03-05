import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageComponent } from 'src/app/shared/message/message.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotesService } from '../notes.service';

@Component({
	selector: 'app-note-create',
	templateUrl: './note-create.component.html',
	styleUrls: [ './note-create.component.css' ]
})
export class NoteCreateComponent implements OnInit, OnDestroy {
	isSaving = false;
	subscription: Subscription;
	notesPerPage: number;
	currentPage: number;
	@ViewChild('noteRef') noteForm: NgForm;

	constructor (private dialog: MatDialog, private notesService: NotesService, private snackBar: MatSnackBar) {}

	ngOnInit () {
		this.subscription = this.notesService.paginatorParams.subscribe((paginatorData) => {
			if (paginatorData) {
				this.notesPerPage = paginatorData.notesPerPage;
				this.currentPage = paginatorData.currentPage;
			}
		});
	}

	addNote (noteForm: NgForm) {
		if (noteForm.invalid) {
			this.dialog.open(MessageComponent, { data: { error: true, message: 'You are missing required inputs!' } });
			return;
		}
		this.isSaving = true;
		this.notesService.addNote(noteForm.value, this.notesPerPage, this.currentPage).subscribe(
			(resData) => {
				this.isSaving = false;
				this.snackBar.open(resData.data.message, null, {
					duration: 2000,
					panelClass: [ 'mat-toolbar', 'mat-primary' ]
				});
			},
			(errorMessage) => {
				this.isSaving = false;
				this.dialog.open(MessageComponent, { data: { error: false, message: errorMessage } });
			}
		);
		this.onClear();
	}

	onClear () {
		this.noteForm.resetForm();
	}

	ngOnDestroy () {
		this.subscription.unsubscribe();
	}
}
