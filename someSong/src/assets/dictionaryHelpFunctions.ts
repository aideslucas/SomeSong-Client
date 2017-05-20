export default class DictionaryHelpFunctions {
  static addToDictionary (oldDict,new_key,new_val){
    var newDict = {};
    for (let key of Object.keys(oldDict)) {
      newDict[key] = oldDict[key];
    }
    newDict[new_key] = new_val;
    return newDict;
  }

  static updateDictionary (dictionary) {
    var newDict = {};
    for (let key of Object.keys(dictionary)) {
      newDict[key] = dictionary[key];
    }
    return newDict;
  }


  static isEmpty(dictionary) {
    return Object.keys(dictionary).length === 0;
  }
}
