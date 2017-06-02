import { Component } from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

import {Language} from "../../providers/language";
import DictionaryHelpFunctions from "../../assets/dictionaryHelpFunctions";

@Component({
  selector: 'page-language-select',
  templateUrl: 'language-select.html'
})
export class LanguageSelectPage {
  languages = [];
  selected : {[id: string] : string};
  canLeave = false;

  constructor(params: NavParams,
              private viewController: ViewController,
              private _language: Language) {
    this.selected = params.get('selectedLanguages');

    var selectAll = false;
    if (DictionaryHelpFunctions.isEmpty(this.selected)) {
      selectAll = true;
    }

    this._language.getLanguages().orderByValue().on('child_added', (data) => {
      this.languages.push(data);
      if (selectAll) {
        this.selected[data.key] = data.val();
      }
    });
  }

  selectAll(){
    for (let x of this.languages) {
      this.selected[x.key] = x.val();
    }
  }

  clearAll(){
    for (let x of Object.keys(this.selected)) {
      delete this.selected[x];
    }
  }

  insertLanguageToArray(item, language){
    if (item.checked)
    {
      this.selected[language.key] = language.val();
    }
    else
    {
      delete this.selected[language.key];
    }
  }

  noneSelected() {
    return DictionaryHelpFunctions.isEmpty(this.selected);
  }

  save()
  {
    this.canLeave = true;
    this.viewController.dismiss(this.selected);
  }

  ionViewCanLeave(): boolean{
    return this.canLeave;
  }

}
