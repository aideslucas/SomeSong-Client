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
      picture: 'http://example.com/image.png'
    });
  }
}
