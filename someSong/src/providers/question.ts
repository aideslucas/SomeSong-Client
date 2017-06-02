import { Injectable } from '@angular/core';
import {User} from "./user";
import firebase from 'firebase';
import {Observable} from "rxjs/Observable";
import {Score} from "./score";

@Injectable()
export class Question {
  private date: any = new Date();

  constructor(private _user: User,
              private _score: Score) {
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
    return firebase.database().ref().child('questions').push().key;
  }

  writeNewQuestion(questionID:string, genres: {}, languages: {}, location: any, record: string, userID: string, title: string)
  {
    var time = new Date();

    firebase.database().ref('/questions/' + questionID).set({
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
      title: title
    });

    this._user.getUser(userID).then(data => {
      var user = data.val();

      if (user.questions == null)
      {
        user.questions = {};
      }

      user.questions[questionID] = true;
      this._score.updateScore(4, userID);

      this._user.updateUser(user);
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
}
