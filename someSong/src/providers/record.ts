import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class Record {

  constructor() {
  }

  getRecordURL(path: string)
  {
    return firebase.storage().ref(path).getDownloadURL();
  }

  uploadRecordFile(file) {
    return;
  }

  deleteRecord(path: string) {
    firebase.storage().ref(path).delete();
  }
}
