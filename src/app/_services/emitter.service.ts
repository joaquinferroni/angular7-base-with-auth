import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmitterService {
  private uploadedEvent: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private saveEvent: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  emitter_UploadFile = this.uploadedEvent.asObservable();
  emitter_saveEvent = this.saveEvent.asObservable();
  constructor() { }

  emitUpload(file: any){
    this.uploadedEvent.next(file);
  }

  emitSaveImg(filepath: string){
    this.saveEvent.next(filepath);
  }
}
