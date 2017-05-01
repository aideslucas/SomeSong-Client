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
  constructor(public af: AngularFire) {

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

/*
  writeNewQuestion(uid, username, picture, title, body) {
    // A Question entry.
    var questionData = {
      author: username,
      uid: uid,
      body: body,
      title: title,
      starCount: 0,
      authorPic: picture
    };

    // Get a key for a new Post.
    var newQuestionKey = firebase.database().ref().child('questions').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/posts/' + newQuestionKey] = questionData;
    updates['/users/' + uid + '/Questions/' + newQuestionKey] = true;

    return firebase.database().ref().update(updates);
  }
*/
}
