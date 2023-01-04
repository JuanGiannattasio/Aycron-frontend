import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogData } from 'src/app/pages/dashboard/dashboard.component';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
      <h3 [innerHTML]="data.body" style="font-weight: 400;"></h3>
    </div>
    <div mat-dialog-actions style="display: flex; flex-direction: row; align-items: flex-end;">
      <button
        mat-flat-button
        data-testId="confirm-modal-Archivo-Subido"
        (click)="dialogRef.close(false)"
        style="flex: 1;"
        color="primary"
      >
        Uploaded file
      </button>
      <button
        mat-flat-button
        data-testId="confirm-modal-confirm"
        color="primary"
        (click)="dialogRef.close(true)"
        cdkFocusInitial
        style="flex: 1"
      >
        PDF of the table
      </button>
    </div>
  `,
})
export class ChooseDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChooseDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) { }

  ngOnInit(): void {
  }

}
