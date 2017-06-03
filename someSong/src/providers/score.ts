import {Injectable} from '@angular/core';
import firebase from 'firebase';
import 'rxjs/add/operator/first'
import {Observable} from "rxjs/Observable";
export enum updateType{
  ADDED_ANSWER = 1,
  ANSWER_MARKED_AS_CORRECT = 2,
  YOUR_ANSWER_UP_VOTED = 3,
  ASKED_QUESTION = 4
}
@Injectable()

export class Score {
  constructor() {
  }

  getScoreDetails(scoreID: string) {
    return Observable.create(function (observer: any) {
      function value(snapshot) {
        observer.next(snapshot.val());
      }

      firebase.database().ref('/scores/' + scoreID).on('value', value);

      return function () {
        firebase.database().ref('/scores/' + scoreID).off('value', value);
      }
    });
  }

  getPosition(userID: string) {
    return firebase.database().ref('/scores/').orderByValue().once('value').then((data) => {
      var scores = [];
      for (let x of Object.keys(data.val()))
      {
        scores.push({key:x,score:data.val()[x]});
      }

      scores = scores.sort((a, b) => {
        return b.score - a.score;
      });

      return (scores.findIndex((a) => {return a.key == userID}) + 1);
    });
  }

  getAllScores() {
    return firebase.database().ref('/scores/');
  }

  updateScore(type: updateType, userID: string) {
    this.getScoreDetails(userID).first().subscribe((scoreDetail) => {
      var score = scoreDetail;
      switch (type) {
        case updateType.ADDED_ANSWER :
          score += 50;
          break;
        case updateType.ANSWER_MARKED_AS_CORRECT:
          score += 200;
          break;
        case updateType.YOUR_ANSWER_UP_VOTED:
          score += 5;
          break;
        case updateType.ASKED_QUESTION:
          score += 25;
          break;
        default:
      }
      firebase.database().ref('/scores/' + userID).set(score);
    });
  }

  writeNewScore(userID: string) {
    if (this.getScoreDetails(userID) == null) {
      return firebase.database().ref('/scores/' + userID).set(0);
    }
  }
}
