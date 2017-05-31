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
      picture: 'https://drive.google.com/file/d/0B_ds4GOh1_8mZnQxejZpUVhPRDA/view?usp=sharing'
    });
  }
}
