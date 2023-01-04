import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor( private http: HttpClient ) { }


  updatePhoto( file: File, uid: string ) {

    const url = `${base_url}/upload/warehouse/${uid}`;
    const formData: FormData = new FormData();
    formData.append('image', file);

    return this.http.put(url, formData).pipe(
      map((resp: any) => resp.archiveName),
      catchError((err) => {
        console.error(err)
        return of(false)
      })
    )
  }

  // downloadFile(fileName: string) {
  //   const url = `${base_url}/upload/warehouse/${fileName}`;

  //   return this.http.get(url);
  // }
}
