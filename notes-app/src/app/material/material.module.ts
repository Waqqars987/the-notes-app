import { NgModule } from '@angular/core';
import { MatButtonModule, MatGridListModule, MatListModule, MatDividerModule, MatToolbarModule, MatIconModule, MatMenuModule, MatTabsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTooltipModule } from '@angular/material';

const MaterialComponents = [
  MatButtonModule,
  MatGridListModule,
  MatListModule,
  MatDividerModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatTabsModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule
]

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
