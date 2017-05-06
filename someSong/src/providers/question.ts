import { Injectable } from '@angular/core';
import {User} from "./user";
import firebase from 'firebase';
import {Observable} from "rxjs/Observable";

@Injectable()
export class Question {
  private date: any = new Date();

  constructor(private _user: User) {
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

  writeNewQuestion(questionID:string, genres: Array<any>, languages: Array<any>, location: any, record: string, userID: string)
  {
    let timeStamp = this.getTimeStamp();

    firebase.database().ref('/questions/' + questionID).set({
      languages: languages,
      genres: genres,
      time: this.getTimeStamp(),
      location: location,
      questionID: questionID,
      record: record,
      user: userID
    });

    this._user.getUser(userID).then(data => {
      var user = data.val();

      if (user.questions == null)
      {
        user.questions = new Array<any>();
      }

      user.questions.push(questionID);

      this._user.updateUser(user);
    });
  }

  updateQuestion(question){
    var answersID = new Array<any>();
    for (let answer of question.answers) {
      if (answer.answerID != null) {
        answersID.push(answer.answerID);
      }
      else {
        answersID.push(answer);
      }
    }

    question.answers = answersID;

    if (question.user.userID != null) {
      question.user = question.user.userID;
    }

    return firebase.database().ref('/questions/' + question.questionID).set(question);
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
