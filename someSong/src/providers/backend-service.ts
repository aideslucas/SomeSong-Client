import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFire} from "angularfire2";
import firebase from 'firebase';

export enum Genres {
  rock = 1,
  pop = 2,
  classic = 3,
  metal = 4,
  dubstep = 5,
  rap = 6,
  disco = 7
}

export enum Languages {
  english = 1,
  hebrew = 2,
  spanish = 3,
  russian = 4,
  french = 5,
  italian = 6
}

export class User {
  userID: string;
  displayName: string;
  email: string;
  image: string;
  score: number;
  genres: Array<Genres>;
  languages: Array<Languages>;

  constructor(userID: string, displayName: string, email: string, image: string, score: number, genres: Array<Genres>, languages: Array<Languages>) {
    this.userID = userID;
    this.displayName = displayName;
    this.email = email;
    this.image = image;
    this.score = score;
    this.genres = genres;
    this.languages = languages;
  }
}

@Injectable()
export class BackendService {
  currUserID: string;

  constructor(public af: AngularFire) {

  }

  setCurrentUser(userID: string)
  {
    this.currUserID = userID
  }

  getCurrentUser()
  {
    return this.af.database.object('/users/' + this.currUserID);
  }

  getUser(userID: string)
  {
    return firebase.database().ref('/users/' + userID).once('value');
  }

  createUser(userID: string, displayName: string, email: string, image: string) : User {
    let user = new User(userID, displayName, email, image, 0, new Array<Genres>(), new Array<Languages>());

    firebase.database().ref('users/' + userID).set(user);

    return user;
  }

  saveUser(user: User) {
    firebase.database().ref('/users/' + user.userID).update(user);
  }

  getQuestionDetails(questionID: string)
  {
    return firebase.database().ref('/questions/' + questionID).once('value');
  }

  getRecordURL(path: string)
  {
    return firebase.storage().ref(path).getDownloadURL();
  }

  getAnswerDetails(answerID: string)
  {
    return firebase.database().ref('/answers/' + answerID).once('value');
  }

  writeNewQuestion(genres: Array<Genres>, languages: Array<Languages>, location: any, record: string, userID: string)
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

    firebase.database().ref('/users/' + userID).once('value').then(data => {
      var user = data.val();

      if (user.questions == null)
      {
        user.questions = new Array<any>();
      }

      user.questions.push(questionKey);

      firebase.database().ref('/users/' + userID).set(user);
    });
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


    firebase.database().ref('/questions/' + questionID).once('value').then(data => {
      var question = data.val();

      if (question.answers == null)
      {
        question.answers = new Array<any>();
      }

      question.answers.push(ansKey);

      firebase.database().ref('/questions/' + questionID).set(question);
    });

    firebase.database().ref('/users/' + userID).once('value').then(data => {
      var user = data.val();

      if (user.answers == null)
      {
        user.answers = new Array<any>();
      }

      user.answers.push(ansKey);

      firebase.database().ref('/users/' + userID).set(user);
    });
  }
}
