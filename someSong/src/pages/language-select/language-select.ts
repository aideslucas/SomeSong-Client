import { Component } from '@angular/core';
import { NavController,NavParams, Platform } from 'ionic-angular';

import {GenreSelectPage} from "../genre-select/genre-select";
import {User} from "../../providers/user";
import {Language} from "../../providers/language";

@Component({
  selector: 'page-language-select',
  templateUrl: 'language-select.html'
})
export class LanguageSelectPage {
  languages: any;
  languagesKeys: any;
  user: any;

  constructor(public platform: Platform,
              public navCtrl: NavController,
              public navParams: NavParams,
              private _user: User,
              private _language: Language) {
    var userSubscription = this._user.currentUser.subscribe(data => {
      this.user = data;
      userSubscription.unsubscribe();
    });

    this._language.getLanguages().then(data =>
    {
      this.languages = data.val();
    });
  }

  insertLanguageToArray(item, language){
    if (item.checked)
    {
      this.user.languages.push(language);
    }
    else
    {
      var index = this.user.languages.indexOf(language, 0);
      if (index > -1) {
        this.user.languages.splice(index, 1);
      }
    }
  }

  save()
  {
    this._user.saveUser(this.user);
    this.navCtrl.push(GenreSelectPage);
  }

}
