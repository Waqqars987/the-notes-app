import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Note } from './../../notes.model';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { NotesService } from '../../notes.service';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { MessageComponent } from 'src/app/shared/message/message.component';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-note-item',
	templateUrl: './note-item.component.html',
	styleUrls: [ './note-item.component.css' ]
})
export class NoteItemComponent implements OnInit, OnDestroy {
	@Input() note: Note;
	@Input() noteIndex: number;
	notesPerPage: number;
	currentPage: number;
	@ViewChild('updateNoteRef') updateNoteForm: NgForm;
	isEditMode = false;
	isSaving = false;
	isDeleting = false;
	subscription: Subscription;

	constructor (private dialog: MatDialog, private notesService: NotesService, private snackBar: MatSnackBar) {}

	ngOnInit () {
		this.subscription = this.notesService.paginatorParams.subscribe((paginatorData) => {
			this.notesPerPage = paginatorData.notesPerPage;
			this.currentPage = paginatorData.currentPage;
		});
	}

	onEdit () {
		this.isEditMode = true;
	}

	onSave () {
		if (this.updateNoteForm.invalid) {
			this.dialog.open(MessageComponent, { data: { error: true, message: 'You are missing required inputs!' } });
			return;
		}
		this.isSaving = true;
		this.notesService
			.updateNote(this.noteIndex, {
				noteID: this.note._id,
				title: this.note.title,
				description: this.note.description
			})
			.subscribe(
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
	}

	onDelete () {
		let dialogRef = this.dialog.open(AlertComponent, {
			data: {
				confirmationMessage: 'Continue to delete?',
				affirmative: 'No',
				negative: 'Yes'
			}
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (JSON.parse(result)) {
				this.isDeleting = true;
				this.notesService.deleteNote(this.note._id, this.notesPerPage, this.currentPage).subscribe(
					(resData) => {
						this.isDeleting = false;
						this.snackBar.open(resData.data.message, null, {
							duration: 3000,
							panelClass: [ 'mat-toolbar', 'mat-primary' ]
						});
					},
					(errorMessage) => {
						this.dialog.open(MessageComponent, { data: { error: false, message: errorMessage } });
					}
				);
			}
		});
	}

	onCancel () {
		this.isEditMode = false;
	}

	ngOnDestroy () {
		this.subscription.unsubscribe();
	}
}
