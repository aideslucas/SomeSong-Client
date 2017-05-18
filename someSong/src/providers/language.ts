import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class Language {

  constructor() {
  }

  getLanguages() {
    return firebase.database().ref('/languages/');
  }
}
