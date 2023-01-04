import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ChooseDialogComponent } from './choose-dialog/choose-dialog.component';



@NgModule({
  declarations: [
    ConfirmDialogComponent,
    ChooseDialogComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [
    ConfirmDialogComponent,
    ChooseDialogComponent
  ]
})
export class ComponentsModule { }
