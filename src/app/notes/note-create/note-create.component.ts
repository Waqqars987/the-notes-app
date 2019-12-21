import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageComponent } from 'src/app/shared/message/message.component';
import { MatDialog } from '@angular/material';
import { NotesService } from '../notes.service';

@Component({
  selector: 'app-note-create',
  templateUrl: './note-create.component.html',
  styleUrls: ['./note-create.component.css']
})
export class NoteCreateComponent implements OnInit {

  isSaving = false;
  isSaved = false;
  @ViewChild('noteRef', { static: false }) noteForm: NgForm;

  constructor(private dialog: MatDialog,private notesService:NotesService) { }

  ngOnInit() {
  }

  addNote(noteForm: NgForm) {
    if (noteForm.invalid) {
      this.dialog.open(MessageComponent,
        { data: { error: true, message: "You are missing required inputs!" } }
      );
      return;
    }
    this.notesService.addNote(noteForm.value);
  }

  onClear(){
    this.noteForm.reset();
  }


    // setTimeout(()=>{
    //   this.isSaving=false;
    //   this.isSaved=true;
    //   setTimeout(()=>{
    //     this.isSaved=false},1000)
    // },2000)

}
