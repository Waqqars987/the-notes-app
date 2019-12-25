import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material/material.module';
import { MessageComponent } from './message/message.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AlertComponent } from './alert/alert.component';

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        MessageComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        AlertComponent,
        LoadingSpinnerComponent,
        MessageComponent,
        CommonModule,
        MaterialModule
    ],
    entryComponents: [AlertComponent, MessageComponent]
})
export class SharedModule { }