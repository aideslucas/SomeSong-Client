import { Injectable } from '@angular/core';
import {User} from "./user";
import firebase from 'firebase';
import {Observable} from "rxjs/Observable";

@Injectable()
export class Question {
  private date: any = new Date();

  constructor(private _user: User) {
  }

  getAllQuestions() {
    return firebase.database().ref('/questions/').once('value');
  }

  getAllUnresolvedQuestions() {
    var ref = firebase.database().ref('/questions/');

    return ref.orderByChild('correctAnswer').equalTo(null).once('value');
  }

  getQuestionDetails(questionID: string) : Observable<any> {
    return Observable.create(function(observer: any) {
      function value(snapshot) {
        observer.next(snapshot.val());
      }

      firebase.database().ref('/questions/' + questionID).on('value', value);

      return function() {
        firebase.database().ref('/questions/' + questionID).off('value', value);
      }
    });
  }

  getNewQuestionID() {
    return firebase.database().ref().child('unresolvedQuestions').push().key;
  }

  writeNewQuestion(questionID:string, genres: {}, languages: {}, location: any, record: string, userID: string, title: string, cordinates: any)
  {
    var time = new Date();

    this._user.getUser(userID).then(data => {
      var user = data.val();

      if (user.questions == null)
      {
        user.questions = {};
      }

      user.questions[questionID] = true;

      this._user.updateUser(user);
    });

    return firebase.database().ref('/questions/' + questionID).set({
      languages: languages,
      genres: genres,
      timeUTC: {
        date: time.getUTCDate(),
        month: time.getUTCMonth(),
        year: time.getUTCFullYear(),
        hours: time.getUTCHours(),
        minutes: time.getUTCMinutes(),
        seconds: time.getUTCSeconds()
      },
      location: location,
      questionID: questionID,
      record: record,
      user: userID,
      title: title,
      coordinates: {latitude: cordinates.latitude,
        longitude: cordinates.longitude}
    });
  }

  updateQuestion(question){
    return firebase.database().ref('/questions/' + question.questionID).set(question);
  }

  getQuestionAnswers(questionID) {
    return firebase.database().ref('/questions/' + questionID + '/answers/');
  }

  private getTimeStamp() {
    return (this.date.getDate() + "_" +
    (this.date.getMonth() + 1) + "_" +
    this.date.getFullYear() + "@" +
    this.date.getHours() + ":" +
    this.date.getMinutes() + ":" +
    this.date.getSeconds());
  }

  getResolvedQuestions() {
    var ref = firebase.database().ref('/questions/');

    // Get all questions that has value in the correctAnswer property.
    return ref.orderByChild('correctAnswer').startAt(1).once('value');

  }
}
