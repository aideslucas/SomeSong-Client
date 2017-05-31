/**
 * Created by Lucas on 5/30/2017.
 */
import {Pipe} from '@angular/core';

@Pipe({
  name: 'sortQuestions'
})
export class SortQuestions {

  getLocalTime(time) {
    var localTime = new Date();
    localTime.setUTCFullYear(time.year);
    localTime.setUTCMonth(time.month);
    localTime.setUTCDate(time.date);
    localTime.setUTCHours(time.hours);
    localTime.setUTCMinutes(time.minutes);
    localTime.setUTCSeconds(time.seconds);

    return localTime;
  }

  transform(arr) {
    if(arr === undefined){return null;}

    return arr.sort((a, b) => {
      if (a.value.correctAnswer !== null &&
          b.value.correctAnswer === null) {
        return 1;
      }
      if (a.value.correctAnswer === null &&
        b.value.correctAnswer !== null) {
        return -1;
      }
      if (this.getLocalTime(a.value.timeUTC) < this.getLocalTime(b.value.timeUTC)) {
        return 1;
      }

      if (this.getLocalTime(a.value.timeUTC) > this.getLocalTime(b.value.timeUTC)) {
        return -1;
      }
      return 0;
    });
  }
}
