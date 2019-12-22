import { MaterialModule } from './shared/material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { NotesComponent } from './notes/notes.component';
import { NoteCreateComponent } from './notes/note-create/note-create.component';
import { NoteListComponent } from './notes/note-list/note-list.component';
import { NoteItemComponent } from './notes/note-list/note-item/note-item.component';
import { NoteEditComponent } from './notes/note-list/note-edit/note-edit.component';
import { AuthComponent } from './auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from './shared/alert/alert.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { MessageComponent } from './shared/message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NotesComponent,
    NoteCreateComponent,
    NoteListComponent,
    NoteItemComponent,
    NoteEditComponent,
    AuthComponent,
    AlertComponent,
    LoadingSpinnerComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AlertComponent,MessageComponent]
})
export class AppModule { }
