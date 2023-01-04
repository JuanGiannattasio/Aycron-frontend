import { EventEmitter, Injectable, OnInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapService implements OnInit {

  public cbAdress: EventEmitter<any> = new EventEmitter<any>();

  public mapbox = (mapboxgl as typeof mapboxgl);
  public map!: mapboxgl.Map;
  public style = 'mapbox://styles/mapbox/streets-v11';

  public zoom = 13;
  public wayPoints: Array<number> = [];
  public markerDriver: any = null;

  constructor( private http: HttpClient ) { 
    this.mapbox.accessToken = environment.mapboxKey;
  }
  
  ngOnInit(): void {
  }

  buildMap(lng: number = 12, lat: number = 42): Promise<any> {
    return new Promise((resolve, reject) => {
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: this.zoom,
        center: [lng, lat]
      });

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        // @ts-ignore
        mapboxgl
      });

      geocoder.on('result', ($event) => {
        const { result } = $event;
        geocoder.clear();
        this.cbAdress.emit(result)
      })

      try {
        resolve({
          map: this.map,
          geocoder
        })
      } catch (error) {
        reject(error);
      }
    });
  } 

  
  laodCoords(coords: any) {
    
    const url = [
      `https://api.mapbox.com/directions/v5/mapbox/driving/`,
      `${coords[0][0]},${coords[0][1]};${coords[1][0]},${coords[1][1]}`,
      `?steps=true&geometries=geojson&access_token=${environment.mapboxKey}`
    ].join('');

    this.http.get(url).subscribe((resp: any) => {
      const data = resp.routes[0];
      const route = data.geometry.coordinates;

      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        }
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': 'red',
          'line-width': 5
        }
      });

      // this.map.fitBounds([route[0], route[route.length - 1]], {
      //   padding: 100
      // })
    });
  }

  addMarkerCustom(coords: number[], mainMarker: boolean) {
    const el = document.createElement('div');
    mainMarker ? el.className = 'mainMarker' : el.className = 'marker';
    this.markerDriver = new mapboxgl.Marker(el);
    this.markerDriver
      .setLngLat(coords)
      .addTo(this.map);
  }

  clearRoute() {
    this.map.removeLayer('route');   
    this.map.removeSource('route');
  
  }

}


