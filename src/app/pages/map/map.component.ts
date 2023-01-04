import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { MapService } from '../../services/map.service';
import { WarehouseService } from '../../services/warehouse.service';
import { WarehouseInterface } from '../../models/warehouse.model';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

export class WayPoints {
  start: any;
  end: any;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('asGeocoder') asGeocoder!: ElementRef;
  
  constructor( 
    private mS: MapService, 
    private render2: Renderer2,
    private warehouseService: WarehouseService,
    private activatedRoute: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    
    combineLatest([
      this.activatedRoute.params,
      this.warehouseService.getWarehouseWithoutLimit()
    ]).subscribe(([{place}, warehouses]) => {
      let coordinates: number[];
      if (place) {
        this.warehouseService.getCoordinates(place).subscribe((resp: any) => {
          coordinates = resp.features[0].center;
          setTimeout(() => {
            this.mS.addMarkerCustom(coordinates, true);
          }, 200);
          this.mS.buildMap(coordinates[0], coordinates[1]).then(({geocoder, map}) => {
  
            this.render2.appendChild(
              this.asGeocoder.nativeElement, 
              geocoder.onAdd(map)
            );
  
  
          })
          .catch((err: any) => {
            console.log(err)
        })
        })
      }

      if (warehouses) {
        this.warehouseService.getWarehouseWithoutLimit().subscribe(resp => {
          resp.warehouses.forEach(warehouse => {
            const coords = [
              coordinates,
              [warehouse.lat as number, warehouse.long as number]
            ]
            setTimeout(() => {
              this.mS.addMarkerCustom([warehouse.lat as number, warehouse.long as number], false);
              this.mS.laodCoords(coords);
            }, 200);
          })
        })
      }
    })
  }

}
