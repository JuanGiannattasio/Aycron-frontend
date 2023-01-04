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
        data-testId="confirm-modal-cancel"
        (click)="dialogRef.close(false)"
        style="flex: 1; margin-right: 1em; background-color: #bebebe; color: white;"
      >
        Cancel
      </button>
      <button
        mat-flat-button
        data-testId="confirm-modal-confirm"
        color="primary"
        (click)="dialogRef.close(true)"
        cdkFocusInitial
        style="flex: 1"
      >
        Confirm
      </button>
    </div>
  `,
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) { }

  ngOnInit(): void {
  }

}
