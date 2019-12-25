import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { NotesComponent } from './notes.component';
import { NoteCreateComponent } from './note-create/note-create.component';
import { NoteListComponent } from './note-list/note-list.component';
import { NoteItemComponent } from './note-list/note-item/note-item.component';
import { AuthGuard } from '../auth/auth.guard';

@NgModule({
    declarations: [
        NotesComponent,
        NoteCreateComponent,
        NoteListComponent,
        NoteItemComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: NotesComponent, canActivate: [AuthGuard] }
        ]),
        SharedModule,
        FormsModule
    ]
})
export class NotesModule { }