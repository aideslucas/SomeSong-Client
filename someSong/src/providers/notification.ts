import { Injectable } from '@angular/core';
import firebase from 'firebase';
@Injectable()
export class Notification {

  constructor() {
  }

  writeNewNotification(to: string, notifType: number, questData: any, ansData: any)
  {
    firebase.database().ref().child('notifications').push({
      destUser: to,
      notifType: notifType,
      questionID: questData.questionID,
      answerID: ansData.answerID
    });
  }
}
