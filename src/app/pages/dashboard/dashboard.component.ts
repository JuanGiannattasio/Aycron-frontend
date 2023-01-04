import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WarehouseService } from '../../services/warehouse.service';
import { WarehouseInterface } from '../../models/warehouse.model';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import autotable from 'jspdf-autotable';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChooseDialogComponent } from '../../components/choose-dialog/choose-dialog.component';
import { UserService } from '../../services/user.service';

export interface ConfirmDialogData {
  title: string,
  body: string,
  uid?: string
}

export interface ChooseDialogData {
  title: string,
  body: string,
  uid?: string
}

const base_url = environment.base_url;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild('table') table!: ElementRef;

  public inputForm: string = '';
  public warehouseData: WarehouseInterface[] = [];
  public displayedColumns: string[] = ['code', 'name', 'address', 'state', 'country', 'zip', 'actions'];

  private onDestroy = new Subject<void>();

  constructor( 
    private warehouseService: WarehouseService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    public userService: UserService
  ) { }
  
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses() {
    this.warehouseService.getWarehouseWithoutLimit().pipe(
      catchError(err => {
        this.toastr.error(err.error.msg, 'Error');
        return of(null);
      }),
      takeUntil(this.onDestroy)
    ).subscribe((resp: {ok: boolean, warehouses: WarehouseInterface[]} | null) => {
      if (resp && resp.ok === true) {
        this.warehouseData = resp.warehouses;
      }
    })
  }

  deleteWarehouse(warehouse: WarehouseInterface) {
    
    const body: string = `Do you want to delete the warehouse ${warehouse.name}?`;
    const title: string = 'Confirm';
    
    this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
      minWidth: '30vw',
      minHeight: '100px',
      data: {title, body}
    }).afterClosed()
    .subscribe(resp => {
      if (resp === true) {
        this.warehouseService.deleteWarehouse(warehouse.uid as string).pipe(
          takeUntil(this.onDestroy),
          catchError(err => {
            this.toastr.error('Error', err.error.msg)
            return of(null);
          })
        ).subscribe((resp: {ok: boolean, msg: string} | null) => {
          if (resp && resp.ok === true) {
            this.toastr.success(resp.msg, 'Success!');
            this.loadWarehouses();
          }
        })
      }
    })
  }

  downloadFile(warehouse: WarehouseInterface) {
    const title = 'Atention!';
    const body = 'Do you want to download a PDF of the table or the file uploaded on the DB?';

    this.dialog.open<ChooseDialogComponent, ChooseDialogData, boolean>(ChooseDialogComponent, {
      minWidth: '30vw',
      minHeight: '100px',
      data: {title, body}
    }).afterClosed().subscribe(resp => {
      if (resp === true) {
        const filename = this.getFileNameWithActualDate('pdf');
        const tableEl = this.table.nativeElement.getElementsByTagName('table').item(0);
        const doc = new jsPDF({ orientation: 'landscape', unit: 'px', compress: true });
        const columnsToShow = [
          { header: 'Code', dataKey: 'code' },
          { header: 'Name', dataKey: 'name' },
          { header: 'Address', dataKey: 'address' },
          { header: 'State', dataKey: 'state' },
          { header: 'Country', dataKey: 'country' },
          { header: 'Zip', dataKey: 'zip' },
        ];
        doc.text('Warehouses', 275, 20);
        autotable(doc, {
          html: tableEl,
          theme: 'striped',
          columns: columnsToShow
        });

        try {
          doc.save(filename)
        } catch (error) {
          this.toastr.error('Error', 'There is an error, contact admin')
          console.log(error);
        }
      } else {
        const anchor = document.createElement('a');
        anchor.href = `${base_url}/upload/warehouse/${warehouse.file}`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }
    });
  }

  getFileNameWithActualDate(type: string) {
    const data = moment();
    return `${data.month()}_${data.day()}_${data.year()}.${type}`;
  }

  goToMap() {
    this.router.navigateByUrl(`/dashboard/map/${this.inputForm}`);
  }

}
