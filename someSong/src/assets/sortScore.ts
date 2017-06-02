/**
 * Created by Lucas on 5/30/2017.
 */
import {Pipe} from '@angular/core';

@Pipe({
  name: 'sortScore'
})
export class SortScore {
  transform(arr) {
    if (arr === undefined) {
      return null;
    }

    return arr.sort((a, b) => {
      return b.value.score - a.value.score;
    });
  }
}
