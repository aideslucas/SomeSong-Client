import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {User} from "./user";
import 'rxjs/add/operator/first'
import {Observable} from "rxjs/Observable";
import DictionaryHelpFunctions from "../assets/dictionaryHelpFunctions";
export enum updateType{
  ADDED_ANSWER = 1,
  ANSWER_MARKED_AS_CORRECT= 2,
  YOUR_ANSWER_UP_VOTED =3,
  ASKED_QUESTION = 4
}
@Injectable()

export class Score {


  constructor(private _user: User) {
  }

  getScoreDetails(scoreID: string)
  {
    return Observable.create(function(observer: any) {
      function value(snapshot) {
        observer.next(snapshot.val());
      }

      firebase.database().ref('/scores/' + scoreID).on('value', value);

      return function() {
        firebase.database().ref('/scores/' + scoreID).off('value', value);
      }
    });
  }

  getNewScoreID() {
    return firebase.database().ref().child('scores').push().key;
  }

  getTopTenScores(){

    var scoresRef = firebase.database().ref('/scores/');
    return scoresRef.orderByValue().limitToLast(10);

  }

  getScores() {
    return firebase.database().ref('//').once('value');
  }


  getAllScores() {
    return firebase.database().ref('/scores/');
  }

  getscoreUser(ScoreID: string) {
    return firebase.database().ref('/users/' +ScoreID);
  }
  updateScore(type: updateType, userID: string) {

       this.getScoreDetails(userID).first().subscribe((scoreDetail) => {
         var score = scoreDetail;
          switch (type) {
            case updateType.ADDED_ANSWER :
              score += 1;
              break;
            case updateType.ANSWER_MARKED_AS_CORRECT:
              score += 20;
              break;
            case updateType.YOUR_ANSWER_UP_VOTED:
              score += 5;
              break;
            case updateType.ASKED_QUESTION:
              score -= 5;
              break;
            default:
          }
      return firebase.database().ref('/scores/' + userID).set(score);

      });

  }

  writeNewScore(userID: string)
  {

     if (this.getScoreDetails(userID).equalTo(null)){
        return firebase.database().ref('/scores/' + userID).set(50);
      }


  }
}