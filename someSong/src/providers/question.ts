import { Injectable } from '@angular/core';
import {User} from "./user";
import firebase from 'firebase';
import {Observable} from "rxjs/Observable";

@Injectable()
export class Question {
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

  writeNewQuestion(genres: Array<any>, languages: Array<any>, location: any, record: string, userID: string)
  {
    var questionKey = firebase.database().ref().child('questions').push().key;

    firebase.database().ref('/questions/' + questionKey).set({
      languages: languages,
      genres: genres,
      time: (new Date()).getUTCDate(),
      location: location,
      questionID: questionKey,
      record: record,
      user: userID
    });

    this._user.getUser(userID).then(data => {
      var user = data.val();

      if (user.questions == null)
      {
        user.questions = new Array<any>();
      }

      user.questions.push(questionKey);

      this._user.saveUser(user);
    });
  }

  setQuestion(question){
    return firebase.database().ref('/questions/' + question.questionID).set(question);
  }
}
