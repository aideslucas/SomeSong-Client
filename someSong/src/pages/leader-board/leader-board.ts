import {Component} from '@angular/core';
import {Score} from "../../providers/score";
import {User} from "../../providers/user";


@Component({
  selector: 'page-leader-board',
  templateUrl: 'leader-board.html'
})
export class LeaderboardPage {
  scores = {};

  constructor(private _score: Score,
              private _user: User) {
    this._score.getAllScores().orderByValue().limitToLast(10).on('child_added', (data) => {
      this._user.getUser(data.key).then(user => {
        if (user) {
          this.scores[data.key] = {'user': user.val().displayName,
            'score': data.val() };
        }
      });
    });
  }

}
