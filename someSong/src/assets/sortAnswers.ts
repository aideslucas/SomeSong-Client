/**
 * Created by Lucas on 5/30/2017.
 */
import {Pipe} from '@angular/core';

@Pipe({
  name: 'sortAnswers'
})
export class SortAnswers {
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

  transform(arr, args) {
    if (arr === undefined) {
      return null;
    }

    return arr.sort((a, b) => {
      let aCorrect = a.value.question.correctAnswer;
      let bCorrect = b.value.question.correctAnswer;

      if (args) {
        aCorrect = args;
        bCorrect = args;
      }

        if (aCorrect != null &&
          bCorrect == null) {
          return 1;
        }

        if (aCorrect == null &&
          bCorrect != null) {
          return -1;
        }


        if (aCorrect != null &&
          bCorrect != null) {
          if (aCorrect == a.key &&
            bCorrect != b.key) {
            return -1;
          }
          if (aCorrect !== a.key &&
            bCorrect == b.key) {
            return 1;
          }
        }

        if (a.value.votes < b.value.votes) {
          return 1;
        }

        if (a.value.votes > b.value.votes) {
          return -1;
        }

        if (this.getLocalTime(a.value.timeUTC) < this.getLocalTime(b.value.timeUTC)) {
          return 1;
        }

        if (this.getLocalTime(a.value.timeUTC) > this.getLocalTime(b.value.timeUTC)) {
          return -1;
        }

        return 0;
      }
    );
  }
}
