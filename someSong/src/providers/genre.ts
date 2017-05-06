import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class Genre {

  constructor() {
  }

  getGenres() {
    return firebase.database().ref('/genres/').once('value');
  }
}
