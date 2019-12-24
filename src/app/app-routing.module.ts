import { AuthComponent } from './auth/auth.component';
import { NotesComponent } from './notes/notes.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ErrorPageComponent } from './error-page/error-page.component';


const routes: Routes = [
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
  {
    path: 'notes',
    component: NotesComponent,
    canActivate: [AuthGuard],
  },
  { path: 'auth', component: AuthComponent },
  { path: 'not-found', component: ErrorPageComponent, data: { message: 'Page Not Found!' } },
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
