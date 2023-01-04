import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private _hideModal: boolean = true;
  public type!: 'warehouse';
  public uid!: string;
  public img!: string;

  public newImage: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  get hideModal() {
    return this._hideModal;
  }

  openModal( type:'warehouse', uid: string, img: string = 'no-img' ) {
    this._hideModal = false;
    this.type = type;
    this.uid = uid;
    this.img = img;


      this.img = `${base_url}/upload/${type}/${img}`
  }

  closeModal() {
    this._hideModal = true;
  }
}
