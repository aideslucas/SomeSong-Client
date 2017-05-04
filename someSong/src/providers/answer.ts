import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {User} from "./user";
import {Question} from "./question";

@Injectable()
export class Answer {

  constructor(private _user: User,
              private _question: Question) {
  }

  getAnswerDetails(answerID: string)
  {
    return firebase.database().ref('/answers/' + answerID).once('value');
  }

  writeNewAnswer(content: string, userID: string, questionID: string)
  {
    var ansKey = firebase.database().ref().child('answers').push().key;

    firebase.database().ref('/answers/' + ansKey).set({
      content: content,
      question: questionID,
      time: (new Date()).toUTCString(),
      user: userID,
      votes: 0,
      answerID: ansKey
    });


    this._question.getQuestionDetails(questionID).then(data => {
      var question = data.val();

      if (question.answers == null)
      {
        question.answers = new Array<any>();
      }

      question.answers.push(ansKey);

      this._question.setQuestion(question);
    });

    this._user.getUser(userID).then(data => {
      var user = data.val();

      if (user.answers == null)
      {
        user.answers = new Array<any>();
      }

      user.answers.push(ansKey);

      this._user.saveUser(user);
    });
  }
}
