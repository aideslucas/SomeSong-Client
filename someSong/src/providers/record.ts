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
    let ref = firebase.storage().ref(path);
    if (ref)
      ref.delete().then(function() {
        // File deleted successfully
      }).catch(function(error) {
        // Uh-oh, an error occurred!
      });
  }
}
