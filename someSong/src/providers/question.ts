import { Injectable } from '@angular/core';
import {User} from "./user";
import firebase from 'firebase';

@Injectable()
export class Question {
  constructor(private _userProvider: User) {
  }

  getQuestionDetails(questionID: string)
  {
    return firebase.database().ref('/questions/' + questionID).once('value');
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

    this._userProvider.getUser(userID).then(data => {
      var user = data.val();

      if (user.questions == null)
      {
        user.questions = new Array<any>();
      }

      user.questions.push(questionKey);

      this._userProvider.saveUser(user);
    });
  }

  setQuestion(question){
    return firebase.database().ref('/questions/' + question.questionID).set(question);
  }
}
