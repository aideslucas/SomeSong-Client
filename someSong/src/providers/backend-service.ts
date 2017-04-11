import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {AngularFire} from "angularfire2";

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
  score: number;
  genres: Array<Genres>;
  languages: Array<Languages>;

  constructor(userID: string, displayName: string, email: string, score: number, genres: Array<Genres>, languages: Array<Languages>) {
    this.userID = userID;
    this.displayName = displayName;
    this.email = email;
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
    return this.af.database.object('/users/' + userID);
  }

  createUser(userID: string, displayName: string, email: string) : User {
    let user = new User(userID, displayName, email, 0, new Array<Genres>(), new Array<Languages>());
    this.af.database.object('/users/' + userID).set(user);
    return user;
  }

  saveUser(user: User) {
    this.af.database.object('/users/' + user.userID).update(user);
  }
}
