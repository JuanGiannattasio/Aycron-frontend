import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WarehouseService } from '../../services/warehouse.service';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { WarehouseInterface } from '../../models/warehouse.model';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../services/modal-image.service';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-new-warehouse',
  templateUrl: './new-warehouse.component.html',
  styleUrls: ['./new-warehouse.component.scss']
})
export class NewWarehouseComponent implements OnInit, OnDestroy {

  public miForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
    state: ['', [Validators.required]],
    country: [''],
    zip: [''],
    lat: [''],
    long: [''],
    file: ['']
  });
  public file!: File;
  public imgTemp!: string | ArrayBuffer | null;

  private onDestroy = new Subject();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private warehouseService: WarehouseService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private fileUpload: FileUploadService
  ) { }
  
  ngOnDestroy(): void {
    // this.onDestroy.next();
    this.onDestroy.complete();
  }

  ngOnInit(): void {
  }


  save() {
    if (this.miForm.valid) {

      const address = `${this.miForm.get('address')?.value} ${this.miForm.get('state')?.value} ${this.miForm.get('country')?.value}`;

      this.warehouseService.getCoordinates(address).subscribe((resp: any) => {
        const coordArr = resp.features[0].center.slice();

        this.miForm.get('lat')?.setValue(coordArr[0]);
        this.miForm.get('long')?.setValue(coordArr[1]);

        this.warehouseService.createWarehouse(this.miForm.value).pipe(
          catchError(err => {
            this.toastr.error(err.error.msg, 'Error');
            return of(null);
          }),
          takeUntil(this.onDestroy)
          // @ts-ignore
        ).subscribe((resp: {ok: boolean, warehouse: WarehouseInterface} | null ) => {
          // @ts-ignore
          if (resp.ok) {
            this.fileUpload.updatePhoto(this.file, resp?.warehouse?.uid as string).subscribe(resp => {
              console.log(resp);
            })
            this.toastr.success('Warehouse created', 'Success!');
            this.router.navigateByUrl('/dashboard');
          }
        })
      })

      
    } 
  }

  changeImage(e: any) {

    const archive = e.target.files[0];
    this.file = archive;

    if (!archive) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL( archive );

    return reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }


  openModal() {
    this.modalService.openModal('warehouse', '63b49b36dea216f89cff2411')
  }

  validCamp(campo: string) {
    // return this.miForm.controls[campo].errors &&
    //        this.miForm.controls[campo].touched;
  }

}
