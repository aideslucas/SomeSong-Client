import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import firebase from 'firebase';

@Injectable()
export class User {
  currentUser: Observable<any> = null;

  constructor() {
  }

  logIn(userID: string)
  {
    this.currentUser = Observable.create(function(observer: any) {
      function value(snapshot) {
        observer.next(snapshot.val());
      }

      firebase.database().ref('/users/' + userID).on('value', value);

      return function() {
        firebase.database().ref('/users/' + userID).off('value', value);
      }
    });
  }

  logOut() {
    this.currentUser.first().subscribe(data => {
      var user = data;
      user.token = "";
      this.updateUser(user);

      this.currentUser = null;
    });
  }

  getUser(userID: string)
  {
    return firebase.database().ref('/users/' + userID).once('value');
  }

  createUser(userID: string, displayName: string, email: string, image: string) {
    return firebase.database().ref('/users/' + userID).set({
      userID: userID,
      displayName: displayName,
      email: email,
      image: image
    });
  }

  updateUser(user) {
    firebase.database().ref('/users/' + user.userID).update(user);
  }


  getUserQuestions(userID) {
    return firebase.database().ref('/users/' + userID + '/questions/');
  }


  getUserAnswers(userID) {
    return firebase.database().ref('/users/' + userID + '/answers/');
  }

  getUserImage(userID) {
    return firebase.storage().ref().child('images/' + userID + '/profile.png').getDownloadURL();
  }
}
