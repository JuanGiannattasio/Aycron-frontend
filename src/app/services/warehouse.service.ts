import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { WarehouseInterface } from '../models/warehouse.model';

const base_url = environment.base_url;

interface WarehouseResponse{
  ok: boolean;
  total: number;
  warehouses: WarehouseInterface[]
}

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  
  getWarehouseWithoutLimit(): Observable<WarehouseResponse> {
    const url =  `${base_url}/warehouse`;
    return this.http.get<WarehouseResponse>(url, this.headers)
  }

  getWarehouseById( id: string ) {
    const url = `${base_url}/warehouse/${id}`;
    return this.http.get(url, this.headers);
  }

  createWarehouse(warehouse: WarehouseInterface): Observable<{ok: boolean, warehouses: WarehouseInterface}> {
    const url = `${base_url}/warehouse/new`;
    return this.http.post<{ok: boolean, warehouses: WarehouseInterface}>( url, warehouse, this.headers )
  }
  
  
  updateWarehouse(burger: any ) {
    console.log(burger)
    const url = `${base_url}/warehouse/${burger.uid}`;
    return this.http.put( url, burger, this.headers )
  }


  deleteWarehouse(_id: string ): Observable<{ok: boolean, msg: string}> {
    const url = `${base_url}/warehouse/${_id}`;
    return this.http.delete<{ok: boolean, msg: string}>(url, this.headers)
  }

  getCoordinates(address: string) {
    return this.http.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?types=address&access_token=${environment.mapboxKey}`)
  }
}
