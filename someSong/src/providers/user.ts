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
    this.currentUser = null;
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
    if (user.answers != null) {
      var answersID = new Array<any>();
      for (let answer of user.answers)
      {
        if (answer.answerID != null)
        {
          answersID.push(answer.answerID);
        }
        else {
          answersID.push(answer);
        }
      }
      user.answers = answersID;
    }

    if (user.questions != null) {
      var questionsID = new Array<any>();
      for (let question of user.questions)
      {
        if (question.questionID != null)
        {
          questionsID.push(question.questionID);
        }
        else {
          questionsID.push(question);
        }
      }
      user.questions = questionsID;
    }

    firebase.database().ref('/users/' + user.userID).update(user);
  }
}
