export default class DictionaryHelpFunctions {
  static isEmpty(dictionary) {
    if (dictionary == null) return true;
    return Object.keys(dictionary).length === 0;
  }
}
