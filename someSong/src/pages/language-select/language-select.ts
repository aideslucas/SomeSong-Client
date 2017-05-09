import { Component } from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

import {Language} from "../../providers/language";

@Component({
  selector: 'page-language-select',
  templateUrl: 'language-select.html'
})
export class LanguageSelectPage {
  languages: any;
  selected: any;

  constructor(params: NavParams,
              private viewController: ViewController,
              private _language: Language) {
    this.selected = params.get('selectedLanguages');

    Language.getLanguages().then(data =>
    {
      this.languages = data.val();
    });
  }

  insertLanguageToArray(item, language){
    if (item.checked)
    {
      this.selected.push(language);
    }
    else
    {
      var index = this.selected.indexOf(language, 0);
      if (index > -1) {
        this.selected.splice(index, 1);
      }
    }
  }

  save()
  {
    this.viewController.dismiss(this.selected);
  }

}
