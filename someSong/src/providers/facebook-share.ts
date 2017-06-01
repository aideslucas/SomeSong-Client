import { Injectable } from '@angular/core';
import {Facebook} from "@ionic-native/facebook";

@Injectable()
export class FacebookShare {

  constructor(public facebook: Facebook) {
  }

  shareQuestion(questionID, questionTitle) : Promise<any> {
    return this.facebook.showDialog({
      method: 'share',
      href: 'https://y8vp4.app.goo.gl/?link=https://somesong.com/question/'+questionID+'&apn=com.ionicframework.somesong653067',
      caption: 'Help me figure this song out',
      description: questionTitle,
      picture: 'https://drive.google.com/file/d/0ByHBZhrlcde2SXRBUklfa1BfRmc/view?usp=sharing'
    });
  }

  inviteFriends(): Promise<any> {
    return this.facebook.appInvite({
      picture: 'https://drive.google.com/file/d/0ByHBZhrlcde2SXRBUklfa1BfRmc/view?usp=sharing',
      url: 'https://fb.me/332496700501204'
    });
  }
}
