import {Component, Input, Output, EventEmitter} from '@angular/core';
import { NavController,NavParams, Platform } from 'ionic-angular';
import {User} from "../../providers/user";
import {Language} from "../../providers/language";

@Component({
  selector: 'page-language-select',
  templateUrl: 'language-select.html'
})
export class LanguageSelectPage {
  allLanguages: any;
  outPutLanguages: any = new Array<number>();
  user: any;

  @Input() saveButton: boolean = true;
  @Output() selectedLanguages = new EventEmitter<number>();

  constructor(public platform: Platform,
              public navCtrl: NavController,
              private _user: User,
              private _language: Language) {

    this._user.currentUser.first().subscribe(userData => {
      if (userData.languages === null) {
        this.user.languages = new Array<any>();
      }
      this.user = userData;
    });

    this._language.getLanguages()
      .then(data => {
        this.allLanguages = data.val();
      });
  }

  insertLanguageToArray(item, language){
    if (item.checked) {
      this.outPutLanguages.push(language);
      this.updateUserLanguages();
      this.selectedLanguages.emit(this.outPutLanguages);
    }
    else {
      let index = this.outPutLanguages.indexOf(language, 0);
      if (index > -1) {
        this.outPutLanguages.splice(index, 1);
      }

      this.updateUserLanguages();
      this.selectedLanguages.emit(this.outPutLanguages);
    }
  }

  private updateUserLanguages(): void {
    this.user.languages = this.outPutLanguages;
  }

  save() {
    this._user.updateUser(this.user);
    this.navCtrl.pop();
  }
}
