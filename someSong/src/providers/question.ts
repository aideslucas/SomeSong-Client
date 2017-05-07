import { Injectable } from '@angular/core';
import {User} from "./user";
import firebase from 'firebase';
import {Observable} from "rxjs/Observable";

@Injectable()
export class Question {
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
    return firebase.database().ref().child('questions').push().key;
  }

  writeNewQuestion(questionID:string, genres: Array<any>, languages: Array<any>, location: any, record: string, userID: string)
  {
    firebase.database().ref('/questions/' + questionID).set({
      languages: languages,
      genres: genres,
      time: (new Date()).getUTCDate(),
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
}
